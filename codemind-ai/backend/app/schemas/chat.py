from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ChatRequest(BaseModel):
    message: str
    project_id: int
    file_path: Optional[str] = None  # Optional active file context

class ChatMessageOut(BaseModel):
    id: int
    project_id: int
    role: str
    content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ChatResponse(BaseModel):
    response: str
    history_message: ChatMessageOut
