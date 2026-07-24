from typing import List
from app.domain.ai.agents.base import AgentResult

class SupervisorAgent:
    name = "supervisor_agent"
    role = "Consensus Supervisor"

    def synthesize(self, agent_results: List[AgentResult]) -> dict:
        if not agent_results:
            return {"overall_score": 100, "all_findings": []}

        total_score = sum(r.score for r in agent_results)
        overall_score = max(0, min(100, int(total_score / len(agent_results))))

        all_findings = []
        for r in agent_results:
            all_findings.extend(r.findings)

        return {
            "overall_score": overall_score,
            "security_score": agent_results[0].score if len(agent_results) > 0 else 100,
            "all_findings": all_findings
        }
