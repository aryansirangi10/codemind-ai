/* --- REPOSITORY SETTINGS PANEL --- */

import { eventBus } from '../../utils/eventBus.js';

export const repositorySettings = {
    render() {
        const container = document.getElementById("repo-sub-view-settings");
        if (!container) return;

        container.innerHTML = `
            <div class="p-8 text-left max-w-2xl">
                <h2 class="text-2xl font-heading font-bold text-white mb-6">Repository Settings</h2>

                <!-- Scanning Policy configuration -->
                <div class="glass-panel p-6 mb-8 flex flex-col gap-4">
                    <h3 class="text-base font-heading font-bold text-white mb-2">Audit Policy Profiles</h3>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs text-muted font-semibold">Active Scanning Rules Profile</label>
                        <select class="w-full h-10 px-3 bg-[#0c0c0c] border border-white/5 rounded-md text-sm text-white focus:outline-none">
                            <option>OWASP Top 10 + Clean Code Standards (Strict)</option>
                            <option>Compliance standard audits (SOC 2, ISO 27001)</option>
                            <option>Performance Optimization checks only</option>
                        </select>
                    </div>
                </div>

                <!-- Webhooks config -->
                <div class="glass-panel p-6 mb-8 flex flex-col gap-4">
                    <h3 class="text-base font-heading font-bold text-white mb-2">CI/CD Webhook Config</h3>
                    <p class="text-xs text-muted">Automatically audit code commits when changes are pushed.</p>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs text-muted font-semibold">Payload URL endpoint</label>
                        <input type="text" value="http://localhost:8000/api/v1/webhooks/commits" readonly
                            class="w-full h-10 px-3 bg-[#0c0c0c]/80 border border-white/5 rounded-md text-xs text-muted focus:outline-none">
                    </div>
                    <button class="btn-premium btn-premium-primary text-xs h-9 justify-center" id="btn-save-settings">
                        Save Webhook Settings
                    </button>
                </div>
            </div>
        `;

        document.getElementById("btn-save-settings").addEventListener("click", () => {
            eventBus.emit("toastAlert", { title: "Settings Saved", desc: "Repository policies successfully updated.", type: "success" });
        });
    }
};
export default repositorySettings;
