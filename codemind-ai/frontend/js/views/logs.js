/* --- COMPLIANCE AUDIT LOGS VIEW --- */

export const logsView = {
    render() {
        const container = document.getElementById("console-view-logs");
        if (!container) return;

        const auditLogs = [
            { ts: "2026-07-24T23:12:00Z", actor: "aryan@codemind.ai", action: "API Key Created", target: "sk-proj-..." },
            { ts: "2026-07-24T23:09:42Z", actor: "aryan@codemind.ai", action: "Review Patch Applied", target: "auth.py:L2" },
            { ts: "2026-07-24T22:45:10Z", actor: "ravi@codemind.ai", action: "Repository Imported", target: "Mobile Core" },
            { ts: "2026-07-24T18:12:00Z", actor: "System", action: "Cron Automated Scan run", target: "Backend API" }
        ];

        container.innerHTML = `
            <div class="workspace-scroll-pane text-left max-w-4xl">
                <h2 class="text-2xl font-heading font-bold text-white mb-2">Organization Audit Logs</h2>
                <p class="text-sm text-muted mb-8 font-normal">Immutable activity stream logs for compliance tracking (SOC 2, ISO 27001).</p>

                <div class="glass-panel p-6">
                    <div class="flex flex-col gap-3 font-code text-xs">
                        <div class="grid grid-cols-12 gap-4 pb-3 border-b border-white/5 text-muted font-bold">
                            <div class="col-span-3">TIMESTAMP</div>
                            <div class="col-span-3">ACTOR</div>
                            <div class="col-span-3">ACTION</div>
                            <div class="col-span-3">TARGET</div>
                        </div>
                        ${auditLogs.map(l => `
                            <div class="grid grid-cols-12 gap-4 py-3.5 border-b border-white/5 items-center">
                                <div class="col-span-3 text-muted">${l.ts}</div>
                                <div class="col-span-3 text-white font-bold">${l.actor}</div>
                                <div class="col-span-3">${l.action}</div>
                                <div class="col-span-3 text-muted">${l.target}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
};
export default logsView;
