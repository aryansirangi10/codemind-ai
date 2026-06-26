from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from sqlalchemy.sql import text

router = APIRouter()

@router.get("/health")
def health_check(db: Session = Depends(deps.get_db)):
    try:
        # Perform simple db select query to check connection health
        db.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "online",
        "service": "codemind-ai-backend",
        "database": db_status
    }
