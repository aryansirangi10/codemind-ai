/* --- REPOSITORY SECURITY CENTER --- */

export const repositorySecurity = {
    render() {
        const container = document.getElementById("repo-sub-view-security");
        if (!container) return;

        container.innerHTML = `
            <div class="p-8 text-left">
                <!-- Score Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="glass-panel p-4 flex flex-col justify-between">
                        <span class="text-xs text-muted font-medium mb-2 block">Risk Level</span>
                        <div class="text-2xl font-heading font-bold text-gradient-primary">MEDIUM RISK</div>
                    </div>
                    <div class="glass-panel p-4 flex flex-col justify-between">
                        <span class="text-xs text-muted font-medium mb-2 block">Vulnerability Aging</span>
                        <div class="text-2xl font-heading font-bold text-white">&lt;2 days</div>
                    </div>
                    <div class="glass-panel p-4 flex flex-col justify-between">
                        <span class="text-xs text-muted font-medium mb-2 block">Exploitable Score</span>
                        <div class="text-2xl font-heading font-bold text-[#FF3B30]">High (8.4)</div>
                    </div>
                    <div class="glass-panel p-4 flex flex-col justify-between">
                        <span class="text-xs text-muted font-medium mb-2 block">Avg Remediation Speed</span>
                        <div class="text-2xl font-heading font-bold text-success">~4 minutes</div>
                    </div>
                </div>

                <!-- Main Snyk-style table -->
                <div class="glass-panel p-6 mb-8">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-heading font-bold text-white">Vulnerability Logs</h3>
                        <div class="flex gap-2">
                            <select class="px-3 bg-panel border border-white/5 text-xs text-muted rounded h-8">
                                <option>Severity: All</option>
                                <option>Critical</option>
                                <option>High</option>
                            </select>
                            <select class="px-3 bg-panel border border-white/5 text-xs text-muted rounded h-8">
                                <option>OWASP Category: All</option>
                                <option>Injection</option>
                                <option>Security Misconfig</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex flex-col gap-3 font-code text-xs">
                        <!-- Table header -->
                        <div class="grid grid-cols-12 gap-4 pb-3 border-b border-white/5 text-muted font-bold">
                            <div class="col-span-4">VULNERABILITY / WEAKNESS</div>
                            <div class="col-span-2">SEVERITY</div>
                            <div class="col-span-2">OWASP CLASS</div>
                            <div class="col-span-2">EXPLOITABILITY</div>
                            <div class="col-span-2">CONFIDENCE</div>
                        </div>

                        <!-- Rows -->
                        <div class="grid grid-cols-12 gap-4 py-3.5 border-b border-white/5 items-center">
                            <div class="col-span-4">
                                <div class="font-bold text-white mb-1">CWE-89: Raw SQL Injection</div>
                                <div class="text-[10px] text-muted">auth.py:L2</div>
                            </div>
                            <div class="col-span-2"><span class="badge-premium badge-premium-danger">Critical</span></div>
                            <div class="col-span-2">A03:Injection</div>
                            <div class="col-span-2 text-white font-bold">High</div>
                            <div class="col-span-2 text-muted">Certain</div>
                        </div>
                        <div class="grid grid-cols-12 gap-4 py-3.5 border-b border-white/5 items-center">
                            <div class="col-span-4">
                                <div class="font-bold text-white mb-1">CWE-397: Bare Generic Exception pass</div>
                                <div class="text-[10px] text-muted">review.py:L3</div>
                            </div>
                            <div class="col-span-2"><span class="badge-premium badge-premium-warning">Medium</span></div>
                            <div class="col-span-2">A05:Misconfig</div>
                            <div class="col-span-2 text-muted">Low</div>
                            <div class="col-span-2 text-muted">Probable</div>
                        </div>
                        <div class="grid grid-cols-12 gap-4 py-3.5 items-center">
                            <div class="col-span-4">
                                <div class="font-bold text-white mb-1">CWE-798: Hardcoded database authentication token</div>
                                <div class="text-[10px] text-muted">config.py:L14</div>
                            </div>
                            <div class="col-span-2"><span class="badge-premium badge-premium-warning">High</span></div>
                            <div class="col-span-2">A07:Identification</div>
                            <div class="col-span-2 text-white font-bold">Medium</div>
                            <div class="col-span-2 text-muted">Certain</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
export default repositorySecurity;
