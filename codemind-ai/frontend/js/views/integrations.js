/* --- INTEGRATIONS MODULE --- */

import { eventBus } from '../utils/eventBus.js';

export const integrationsView = {
    render() {
        const container = document.getElementById("console-view-integrations");
        if (!container) return;

        const apps = [
            { id: "github", name: "GitHub Repository Import", desc: "Sync repos and pull requests webhooks.", status: "Connected", badge: "badge-premium-success" },
            { id: "gitlab", name: "GitLab Pipelines", desc: "Trigger AST scans on merge commits.", status: "Connect", badge: "badge-premium-info" },
            { id: "slack", name: "Slack Alerts Ticker", desc: "Post audit alerts to a #security channel.", status: "Connected", badge: "badge-premium-success" },
            { id: "cursor", name: "Cursor Editor Extension", desc: "Audits code natively inside Cursor editor.", status: "Installed", badge: "badge-premium-success" },
            { id: "vscode", name: "VS Code plugin", desc: "Inline code suggestions and vulnerability markers.", status: "Install", badge: "badge-premium-info" },
            { id: "jira", name: "Jira Vulnerability Tickets", desc: "Creates tickets automatically for CWE critical risks.", status: "Connect", badge: "badge-premium-info" }
        ];

        container.innerHTML = `
            <div class="workspace-scroll-pane text-left max-w-4xl">
                <h2 class="text-2xl font-heading font-bold text-white mb-2">Workspace Integrations</h2>
                <p class="text-sm text-muted mb-8 font-normal">Connect CodeMind AI to your code managers, IDEs, and communications systems.</p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${apps.map(a => `
                        <div class="glass-panel p-6 flex flex-col justify-between hover:border-white/10 transition-colors">
                            <div>
                                <div class="flex items-center justify-between mb-4">
                                    <span class="text-sm font-heading font-bold text-white">${a.name}</span>
                                    <span class="badge-premium ${a.badge}" id="badge-int-${a.id}">${a.status}</span>
                                </div>
                                <p class="text-xs text-muted leading-relaxed mb-6">${a.desc}</p>
                            </div>
                            <button class="btn-premium btn-premium-secondary text-xs h-8 justify-center btn-toggle-int" data-app-id="${a.id}">
                                ${a.status === 'Connected' || a.status === 'Installed' ? 'Disconnect' : 'Connect'}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Bind clicks to connect/disconnect
        container.querySelectorAll(".btn-toggle-int").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-app-id");
                const badge = document.getElementById(`badge-int-${id}`);
                const isConnected = btn.textContent.trim() === 'Disconnect';
                
                if (isConnected) {
                    btn.textContent = 'Connect';
                    badge.textContent = 'Connect';
                    badge.className = 'badge-premium badge-premium-info';
                    eventBus.emit("toastAlert", { title: "Disconnected", desc: `${id} integration disabled.`, type: "warning" });
                } else {
                    btn.textContent = 'Disconnect';
                    badge.textContent = 'Connected';
                    badge.className = 'badge-premium badge-premium-success';
                    eventBus.emit("toastAlert", { title: "Connected", desc: `${id} integration successfully synced!`, type: "success" });
                }
            });
        });
    }
};
export default integrationsView;
