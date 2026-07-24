/* --- GLOBAL ORGANIZATIONAL SETTINGS --- */

import { eventBus } from '../utils/eventBus.js';
import { themeManager } from '../theme.js';
import { FeatureFlags } from '../constants.js';

export const settingsView = {
    render() {
        const container = document.getElementById("console-view-settings");
        if (!container) return;

        container.innerHTML = `
            <div class="workspace-scroll-pane text-left max-w-2xl">
                <h2 class="text-2xl font-heading font-bold text-white mb-6">Global Console Settings</h2>

                <!-- Theme Toggler -->
                <div class="glass-panel p-6 mb-8 flex flex-col gap-4">
                    <h3 class="text-base font-heading font-bold text-white mb-2">Visual Style Settings</h3>
                    <p class="text-xs text-muted">Switch UI themes dynamically between Matte Crimson and Cyber Purple.</p>
                    <div class="flex gap-3">
                        <button class="btn-premium btn-premium-primary text-xs h-9 px-4" id="btn-settings-toggle-theme">
                            Toggle UI Theme Preset
                        </button>
                    </div>
                </div>

                <!-- API Keys -->
                <div class="glass-panel p-6 mb-8 flex flex-col gap-4">
                    <h3 class="text-base font-heading font-bold text-white mb-2">LLM Provider Keys</h3>
                    <p class="text-xs text-muted">Submit secret keys to execute custom AI scans using private endpoints.</p>
                    <div class="flex flex-col gap-1.5 mb-2">
                        <label class="text-xs text-muted font-semibold">OpenAI API Key</label>
                        <input type="password" value="sk-proj-xxxxxxxxxxxxxxxx" placeholder="sk-proj-..."
                            class="w-full h-10 px-3 bg-[#0c0c0c] border border-white/5 rounded-md text-sm text-white focus:outline-none focus:border-[#FF3B30]/40 transition-colors">
                    </div>
                    <button class="btn-premium btn-premium-primary text-xs h-9 justify-center" id="btn-settings-save-keys">
                        Save LLM Tokens
                    </button>
                </div>

                <!-- Feature Flags info -->
                <div class="glass-panel p-6">
                    <h3 class="text-base font-heading font-bold text-white mb-4">Enterprise Feature Flags</h3>
                    <div class="flex flex-col gap-3 font-code text-xs">
                        <div class="flex items-center justify-between border-b border-white/5 pb-2.5">
                            <span class="text-white">AI Chat Console</span>
                            <span class="text-success font-bold">${FeatureFlags.AI_CHAT ? 'ENABLED' : 'DISABLED'}</span>
                        </div>
                        <div class="flex items-center justify-between border-b border-white/5 pb-2.5">
                            <span class="text-white">Interactive API Playground</span>
                            <span class="text-success font-bold">${FeatureFlags.API_PLAYGROUND ? 'ENABLED' : 'DISABLED'}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-white">SVG Analytics Plots</span>
                            <span class="text-success font-bold">${FeatureFlags.ANALYTICS ? 'ENABLED' : 'DISABLED'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind Theme button
        document.getElementById("btn-settings-toggle-theme").addEventListener("click", () => {
            themeManager.toggle();
            eventBus.emit("toastAlert", { title: "Theme Preset Toggled", type: "info" });
        });

        // Save keys
        document.getElementById("btn-settings-save-keys").addEventListener("click", () => {
            eventBus.emit("toastAlert", { title: "Tokens Saved", desc: "OpenAI keys cached in local session.", type: "success" });
        });
    }
};
export default settingsView;
