from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class RepositoryBase(BaseModel):
    name: str
    git_url: str
    branch: Optional[str] = "main"

class RepositoryCreate(RepositoryBase):
    pass

class RepositoryOut(RepositoryBase):
    id: int
    project_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    repositories: Optional[List[RepositoryCreate]] = []

class ProjectOut(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    repositories: List[RepositoryOut] = []

    model_config = ConfigDict(from_attributes=True)
