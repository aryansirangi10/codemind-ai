/* --- REPOSITORY MASTER VIEW SYSTEM --- */

import { uiState } from '../state/uiState.js';
import { repoState } from '../state/repoState.js';
import { eventBus } from '../utils/eventBus.js';

export const repositoryView = {
    render() {
        const container = document.getElementById("console-view-repository");
        if (!container) return;

        const repoName = repoState.activeProject ? repoState.activeProject.name : "Select Repository";

        container.innerHTML = `
            <!-- Repository Workspace Tabs Subheader -->
            <div class="border-b border-white/5 bg-[#090909] px-8 flex justify-between items-center h-12 flex-shrink-0">
                <div class="flex items-center gap-6">
                    <span class="text-xs font-bold text-white font-heading uppercase mr-4">${repoName}</span>
                    <button class="repo-sub-tab list-item-interactive text-xs font-semibold py-1.5 px-3 rounded-md border border-transparent w-auto" data-sub-view="overview">
                        Overview
                    </button>
                    <button class="repo-sub-tab list-item-interactive text-xs font-semibold py-1.5 px-3 rounded-md border border-transparent w-auto" data-sub-view="code">
                        Code Explorer
                    </button>
                    <button class="repo-sub-tab list-item-interactive text-xs font-semibold py-1.5 px-3 rounded-md border border-transparent w-auto" data-sub-view="reviews">
                        AI Reviews
                    </button>
                    <button class="repo-sub-tab list-item-interactive text-xs font-semibold py-1.5 px-3 rounded-md border border-transparent w-auto" data-sub-view="security">
                        Security
                    </button>
                    <button class="repo-sub-tab list-item-interactive text-xs font-semibold py-1.5 px-3 rounded-md border border-transparent w-auto" data-sub-view="chat">
                        AI Chat
                    </button>
                    <button class="repo-sub-tab list-item-interactive text-xs font-semibold py-1.5 px-3 rounded-md border border-transparent w-auto" data-sub-view="analytics">
                        Analytics
                    </button>
                    <button class="repo-sub-tab list-item-interactive text-xs font-semibold py-1.5 px-3 rounded-md border border-transparent w-auto" data-sub-view="reports">
                        Reports
                    </button>
                    <button class="repo-sub-tab list-item-interactive text-xs font-semibold py-1.5 px-3 rounded-md border border-transparent w-auto" data-sub-view="settings">
                        Settings
                    </button>
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-success"></span>
                    <span class="text-[10px] font-code text-muted">Synced with Local Engine</span>
                </div>
            </div>

            <!-- Repository Inner Panel Views -->
            <div class="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                <!-- Overview Panel -->
                <div id="repo-sub-view-overview" class="repo-sub-view hidden h-full overflow-y-auto"></div>

                <!-- Code Explorer Panel -->
                <div id="repo-sub-view-code" class="repo-sub-view hidden h-full flex min-h-0"></div>

                <!-- AI Reviews (Monaco Diff split) Panel -->
                <div id="repo-sub-view-reviews" class="repo-sub-view hidden h-full flex min-h-0"></div>

                <!-- Security Center Panel -->
                <div id="repo-sub-view-security" class="repo-sub-view hidden h-full overflow-y-auto"></div>

                <!-- AI Chat Panel -->
                <div id="repo-sub-view-chat" class="repo-sub-view hidden h-full overflow-y-auto"></div>

                <!-- Analytics Panel -->
                <div id="repo-sub-view-analytics" class="repo-sub-view hidden h-full overflow-y-auto"></div>

                <!-- Reports Panel -->
                <div id="repo-sub-view-reports" class="repo-sub-view hidden h-full overflow-y-auto"></div>

                <!-- Settings Panel -->
                <div id="repo-sub-view-settings" class="repo-sub-view hidden h-full overflow-y-auto"></div>
            </div>
        `;

        // Bind clicks on subtabs
        document.querySelectorAll(".repo-sub-tab").forEach(tab => {
            tab.addEventListener("click", () => {
                const subView = tab.getAttribute("data-sub-view");
                uiState.setRepoSubView(subView);
            });
        });
    }
};
export default repositoryView;
