from typing import Optional, List
from sqlalchemy.orm import Session
from app.domain.models.review import Review, ReviewResult

class ReviewRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, review_id: int) -> Optional[Review]:
        return self.db.query(Review).filter(Review.id == review_id).first()

    def list_by_project(self, project_id: int) -> List[Review]:
        return self.db.query(Review).filter(Review.project_id == project_id).all()

    def create_review(self, project_id: int, status: str = "PENDING", commit_sha: str = "a9c18f2d") -> Review:
        review = Review(
            project_id=project_id,
            status=status,
            commit_sha=commit_sha
        )
        self.db.add(review)
        self.db.commit()
        self.db.refresh(review)
        return review

    def add_result(self, review_id: int, file_path: str, category: str, severity: str, message: str, line_number: int = 1, original_code: str = None, suggested_code: str = None) -> ReviewResult:
        result = ReviewResult(
            review_id=review_id,
            file_path=file_path,
            line_number=line_number,
            category=category,
            severity=severity,
            message=message,
            original_code=original_code,
            suggested_code=suggested_code
        )
        self.db.add(result)
        self.db.commit()
        self.db.refresh(result)
        return result
