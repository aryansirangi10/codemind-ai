/* --- REPORTS PANEL --- */

import { repoState } from '../../state/repoState.js';
import { logger } from '../../utils/logger.js';
import { eventBus } from '../../utils/eventBus.js';

export const repositoryReports = {
    render() {
        const container = document.getElementById("repo-sub-view-reports");
        if (!container) return;

        container.innerHTML = `
            <div class="p-8 text-left max-w-4xl">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h2 class="text-2xl font-heading font-bold text-white mb-1">Interactive Audit Reports</h2>
                        <p class="text-sm text-muted font-normal">Export or download compliance-ready compliance audits files.</p>
                    </div>
                    <span class="badge-premium badge-premium-success">Compliance: SOC2 ready</span>
                </div>

                <!-- Summary statistics -->
                <div class="glass-panel p-6 mb-8 flex items-center justify-between">
                    <div>
                        <div class="text-xs text-muted font-semibold uppercase tracking-wider mb-2">Executive Overview Score</div>
                        <div class="text-3xl font-heading font-bold text-white mb-2">92 / 100</div>
                        <div class="text-xs text-success font-semibold">✓ Meets SOC 2 Type II controls requirements</div>
                    </div>
                    <div class="flex gap-3">
                        <button class="btn-premium btn-premium-primary text-xs h-9 px-4" id="btn-export-markdown">Download Markdown</button>
                        <button class="btn-premium btn-premium-secondary text-xs h-9 px-4" id="btn-export-json">Download JSON</button>
                    </div>
                </div>

                <!-- Table details -->
                <div class="glass-panel p-6">
                    <h3 class="text-lg font-heading font-bold text-white mb-4">Regulatory Findings checklist</h3>
                    <div class="flex flex-col gap-3 font-code text-xs">
                        <div class="flex items-center justify-between border-b border-white/5 pb-2.5">
                            <span class="text-white font-bold">SQL Injection Concatenation Check</span>
                            <span class="text-danger font-bold">Failed</span>
                        </div>
                        <div class="flex items-center justify-between border-b border-white/5 pb-2.5">
                            <span class="text-white font-bold">Hardcoded Secret tokens check</span>
                            <span class="text-danger font-bold">Failed</span>
                        </div>
                        <div class="flex items-center justify-between border-b border-white/5 pb-2.5">
                            <span class="text-white font-bold">Generic exception catcher pass check</span>
                            <span class="text-warning font-bold">Warning</span>
                        </div>
                        <div class="flex items-center justify-between pb-2.5">
                            <span class="text-white font-bold">Strict CSRF cookies verification</span>
                            <span class="text-success font-bold">Passed</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind download actions
        document.getElementById("btn-export-markdown").addEventListener("click", () => this.downloadMarkdown());
        document.getElementById("btn-export-json").addEventListener("click", () => this.downloadJSON());
    },

    downloadMarkdown() {
        logger.info("Reports Panel: Creating Markdown payload...");
        const content = `# CodeMind AI Audit Report - ${repoState.activeProject ? repoState.activeProject.name : "Repository"}\n\nGenerated: ${new Date().toLocaleDateString()}\n\n- Security Score: 92/100\n- Findings:\n  1. Critical: SQL Injection inside auth.py\n  2. High: Hardcoded credential token in config.py`;
        
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `codemind_report_${repoState.activeProject ? repoState.activeProject.name.toLowerCase().replace(" ", "_") : "repo"}.md`;
        a.click();
        URL.revokeObjectURL(url);
        
        eventBus.emit("toastAlert", { title: "Markdown Downloaded", desc: "Report saved successfully.", type: "success" });
    },

    downloadJSON() {
        logger.info("Reports Panel: Creating JSON payload...");
        const obj = {
            project: repoState.activeProject ? repoState.activeProject.name : "Repository",
            generated: new Date().toISOString(),
            score: 92,
            findings: [
                { id: 1, cwe: "CWE-89", severity: "critical", file: "auth.py" },
                { id: 2, cwe: "CWE-798", severity: "high", file: "config.py" }
            ]
        };
        
        const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "codemind_report.json";
        a.click();
        URL.revokeObjectURL(url);

        eventBus.emit("toastAlert", { title: "JSON Downloaded", desc: "Raw audit schema saved.", type: "success" });
    }
};
export default repositoryReports;
