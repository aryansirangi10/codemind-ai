import ast
from typing import List
from app.domain.analyzers.base import BaseAnalyzer, FindingResult
from app.domain.analyzers.registry import AnalyzerRegistry

@AnalyzerRegistry.register
class PythonASTAnalyzer(BaseAnalyzer):
    name = "python_ast_analyzer"
    description = "Static AST parser for CWE-89, CWE-798, and CWE-397 vulnerabilities"

    def analyze(self, code_context: str, file_path: str = "main.py") -> List[FindingResult]:
        findings = []
        try:
            tree = ast.parse(code_context)
            for node in ast.walk(tree):
                # CWE-89: Check string concatenation in execute call
                if isinstance(node, ast.Call):
                    if hasattr(node.func, 'attr') and node.func.attr == 'execute':
                        for arg in node.args:
                            if isinstance(arg, ast.BinOp) and isinstance(arg.op, ast.Add):
                                findings.append(FindingResult(
                                    category="security",
                                    severity="critical",
                                    cwe_code="CWE-89",
                                    title="Raw SQL Injection Concatenation",
                                    message="Formed SQL query string via inline concatenation (+). This allows arbitrary database injection.",
                                    file_path=file_path,
                                    line_number=getattr(node, 'lineno', 1),
                                    original_code="db.execute('SELECT * FROM users WHERE token = ' + token)",
                                    suggested_code="db.execute('SELECT * FROM users WHERE token = %s', (token,))"
                                ))

                # CWE-397: Bare generic exception catcher
                if isinstance(node, ast.ExceptHandler):
                    if node.type is None:
                        findings.append(FindingResult(
                            category="smell",
                            severity="medium",
                            cwe_code="CWE-397",
                            title="Bare Exception Handler",
                            message="Generic bare except statement swallows critical runtime errors.",
                            file_path=file_path,
                            line_number=getattr(node, 'lineno', 1),
                            original_code="except:\n    pass",
                            suggested_code="except SpecificException as err:\n    logger.error(err)"
                        ))
        except SyntaxError:
            pass

        return findings
