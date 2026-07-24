/* --- REPOSITORY SCOPED AI CHAT --- */

import { repoState } from '../state/repoState.js';
import { logger } from '../utils/logger.js';

export const repositoryChat = {
    render() {
        const container = document.getElementById("repo-sub-view-chat");
        if (!container) return;

        const repoName = repoState.activeProject ? repoState.activeProject.name : "Repository";

        container.innerHTML = `
            <div class="p-8 text-left flex flex-col justify-between h-full max-w-4xl mx-auto">
                <div>
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h2 class="text-2xl font-heading font-bold text-white mb-1">AI Chat Console</h2>
                            <p class="text-sm text-muted font-normal">Ask questions scoped to the <span class="text-white font-bold">${repoName}</span> codebase.</p>
                        </div>
                        <span class="badge-premium badge-premium-accent">GPT-4o Auditor</span>
                    </div>

                    <!-- Prompt suggestions chips -->
                    <div class="flex gap-2.5 mb-6 text-[10px] font-code flex-wrap">
                        <button class="py-2 px-3 bg-panel border border-white/5 rounded-md hover:border-white/10 transition-colors cursor-pointer select-none pg-chip-prompt">
                            🔍 Explain active file
                        </button>
                        <button class="py-2 px-3 bg-panel border border-white/5 rounded-md hover:border-white/10 transition-colors cursor-pointer select-none pg-chip-prompt">
                            🔍 Generate unit tests
                        </button>
                        <button class="py-2 px-3 bg-panel border border-white/5 rounded-md hover:border-white/10 transition-colors cursor-pointer select-none pg-chip-prompt">
                            🔍 Audit for SQL injections
                        </button>
                        <button class="py-2 px-3 bg-panel border border-white/5 rounded-md hover:border-white/10 transition-colors cursor-pointer select-none pg-chip-prompt">
                            🔍 Optimize performance loops
                        </button>
                    </div>

                    <!-- Messages list -->
                    <div class="flex flex-col gap-4 max-h-[360px] overflow-y-auto p-4 bg-black/40 rounded-lg font-code text-xs mb-6 text-muted" id="chat-console-messages-list">
                        <div class="bg-white/5 p-3 rounded text-white max-w-lg self-start text-left">
                            Codebase index loaded successfully! Ask me anything about the codebase structures, dependency mappings, or specific functions.
                        </div>
                    </div>
                </div>

                <!-- Input area -->
                <div class="flex gap-3 bg-panel p-3 border border-white/5 rounded-lg">
                    <input type="text" id="chat-console-input-field" placeholder="Ask about the project code..."
                        class="flex-1 h-10 px-3 bg-[#0c0c0c] border border-white/5 rounded-md text-sm text-white focus:outline-none placeholder:text-muted">
                    <button class="btn-premium btn-premium-primary h-10 px-4 rounded-md" id="btn-chat-console-submit">
                        Ask Repo
                    </button>
                </div>
            </div>
        `;

        this.bindEvents();
    },

    bindEvents() {
        const input = document.getElementById("chat-console-input-field");
        const sendBtn = document.getElementById("btn-chat-console-submit");
        const list = document.getElementById("chat-console-messages-list");

        const submit = async () => {
            const query = input.value.trim();
            if (!query) return;

            // User bubble
            const userMsg = document.createElement("div");
            userMsg.className = "bg-panel border border-white/5 p-3 rounded text-white max-w-lg self-end text-right ml-auto";
            userMsg.textContent = query;
            list.appendChild(userMsg);
            
            input.value = "";
            list.scrollTop = list.scrollHeight;

            await new Promise(r => setTimeout(r, 900));

            // Agent bubble
            const agentMsg = document.createElement("div");
            agentMsg.className = "bg-white/5 p-3 rounded text-white max-w-lg self-start text-left";
            
            if (query.toLowerCase().includes("sql") || query.toLowerCase().includes("injection")) {
                agentMsg.innerHTML = `I scanned the workspace and resolved <strong>1 critical SQL Injection finding</strong> inside <code>auth.py:L2</code>: \n\n\`\`\`python\nquery = f"SELECT * FROM users WHERE token = '{token}'"\n\`\`\`\n\nYou can fix this by applying parameters bindings.`;
            } else if (query.toLowerCase().includes("test") || query.toLowerCase().includes("unit")) {
                agentMsg.innerHTML = `Here is a mock unit test code block for the auth verify function:\n\n\`\`\`python\ndef test_verify_token():\n    assert verify_token("valid_token") is True\n\`\`\``;
            } else {
                agentMsg.innerHTML = `Indexed <strong>4 files</strong> inside the repository. The architecture defines a FastAPI web framework routing to local AST scanners. Let me know if you would like me to explain any helper modules!`;
            }

            list.appendChild(agentMsg);
            list.scrollTop = list.scrollHeight;
        };

        sendBtn.addEventListener("click", submit);
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") submit();
        });

        // Prompt chips trigger clicks
        document.querySelectorAll(".pg-chip-prompt").forEach(chip => {
            chip.addEventListener("click", () => {
                const text = chip.textContent.trim().replace("🔍 ", "");
                input.value = text;
                submit();
            });
        });
    }
};
export default repositoryChat;
