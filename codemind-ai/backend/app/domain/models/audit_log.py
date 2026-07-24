import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database.session import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False)        # e.g., 'API Key Created', 'Review Patch Applied'
    target = Column(String, nullable=False)        # e.g., 'auth.py:L2', 'Backend API'
    actor_email = Column(String, nullable=False)   # e.g., 'aryan@codemind.ai'
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
