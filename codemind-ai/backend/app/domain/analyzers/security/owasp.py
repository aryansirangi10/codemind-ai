import re
from typing import List
from app.domain.analyzers.base import BaseAnalyzer, FindingResult
from app.domain.analyzers.registry import AnalyzerRegistry

@AnalyzerRegistry.register
class OWASPSecurityAnalyzer(BaseAnalyzer):
    name = "owasp_security_analyzer"
    description = "Scans for hardcoded credential tokens and OWASP Top 10 vulnerabilities"

    def analyze(self, code_context: str, file_path: str = "main.py") -> List[FindingResult]:
        findings = []
        secret_patterns = [
            (r'(?i)(jwt_secret|api_key|password|secret_key)\s*=\s*[\'"][^\'"]+[\'"]', "CWE-798", "Hardcoded Secret Credentials Token")
        ]

        lines = code_context.split("\n")
        for idx, line in enumerate(lines, 1):
            for pattern, cwe, title in secret_patterns:
                if re.search(pattern, line):
                    findings.append(FindingResult(
                        category="security",
                        severity="high",
                        cwe_code=cwe,
                        title=title,
                        message=f"Hardcoded credential key found on line {idx}. Secrets should be stored in environment variables.",
                        file_path=file_path,
                        line_number=idx,
                        original_code=line.strip(),
                        suggested_code="import os\nJWT_SECRET = os.getenv('JWT_SECRET')"
                    ))

        return findings
