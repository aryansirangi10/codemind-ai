import os
import json
from typing import Dict, Any, List

def generate_markdown_report(review_data: Dict[str, Any], project_name: str) -> str:
    """
    Generates a markdown report summarizing the review.
    """
    md = []
    md.append(f"# CodeMind AI - Code Review Report")
    md.append(f"**Project:** {project_name}")
    md.append(f"**Overall Score:** {review_data.get('overall_score')}/100")
    md.append("")
    md.append("## Metrics Dashboard")
    md.append(f"- **Security Score:** {review_data.get('security_score')}/100")
    md.append(f"- **Performance Score:** {review_data.get('performance_score')}/100")
    md.append(f"- **Bugs Score:** {review_data.get('bugs_score')}/100")
    md.append(f"- **Complexity & Style Score:** {review_data.get('complexity_score')}/100")
    md.append(f"- **Documentation Score:** {review_data.get('doc_score')}/100")
    md.append("")
    
    issues: List[Dict] = review_data.get("issues", [])
    md.append(f"## Code Findings ({len(issues)} issues detected)")
    md.append("")
    
    if not issues:
        md.append("🎉 Clean Review! No major issues detected by the CodeMind AI agents.")
    else:
        for idx, issue in enumerate(issues):
            severity = issue.get("severity", "info").upper()
            category = issue.get("category", "code").upper()
            file_path = issue.get("file_path", "unknown")
            line = issue.get("line_number", "N/A")
            
            md.append(f"### {idx+1}. [{severity}] {category} in `{file_path}` (Line {line})")
            md.append(f"**Description:** {issue.get('message')}")
            md.append("")
            
            orig = issue.get("original_code")
            sugg = issue.get("suggested_code")
            
            if orig:
                md.append("```python")
                md.append("# Original Code:")
                md.append(orig)
                md.append("```")
                md.append("")
            if sugg:
                md.append("```python")
                md.append("# Suggested Fix:")
                md.append(sugg)
                md.append("```")
                md.append("")
            md.append("---")
            
    return "\n".join(md)

def generate_html_report(review_data: Dict[str, Any], project_name: str) -> str:
    """
    Generates a beautifully styled, premium, responsive HTML report.
    Uses the CodeMind AI dark-red design system (#0A0A0A base background, #FF0000 highlights).
    """
    issues: List[Dict] = review_data.get("issues", [])
    issues_html = []
    
    for idx, issue in enumerate(issues):
        severity = issue.get("severity", "info").lower()
        category = issue.get("category", "code").lower()
        file_path = issue.get("file_path", "unknown")
        line = issue.get("line_number", "N/A")
        message = issue.get("message", "")
        orig = issue.get("original_code", "")
        sugg = issue.get("suggested_code", "")
        
        sev_color = "#FF0000" if severity == "critical" else "#FF4D4F" if severity == "high" else "#FFC83D" if severity == "medium" else "#00D26A"
        
        orig_section = f'<div class="code-block"><h4>Original Code:</h4><pre><code>{orig}</code></pre></div>' if orig else ''
        sugg_section = f'<div class="code-block suggested"><h4>Suggested Fix:</h4><pre><code>{sugg}</code></pre></div>' if sugg else ''
        
        issues_html.append(f"""
        <div class="issue-card border-{severity}">
            <div class="issue-header">
                <span class="severity-badge" style="background-color: {sev_color}">{severity.upper()}</span>
                <span class="category-badge">{category.upper()}</span>
                <span class="file-info">`{file_path}` (Line {line})</span>
            </div>
            <p class="issue-msg">{message}</p>
            {orig_section}
            {sugg_section}
        </div>
        """)
        
    issues_content = "\n".join(issues_html) if issues_html else "<div class='clean-state'>🎉 Clean Review! No major issues detected by the CodeMind AI agents.</div>"
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeMind AI Review Report - {project_name}</title>
    <style>
        body {{
            background-color: #0A0A0A;
            color: #FFFFFF;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 40px 20px;
            line-height: 1.6;
        }}
        .container {{
            max-width: 900px;
            margin: 0 auto;
        }}
        header {{
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 24px;
            margin-bottom: 40px;
        }}
        .brand {{
            color: #FF0000;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }}
        h1 {{
            font-size: 32px;
            margin: 0 0 10px 0;
        }}
        .meta {{
            color: #A5A5A5;
            font-size: 14px;
        }}
        .score-dashboard {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
            gap: 16px;
            margin-bottom: 40px;
        }}
        .score-card {{
            background-color: #111111;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }}
        .score-card.primary {{
            border-color: #FF0000;
            background: linear-gradient(180deg, #111111 0%, rgba(255, 0, 0, 0.05) 100%);
        }}
        .score-num {{
            font-size: 36px;
            font-weight: bold;
            color: #FFFFFF;
            margin-top: 10px;
        }}
        .score-card.primary .score-num {{
            color: #FF3D3D;
        }}
        .score-label {{
            font-size: 12px;
            color: #A5A5A5;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        .issue-card {{
            background-color: #181818;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-left: 4px solid #707070;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
        }}
        .border-critical {{ border-left-color: #FF0000; }}
        .border-high {{ border-left-color: #FF4D4F; }}
        .border-medium {{ border-left-color: #FFC83D; }}
        .border-low {{ border-left-color: #00D26A; }}
        .border-info {{ border-left-color: #00D26A; }}
        
        .issue-header {{
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            flex-wrap: wrap;
        }}
        .severity-badge, .category-badge {{
            font-size: 11px;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            text-transform: uppercase;
        }}
        .category-badge {{
            background-color: rgba(255, 255, 255, 0.1);
            color: #FFFFFF;
        }}
        .file-info {{
            color: #A5A5A5;
            font-size: 14px;
        }}
        .issue-msg {{
            margin: 0 0 20px 0;
            font-size: 16px;
            color: #E5E5E5;
        }}
        .code-block {{
            background-color: #0A0A0A;
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            overflow-x: auto;
        }}
        .code-block.suggested {{
            border-color: rgba(0, 210, 106, 0.3);
            background-color: rgba(0, 210, 106, 0.02);
        }}
        .code-block h4 {{
            margin: 0 0 10px 0;
            font-size: 12px;
            color: #707070;
            text-transform: uppercase;
        }}
        pre {{
            margin: 0;
            font-family: 'JetBrains Mono', Courier, monospace;
            font-size: 13px;
        }}
        code {{
            color: #FF6A6A;
        }}
        .code-block.suggested code {{
            color: #00D26A;
        }}
        .clean-state {{
            background-color: rgba(0, 210, 106, 0.05);
            border: 1px solid rgba(0, 210, 106, 0.2);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            font-size: 18px;
            color: #00D26A;
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="brand">CodeMind AI</div>
            <h1>Code Review Report</h1>
            <div class="meta">Project: {project_name} | Generated by CodeMind AI Multi-Agent Pipeline</div>
        </header>

        <section class="score-dashboard">
            <div class="score-card primary">
                <div class="score-label">Overall Score</div>
                <div class="score-num">{review_data.get('overall_score')}/100</div>
            </div>
            <div class="score-card">
                <div class="score-label">Security</div>
                <div class="score-num">{review_data.get('security_score')}/100</div>
            </div>
            <div class="score-card">
                <div class="score-label">Performance</div>
                <div class="score-num">{review_data.get('performance_score')}/100</div>
            </div>
            <div class="score-card">
                <div class="score-label">Bugs</div>
                <div class="score-num">{review_data.get('bugs_score')}/100</div>
            </div>
            <div class="score-card">
                <div class="score-label">Complexity</div>
                <div class="score-num">{review_data.get('complexity_score')}/100</div>
            </div>
        </section>

        <h2>Detailed Audit Findings</h2>
        <section class="findings">
            {issues_content}
        </section>
    </div>
</body>
</html>
"""
    return html
