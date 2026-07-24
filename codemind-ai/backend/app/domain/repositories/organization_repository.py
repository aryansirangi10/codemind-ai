from typing import Optional, List
from sqlalchemy.orm import Session
from app.domain.models.organization import Organization, OrganizationMember

class OrganizationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, org_id: int) -> Optional[Organization]:
        return self.db.query(Organization).filter(Organization.id == org_id).first()

    def get_by_slug(self, slug: str) -> Optional[Organization]:
        return self.db.query(Organization).filter(Organization.slug == slug).first()

    def list_all(self) -> List[Organization]:
        return self.db.query(Organization).all()

    def create(self, name: str, slug: str) -> Organization:
        org = Organization(name=name, slug=slug)
        self.db.add(org)
        self.db.commit()
        self.db.refresh(org)
        return org

    def add_member(self, org_id: int, user_id: int, role: str = "developer") -> OrganizationMember:
        member = OrganizationMember(organization_id=org_id, user_id=user_id, role=role)
        self.db.add(member)
        self.db.commit()
        self.db.refresh(member)
        return member
