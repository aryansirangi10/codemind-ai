from app.domain.ai.agents.base import BaseAgent, AgentResult

class SecurityAgent(BaseAgent):
    name = "security_agent"
    role = "Security Auditor"

    def run(self, code_context: str, file_path: str = "main.py") -> AgentResult:
        score = 85
        findings = []
        if "execute" in code_context and "+" in code_context:
            score = 35
            findings.append({
                "severity": "critical",
                "cwe": "CWE-89",
                "title": "SQL Injection",
                "message": "Dynamic query string concatenation detected.",
                "file_path": file_path,
                "line_number": 2
            })
        
        return AgentResult(
            agent_name=self.name,
            role=self.role,
            score=score,
            findings=findings,
            recommendations=["Sanitize SQL input parameters", "Store secrets in environment vault"]
        )
