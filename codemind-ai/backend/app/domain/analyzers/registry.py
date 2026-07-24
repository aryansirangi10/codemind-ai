from typing import List, Type
from app.domain.analyzers.base import BaseAnalyzer, FindingResult

class AnalyzerRegistry:
    _analyzers: List[BaseAnalyzer] = []

    @classmethod
    def register(cls, analyzer_cls: Type[BaseAnalyzer]):
        # Avoid duplicate registrations
        if not any(isinstance(a, analyzer_cls) for a in cls._analyzers):
            cls._analyzers.append(analyzer_cls())
        return analyzer_cls

    @classmethod
    def discover_analyzers(cls):
        if not cls._analyzers:
            try:
                import app.domain.analyzers.ast.python_ast
                import app.domain.analyzers.security.owasp
            except ImportError:
                pass

    @classmethod
    def get_analyzers(cls) -> List[BaseAnalyzer]:
        cls.discover_analyzers()
        return cls._analyzers

    @classmethod
    def run_all(cls, code_context: str, file_path: str = "main.py") -> List[FindingResult]:
        cls.discover_analyzers()
        all_findings = []
        for analyzer in cls._analyzers:
            try:
                findings = analyzer.analyze(code_context, file_path)
                all_findings.extend(findings)
            except Exception:
                pass
        return all_findings

analyzer_registry = AnalyzerRegistry()
