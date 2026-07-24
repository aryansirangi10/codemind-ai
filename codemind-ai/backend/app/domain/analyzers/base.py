from abc import ABC, abstractmethod
from typing import List, Optional
from pydantic import BaseModel

class FindingResult(BaseModel):
    category: str       # bug, security, performance, complexity, smell
    severity: str       # critical, high, medium, low, info
    cwe_code: Optional[str] = "CWE-General"
    title: str
    message: str
    file_path: str
    line_number: int = 1
    original_code: Optional[str] = None
    suggested_code: Optional[str] = None

class BaseAnalyzer(ABC):
    name: str = "base_analyzer"
    description: str = "Base code analyzer plugin"

    @abstractmethod
    def analyze(self, code_context: str, file_path: str = "main.py") -> List[FindingResult]:
        pass
