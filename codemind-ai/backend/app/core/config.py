import os
from typing import List, Optional
from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "CodeMind AI"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-codemind-ai-token-key-2026")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    # Will default to sqlite in workspace if no Postgres is configured
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./codemind.db")
    
    # AI Providers
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
    OPENROUTER_API_KEY: Optional[str] = os.getenv("OPENROUTER_API_KEY")
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
