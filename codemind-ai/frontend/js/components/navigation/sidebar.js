/* --- LEFT NAVIGATION SIDEBAR COMPONENT --- */

import { uiState } from '../../state/uiState.js';
import { repoState } from '../../state/repoState.js';
import { userState } from '../../state/userState.js';
import { eventBus } from '../../utils/eventBus.js';

export const sidebarComponent = {
    render() {
        const sidebar = document.getElementById("console-sidebar");
        if (!sidebar) return;

        const email = userState.getEmail();
        const initial = userState.getInitial();

        sidebar.innerHTML = `
            <!-- Top brand & Org Selector -->
            <div>
                <div class="flex items-center gap-3 mb-8 px-2">
                    <div class="w-7 h-7 rounded bg-gradient-to-tr from-[#FF3B30] to-[#FF6B6B] flex items-center justify-center font-bold font-heading text-white text-sm">C</div>
                    <span class="text-lg font-heading font-bold select-none text-white">CodeMind <span class="text-gradient-primary">AI</span></span>
                </div>

                <!-- Org Switcher Dropdown -->
                <div class="relative mb-6">
                    <button class="list-item-interactive flex items-center justify-between border border-white/5 bg-black/40 h-10 w-full rounded-md px-3 text-xs" id="btn-org-switcher">
                        <span id="active-org-label" class="font-bold text-white">${repoState.activeOrg.name}</span>
                        <span class="text-[10px] text-muted">▼</span>
                    </button>
                    <div class="absolute left-0 right-0 top-11 bg-panel border border-white/5 rounded-md hidden flex-col z-50 p-1.5 shadow-2xl" id="org-switcher-menu">
                        ${repoState.organizations.map(o => `
                            <button class="list-item-interactive text-xs py-2 px-3 rounded select-none cursor-pointer w-full text-left org-menu-option" data-org-id="${o.id}">
                                <div>
                                    <div class="font-bold text-white">${o.name}</div>
                                    <div class="text-[9px] text-muted">${o.description}</div>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Menu Tabs list -->
                <div class="flex flex-col gap-1.5 font-code text-xs">
                    <button class="sidebar-nav-item list-item-interactive" data-view="dashboard">
                        <span>📊 Dashboard</span>
                    </button>
                    <button class="sidebar-nav-item list-item-interactive" data-view="repository">
                        <span>📁 Active Repository</span>
                    </button>
                    <button class="sidebar-nav-item list-item-interactive" data-view="team">
                        <span>👥 Team Space</span>
                    </button>
                    <button class="sidebar-nav-item list-item-interactive" data-view="integrations">
                        <span>🔌 Integrations</span>
                    </button>
                    <button class="sidebar-nav-item list-item-interactive" data-view="playground">
                        <span>⌨ API Playground</span>
                    </button>
                    <button class="sidebar-nav-item list-item-interactive" data-view="billing">
                        <span>💳 Billing</span>
                    </button>
                    <button class="sidebar-nav-item list-item-interactive" data-view="logs">
                        <span>📄 Audit Logs</span>
                    </button>
                    <button class="sidebar-nav-item list-item-interactive" data-view="settings">
                        <span>⚙ Settings</span>
                    </button>
                </div>
            </div>

            <!-- Bottom User Profile Card -->
            <div class="flex flex-col gap-4">
                <div class="p-3 bg-gradient-to-tr from-[#FF3B30]/10 to-[#6C5CE7]/10 border border-white/5 rounded-lg text-left">
                    <div class="text-[10px] text-white font-bold mb-1 uppercase tracking-wider">Enterprise Status</div>
                    <div class="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mb-2">
                        <div class="h-full bg-primary" style="width: 100%;"></div>
                    </div>
                    <div class="text-[9px] text-muted">Unlimited agents scans active.</div>
                </div>

                <div class="flex items-center justify-between border-t border-white/5 pt-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF3B30] to-[#FF6B6B] flex items-center justify-center font-bold text-white text-xs">
                            ${initial}
                        </div>
                        <div class="text-left">
                            <div class="font-bold text-white text-xs truncate max-w-[120px]">${email.split("@")[0]}</div>
                            <div class="text-[9px] text-muted truncate max-w-[120px]">Lead Auditor</div>
                        </div>
                    </div>
                    <button class="hover:text-[#FF3B30] text-muted text-xs cursor-pointer select-none" id="btn-sidebar-logout">➔</button>
                </div>
            </div>
        `;

        this.bindEvents();
    },

    bindEvents() {
        // Switch Console views
        document.querySelectorAll(".sidebar-nav-item").forEach(item => {
            item.addEventListener("click", () => {
                const view = item.getAttribute("data-view");
                uiState.setConsoleView(view);
                if (view === "repository") {
                    uiState.setRepoSubView("overview");
                }
            });
        });

        // Dropdown toggle
        const toggleBtn = document.getElementById("btn-org-switcher");
        const menu = document.getElementById("org-switcher-menu");
        
        toggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            menu.classList.toggle("hidden");
        });

        document.addEventListener("click", () => {
            menu.classList.add("hidden");
        });

        // Option switches
        document.querySelectorAll(".org-menu-option").forEach(opt => {
            opt.addEventListener("click", () => {
                const id = opt.getAttribute("data-org-id");
                repoState.setOrganization(id);
                document.getElementById("active-org-label").textContent = repoState.activeOrg.name;
                // Switch view to force reload organization
                uiState.setConsoleView("dashboard");
            });
        });

        // Logout
        document.getElementById("btn-sidebar-logout").addEventListener("click", () => {
            userState.clearSession();
            uiState.setViewState("landing");
        });
    }
};
export default sidebarComponent;
