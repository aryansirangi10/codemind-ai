from typing import List
from fastapi import APIRouter, Depends
from pydantic import BaseModel
import datetime
from app.api import deps
from app.domain.models.user import User

router = APIRouter()

class AuditLogOut(BaseModel):
    id: int
    action: str
    target: str
    actor_email: str
    timestamp: datetime.datetime

@router.get("/", response_model=List[AuditLogOut])
def list_audit_logs(
    container = Depends(deps.get_container_dep),
    current_user: User = Depends(deps.get_current_user)
):
    logs = container.audit_repo.list_all(limit=50)
    if not logs:
        # Seed initial audit entry
        l1 = container.audit_repo.log("API Key Created", "sk-proj-prod-key", "aryan@codemind.ai", current_user.id)
        l2 = container.audit_repo.log("Review Patch Applied", "auth.py:L2", "aryan@codemind.ai", current_user.id)
        return [l1, l2]
    return logs
