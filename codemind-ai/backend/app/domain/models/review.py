from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, func
from sqlalchemy.orm import relationship
from app.database.session import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    repository_id = Column(Integer, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=True)
    status = Column(String, default="PENDING")  # PENDING, RUNNING, COMPLETED, FAILED
    commit_sha = Column(String, nullable=True)
    
    # Scores (0-100)
    overall_score = Column(Integer, default=100)
    security_score = Column(Integer, default=100)
    performance_score = Column(Integer, default=100)
    bugs_score = Column(Integer, default=100)
    complexity_score = Column(Integer, default=100)
    doc_score = Column(Integer, default=100)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="reviews")
    repository = relationship("Repository", back_populates="reviews")
    results = relationship("ReviewResult", back_populates="review", cascade="all, delete-orphan")


class ReviewResult(Base):
    __tablename__ = "review_results"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id", ondelete="CASCADE"), nullable=False)
    file_path = Column(String, nullable=False)
    line_number = Column(Integer, nullable=True)
    
    category = Column(String, nullable=False)  # bug, security, performance, complexity, smell, style
    severity = Column(String, nullable=False)  # critical, high, medium, low, info
    message = Column(Text, nullable=False)
    original_code = Column(Text, nullable=True)
    suggested_code = Column(Text, nullable=True)

    review = relationship("Review", back_populates="results")
