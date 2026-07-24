/* --- LANDING VIEW TEMPLATE --- */

import { uiState } from '../state/uiState.js';

export const landingView = {
    render() {
        const container = document.getElementById("view-landing");
        if (!container) return;

        container.innerHTML = `
            <!-- Landing Navigation -->
            <nav class="top-breadcrumb-bar border-b border-white/5" style="height: 80px; position: sticky; top: 0; z-index: 100;">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-md bg-gradient-to-tr from-[#FF3B30] to-[#FF6B6B] flex items-center justify-center font-bold font-heading text-white">C</div>
                    <span class="text-xl font-heading font-bold select-none text-white">CodeMind <span class="text-gradient-primary">AI</span></span>
                </div>
                <div class="flex items-center gap-8 text-sm font-medium text-muted">
                    <a href="#features" class="hover:text-white transition-colors">Features</a>
                    <a href="#solutions" class="hover:text-white transition-colors">Solutions</a>
                    <a href="#pricing" class="hover:text-white transition-colors">Pricing</a>
                    <a href="#faq" class="hover:text-white transition-colors">FAQ</a>
                </div>
                <div class="flex items-center gap-4">
                    <button id="btn-landing-login" class="btn-premium btn-premium-secondary">Login</button>
                    <button id="btn-landing-demo" class="btn-premium btn-premium-primary">Book Demo</button>
                </div>
            </nav>

            <!-- Hero Section -->
            <div class="mx-auto max-w-7xl px-8 py-20 text-center relative z-10 flex flex-col items-center">
                <!-- Spotlight ambient background -->
                <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF3B30]/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div class="badge-premium badge-premium-accent mb-6 animate-pulse">Platform Launch 2.0</div>
                <h1 class="text-5xl md:text-7xl font-heading font-bold mb-6 max-w-4xl text-white leading-tight">
                    Enterprise AI <br>Engineering Intelligence
                </h1>
                <p class="text-lg md:text-xl text-muted font-normal max-w-2xl mb-10 leading-relaxed">
                    Review, secure, optimize, and understand your entire codebase using multiple autonomous AI agents working together in real time.
                </p>
                <div class="flex items-center gap-4 mb-20">
                    <button id="btn-hero-start" class="btn-premium btn-premium-primary h-12 px-8 text-sm rounded-lg">Start Free</button>
                    <button id="btn-hero-demo" class="btn-premium btn-premium-secondary h-12 px-8 text-sm rounded-lg">Watch Demo</button>
                </div>

                <!-- Scrolling Floating Code Window -->
                <div class="w-full max-w-4xl rounded-xl border border-white/5 bg-[#0a0a0a] p-1 mb-24 shadow-2xl relative overflow-hidden">
                    <div class="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-panel">
                        <div class="flex gap-2">
                            <span class="w-3 h-3 rounded-full bg-[#FF3B30]/30"></span>
                            <span class="w-3 h-3 rounded-full bg-[#F59E0B]/30"></span>
                            <span class="w-3 h-3 rounded-full bg-[#22C55E]/30"></span>
                        </div>
                        <span class="text-xs font-code text-muted">ai_review_agent.py</span>
                        <span class="text-xs font-code text-gradient-primary">● Active Pipeline</span>
                    </div>
                    <pre class="p-6 text-left text-sm font-code text-[#FF6B6B] overflow-x-auto bg-[#050505]"><code>def run_security_pipeline(code: str, rag_context: dict):
    # AST analysis check pre-filter
    ast_findings = ast_scanner.parse(code)
    if ast_findings:
        logger.warn(f"AST tagged {len(ast_findings)} alerts")
    
    # Trigger Parallel Agents Scan
    results = parallel_orch([
        SecurityAgent.scan(code, rag_context),
        PerformanceAgent.scan(code),
        QAExceptionAgent.scan(code)
    ])
    return Supervisor.consolidate(results)</code></pre>
                </div>

                <!-- Metrics Section -->
                <h2 class="text-2xl font-heading mb-12 text-muted uppercase tracking-wider">Engineering Impact Metrics</h2>
                <div class="grid grid-cols-2 md:grid-cols-5 gap-8 w-full max-w-5xl mb-28 text-left">
                    <div class="p-4 border-l-2 border-[#FF3B30]/40">
                        <div class="text-4xl font-heading font-bold text-white mb-2">98%</div>
                        <div class="text-xs text-muted font-medium">Review Accuracy</div>
                    </div>
                    <div class="p-4 border-l-2 border-[#6C5CE7]/40">
                        <div class="text-4xl font-heading font-bold text-white mb-2">4</div>
                        <div class="text-xs text-muted font-medium">AI Agents</div>
                    </div>
                    <div class="p-4 border-l-2 border-[#3B82F6]/40">
                        <div class="text-4xl font-heading font-bold text-white mb-2">100+</div>
                        <div class="text-xs text-muted font-medium">Security Rules</div>
                    </div>
                    <div class="p-4 border-l-2 border-[#22C55E]/40">
                        <div class="text-4xl font-heading font-bold text-white mb-2">12x</div>
                        <div class="text-xs text-muted font-medium">Faster Reviews</div>
                    </div>
                    <div class="p-4 border-l-2 border-[#F59E0B]/40">
                        <div class="text-4xl font-heading font-bold text-white mb-2">&lt;500ms</div>
                        <div class="text-xs text-muted font-medium">AST Scan Speed</div>
                    </div>
                </div>

                <!-- Trusted Technologies -->
                <h2 class="text-xs font-heading font-semibold text-muted uppercase tracking-widest mb-8">Built With Enterprise Technologies</h2>
                <div class="flex flex-wrap items-center justify-center gap-12 mb-32 opacity-50">
                    <span class="text-sm font-bold text-white">GitHub API</span>
                    <span class="text-sm font-bold text-white">FastAPI</span>
                    <span class="text-sm font-bold text-white">Docker</span>
                    <span class="text-sm font-bold text-white">Python AST</span>
                    <span class="text-sm font-bold text-white">OWASP Rules</span>
                    <span class="text-sm font-bold text-white">Monaco Editor</span>
                </div>

                <!-- Features Section -->
                <div id="features" class="w-full max-w-6xl mb-32">
                    <h2 class="text-4xl font-heading font-bold text-center mb-16 text-white">Built for Security & Performance Engineers</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="glass-panel text-left">
                            <div class="w-10 h-10 rounded-md bg-[#FF3B30]/10 border border-[#FF3B30]/20 flex items-center justify-center text-[#FF3B30] mb-6">
                                <span class="font-bold">AST</span>
                            </div>
                            <h3 class="text-xl font-heading font-bold mb-3 text-white">AST Linter Scanner</h3>
                            <p class="text-sm text-muted leading-relaxed">
                                Compiles source trees locally before triggering models. Catches SQL concatenation leaks, exceptions, and vulnerabilities instantly.
                            </p>
                        </div>
                        <div class="glass-panel text-left">
                            <div class="w-10 h-10 rounded-md bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 flex items-center justify-center text-[#6C5CE7] mb-6">
                                <span class="font-bold">RAG</span>
                            </div>
                            <h3 class="text-xl font-heading font-bold mb-3 text-white">Contextual RAG Indexes</h3>
                            <p class="text-sm text-muted leading-relaxed">
                                Indexes code guidelines locally using vector models to enforce OWASP Top 10 standards and internal naming conventions dynamically.
                            </p>
                        </div>
                        <div class="glass-panel text-left">
                            <div class="w-10 h-10 rounded-md bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E] mb-6">
                                <span class="font-bold">MA</span>
                            </div>
                            <h3 class="text-xl font-heading font-bold mb-3 text-white">Multi-Agent Pipelines</h3>
                            <p class="text-sm text-muted leading-relaxed">
                                Security, Performance, QA, and Architecture agents scan code concurrently. The supervisor dedups findings and aggregates scores.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Pricing Plan Tiers -->
                <div id="pricing" class="w-full max-w-5xl mb-32">
                    <h2 class="text-4xl font-heading font-bold text-center mb-6 text-white">Simple, Enterprise-Grade Pricing</h2>
                    <p class="text-muted mb-16 max-w-lg mx-auto">Scale your code auditing seamlessly from individuals to massive global team workspaces.</p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="glass-panel text-left flex flex-col justify-between">
                            <div>
                                <h3 class="text-lg font-heading font-bold text-white mb-2">Starter</h3>
                                <div class="text-3xl font-heading font-bold text-white mb-4">$0 <span class="text-xs font-normal text-muted">/ month</span></div>
                                <p class="text-xs text-muted mb-6">Perfect for individual developer audits and sandbox integrations.</p>
                                <ul class="text-xs text-muted gap-3 flex flex-col mb-8">
                                    <li>✓ 1 Active Workspace</li>
                                    <li>✓ Standard AST Parsing Scans</li>
                                    <li>✓ 5 Reviews per day</li>
                                </ul>
                            </div>
                            <button class="btn-premium btn-premium-secondary w-full btn-price-select">Start Free</button>
                        </div>
                        <div class="glass-panel text-left flex flex-col justify-between border-[#FF3B30]/40 bg-[#161212]/50 relative">
                            <div class="absolute top-4 right-4 badge-premium badge-premium-danger">Popular</div>
                            <div>
                                <h3 class="text-lg font-heading font-bold text-white mb-2">Professional</h3>
                                <div class="text-3xl font-heading font-bold text-white mb-4">$49 <span class="text-xs font-normal text-muted">/ month</span></div>
                                <p class="text-xs text-muted mb-6">For scaling teams that need deep AST context and concurrent agent scans.</p>
                                <ul class="text-xs text-muted gap-3 flex flex-col mb-8">
                                    <li>✓ 10 Active Workspaces</li>
                                    <li>✓ Parallel AI Specialist Agents</li>
                                    <li>✓ Unlimited reviews & API playground</li>
                                    <li>✓ Shared Team Collaboration dashboard</li>
                                </ul>
                            </div>
                            <button class="btn-premium btn-premium-primary w-full btn-price-select">Upgrade to Pro</button>
                        </div>
                        <div class="glass-panel text-left flex flex-col justify-between">
                            <div>
                                <h3 class="text-lg font-heading font-bold text-white mb-2">Enterprise</h3>
                                <div class="text-3xl font-heading font-bold text-white mb-4">Custom</div>
                                <p class="text-xs text-muted mb-6">Full compliance, localized deployments, and custom policy configurations.</p>
                                <ul class="text-xs text-muted gap-3 flex flex-col mb-8">
                                    <li>✓ Unlimited Orgs & Workspaces</li>
                                    <li>✓ Custom LLM prompt configurations</li>
                                    <li>✓ Webhook integrations & Audit logs</li>
                                    <li>✓ SOC 2, ISO 27001 compliance logs</li>
                                </ul>
                            </div>
                            <button class="btn-premium btn-premium-secondary w-full btn-price-select">Contact Sales</button>
                        </div>
                    </div>
                </div>

                <!-- FAQs Section -->
                <div id="faq" class="w-full max-w-4xl text-left mb-32">
                    <h2 class="text-3xl font-heading font-bold mb-12 text-center text-white">Frequently Asked Questions</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 class="text-base font-heading font-bold text-white mb-2">How does the AST Parser work?</h4>
                            <p class="text-xs text-muted leading-relaxed">
                                CodeMind compiles your code into an Abstract Syntax Tree locally inside the FastAPI backend. This tags obvious issues (concatenations, credentials leaks) immediately without sending code to LLMs.
                            </p>
                        </div>
                        <div>
                            <h4 class="text-base font-heading font-bold text-white mb-2">Is my codebase sent to external LLMs?</h4>
                            <p class="text-xs text-muted leading-relaxed">
                                You can configure CodeMind to run local models (e.g. Ollama/Llama) or specify your enterprise OpenAI API keys. No code is stored by third parties.
                            </p>
                        </div>
                        <div>
                            <h4 class="text-base font-heading font-bold text-white mb-2">What is the role of the Supervisor Agent?</h4>
                            <p class="text-xs text-muted leading-relaxed">
                                The Supervisor consolidates responses from the security, performance, and QA agents, filters duplicate warnings, and uses weights to calculate the workspace quality score.
                            </p>
                        </div>
                        <div>
                            <h4 class="text-base font-heading font-bold text-white mb-2">Can I apply fixes automatically?</h4>
                            <p class="text-xs text-muted leading-relaxed">
                                Yes. The Monaco reviews view displays side-by-side git diffs. Clicking "Apply Patch" updates the workspace code automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <footer class="border-t border-white/5 bg-panel py-16 px-8 relative z-10">
                <div class="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-left">
                    <div>
                        <span class="text-base font-heading font-bold text-white mb-4 block">Product</span>
                        <ul class="text-xs text-muted flex flex-col gap-3">
                            <li><a href="#" class="hover:text-white">Features</a></li>
                            <li><a href="#" class="hover:text-white">Pricing</a></li>
                            <li><a href="#" class="hover:text-white">Integrations</a></li>
                            <li><a href="#" class="hover:text-white">Security Specs</a></li>
                        </ul>
                    </div>
                    <div>
                        <span class="text-base font-heading font-bold text-white mb-4 block">Resources</span>
                        <ul class="text-xs text-muted flex flex-col gap-3">
                            <li><a href="#" class="hover:text-white">Documentation</a></li>
                            <li><a href="#" class="hover:text-white">API Playground</a></li>
                            <li><a href="#" class="hover:text-white">Release Logs</a></li>
                            <li><a href="#" class="hover:text-white">Vulnerability DB</a></li>
                        </ul>
                    </div>
                    <div>
                        <span class="text-base font-heading font-bold text-white mb-4 block">Company</span>
                        <ul class="text-xs text-muted flex flex-col gap-3">
                            <li><a href="#" class="hover:text-white">About Us</a></li>
                            <li><a href="#" class="hover:text-white">Careers</a></li>
                            <li><a href="#" class="hover:text-white">Trust Center</a></li>
                            <li><a href="#" class="hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <span class="text-base font-heading font-bold text-white mb-4 block">Legals</span>
                        <ul class="text-xs text-muted flex flex-col gap-3">
                            <li><a href="#" class="hover:text-white">Terms of Service</a></li>
                            <li><a href="#" class="hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" class="hover:text-white">Compliance Docs</a></li>
                            <li><a href="#" class="hover:text-white">Audit Logs</a></li>
                        </ul>
                    </div>
                </div>
                <div class="mx-auto max-w-7xl flex items-center justify-between border-t border-white/5 pt-8 text-xs text-muted">
                    <span>© 2026 CodeMind AI Platform. All rights reserved.</span>
                    <span>System Status: <span class="text-success">● Fully Operational</span></span>
                </div>
            </footer>
        `;

        // Bind interactive events
        document.getElementById("btn-landing-login").addEventListener("click", () => {
            uiState.setViewState("auth");
        });
        document.getElementById("btn-hero-start").addEventListener("click", () => {
            uiState.setViewState("auth");
        });
        document.querySelectorAll(".btn-price-select").forEach(btn => {
            btn.addEventListener("click", () => {
                uiState.setViewState("auth");
            });
        });
        document.getElementById("btn-landing-demo").addEventListener("click", () => {
            // Bypass login directly to demo console
            uiState.setViewState("console");
            uiState.setConsoleView("dashboard");
        });
        document.getElementById("btn-hero-demo").addEventListener("click", () => {
            uiState.setViewState("console");
            uiState.setConsoleView("dashboard");
        });
    }
};
