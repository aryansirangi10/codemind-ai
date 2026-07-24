/* --- REPOSITORY OVERVIEW PANELS --- */

import { repoState } from '../../state/repoState.js';

export const repositoryOverview = {
    render() {
        const container = document.getElementById("repo-sub-view-overview");
        if (!container) return;

        const repo = repoState.activeProject || { name: "Repository", score: 92, health: "Healthy" };

        container.innerHTML = `
            <div class="p-8 text-left">
                <!-- Health summary card -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="glass-panel p-6 border-l-4 border-success flex items-center justify-between">
                        <div>
                            <span class="text-xs text-muted font-medium mb-1 block">Security Score</span>
                            <span class="text-3xl font-heading font-bold text-white">${repo.score}%</span>
                        </div>
                        <div class="text-success text-2xl font-bold">A</div>
                    </div>
                    <div class="glass-panel p-6 border-l-4 border-[#6C5CE7] flex items-center justify-between">
                        <div>
                            <span class="text-xs text-muted font-medium mb-1 block">Code Quality</span>
                            <span class="text-3xl font-heading font-bold text-white">94%</span>
                        </div>
                        <div class="text-[#6C5CE7] text-2xl font-bold">A+</div>
                    </div>
                    <div class="glass-panel p-6 border-l-4 border-[#3B82F6] flex items-center justify-between">
                        <div>
                            <span class="text-xs text-muted font-medium mb-1 block">Performance Score</span>
                            <span class="text-3xl font-heading font-bold text-white">88%</span>
                        </div>
                        <div class="text-[#3B82F6] text-2xl font-bold">B</div>
                    </div>
                    <div class="glass-panel p-6 border-l-4 border-[#F59E0B] flex items-center justify-between">
                        <div>
                            <span class="text-xs text-muted font-medium mb-1 block">Technical Debt</span>
                            <span class="text-3xl font-heading font-bold text-white">4.2d</span>
                        </div>
                        <span class="badge-premium badge-premium-warning">Low</span>
                    </div>
                </div>

                <!-- Detail grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Left: Latest Reviews & recommendations -->
                    <div class="lg:col-span-2 flex flex-col gap-6">
                        <div class="glass-panel p-6">
                            <h3 class="text-lg font-heading font-bold text-white mb-6">AI Recommendations</h3>
                            <div class="flex flex-col gap-4 font-code text-xs">
                                <div class="p-4 bg-panel border border-white/5 rounded-lg flex items-start gap-4">
                                    <div class="w-2.5 h-2.5 rounded-full bg-danger mt-1 flex-shrink-0"></div>
                                    <div>
                                        <div class="font-bold text-white mb-1">Parameterized SQL Execution</div>
                                        <div class="text-muted leading-relaxed mb-3">
                                            Vulnerable concatenation in auth.py:L2 exposes your workspace to SQL injection risks.
                                        </div>
                                        <button class="btn-premium btn-premium-primary text-[10px] h-7 px-3 btn-jump-to-review">Inspect & Fix Now</button>
                                    </div>
                                </div>
                                <div class="p-4 bg-panel border border-white/5 rounded-lg flex items-start gap-4">
                                    <div class="w-2.5 h-2.5 rounded-full bg-warning mt-1 flex-shrink-0"></div>
                                    <div>
                                        <div class="font-bold text-white mb-1">Handle generic except block exceptions</div>
                                        <div class="text-muted leading-relaxed mb-3">
                                            Bare pass exception in review.py:L3 catches system interrupts. Log details contextually.
                                        </div>
                                        <button class="btn-premium btn-premium-secondary text-[10px] h-7 px-3 btn-jump-to-review">Inspect & Fix Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Recent Commits List -->
                        <div class="glass-panel p-6">
                            <h3 class="text-lg font-heading font-bold text-white mb-6">Recent Commit Audits</h3>
                            <div class="flex flex-col gap-3 font-code text-xs">
                                <div class="flex items-center justify-between py-2.5 border-b border-white/5">
                                    <div class="flex items-center gap-4">
                                        <span class="text-muted font-bold text-[#FF6B6B]">c3a4f12</span>
                                        <span class="text-white">Refactored JWT claims validation models</span>
                                    </div>
                                    <span class="text-muted">Aryan · 10m ago</span>
                                </div>
                                <div class="flex items-center justify-between py-2.5 border-b border-white/5">
                                    <div class="flex items-center gap-4">
                                        <span class="text-muted font-bold text-[#FF6B6B]">a412bb3</span>
                                        <span class="text-white">Redesigned navigation bar responsive drawers</span>
                                    </div>
                                    <span class="text-muted">Aryan · 2h ago</span>
                                </div>
                                <div class="flex items-center justify-between py-2.5">
                                    <div class="flex items-center gap-4">
                                        <span class="text-muted font-bold text-[#FF6B6B]">f127b40</span>
                                        <span class="text-white">Initial import and seeder records setup</span>
                                    </div>
                                    <span class="text-muted">System · 1d ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Repository Vulnerability stats & timeline -->
                    <div class="flex flex-col gap-6">
                        <div class="glass-panel p-6">
                            <h3 class="text-base font-heading font-bold text-white mb-4">Open Vulnerabilities</h3>
                            <div class="grid grid-cols-2 gap-4 text-center">
                                <div class="p-3 bg-[#FF3B30]/5 border border-[#FF3B30]/20 rounded-md">
                                    <div class="text-2xl font-bold text-[#FF3B30]">1</div>
                                    <div class="text-[10px] text-muted font-semibold uppercase">Critical</div>
                                </div>
                                <div class="p-3 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-md">
                                    <div class="text-2xl font-bold text-[#F59E0B]">2</div>
                                    <div class="text-[10px] text-muted font-semibold uppercase">High</div>
                                </div>
                                <div class="p-3 bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-md">
                                    <div class="text-2xl font-bold text-[#3B82F6]">4</div>
                                    <div class="text-[10px] text-muted font-semibold uppercase">Medium</div>
                                </div>
                                <div class="p-3 bg-white/5 border border-white/10 rounded-md">
                                    <div class="text-2xl font-bold text-white">7</div>
                                    <div class="text-[10px] text-muted font-semibold uppercase">Low</div>
                                </div>
                            </div>
                        </div>

                        <!-- Activity timeline -->
                        <div class="glass-panel p-6">
                            <h3 class="text-base font-heading font-bold text-white mb-6">Activity Timeline</h3>
                            <div class="flex flex-col gap-6 relative border-l border-white/5 pl-4 ml-2">
                                <div class="relative">
                                    <div class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-success"></div>
                                    <div class="text-xs font-bold text-white mb-1">Patch applied successfully</div>
                                    <div class="text-[10px] text-muted">Review #242 (auth.py) verified</div>
                                </div>
                                <div class="relative">
                                    <div class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary"></div>
                                    <div class="text-xs font-bold text-white mb-1">Audit triggered automatically</div>
                                    <div class="text-[10px] text-muted">Commit c3a4f12 processed via webhook</div>
                                </div>
                                <div class="relative">
                                    <div class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-info"></div>
                                    <div class="text-xs font-bold text-white mb-1">Repository imported</div>
                                    <div class="text-[10px] text-muted">Project mapped to OpenAI org</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind clicks on recommendation fix CTA buttons
        container.querySelectorAll(".btn-jump-to-review").forEach(btn => {
            btn.addEventListener("click", () => {
                const tab = document.querySelector(".repo-sub-tab[data-sub-view='reviews']");
                if (tab) tab.click();
            });
        });
    }
};
export default repositoryOverview;
