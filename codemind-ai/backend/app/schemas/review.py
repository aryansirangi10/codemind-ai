from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CodeUpload(BaseModel):
    file_name: str
    code_content: str
    project_id: Optional[int] = None

class ReviewResultOut(BaseModel):
    id: int
    file_path: str
    line_number: Optional[int] = None
    category: str
    severity: str
    message: str
    original_code: Optional[str] = None
    suggested_code: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ReviewOut(BaseModel):
    id: int
    project_id: int
    repository_id: Optional[int] = None
    status: str
    overall_score: int
    security_score: int
    performance_score: int
    bugs_score: int
    complexity_score: int
    doc_score: int
    commit_sha: Optional[str] = None
    created_at: datetime
    results: List[ReviewResultOut] = []

    model_config = ConfigDict(from_attributes=True)
