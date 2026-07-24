/* --- TEAM COLLABORATION SPACE --- */

import { eventBus } from '../utils/eventBus.js';

export const teamView = {
    render() {
        const container = document.getElementById("console-view-team");
        if (!container) return;

        container.innerHTML = `
            <div class="workspace-scroll-pane text-left max-w-4xl">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h2 class="text-2xl font-heading font-bold text-white mb-1">Team Workspace Hub</h2>
                        <p class="text-sm text-muted">Coordinate reviews assignments and assign developers roles.</p>
                    </div>
                    <button class="btn-premium btn-premium-primary text-xs h-8 px-3" id="btn-team-invite">Invite Member</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Members list -->
                    <div class="md:col-span-2 glass-panel p-6">
                        <h3 class="text-base font-heading font-bold text-white mb-4">Workspace Members</h3>
                        <div class="flex flex-col gap-4 font-code text-xs">
                            <div class="flex items-center justify-between py-2 border-b border-white/5">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-white">A</div>
                                    <div>
                                        <div class="font-bold text-white">Aryan</div>
                                        <div class="text-[10px] text-muted">aryan@codemind.ai</div>
                                    </div>
                                </div>
                                <span class="badge-premium badge-premium-danger">Owner</span>
                            </div>
                            <div class="flex items-center justify-between py-2 border-b border-white/5">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-info flex items-center justify-center font-bold text-white">R</div>
                                    <div>
                                        <div class="font-bold text-white">Ravi</div>
                                        <div class="text-[10px] text-muted">ravi@codemind.ai</div>
                                    </div>
                                </div>
                                <span class="badge-premium badge-premium-info">Developer</span>
                            </div>
                            <div class="flex items-center justify-between py-2">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-bold text-white">A</div>
                                    <div>
                                        <div class="font-bold text-white">Ankit</div>
                                        <div class="text-[10px] text-muted">ankit@codemind.ai</div>
                                    </div>
                                </div>
                                <span class="badge-premium badge-premium-accent">Reviewer</span>
                            </div>
                        </div>
                    </div>

                    <!-- Assignments & notifications -->
                    <div class="glass-panel p-6 flex flex-col gap-4">
                        <h3 class="text-base font-heading font-bold text-white mb-2">Pending Assigns</h3>
                        <div class="flex flex-col gap-3 font-code text-[11px] text-muted">
                            <div class="p-3 bg-panel rounded border border-white/5">
                                <div class="font-bold text-white mb-1">Verify SQL Injection Fix</div>
                                <div>Assigned to: Ravi · auth.py</div>
                            </div>
                            <div class="p-3 bg-panel rounded border border-white/5">
                                <div class="font-bold text-white mb-1">OWASP Compliance audit</div>
                                <div>Assigned to: Ankit · Mobile Core</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById("btn-team-invite").addEventListener("click", () => {
            eventBus.emit("toastAlert", { title: "Invitation Sent", desc: "User invitation email triggered.", type: "success" });
        });
    }
};
export default teamView;
