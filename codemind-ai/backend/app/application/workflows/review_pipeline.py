from typing import Dict, Any
from app.domain.analyzers.registry import AnalyzerRegistry
from app.domain.ai.agents.security import SecurityAgent
from app.domain.ai.agents.supervisor import SupervisorAgent
from app.domain.repositories.review_repository import ReviewRepository
from app.domain.repositories.audit_repository import AuditRepository
from app.infrastructure.observability.logging import logger
from app.infrastructure.observability.metrics import metrics

class ReviewPipeline:
    def __init__(self, review_repo: ReviewRepository, audit_repo: AuditRepository):
        self.review_repo = review_repo
        self.audit_repo = audit_repo
        self.security_agent = SecurityAgent()
        self.supervisor = SupervisorAgent()

    def execute(self, project_id: int, code_context: str, file_path: str = "auth.py", actor_email: str = "dev@codemind.ai") -> Dict[str, Any]:
        logger.info(f"ReviewPipeline: Starting audit for Project ID {project_id}")
        metrics.increment("reviews_triggered")

        # Step 1: Create Review Record in Persistence
        review = self.review_repo.create_review(project_id=project_id, status="RUNNING")

        # Step 2: AST & Analyzer Registry Scan
        static_findings = AnalyzerRegistry.run_all(code_context, file_path)

        # Step 3: AI Specialist Agent Execution
        sec_result = self.security_agent.run(code_context, file_path)

        # Step 4: Supervisor Consensus & Synthesis
        synthesis = self.supervisor.synthesize([sec_result])

        # Step 5: Save Results to Database
        review.status = "COMPLETED"
        review.overall_score = synthesis["overall_score"]
        review.security_score = synthesis["security_score"]

        # Persist findings
        for f in static_findings:
            self.review_repo.add_result(
                review_id=review.id,
                file_path=f.file_path,
                category=f.category,
                severity=f.severity,
                message=f.message,
                line_number=f.line_number,
                original_code=f.original_code,
                suggested_code=f.suggested_code
            )

        self.review_repo.db.commit()

        # Step 6: Log Audit Trail
        self.audit_repo.log(
            action="Review Completed",
            target=f"{file_path}:L{static_findings[0].line_number if static_findings else 1}",
            actor_email=actor_email
        )

        logger.info(f"ReviewPipeline: Audit completed for Review ID {review.id} with score {review.overall_score}")
        return {
            "id": review.id,
            "status": review.status,
            "overall_score": review.overall_score,
            "security_score": review.security_score,
            "results_count": len(static_findings)
        }
