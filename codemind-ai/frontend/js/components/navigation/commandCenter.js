/* --- CMD+K COMMAND PALETTE OVERLAY --- */

import { uiState } from '../../state/uiState.js';
import { eventBus } from '../../utils/eventBus.js';

export const commandCenterComponent = {
    render() {
        // Modal overlay structure exists in index.html, we append it if missing or manage its content
        let overlay = document.getElementById("command-palette-overlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "command-palette-overlay";
            overlay.className = "modal-overlay hidden";
            document.body.appendChild(overlay);
        }

        overlay.innerHTML = `
            <div class="modal-content w-full max-w-lg p-1.5 bg-[#111] overflow-hidden border border-white/5 shadow-2xl relative">
                <input type="text" id="command-search-input" placeholder="Search files, repos, or run action commands..."
                    class="w-full h-12 px-4 bg-[#0a0a0a] border-b border-white/5 text-sm text-white font-code focus:outline-none placeholder:text-muted">
                
                <!-- Commands list -->
                <div class="p-2 flex flex-col gap-1 font-code text-xs text-left" id="command-suggestions-list">
                    <button class="list-item-interactive command-suggestion-item active" data-action="go_dashboard">
                        <span>➔ Go to Dashboard</span>
                        <span class="text-[9px] text-muted">Navigate</span>
                    </button>
                    <button class="list-item-interactive command-suggestion-item" data-action="go_reviews">
                        <span>➔ Go to AI Reviews</span>
                        <span class="text-[9px] text-muted">Navigate</span>
                    </button>
                    <button class="list-item-interactive command-suggestion-item" data-action="new_project">
                        <span>➔ Import Repository</span>
                        <span class="text-[9px] text-muted">Workspace</span>
                    </button>
                    <button class="list-item-interactive command-suggestion-item" data-action="save_keys">
                        <span>➔ Config API Keys</span>
                        <span class="text-[9px] text-muted">Settings</span>
                    </button>
                    <button class="list-item-interactive command-suggestion-item" data-action="logout">
                        <span>➔ Logout Session</span>
                        <span class="text-[9px] text-muted">System</span>
                    </button>
                </div>
            </div>
        `;

        this.bindEvents();
    },

    bindEvents() {
        const overlay = document.getElementById("command-palette-overlay");
        const searchInput = document.getElementById("command-search-input");
        
        eventBus.on("commandPaletteToggled", (open) => {
            if (open) {
                overlay.classList.remove("hidden");
                requestAnimationFrame(() => {
                    overlay.classList.add("open");
                    searchInput.focus();
                });
            } else {
                overlay.classList.remove("open");
                setTimeout(() => overlay.classList.add("hidden"), 200);
            }
        });

        // Close on overlay click
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                uiState.toggleCommandPalette(false);
            }
        });

        // Keyboard arrow navigation inside palette
        searchInput.addEventListener("keydown", (e) => {
            const items = document.querySelectorAll(".command-suggestion-item");
            let activeIdx = Array.from(items).findIndex(el => el.classList.contains("active"));

            if (e.key === "ArrowDown") {
                e.preventDefault();
                items[activeIdx].classList.remove("active");
                activeIdx = (activeIdx + 1) % items.length;
                items[activeIdx].classList.add("active");
                items[activeIdx].scrollIntoView({ block: 'nearest' });
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                items[activeIdx].classList.remove("active");
                activeIdx = (activeIdx - 1 + items.length) % items.length;
                items[activeIdx].classList.add("active");
                items[activeIdx].scrollIntoView({ block: 'nearest' });
            } else if (e.key === "Enter") {
                e.preventDefault();
                const action = items[activeIdx].getAttribute("data-action");
                this.executeCommand(action);
            } else if (e.key === "Escape") {
                uiState.toggleCommandPalette(false);
            }
        });

        // Bind clicks on suggestions
        document.querySelectorAll(".command-suggestion-item").forEach(item => {
            item.addEventListener("click", () => {
                const action = item.getAttribute("data-action");
                this.executeCommand(action);
            });
        });
    },

    executeCommand(action) {
        uiState.toggleCommandPalette(false);
        
        if (action === "go_dashboard") {
            uiState.setConsoleView("dashboard");
        } else if (action === "go_reviews") {
            uiState.setConsoleView("repository");
            uiState.setRepoSubView("reviews");
        } else if (action === "new_project") {
            eventBus.emit("openNewProjectModal");
        } else if (action === "save_keys") {
            uiState.setConsoleView("settings");
        } else if (action === "logout") {
            document.getElementById("btn-sidebar-logout").click();
        }
    }
};
export default commandCenterComponent;
