/* --- AUTHENTICATION VIEW TEMPLATE --- */

import { uiState } from '../state/uiState.js';
import { authService } from '../services/authService.js';
import { logger } from '../utils/logger.js';
import { eventBus } from '../utils/eventBus.js';

export const authView = {
    render() {
        const container = document.getElementById("view-auth");
        if (!container) return;

        container.innerHTML = `
            <div class="flex min-h-screen w-full relative">
                <!-- Ambient blur -->
                <div class="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF3B30]/5 blur-[120px] rounded-full pointer-events-none"></div>

                <!-- Left Column (Branding & Tagline) -->
                <div class="hidden lg:flex w-1/2 bg-black border-r border-white/5 flex-col justify-between p-12 relative z-10 text-left">
                    <div class="flex items-center gap-3 cursor-pointer" id="btn-auth-back-home">
                        <div class="w-8 h-8 rounded-md bg-gradient-to-tr from-[#FF3B30] to-[#FF6B6B] flex items-center justify-center font-bold font-heading text-white">C</div>
                        <span class="text-xl font-logo select-none text-white">CodeMind <span class="text-gradient-primary">AI</span></span>
                    </div>

                    <div class="max-w-md">
                        <h2 class="text-4xl font-heading font-bold mb-4 text-white leading-tight">Every line.<br>Audited. Explained.</h2>
                        <p class="text-sm text-muted leading-relaxed">
                            Continuous static parsing and parallel AI specialist analysis unified inside a single platform interface.
                        </p>
                    </div>

                    <div class="text-xs text-muted">
                        © 2026 CodeMind AI Platform. Security compliant.
                    </div>
                </div>

                <!-- Right Column (Authentication Form Card) -->
                <div class="flex-1 flex items-center justify-center p-8 bg-[#050505] relative z-10">
                    <div class="w-full max-w-sm glass-panel text-left">
                        <h3 class="text-2xl font-heading font-bold mb-2 text-white">Sign In</h3>
                        <p class="text-xs text-muted mb-6">Enter your details to access the auditing workspace.</p>

                        <form id="form-auth-login" class="flex flex-col gap-4">
                            <div class="flex flex-col gap-1.5">
                                <label for="login-email" class="text-xs font-semibold text-muted">Email Address</label>
                                <input type="email" id="login-email" required placeholder="dev@codemind.ai" value="dev@codemind.ai"
                                    class="w-full h-10 px-3 bg-[#0c0c0c] border border-white/5 rounded-md text-sm text-white focus:outline-none focus:border-[#FF3B30]/40 transition-colors">
                            </div>

                            <div class="flex flex-col gap-1.5 mb-2">
                                <div class="flex items-center justify-between">
                                    <label for="login-password" class="text-xs font-semibold text-muted">Password</label>
                                    <a href="#" class="text-xs text-gradient-primary hover:underline">Forgot password?</a>
                                </div>
                                <input type="password" id="login-password" required placeholder="••••••••" value="password123"
                                    class="w-full h-10 px-3 bg-[#0c0c0c] border border-white/5 rounded-md text-sm text-white focus:outline-none focus:border-[#FF3B30]/40 transition-colors">
                            </div>

                            <button type="submit" class="btn-premium btn-premium-primary h-10 rounded-md font-semibold mt-2">
                                Authenticate & Enter
                            </button>
                        </form>

                        <div class="text-center mt-6 text-xs text-muted">
                            New to CodeMind? <a href="#" class="text-gradient-primary font-semibold hover:underline">Request account access</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind form event
        document.getElementById("form-auth-login").addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            
            try {
                await authService.login(email, password);
                eventBus.emit("toastAlert", { title: "Authenticated", desc: `Welcome back ${email}!`, type: "success" });
                uiState.setViewState("console");
                uiState.setConsoleView("dashboard");
            } catch (err) {
                eventBus.emit("toastAlert", { title: "Auth Error", desc: err.message, type: "danger" });
            }
        });

        document.getElementById("btn-auth-back-home").addEventListener("click", () => {
            uiState.setViewState("landing");
        });
    }
};
