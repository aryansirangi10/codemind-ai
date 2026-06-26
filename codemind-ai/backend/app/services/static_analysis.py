import ast
import re
import os
from typing import List, Dict, Any

class CodeASTAnalyzer(ast.NodeVisitor):
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.findings = []
        self.current_function = None

    def visit_FunctionDef(self, node):
        self.current_function = node.name
        # Check function length
        lines = node.end_lineno - node.lineno
        if lines > 50:
            self.findings.append({
                "file_path": self.file_path,
                "line_number": node.lineno,
                "category": "complexity",
                "severity": "medium",
                "message": f"Function '{node.name}' is too long ({lines} lines). Consider refactoring it into smaller functions.",
                "original_code": f"def {node.name}(...):",
                "suggested_code": None
            })
        self.generic_visit(node)
        self.current_function = None

    def visit_Call(self, node):
        # 1. Check for dangerous functions
        if isinstance(node.func, ast.Name):
            func_name = node.func.id
            if func_name in ["eval", "exec"]:
                self.findings.append({
                    "file_path": self.file_path,
                    "line_number": node.lineno,
                    "category": "security",
                    "severity": "critical",
                    "message": f"Use of dangerous function '{func_name}()' detected. This can lead to arbitrary code execution.",
                    "original_code": f"{func_name}(...)",
                    "suggested_code": "# Use safer alternatives or static parsing"
                })
        
        # 2. Check for SQL Injection patterns in DB calls
        # e.g., db.execute(f"...") or conn.execute("..." % ...)
        if isinstance(node.func, ast.Attribute) and node.func.attr in ["execute", "raw"]:
            for arg in node.args:
                # Check for f-string formatting
                if isinstance(arg, ast.JoinedStr):
                    self.findings.append({
                        "file_path": self.file_path,
                        "line_number": node.lineno,
                        "category": "security",
                        "severity": "critical",
                        "message": "Potential SQL injection. Formatted f-string used in database execution call.",
                        "original_code": "db.execute(f\"...\")",
                        "suggested_code": "Use parameterized queries, e.g., db.execute('SELECT * FROM users WHERE id = :id', {'id': user_id})"
                    })
                # Check for string % formatting or string.format()
                elif isinstance(arg, ast.BinOp) and isinstance(arg.op, ast.Mod):
                    self.findings.append({
                        "file_path": self.file_path,
                        "line_number": node.lineno,
                        "category": "security",
                        "severity": "critical",
                        "message": "Potential SQL injection. Modulo formatting (%) used in database execution call.",
                        "original_code": "db.execute('...' % ...)",
                        "suggested_code": "Use parameterized queries."
                    })
        self.generic_visit(node)

    def visit_Assign(self, node):
        # Check for hardcoded credentials / secret keys
        for target in node.targets:
            if isinstance(target, ast.Name):
                var_name = target.id.lower()
                if any(x in var_name for x in ["password", "secret", "api_key", "token", "private_key"]):
                    if isinstance(node.value, ast.Constant) and isinstance(node.value.value, str):
                        val = node.value.value
                        if len(val) > 4:  # Ignore empty or placeholder strings
                            self.findings.append({
                                "file_path": self.file_path,
                                "line_number": node.lineno,
                                "category": "security",
                                "severity": "high",
                                "message": f"Hardcoded credential/secret assigned to variable '{target.id}'.",
                                "original_code": f"{target.id} = '{'*' * len(val)}'",
                                "suggested_code": f"{target.id} = os.getenv('{target.id.upper()}')"
                            })
        self.generic_visit(node)

    def visit_Try(self, node):
        # Check for bare except / empty except
        for handler in node.handlers:
            if handler.type is None:  # Bare except
                # Check if body is just 'pass'
                if len(handler.body) == 1 and isinstance(handler.body[0], ast.Pass):
                    self.findings.append({
                        "file_path": self.file_path,
                        "line_number": handler.lineno,
                        "category": "smell",
                        "severity": "low",
                        "message": "Bare except handler that only performs 'pass' found. This silences all exceptions.",
                        "original_code": "except:\n    pass",
                        "suggested_code": "except Exception as e:\n    logger.error(e)\n    raise"
                    })
        self.generic_visit(node)


def analyze_file_content(file_path: str, code_content: str) -> List[Dict[str, Any]]:
    findings = []
    
    # Run AST-based checks for Python
    if file_path.endswith(".py"):
        try:
            tree = ast.parse(code_content)
            analyzer = CodeASTAnalyzer(file_path)
            analyzer.visit(tree)
            findings.extend(analyzer.findings)
        except SyntaxError as e:
            findings.append({
                "file_path": file_path,
                "line_number": e.lineno,
                "category": "bug",
                "severity": "critical",
                "message": f"Syntax error in code: {e.msg}",
                "original_code": e.text,
                "suggested_code": None
            })
            return findings

    # General Regex-based scanning (for JavaScript, Go, HTML, Java, etc.)
    lines = code_content.splitlines()
    for idx, line in enumerate(lines):
        line_num = idx + 1
        
        # 1. Hardcoded API keys / tokens
        if re.search(r'(api[_-]?key|secret|token|password|passwd|private[_-]?key)\s*[:=]\s*["\'][a-zA-Z0-9_\-\.\/]{8,}["\']', line, re.IGNORECASE):
            # Exclude imports
            if "import " not in line and "require(" not in line:
                findings.append({
                    "file_path": file_path,
                    "line_number": line_num,
                    "category": "security",
                    "severity": "high",
                    "message": "Potential hardcoded credential or secret detected.",
                    "original_code": line.strip(),
                    "suggested_code": None
                })
        
        # 2. Console logs left in code (Code Smell)
        if "console.log(" in line and not line.strip().startswith("//") and not line.strip().startswith("/*"):
            if file_path.endswith((".js", ".ts", ".jsx", ".tsx")):
                findings.append({
                    "file_path": file_path,
                    "line_number": line_num,
                    "category": "smell",
                    "severity": "info",
                    "message": "Avoid leaving 'console.log' statements in production code.",
                    "original_code": line.strip(),
                    "suggested_code": None
                })

        # 3. SQL injection patterns in non-python files
        if re.search(r'(SELECT|INSERT|UPDATE|DELETE).*\+.*req\.query|req\.body', line, re.IGNORECASE):
            findings.append({
                "file_path": file_path,
                "line_number": line_num,
                "category": "security",
                "severity": "critical",
                "message": "Potential SQL injection due to query string concatenation.",
                "original_code": line.strip(),
                "suggested_code": None
            })

        # 4. TODO comments (smells/info)
        if "TODO" in line or "FIXME" in line:
            if not line.strip().startswith("*") and not line.strip().startswith("#"):
                findings.append({
                    "file_path": file_path,
                    "line_number": line_num,
                    "category": "smell",
                    "severity": "info",
                    "message": "Unresolved TODO/FIXME item found in comments.",
                    "original_code": line.strip(),
                    "suggested_code": None
                })

    return findings
