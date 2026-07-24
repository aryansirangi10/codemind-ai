from typing import List, Optional
from sqlalchemy.orm import Session
from app.domain.models.audit_log import AuditLog

class AuditRepository:
    def __init__(self, db: Session):
        self.db = db

    def log(self, action: str, target: str, actor_email: str, user_id: Optional[int] = None) -> AuditLog:
        audit = AuditLog(
            action=action,
            target=target,
            actor_email=actor_email,
            user_id=user_id
        )
        self.db.add(audit)
        self.db.commit()
        self.db.refresh(audit)
        return audit

    def list_all(self, limit: int = 50) -> List[AuditLog]:
        return self.db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
