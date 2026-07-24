from fastapi import APIRouter
from app.api.v1 import auth, projects, reviews, chat, health
from app.api.v1.routes import organizations_routes, audit_routes

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(organizations_routes.router, prefix="/organizations", tags=["organizations"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(audit_routes.router, prefix="/audit-logs", tags=["audit-logs"])
api_router.include_router(health.router, prefix="/health", tags=["health"])
