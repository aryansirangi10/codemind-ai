from abc import ABC, abstractmethod
from typing import List, Dict, Any
from pydantic import BaseModel

class AgentResult(BaseModel):
    agent_name: str
    role: str
    score: int
    findings: List[Dict[str, Any]]
    recommendations: List[str]

class BaseAgent(ABC):
    name: str = "base_agent"
    role: str = "specialist"

    @abstractmethod
    def run(self, code_context: str, file_path: str = "main.py") -> AgentResult:
        pass
