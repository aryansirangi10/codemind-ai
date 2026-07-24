from typing import Optional, List
from sqlalchemy.orm import Session
from app.domain.models.project import Project
from app.domain.models.repository import Repository

class ProjectRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, project_id: int) -> Optional[Project]:
        return self.db.query(Project).filter(Project.id == project_id).first()

    def list_by_owner(self, owner_id: int) -> List[Project]:
        return self.db.query(Project).filter(Project.owner_id == owner_id).all()

    def list_all(self) -> List[Project]:
        return self.db.query(Project).all()

    def create_project(self, name: str, description: str, owner_id: int, organization_id: Optional[int] = None) -> Project:
        project = Project(
            name=name,
            description=description,
            owner_id=owner_id,
            organization_id=organization_id
        )
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)
        return project

    def create_repository(self, name: str, git_url: str, project_id: int, branch: str = "main") -> Repository:
        repo = Repository(
            name=name,
            git_url=git_url,
            project_id=project_id,
            branch=branch
        )
        self.db.add(repo)
        self.db.commit()
        self.db.refresh(repo)
        return repo

    def delete_project(self, project_id: int) -> bool:
        project = self.get_by_id(project_id)
        if project:
            self.db.delete(project)
            self.db.commit()
            return True
        return False
