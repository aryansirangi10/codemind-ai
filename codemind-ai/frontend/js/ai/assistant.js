/* --- CONTEXT-AWARE FLOATING ASSISTANT --- */

import { uiState } from '../state/uiState.js';
import { eventBus } from '../utils/eventBus.js';

export const assistantComponent = {
    render() {
        let bubble = document.getElementById("floating-assistant-bubble");
        if (!bubble) {
            bubble = document.createElement("div");
            bubble.id = "floating-assistant-bubble";
            bubble.style.position = "fixed";
            bubble.style.bottom = "24px";
            bubble.style.right = "24px";
            bubble.style.zIndex = "400";
            document.body.appendChild(bubble);
        }

        bubble.innerHTML = `
            <!-- Chat Trigger Button -->
            <button class="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF3B30] to-[#6C5CE7] flex items-center justify-center font-bold text-white shadow-2xl cursor-pointer select-none" id="btn-assistant-trigger">
                🤖
            </button>

            <!-- Expanded chat box -->
            <div class="glass-panel w-72 h-96 absolute bottom-14 right-0 hidden flex-col justify-between p-4 shadow-2xl border border-white/10 text-left bg-panel/95" id="assistant-chat-panel">
                <div class="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-heading font-bold text-white">Ask CodeMind Assistant</span>
                        <span class="badge-premium badge-premium-accent">RAG</span>
                    </div>
                    <button class="text-muted hover:text-white text-[10px]" id="btn-assistant-close">✕</button>
                </div>

                <!-- Messages box -->
                <div class="flex-1 overflow-y-auto py-3 font-code text-[11px] text-muted flex flex-col gap-3" id="assistant-chat-logs">
                    <div class="bg-white/5 p-2.5 rounded text-white text-left">
                        Hello! I am your context-aware code audit assistant. How can I help you on this page?
                    </div>
                </div>

                <!-- Suggestion chips -->
                <div class="flex flex-col gap-1.5 mb-2.5" id="assistant-chips-container">
                    <!-- Loaded contextually -->
                </div>

                <!-- Input area -->
                <div class="flex gap-2">
                    <input type="text" id="assistant-chat-input" placeholder="Ask about this view..." 
                        class="flex-1 h-8 px-2 bg-black/40 border border-white/5 rounded text-xs text-white focus:outline-none">
                    <button class="btn-premium btn-premium-primary text-[10px] h-8 px-3" id="btn-assistant-send">Send</button>
                </div>
            </div>
        `;

        this.bindEvents();
    },

    bindEvents() {
        const trigger = document.getElementById("btn-assistant-trigger");
        const panel = document.getElementById("assistant-chat-panel");
        const close = document.getElementById("btn-assistant-close");
        const send = document.getElementById("btn-assistant-send");
        const input = document.getElementById("assistant-chat-input");

        trigger.addEventListener("click", () => {
            const open = panel.classList.toggle("hidden");
            if (!open) {
                this.loadSuggestions();
                trigger.classList.add("hidden");
            }
        });

        close.addEventListener("click", () => {
            panel.classList.add("hidden");
            trigger.classList.remove("hidden");
        });

        send.addEventListener("click", () => this.sendMessage());
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") this.sendMessage();
        });

        // Trigger updates on view changes
        eventBus.on("consoleViewChanged", () => this.loadSuggestions());
        eventBus.on("repoSubViewChanged", () => this.loadSuggestions());
    },

    loadSuggestions() {
        const container = document.getElementById("assistant-chips-container");
        if (!container) return;

        let suggestions = ["Summarize this page"];
        const view = uiState.currentConsoleView;
        const sub = uiState.currentRepoSubView;

        if (view === "dashboard") {
            suggestions = [
                "Explain organization health",
                "What is our critical issue?"
            ];
        } else if (view === "repository") {
            if (sub === "overview") suggestions = ["Summarize project technical debt", "What are the core alerts?"];
            if (sub === "reviews") suggestions = ["Explain raw SQL Injection", "How to apply code patch?"];
            if (sub === "security") suggestions = ["Explain CWE-89 vulnerability", "What are exploitability rankings?"];
        } else if (view === "settings") {
            suggestions = ["How to register webhook listeners", "Manage secret API keys"];
        }

        container.innerHTML = suggestions.map(s => `
            <button class="text-left py-1.5 px-2 bg-white/5 rounded text-[10px] text-muted hover:text-white transition-colors cursor-pointer select-none assistant-chip-btn">
                🔍 ${s}
            </button>
        `).join('');

        container.querySelectorAll(".assistant-chip-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const text = btn.textContent.trim().replace("🔍 ", "");
                document.getElementById("assistant-chat-input").value = text;
                this.sendMessage();
            });
        });
    },

    async sendMessage() {
        const input = document.getElementById("assistant-chat-input");
        const query = input.value.trim();
        if (!query) return;

        const logs = document.getElementById("assistant-chat-logs");
        
        // User bubble
        const userMsg = document.createElement("div");
        userMsg.className = "bg-panel border border-white/5 p-2.5 rounded text-white self-end text-right";
        userMsg.textContent = query;
        logs.appendChild(userMsg);
        
        input.value = "";
        logs.scrollTop = logs.scrollHeight;

        await new Promise(r => setTimeout(r, 800));

        // Assistant reply
        const reply = document.createElement("div");
        reply.className = "bg-white/5 p-2.5 rounded text-[#6C5CE7] self-start text-left";
        
        if (query.includes("SQL")) {
            reply.innerHTML = `<strong>SQL Injection alert details:</strong><br>In auth.py:L2, parameter input is concatenated directly inside the execute command. Replacing f-strings with tuple inputs resolves this vulnerability.`;
        } else if (query.includes("debt")) {
            reply.innerHTML = `This project currently has <strong>4.2 days</strong> of technical debt accumulated across raw exceptions and SQL warnings.`;
        } else {
            reply.innerHTML = `I evaluated this view and verified all settings. Let me know if you would like me to audit a specific repository code snippet!`;
        }

        logs.appendChild(reply);
        logs.scrollTop = logs.scrollHeight;
    }
};
export default assistantComponent;
