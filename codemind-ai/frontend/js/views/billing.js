/* --- BILLING & USAGE VIEWS --- */

export const billingView = {
    render() {
        const container = document.getElementById("console-view-billing");
        if (!container) return;

        container.innerHTML = `
            <div class="workspace-scroll-pane text-left max-w-4xl">
                <h2 class="text-2xl font-heading font-bold text-white mb-2">Billing & Subscription</h2>
                <p class="text-sm text-muted mb-8 font-normal">Manage your organization licenses and monitor scanning quotas.</p>

                <!-- Usage progress -->
                <div class="glass-panel p-6 mb-8">
                    <h3 class="text-base font-heading font-bold text-white mb-4">Workspace Scanning Usage</h3>
                    <div class="flex flex-col gap-4 font-code text-xs text-muted">
                        <div>
                            <div class="flex justify-between text-white mb-1.5 font-bold">
                                <span>Reviews Run (Monthly Quota)</span>
                                <span>428 / 1,000 scans</span>
                            </div>
                            <div class="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <div class="h-full bg-gradient-to-r from-[#FF3B30] to-[#FF6B6B] rounded-full" style="width: 42.8%;"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-white mb-1.5 font-bold">
                                <span>AI Agent Cost ($ Credits)</span>
                                <span>$14.20 / $50.00 limits</span>
                            </div>
                            <div class="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <div class="h-full bg-gradient-to-r from-[#6C5CE7] to-[#FF6B6B] rounded-full" style="width: 28.4%;"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Active Plan -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="glass-panel p-6 md:col-span-2 border-l-4 border-success flex flex-col justify-between">
                        <div>
                            <span class="text-xs text-success font-bold uppercase tracking-wider mb-1 block">Active Plan</span>
                            <h3 class="text-xl font-heading font-bold text-white mb-3">Enterprise Sandbox (Pro Tier)</h3>
                            <p class="text-xs text-muted leading-relaxed">
                                Subscribed via Stripe. Renewing automatically on August 24, 2026.
                            </p>
                        </div>
                        <button class="btn-premium btn-premium-secondary text-xs h-9 justify-center mt-6 w-fit">
                            Manage Subscription
                        </button>
                    </div>

                    <!-- Invoices list -->
                    <div class="glass-panel p-6">
                        <h3 class="text-sm font-heading font-semibold text-muted uppercase tracking-wider mb-4">Invoices History</h3>
                        <div class="flex flex-col gap-3 font-code text-[10px] text-muted">
                            <div class="flex justify-between items-center py-1.5 border-b border-white/5">
                                <span>INV-2026-06</span>
                                <span class="text-white font-bold">$49.00</span>
                                <span class="text-success font-bold">Paid</span>
                            </div>
                            <div class="flex justify-between items-center py-1.5 border-b border-white/5">
                                <span>INV-2026-05</span>
                                <span class="text-white font-bold">$49.00</span>
                                <span class="text-success font-bold">Paid</span>
                            </div>
                            <div class="flex justify-between items-center py-1.5">
                                <span>INV-2026-04</span>
                                <span class="text-white font-bold">$49.00</span>
                                <span class="text-success font-bold">Paid</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
export default billingView;
