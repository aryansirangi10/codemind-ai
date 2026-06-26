// CodeMind AI API Client with Mock Fallback Mode
const API_BASE = "http://localhost:8000/api/v1";

class ApiClient {
    constructor() {
        this.token = localStorage.getItem("token") || null;
        this.currentUser = JSON.parse(localStorage.getItem("user")) || null;
        this.fallbackMode = false; // Will set to true if backend connection fails
        
        // Local Mock Data Store (used in fallback mode)
        this.mockProjects = [
            {
                id: 1,
                name: "Vulnerability Playground",
                description: "Audit tests for OWASP Top 10 vulnerabilities, AST parser validations, and dependency analysis.",
                created_at: "2026-06-25T12:00:00Z",
                repositories: [{ id: 101, name: "vuln-node-api", git_url: "https://github.com/codemind-ai/vuln-node-api.git", branch: "master" }]
            },
            {
                id: 2,
                name: "Cloud Microservice Core",
                description: "Core payment integrations, JWT authorization service, and Redis transaction queue adapter.",
                created_at: "2026-06-26T09:30:00Z",
                repositories: [{ id: 102, name: "payment-gateway", git_url: "https://github.com/codemind-ai/payment-gateway.git", branch: "main" }]
            }
        ];
        
        this.mockReviews = [
            {
                id: 1,
                project_id: 1,
                repository_id: 101,
                status: "COMPLETED",
                overall_score: 58,
                security_score: 35,
                performance_score: 70,
                bugs_score: 60,
                complexity_score: 65,
                doc_score: 60,
                commit_sha: "a9c18f2d",
                created_at: "2026-06-25T14:45:00Z",
                results: [
                    {
                        id: 501,
                        file_path: "routes/auth.py",
                        line_number: 24,
                        category: "security",
                        severity: "critical",
                        message: "SQL Injection Vulnerability. Formatted f-string variables directly inserted into SQL query string execution. This permits arbitrary database access.",
                        original_code: "cursor.execute(f'SELECT * FROM users WHERE email = \"{email}\" AND password = \"{passwd}\"')",
                        suggested_code: "cursor.execute(\n    'SELECT * FROM users WHERE email = :email AND password = :password',\n    {'email': email, 'password': password}\n)"
                    },
                    {
                        id: 502,
                        file_path: "routes/auth.py",
                        line_number: 8,
                        category: "security",
                        severity: "high",
                        message: "Hardcoded encryption secret found in source code files. Credentials should always be loaded from runtime environmental variables or vault secrets.",
                        original_code: "JWT_SECRET = 'super-secret-key-321-abc'",
                        suggested_code: "import os\nJWT_SECRET = os.getenv('JWT_SECRET')"
                    },
                    {
                        id: 503,
                        file_path: "utils/parser.js",
                        line_number: 45,
                        category: "performance",
                        severity: "high",
                        message: "Performance issue: Database connection initialized inside helper loop. Connection pooling should be handled at module lifecycle initialization.",
                        original_code: "for (let i = 0; i < ids.length; i++) {\n    const client = new Client();\n    await client.connect();\n    ...",
                        suggested_code: "const client = await pool.connect();\ntry {\n    for (const id of ids) {\n        // run query on same client\n    }\n} finally {\n    client.release();\n}"
                    }
                ]
            },
            {
                id: 2,
                project_id: 2,
                repository_id: 102,
                status: "COMPLETED",
                overall_score: 92,
                security_score: 95,
                performance_score: 90,
                bugs_score: 95,
                complexity_score: 85,
                doc_score: 95,
                commit_sha: "7e3d11b2",
                created_at: "2026-06-26T10:15:00Z",
                results: [
                    {
                        id: 504,
                        file_path: "integrations/stripe.py",
                        line_number: 62,
                        category: "complexity",
                        severity: "medium",
                        message: "Cognitive complexity warning. Function 'process_webhook' contains 4 levels of nested loops and conditional statements. Extract sub-logic into dedicated handlers.",
                        original_code: "def process_webhook(payload):\n    if payload.type == 'invoice':\n        for line in payload.lines:\n            if line.amount > 0:\n                ...",
                        suggested_code: "def process_webhook(payload):\n    if payload.type != 'invoice':\n        return\n    _handle_invoice_webhook(payload)"
                    },
                    {
                        id: 505,
                        file_path: "integrations/stripe.py",
                        line_number: 14,
                        category: "smell",
                        severity: "info",
                        message: "Clean Code Smell: Wildcard import statement. Wildcard imports pollute the namespace and reduce file readability.",
                        original_code: "from stripe.errors import *",
                        suggested_code: "from stripe.errors import StripeError, CardError, InvalidRequestError"
                    }
                ]
            }
        ];
        
        this.mockChats = [];
    }

    setToken(token, user) {
        this.token = token;
        this.currentUser = user;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
    }

    clearToken() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    async request(path, options = {}) {
        if (this.fallbackMode) {
            return this.mockResponse(path, options);
        }

        const headers = {
            "Content-Type": "application/json",
            ...options.headers
        };

        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }

        try {
            const res = await fetch(`${API_BASE}${path}`, {
                ...options,
                headers
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ detail: "Request failed" }));
                throw new Error(errorData.detail || "Server error");
            }

            return await res.json();
        } catch (err) {
            console.warn(`Backend connection failed for ${path}. Switching to Client-Side Mock mode.`, err);
            this.fallbackMode = true;
            return this.mockResponse(path, options);
        }
    }

    // Intercepts request and returns mock data when backend is not active
    mockResponse(path, options) {
        const method = options.method || "GET";
        
        if (path === "/auth/login") {
            const params = new URLSearchParams(options.body);
            const email = params.get("username");
            return Promise.resolve({
                access_token: "mock-jwt-token-string",
                token_type: "bearer",
                user: { id: 99, email: email, full_name: "Demo Developer", role: "developer", is_active: true }
            });
        }
        
        if (path === "/auth/register") {
            const body = JSON.parse(options.body);
            return Promise.resolve({
                id: 99, email: body.email, full_name: body.full_name, role: body.role, is_active: true
            });
        }
        
        if (path === "/projects/") {
            if (method === "POST") {
                const body = JSON.parse(options.body);
                const newProj = {
                    id: this.mockProjects.length + 1,
                    name: body.name,
                    description: body.description,
                    created_at: new Date().toISOString(),
                    repositories: (body.repositories || []).map((r, i) => ({
                        id: 200 + i,
                        name: r.name,
                        git_url: r.git_url,
                        branch: r.branch || "main"
                    }))
                };
                this.mockProjects.push(newProj);
                return Promise.resolve(newProj);
            }
            return Promise.resolve(this.mockProjects);
        }
        
        if (path.startsWith("/projects/")) {
            const id = parseInt(path.split("/")[2]);
            const proj = this.mockProjects.find(p => p.id === id);
            return Promise.resolve(proj || this.mockProjects[0]);
        }
        
        if (path === "/reviews/") {
            if (method === "POST") {
                const body = JSON.parse(options.body);
                // Trigger a realistic code review on the client
                const reviewText = body.code_content;
                let security = 100;
                let performance = 100;
                let bugs = 100;
                let complexity = 90;
                const results = [];
                
                if (reviewText.includes("execute(") && (reviewText.includes("f'") || reviewText.includes('f"'))) {
                    security -= 35;
                    results.append({
                        id: Date.now() + 1,
                        file_path: body.file_name,
                        line_number: 12,
                        category: "security",
                        severity: "critical",
                        message: "SQL Injection found: query concatenation detected inside DB statement.",
                        original_code: "db.execute(f'...')",
                        suggested_code: "db.execute('SELECT * FROM users WHERE id = :id', {'id': user_id})"
                    });
                }
                
                if (reviewText.includes("eval(")) {
                    security -= 40;
                    results.push({
                        id: Date.now() + 2,
                        file_path: body.file_name,
                        line_number: 5,
                        category: "security",
                        severity: "critical",
                        message: "Use of dangerous function 'eval()' detected. This can lead to arbitrary code execution.",
                        original_code: "eval(user_input)",
                        suggested_code: "# Use safer parsing alternatives"
                    });
                }
                
                if (reviewText.includes("for") && reviewText.includes("db.")) {
                    performance -= 20;
                    results.push({
                        id: Date.now() + 3,
                        file_path: body.file_name,
                        line_number: 18,
                        category: "performance",
                        severity: "high",
                        message: "Performance warning: Database connection / query called inside loop iteration.",
                        original_code: "for item in items:\n    db.query()",
                        suggested_code: "db.query_all_ids([i.id for i in items])"
                    });
                }
                
                const overall = Math.round((security + performance + bugs + complexity) / 4);
                
                const newReview = {
                    id: this.mockReviews.length + 1,
                    project_id: body.project_id || 1,
                    status: "COMPLETED",
                    overall_score: overall,
                    security_score: security,
                    performance_score: performance,
                    bugs_score: bugs,
                    complexity_score: complexity,
                    doc_score: 90,
                    commit_sha: "head-sha",
                    created_at: new Date().toISOString(),
                    results: results
                };
                this.mockReviews.push(newReview);
                return Promise.resolve(newReview);
            }
            return Promise.resolve(this.mockReviews);
        }
        
        if (path.startsWith("/reviews/")) {
            const parts = path.split("/");
            const id = parseInt(parts[2]);
            const rev = this.mockReviews.find(r => r.id === id);
            return Promise.resolve(rev || this.mockReviews[0]);
        }
        
        if (path === "/chat/") {
            const body = JSON.parse(options.body);
            const msg = body.message.toLowerCase();
            let reply = "";
            if (msg.includes("auth.py") || msg.includes("login")) {
                reply = "Inside `auth.py`, you have password verification routes. I found a SQL injection warning on line 24. Be sure to use parameterized SQL rather than f-string variables.";
            } else {
                reply = "I parsed your repository context. CodeMind AI suggests cleaning up nested loops and using environment variables for any API credentials.";
            }
            
            const chatObj = {
                id: Date.now(),
                project_id: body.project_id,
                role: "assistant",
                content: reply,
                created_at: new Date().toISOString()
            };
            
            return Promise.resolve({
                response: reply,
                history_message: chatObj
            });
        }
        
        return Promise.resolve({ status: "offline-mock-mode" });
    }
}

const api = new ApiClient();
window.api = api; // Expose globally
