/* --- DASHBOARD VIEW TEMPLATE --- */

import { uiState } from '../state/uiState.js';
import { repoState } from '../state/repoState.js';
import { userState } from '../state/userState.js';
import { repositoryService } from '../services/repositoryService.js';
import { eventBus } from '../utils/eventBus.js';

export const dashboardView = {
    async render() {
        const container = document.getElementById("console-view-dashboard");
        if (!container) return;

        // Fetch repositories
        const repos = await repositoryService.loadProjects();
        const userName = userState.currentUser ? userState.currentUser.name || "Auditor" : "Developer";

        container.innerHTML = `
            <div class="workspace-scroll-pane text-left">
                <!-- Welcome Banner -->
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h2 class="text-3xl font-heading font-bold text-white mb-1">Welcome back, ${userName}</h2>
                        <p class="text-sm text-muted">Here is the executive health summary for the ${repoState.activeOrg.name} organization.</p>
                    </div>
                    <div class="badge-premium badge-premium-success">Org License Valid</div>
                </div>

                <!-- Executive Health Grid -->
                <div class="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
                    <div class="glass-panel p-4 flex flex-col justify-between">
                        <span class="text-xs text-muted font-medium mb-2 block">Organization Health</span>
                        <div class="flex items-baseline gap-2">
                            <span class="text-3xl font-heading font-bold text-white">92%</span>
                            <span class="text-xs text-success font-semibold">▲ 1.4%</span>
                        </div>
                    </div>
                    <div class="glass-panel p-4 flex flex-col justify-between">
                        <span class="text-xs text-muted font-medium mb-2 block">Repositories</span>
                        <div class="text-3xl font-heading font-bold text-white">${repos.length}</div>
                    </div>
                    <div class="glass-panel p-4 flex flex-col justify-between border-[#6C5CE7]/30">
                        <span class="text-xs text-muted font-medium mb-2 block">Running Reviews</span>
                        <div class="text-3xl font-heading font-bold text-gradient-purple animate-pulse">3</div>
                    </div>
                    <div class="glass-panel p-4 flex flex-col justify-between border-[#FF3B30]/30">
                        <span class="text-xs text-muted font-medium mb-2 block">Critical Issues</span>
                        <div class="text-3xl font-heading font-bold text-[#FF3B30]">5</div>
                    </div>
                    <div class="glass-panel p-4 flex flex-col justify-between">
                        <span class="text-xs text-muted font-medium mb-2 block">Review Queue</span>
                        <div class="text-3xl font-heading font-bold text-white">7</div>
                    </div>
                </div>

                <!-- Main Layout splits -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <!-- Left: Repositories Checklist -->
                    <div class="lg:col-span-2 flex flex-col gap-6">
                        <div class="glass-panel p-6">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-lg font-heading font-bold text-white">Repositories</h3>
                                <button id="btn-dashboard-new-repo" class="btn-premium btn-premium-primary text-xs h-8">Import Repo</button>
                            </div>
                            <div class="flex flex-col gap-3" id="dashboard-repos-list">
                                <!-- Loaded Repositories dynamically -->
                            </div>
                        </div>

                        <!-- Actionable Analytics: Weekly reviews SVG Chart -->
                        <div class="glass-panel p-6">
                            <h3 class="text-lg font-heading font-bold text-white mb-4">Weekly Reviews Trend</h3>
                            <div class="w-full h-48 flex items-center justify-center bg-black/40 rounded-lg p-4" id="dashboard-chart-reviews">
                                <!-- SVG Line Chart -->
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Feeds & Alerts -->
                    <div class="flex flex-col gap-6">
                        <!-- Real-time Activity Ticker -->
                        <div class="glass-panel p-6 border-l-2 border-[#FF3B30]/40 bg-[#161212]/20">
                            <h3 class="text-base font-heading font-bold text-white mb-3 flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-primary animate-ping"></span> Live Auditor Feed
                            </h3>
                            <div class="h-28 overflow-hidden relative">
                                <div id="live-activity-feed-ticker" class="flex flex-col gap-3 font-code text-xs">
                                    <!-- Dynamic Ticker logs -->
                                </div>
                            </div>
                        </div>

                        <!-- Security Alerts -->
                        <div class="glass-panel p-6">
                            <h3 class="text-base font-heading font-bold text-white mb-4">Critical Security Alerts</h3>
                            <div class="flex flex-col gap-4 font-code text-xs">
                                <div class="p-3 bg-[#FF3B30]/5 border border-[#FF3B30]/20 rounded-md flex justify-between items-center">
                                    <div>
                                        <div class="font-bold text-white mb-1">SQL Injection Vulnerability</div>
                                        <div class="text-[10px] text-muted">auth.py:L2 (Backend API)</div>
                                    </div>
                                    <span class="badge-premium badge-premium-danger">Critical</span>
                                </div>
                                <div class="p-3 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-md flex justify-between items-center">
                                    <div>
                                        <div class="font-bold text-white mb-1">Raw password hashing bypass</div>
                                        <div class="text-[10px] text-muted">security.py:L142 (Mobile Core)</div>
                                    </div>
                                    <span class="badge-premium badge-premium-warning">High</span>
                                </div>
                            </div>
                        </div>

                        <!-- Calendar Heatmap -->
                        <div class="glass-panel p-6">
                            <h3 class="text-sm font-heading font-semibold text-muted uppercase tracking-wider mb-4">Audits Commit Heatmap</h3>
                            <div id="dashboard-heatmap" class="flex justify-center"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.renderReposList(repos);
        this.renderWeeklyReviewsChart();
        this.renderCalendarHeatmap();
        this.startActivityTicker();

        // Bind creation modal trigger
        document.getElementById("btn-dashboard-new-repo").addEventListener("click", () => {
            eventBus.emit("openNewProjectModal");
        });
    },

    renderReposList(repos) {
        const list = document.getElementById("dashboard-repos-list");
        if (!list) return;

        list.innerHTML = repos.map(r => {
            let badgeClass = "badge-premium-success";
            if (r.health === "Needs Review") badgeClass = "badge-premium-warning";
            if (r.health === "Critical") badgeClass = "badge-premium-danger";
            if (r.health === "Review Running") badgeClass = "badge-premium-accent animate-pulse";

            return `
                <div class="p-4 border border-white/5 bg-black/40 rounded-lg flex items-center justify-between hover:border-white/10 transition-colors cursor-pointer repo-checklist-item" data-repo-id="${r.id}">
                    <div class="flex items-center gap-4">
                        <div class="w-2.5 h-2.5 rounded-full ${r.health === 'Healthy' ? 'bg-success' : r.health === 'Critical' ? 'bg-danger' : 'bg-warning'}"></div>
                        <div>
                            <div class="font-heading font-bold text-white text-sm mb-1">${r.name}</div>
                            <div class="text-xs text-muted flex items-center gap-3">
                                <span>Stars: ${r.stars}</span>
                                <span>Issues: ${r.issues}</span>
                                <span>Language: ${r.language}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-xs text-muted">Quality Score: <span class="font-bold text-white">${r.score}/100</span></span>
                        <span class="badge-premium ${badgeClass}">${r.health}</span>
                    </div>
                </div>
            `;
        }).join('');

        // Bind clicks on checklist items
        document.querySelectorAll(".repo-checklist-item").forEach(item => {
            item.addEventListener("click", () => {
                const id = parseInt(item.getAttribute("data-repo-id"));
                const repo = repos.find(r => r.id === id);
                if (repo) {
                    repoState.setProject(repo);
                    uiState.setConsoleView("repository");
                    uiState.setRepoSubView("overview");
                }
            });
        });
    },

    renderWeeklyReviewsChart() {
        const container = document.getElementById("dashboard-chart-reviews");
        if (!container) return;

        // Generating dynamic responsive SVG line chart
        container.innerHTML = `
            <svg viewBox="0 0 500 120" class="w-full h-full">
                <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.3"/>
                        <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0"/>
                    </linearGradient>
                </defs>
                <path d="M 30,100 Q 100,50 180,80 T 320,40 T 470,20 L 470,100 Z" fill="url(#chartGrad)"/>
                <path d="M 30,100 Q 100,50 180,80 T 320,40 T 470,20" fill="none" stroke="var(--primary)" stroke-width="2"/>
                <circle cx="180" cy="80" r="4" fill="var(--secondary)"/>
                <circle cx="320" cy="40" r="4" fill="var(--secondary)"/>
                <circle cx="470" cy="20" r="4" fill="var(--secondary)"/>
                <text x="30" y="115" fill="var(--muted)" font-size="8">Mon</text>
                <text x="180" y="115" fill="var(--muted)" font-size="8">Wed</text>
                <text x="320" y="115" fill="var(--muted)" font-size="8">Fri</text>
                <text x="470" y="115" fill="var(--muted)" font-size="8">Sun</text>
            </svg>
        `;
    },

    renderCalendarHeatmap() {
        const container = document.getElementById("dashboard-heatmap");
        if (!container) return;

        // Custom Calendar heat grids
        let cells = "";
        for (let i = 0; i < 48; i++) {
            let opacity = "opacity-10";
            if (i % 5 === 0) opacity = "opacity-30";
            if (i % 7 === 0) opacity = "opacity-60";
            if (i % 9 === 0) opacity = "opacity-90";
            cells += `<div class="w-3.5 h-3.5 rounded-sm bg-[#FF3B30] ${opacity}"></div>`;
        }

        container.innerHTML = `
            <div class="grid grid-cols-12 gap-1.5 w-fit">
                ${cells}
            </div>
        `;
    },

    startActivityTicker() {
        const ticker = document.getElementById("live-activity-feed-ticker");
        if (!ticker) return;

        const logs = [
            "Review #242 completed on Backend API",
            "Vulnerability scanner started on Mobile Core",
            "Patch SQL parameterization applied to auth.py",
            "Security alert dismissed inside config.py",
            "AST Compiler loaded 23 nodes on review.py",
            "RAG vector indexed new OWASP specifications"
        ];

        let index = 0;
        ticker.innerHTML = `<div class="text-white py-1">➔ ${logs[index]}</div>`;

        // Loop feed updates
        if (this.tickerInterval) clearInterval(this.tickerInterval);
        this.tickerInterval = setInterval(() => {
            index = (index + 1) % logs.length;
            ticker.innerHTML = `<div class="text-white py-1 ticker-animate">➔ ${logs[index]}</div>`;
        }, 3000);
    }
};
export default dashboardView;
