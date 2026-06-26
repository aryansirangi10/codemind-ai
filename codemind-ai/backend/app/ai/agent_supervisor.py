import json
from typing import List, Dict, Any
from app.core.config import settings
from app.ai.prompts import SUPERVISOR_AGENT_PROMPT
from app.ai.agents import (
    call_llm,
    run_security_agent,
    run_performance_agent,
    run_bugs_agent,
    run_complexity_agent
)
from app.ai.rag_engine import retrieve_relevant_standards

def run_multi_agent_review(file_path: str, code_content: str, static_findings: List[Dict]) -> Dict[str, Any]:
    """
    Runs the multi-agent review pipeline on a single file:
    1. Retrieval-Augmented Generation: Get relevant coding standards.
    2. Sub-agents run concurrently: Security, Performance, Bugs, Complexity.
    3. Supervisor Agent combines, deduplicates, and scores the code.
    """
    # 1. RAG step
    rag_standards = retrieve_relevant_standards(code_content, limit=3)
    
    # 2. Execute sub-agents
    security_reports = run_security_agent(file_path, code_content, static_findings, rag_standards)
    performance_reports = run_performance_agent(file_path, code_content, static_findings, rag_standards)
    bugs_reports = run_bugs_agent(file_path, code_content, static_findings, rag_standards)
    complexity_reports = run_complexity_agent(file_path, code_content, static_findings, rag_standards)
    
    # Combined reports representation
    combined_reports = {
        "security_agent": security_reports,
        "performance_agent": performance_reports,
        "bugs_agent": bugs_reports,
        "complexity_agent": complexity_reports
    }
    
    # 3. Supervisor synthesis
    prompt = f"File: {file_path}\nCombined Agent Results:\n{json.dumps(combined_reports, indent=2)}"
    system_inst = SUPERVISOR_AGENT_PROMPT.format(
        combined_reports=json.dumps(combined_reports, indent=2),
        code_content=code_content
    )
    
    response_text = call_llm(prompt, system_instruction=system_inst)
    if response_text:
        try:
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0].strip()
            return json.loads(response_text)
        except Exception:
            pass

    # Programmatic fallback synthesis
    all_issues = []
    
    # Deduplicate and combine findings
    seen_keys = set()
    for category, reports in combined_reports.items():
        for r in reports:
            # Create a unique key for deduplication
            key = f"{r.get('file_path')}:{r.get('line_number')}:{r.get('category')}:{r.get('message', '')[:30]}"
            if key not in seen_keys:
                seen_keys.add(key)
                all_issues.append(r)
                
    # Calculate scores dynamically
    security_score = 100
    performance_score = 100
    bugs_score = 100
    complexity_score = 100
    doc_score = 90
    
    # Check for docstrings to modify doc_score
    if "def " in code_content and '"""' not in code_content and "'''" not in code_content:
        doc_score = 70
        
    for issue in all_issues:
        sev = issue.get("severity", "low").lower()
        cat = issue.get("category", "").lower()
        
        # Deduct based on severity and category
        deduction = 5
        if sev == "critical":
            deduction = 25
        elif sev == "high":
            deduction = 15
        elif sev == "medium":
            deduction = 8
            
        if cat == "security":
            security_score -= deduction
        elif cat == "performance":
            performance_score -= deduction
        elif cat == "bug":
            bugs_score -= deduction
        elif cat in ["complexity", "smell", "style"]:
            complexity_score -= deduction

    # Clamp scores between 25 and 100
    security_score = max(25, min(100, security_score))
    performance_score = max(25, min(100, performance_score))
    bugs_score = max(25, min(100, bugs_score))
    complexity_score = max(25, min(100, complexity_score))
    
    # Calculate overall average
    overall_score = int((security_score + performance_score + bugs_score + complexity_score + doc_score) / 5)
    
    return {
        "overall_score": overall_score,
        "security_score": security_score,
        "performance_score": performance_score,
        "bugs_score": bugs_score,
        "complexity_score": complexity_score,
        "doc_score": doc_score,
        "issues": all_issues
    }
