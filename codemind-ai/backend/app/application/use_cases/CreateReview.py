from typing import Dict, Any
from app.application.workflows.review_pipeline import ReviewPipeline

class CreateReviewUseCase:
    def __init__(self, review_pipeline: ReviewPipeline):
        self.review_pipeline = review_pipeline

    def execute(self, project_id: int, code: str, file_path: str = "auth.py", actor_email: str = "dev@codemind.ai") -> Dict[str, Any]:
        return self.review_pipeline.execute(
            project_id=project_id,
            code_context=code,
            file_path=file_path,
            actor_email=actor_email
        )
