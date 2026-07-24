from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.api import deps
from app.domain.models.user import User

router = APIRouter()

class OrgCreate(BaseModel):
    name: str
    slug: str

class OrgOut(BaseModel):
    id: int
    name: str
    slug: str
    health_score: int

@router.get("/", response_model=List[OrgOut])
def list_organizations(
    container = Depends(deps.get_container_dep),
    current_user: User = Depends(deps.get_current_user)
):
    orgs = container.org_repo.list_all()
    if not orgs:
        default_org = container.org_repo.create(name="OpenAI", slug="openai")
        return [default_org]
    return orgs

@router.post("/", response_model=OrgOut)
def create_organization(
    payload: OrgCreate,
    container = Depends(deps.get_container_dep),
    current_user: User = Depends(deps.get_current_user)
):
    existing = container.org_repo.get_by_slug(payload.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Organization slug already exists")
    org = container.org_repo.create(name=payload.name, slug=payload.slug)
    container.org_repo.add_member(org_id=org.id, user_id=current_user.id, role="owner")
    return org
