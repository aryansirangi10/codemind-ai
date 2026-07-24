from typing import List, Type
from app.domain.analyzers.base import BaseAnalyzer, FindingResult

class AnalyzerRegistry:
    _analyzers: List[BaseAnalyzer] = []

    @classmethod
    def register(cls, analyzer_cls: Type[BaseAnalyzer]):
        cls._analyzers.append(analyzer_cls())
        return analyzer_cls

    @classmethod
    def get_analyzers(cls) -> List[BaseAnalyzer]:
        return cls._analyzers

    @classmethod
    def run_all(cls, code_context: str, file_path: str = "main.py") -> List[FindingResult]:
        all_findings = []
        for analyzer in cls._analyzers:
            try:
                findings = analyzer.analyze(code_context, file_path)
                all_findings.extend(findings)
            except Exception:
                pass
        return all_findings

analyzer_registry = AnalyzerRegistry()
