/* --- REPOSITORY ANALYTICS PANEL --- */

export const repositoryAnalytics = {
    render() {
        const container = document.getElementById("repo-sub-view-analytics");
        if (!container) return;

        container.innerHTML = `
            <div class="p-8 text-left">
                <!-- Top stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="glass-panel p-4 flex flex-col justify-between">
                        <span class="text-xs text-muted font-medium mb-2 block">Monthly Reviews Count</span>
                        <div class="text-2xl font-heading font-bold text-white">84 reviews</div>
                    </div>
                    <div class="glass-panel p-4 flex flex-col justify-between">
                        <span class="text-xs text-muted font-medium mb-2 block">AI Fix Acceptance Rate</span>
                        <div class="text-2xl font-heading font-bold text-success">91.4%</div>
                    </div>
                    <div class="glass-panel p-4 flex flex-col justify-between">
                        <span class="text-xs text-muted font-medium mb-2 block">Total Code Audited</span>
                        <div class="text-2xl font-heading font-bold text-white">12,482 lines</div>
                    </div>
                </div>

                <!-- Charts layout -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <!-- Developer Productivity -->
                    <div class="glass-panel p-6">
                        <h3 class="text-base font-heading font-bold text-white mb-4">Vulnerability Trends Over Time</h3>
                        <div class="h-48 w-full bg-black/40 rounded-lg p-4 flex items-center justify-center">
                            <svg viewBox="0 0 500 120" class="w-full h-full">
                                <!-- Line chart with dots -->
                                <path d="M 40,90 L 120,60 L 200,80 L 280,30 L 360,40 L 440,10" fill="none" stroke="var(--primary)" stroke-width="2"/>
                                <circle cx="120" cy="60" r="3" fill="var(--secondary)"/>
                                <circle cx="280" cy="30" r="3" fill="var(--secondary)"/>
                                <circle cx="440" cy="10" r="3" fill="var(--secondary)"/>
                                <text x="40" y="110" fill="var(--muted)" font-size="8">May</text>
                                <text x="200" y="110" fill="var(--muted)" font-size="8">Jun</text>
                                <text x="360" y="110" fill="var(--muted)" font-size="8">Jul</text>
                            </svg>
                        </div>
                    </div>

                    <!-- Code Churn -->
                    <div class="glass-panel p-6">
                        <h3 class="text-base font-heading font-bold text-white mb-4">Vulnerability Density distribution (CWE)</h3>
                        <div class="h-48 w-full bg-black/40 rounded-lg p-4 flex items-center justify-center">
                            <svg viewBox="0 0 120 120" class="h-full">
                                <!-- SVG Pie chart -->
                                <circle cx="60" cy="60" r="40" fill="transparent" stroke="var(--primary)" stroke-width="20" stroke-dasharray="100 250" stroke-dashoffset="0"/>
                                <circle cx="60" cy="60" r="40" fill="transparent" stroke="var(--accent)" stroke-width="20" stroke-dasharray="60 250" stroke-dashoffset="-100"/>
                                <circle cx="60" cy="60" r="40" fill="transparent" stroke="var(--warning)" stroke-width="20" stroke-dasharray="40 250" stroke-dashoffset="-160"/>
                                <circle cx="60" cy="60" r="40" fill="transparent" stroke="var(--info)" stroke-width="20" stroke-dasharray="50 250" stroke-dashoffset="-200"/>
                            </svg>
                            <div class="flex flex-col gap-2 pl-6 text-xs">
                                <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 bg-primary rounded-full"></span> CWE-89 (Injection)</div>
                                <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 bg-accent rounded-full"></span> CWE-397 (Exceptions)</div>
                                <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 bg-warning rounded-full"></span> CWE-798 (Secrets)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
export default repositoryAnalytics;
