/* --- BREADCRUMB & UTILITY HEADER BAR --- */

import { uiState } from '../../state/uiState.js';
import { repoState } from '../../state/repoState.js';
import { MOCK_NOTIFICATIONS } from '../../constants.js';
import { eventBus } from '../../utils/eventBus.js';

export const breadcrumbComponent = {
    render() {
        const bar = document.getElementById("breadcrumb-utility-bar");
        if (!bar) return;

        bar.innerHTML = `
            <!-- Left Scope Breadcrumbs -->
            <div class="flex items-center gap-2 font-code text-xs text-muted">
                <span id="breadcrumb-org" class="text-white font-semibold">${repoState.activeOrg.name}</span>
                <span id="breadcrumb-repo" class="hidden items-center gap-2">
                    <span>&gt;</span>
                    <span class="text-white font-semibold">Project</span>
                </span>
                <span id="breadcrumb-subview" class="flex items-center gap-2">
                    <span>&gt;</span>
                    <span class="text-[#FF3B30] font-bold">Dashboard</span>
                </span>
            </div>

            <!-- Right search & Notifications controls -->
            <div class="flex items-center gap-4">
                <!-- Search bar trigger (Ctrl+K palette) -->
                <button class="flex items-center gap-6 px-3 bg-panel border border-white/5 h-8 rounded-md text-xs text-muted hover:border-white/10 transition-colors" id="btn-header-search-trigger">
                    <span>Search or command...</span>
                    <span class="font-code opacity-50">⌘K</span>
                </button>

                <!-- Notifications bell icon -->
                <div class="relative">
                    <button class="w-8 h-8 rounded-md bg-panel border border-white/5 flex items-center justify-center text-muted hover:text-white transition-colors relative" id="btn-bell-trigger">
                        <span>🔔</span>
                        <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger animate-ping"></span>
                    </button>
                    <div class="absolute right-0 top-9 w-64 bg-panel border border-white/5 rounded-md hidden flex-col z-50 p-3 shadow-2xl" id="notifications-menu">
                        <div class="font-heading font-bold text-white text-xs mb-3 pb-1 border-b border-white/5">System Alerts</div>
                        <div class="flex flex-col gap-3 font-code text-[10px] text-left">
                            ${MOCK_NOTIFICATIONS.map(n => `
                                <div class="flex flex-col gap-0.5 pb-2 border-b border-white/5 last:border-0 last:pb-0">
                                    <div class="font-bold text-white">${n.title}</div>
                                    <div class="text-muted">${n.desc}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    },

    bindEvents() {
        // Cmd+K palette open
        document.getElementById("btn-header-search-trigger").addEventListener("click", () => {
            uiState.toggleCommandPalette(true);
        });

        // Notifications bell
        const bellBtn = document.getElementById("btn-bell-trigger");
        const menu = document.getElementById("notifications-menu");
        
        bellBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            menu.classList.toggle("hidden");
        });

        document.addEventListener("click", () => {
            menu.classList.add("hidden");
        });
    }
};
export default breadcrumbComponent;
