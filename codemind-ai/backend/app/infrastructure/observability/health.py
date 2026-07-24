from app.database.session import SessionLocal

def check_system_health():
    db = SessionLocal()
    db_status = "healthy"
    try:
        db.execute("SELECT 1")
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    finally:
        db.close()

    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "components": {
            "database": db_status,
            "api_gateway": "healthy",
            "analyzer_registry": "healthy"
        }
    }
