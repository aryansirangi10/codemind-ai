from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.database.session import Base

class Finding(Base):
    __tablename__ = "findings"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=False)
    cwe_code = Column(String, nullable=False)        # e.g., 'CWE-89'
    title = Column(String, nullable=False)           # e.g., 'Raw SQL Injection'
    severity = Column(String, nullable=False)        # critical, high, medium, low
    owasp_category = Column(String, nullable=False)  # A03:Injection
    file_path = Column(String, nullable=False)
    line_number = Column(Integer, default=1)
    original_code = Column(Text, nullable=True)
    suggested_patch = Column(Text, nullable=True)
