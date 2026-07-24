/* --- IMPORT REPOSITORY MODAL COMPONENT --- */

import { repositoryService } from '../../services/repositoryService.js';
import { eventBus } from '../../utils/eventBus.js';

export const newProjectModalComponent = {
    render() {
        let overlay = document.getElementById("new-project-modal-overlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "new-project-modal-overlay";
            overlay.className = "modal-overlay hidden";
            document.body.appendChild(overlay);
        }

        overlay.innerHTML = `
            <div class="modal-content w-full max-w-md p-6 bg-panel text-left flex flex-col gap-5 border border-white/5 shadow-2xl relative">
                <div class="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 class="text-lg font-heading font-bold text-white">Import Repository</h3>
                    <button class="text-muted hover:text-white text-xs" id="btn-close-new-project">✕</button>
                </div>

                <!-- Provider grid selection -->
                <div>
                    <label class="text-[10px] text-muted font-bold uppercase tracking-wider block mb-2">Connect Source Manager</label>
                    <div class="grid grid-cols-3 gap-3 text-center text-[10px] font-code text-muted">
                        <button class="p-2 border border-white/10 rounded hover:border-[#FF3B30]/40 transition-colors select-none cursor-pointer flex flex-col items-center gap-1.5 active-prov">
                            🐱 GitHub
                        </button>
                        <button class="p-2 border border-white/5 bg-black/40 rounded opacity-50 select-none cursor-not-allowed flex flex-col items-center gap-1.5">
                            🦊 GitLab
                        </button>
                        <button class="p-2 border border-white/5 bg-black/40 rounded opacity-50 select-none cursor-not-allowed flex flex-col items-center gap-1.5">
                            🏺 Bitbucket
                        </button>
                    </div>
                </div>

                <!-- Repository form settings -->
                <form id="form-import-repository" class="flex flex-col gap-4 text-xs">
                    <div class="flex flex-col gap-1.5">
                        <label for="new-repo-name" class="text-muted font-semibold">Repository Name</label>
                        <input type="text" id="new-repo-name" required placeholder="FastAPI Service"
                            class="w-full h-9 px-3 bg-[#0c0c0c] border border-white/5 rounded text-white focus:outline-none focus:border-[#FF3B30]/40 transition-colors">
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label for="new-repo-desc" class="text-muted font-semibold">Description</label>
                        <input type="text" id="new-repo-desc" placeholder="Microservices for token validation audits"
                            class="w-full h-9 px-3 bg-[#0c0c0c] border border-white/5 rounded text-white focus:outline-none focus:border-[#FF3B30]/40 transition-colors">
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label for="new-repo-lang" class="text-muted font-semibold">Primary Language</label>
                        <select id="new-repo-lang"
                            class="w-full h-9 px-3 bg-[#0c0c0c] border border-white/5 rounded text-white focus:outline-none focus:border-[#FF3B30]/40 transition-colors">
                            <option>Python</option>
                            <option>TypeScript</option>
                            <option>Java</option>
                            <option>Dart</option>
                        </select>
                    </div>

                    <button type="submit" class="btn-premium btn-premium-primary h-9 rounded mt-2 justify-center font-semibold">
                        Confirm Import Workspace
                    </button>
                </form>
            </div>
        `;

        this.bindEvents();
    },

    bindEvents() {
        const overlay = document.getElementById("new-project-modal-overlay");
        const closeBtn = document.getElementById("btn-close-new-project");
        const form = document.getElementById("form-import-repository");

        eventBus.on("openNewProjectModal", () => {
            overlay.classList.remove("hidden");
            requestAnimationFrame(() => overlay.classList.add("open"));
        });

        const close = () => {
            overlay.classList.remove("open");
            setTimeout(() => overlay.classList.add("hidden"), 200);
        };

        closeBtn.addEventListener("click", close);
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) close();
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("new-repo-name").value;
            const desc = document.getElementById("new-repo-desc").value;
            const lang = document.getElementById("new-repo-lang").value;
            
            try {
                await repositoryService.createProject(name, desc, lang);
                eventBus.emit("toastAlert", { title: "Repository Imported", desc: `${name} has been imported successfully!`, type: "success" });
                close();
                // Switch view to trigger reload
                uiState.setConsoleView("dashboard");
            } catch (err) {
                eventBus.emit("toastAlert", { title: "Import Error", desc: err.message, type: "danger" });
            }
        });
    }
};
export default newProjectModalComponent;
