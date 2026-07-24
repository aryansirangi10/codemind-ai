from sqlalchemy.orm import Session
from app.domain.repositories.user_repository import UserRepository
from app.domain.repositories.organization_repository import OrganizationRepository
from app.domain.repositories.project_repository import ProjectRepository
from app.domain.repositories.review_repository import ReviewRepository
from app.domain.repositories.audit_repository import AuditRepository
from app.application.workflows.review_pipeline import ReviewPipeline
from app.application.use_cases.CreateReview import CreateReviewUseCase

class Container:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.org_repo = OrganizationRepository(db)
        self.project_repo = ProjectRepository(db)
        self.review_repo = ReviewRepository(db)
        self.audit_repo = AuditRepository(db)

        # Workflows
        self.review_pipeline = ReviewPipeline(self.review_repo, self.audit_repo)

        # Use Cases
        self.create_review_uc = CreateReviewUseCase(self.review_pipeline)

def get_container(db: Session) -> Container:
    return Container(db)
