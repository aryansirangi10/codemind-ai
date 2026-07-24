/* --- STRIPE-STYLE API PLAYGROUND --- */

import { eventBus } from '../utils/eventBus.js';
import { logger } from '../utils/logger.js';

export const playgroundView = {
    render() {
        const container = document.getElementById("console-view-playground");
        if (!container) return;

        container.innerHTML = `
            <div class="workspace-scroll-pane text-left max-w-5xl">
                <h2 class="text-2xl font-heading font-bold text-white mb-2">API Playground</h2>
                <p class="text-sm text-muted mb-8 font-normal">Interactive endpoint sandbox runner and client code generator.</p>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Left: Configuration & Request settings -->
                    <div class="glass-panel p-6 flex flex-col gap-4">
                        <div class="flex items-center gap-3">
                            <span class="badge-premium badge-premium-success">POST</span>
                            <span class="text-sm font-code text-white">/api/v1/reviews/</span>
                        </div>
                        <p class="text-xs text-muted">Triggers a multi-agent review on raw string source code.</p>

                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs text-muted font-semibold">Authorization Token</label>
                            <input type="text" value="Bearer mock_jwt_token_auth" readonly
                                class="w-full h-10 px-3 bg-[#0c0c0c] border border-white/5 rounded-md text-xs text-muted focus:outline-none">
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs text-muted font-semibold">Request Body (JSON)</label>
                            <textarea id="playground-request-body" rows="6" 
                                class="w-full p-3 bg-[#0c0c0c] border border-white/5 rounded-md text-xs font-code text-[#FF6B6B] focus:outline-none focus:border-[#FF3B30]/40 transition-colors">{
  "project_id": 1,
  "code": "def query_db(token):\n    return db.execute('SELECT * FROM users WHERE token = ' + token)"
}</textarea>
                        </div>

                        <button class="btn-premium btn-premium-primary text-xs h-10 justify-center" id="btn-playground-run">
                            Run Request
                        </button>
                    </div>

                    <!-- Right: Response code generation console -->
                    <div class="flex flex-col gap-4">
                        <!-- Code snippets selection -->
                        <div class="glass-panel p-4 bg-black/40">
                            <div class="flex gap-4 border-b border-white/5 pb-2 mb-4 text-xs font-code text-muted">
                                <button class="hover:text-white font-bold select-none cursor-pointer tab-pg-code active" data-lang="curl">cURL</button>
                                <button class="hover:text-white font-bold select-none cursor-pointer tab-pg-code" data-lang="python">Python</button>
                                <button class="hover:text-white font-bold select-none cursor-pointer tab-pg-code" data-lang="js">JavaScript</button>
                            </div>
                            <pre class="text-xs font-code text-muted overflow-x-auto text-left h-24 p-2 bg-[#050505]" id="pg-code-preview"><code>curl -X POST "http://localhost:8000/api/v1/reviews/" \\
  -H "Authorization: Bearer mock_jwt_token_auth" \\
  -H "Content-Type: application/json" \\
  -d '{"project_id": 1, "code": "def query_db(token): ..."}'</code></pre>
                        </div>

                        <!-- Response window -->
                        <div class="glass-panel p-6 flex-1 flex flex-col justify-between">
                            <div class="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                                <span class="text-xs text-muted font-semibold">Response Payload</span>
                                <span id="pg-response-status" class="text-xs text-muted">200 OK</span>
                            </div>
                            <pre class="flex-1 text-xs font-code text-success overflow-x-auto bg-[#050505] p-4 rounded min-h-36 text-left" id="pg-response-body"><code>{
  "status": "waiting",
  "message": "Click Run Request to test live payload execution."
}</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    },

    bindEvents() {
        const runBtn = document.getElementById("btn-playground-run");
        const bodyText = document.getElementById("playground-request-body");
        const statusSpan = document.getElementById("pg-response-status");
        const responsePre = document.getElementById("pg-response-body");

        runBtn.addEventListener("click", async () => {
            logger.info("API Playground: Executing sandbox run...");
            runBtn.disabled = true;
            runBtn.textContent = "Running request...";
            statusSpan.textContent = "Processing...";
            responsePre.textContent = "{\n  \"status\": \"scanning_ast\"\n}";

            await new Promise(r => setTimeout(r, 1200));

            try {
                // Parse request body input
                const payload = JSON.parse(bodyText.value);
                
                statusSpan.textContent = "200 OK";
                statusSpan.className = "text-xs text-success font-bold";
                responsePre.textContent = JSON.stringify({
                    id: Math.floor(Math.random() * 800) + 100,
                    score: 72,
                    created_at: new Date().toISOString(),
                    vulnerabilities_found: 1,
                    findings: [
                        {
                            severity: "critical",
                            title: "Raw SQL Injection vulnerability",
                            cwe: "CWE-89",
                            line: 2,
                            original: "return db.execute('SELECT * FROM users WHERE token = ' + token)",
                            suggested: "return db.execute('SELECT * FROM users WHERE token = %s', (token,))"
                        }
                    ]
                }, null, 2);
                
                eventBus.emit("toastAlert", { title: "API Run Success", desc: "Response payload returned 200 OK", type: "success" });
            } catch (err) {
                statusSpan.textContent = "400 Bad Request";
                statusSpan.className = "text-xs text-danger font-bold";
                responsePre.textContent = JSON.stringify({ error: "Invalid JSON format body" }, null, 2);
                responsePre.className = "text-xs font-code text-danger bg-[#050505] p-4 rounded text-left";
            }
            
            runBtn.disabled = false;
            runBtn.textContent = "Run Request";
        });

        // Code tab highlights switcher
        document.querySelectorAll(".tab-pg-code").forEach(tab => {
            tab.addEventListener("click", () => {
                document.querySelectorAll(".tab-pg-code").forEach(t => t.classList.remove("active", "text-white"));
                tab.classList.add("active", "text-white");
                
                const lang = tab.getAttribute("data-lang");
                const preview = document.getElementById("pg-code-preview");
                
                if (lang === "python") {
                    preview.innerHTML = `<code>import requests\n\nurl = "http://localhost:8000/api/v1/reviews/"\nheaders = {"Authorization": "Bearer mock_jwt_token_auth"}\npayload = {"project_id": 1, "code": "..."}\n\nresponse = requests.post(url, json=payload, headers=headers)</code>`;
                } else if (lang === "js") {
                    preview.innerHTML = `<code>fetch("http://localhost:8000/api/v1/reviews/", {\n  method: "POST",\n  headers: {\n    "Authorization": "Bearer mock_jwt_token_auth",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify({ project_id: 1, code: "..." })\n});</code>`;
                } else {
                    preview.innerHTML = `<code>curl -X POST "http://localhost:8000/api/v1/reviews/" \\\\ \n  -H "Authorization: Bearer mock_jwt_token_auth" \\\\ \n  -d '{"project_id": 1, "code": "..."}'</code>`;
                }
            });
        });
    }
};
export default playgroundView;
