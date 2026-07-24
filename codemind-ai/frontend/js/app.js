/* --- MAIN ENTRYPOINT & BOOTSTRAPPER --- */

// State & System Imports
import { uiState } from './state/uiState.js';
import { userState } from './state/userState.js';
import { repoState } from './state/repoState.js';
import { themeManager } from './theme.js';
import { router } from './router/router.js';
import { eventBus } from './utils/eventBus.js';
import { logger } from './utils/logger.js';

// Views Imports
import { landingView } from './views/landing.js';
import { authView } from './views/auth.js';
import { dashboardView } from './views/dashboard.js';
import { repositoryView } from './views/repository.js';
import { teamView } from './views/team.js';
import { integrationsView } from './views/integrations.js';
import { playgroundView } from './views/playground.js';
import { billingView } from './views/billing.js';
import { logsView } from './views/logs.js';
import { settingsView } from './views/settings.js';

// Repository Subviews
import { repositoryOverview } from './views/repository/overview.js';
import { repositoryCodeExplorer } from './views/repository/codeExplorer.js';
import { repositoryReviewPanel } from './views/repository/reviewPanel.js';
import { repositorySecurity } from './views/repository/securityPanel.js';
import { repositoryChat } from './ai/chat.js';
import { repositoryAnalytics } from './views/repository/analyticsPanel.js';
import { repositoryReports } from './views/repository/reportsPanel.js';
import { repositorySettings } from './views/repository/settingsPanel.js';

// Navigation Components
import { sidebarComponent } from './components/navigation/sidebar.js';
import { breadcrumbComponent } from './components/navigation/breadcrumb.js';
import { commandCenterComponent } from './components/navigation/commandCenter.js';
import { newProjectModalComponent } from './components/dialogs/newProjectModal.js';
import { toastWidget } from './components/widgets/toast.js';
import { assistantComponent } from './ai/assistant.js';

// Main App Controller
class App {
    init() {
        logger.info("CodeMind AI: Bootstrapping application...");

        // 1. Initialize System systems
        themeManager.init();
        router.init();
        toastWidget.init();

        // 2. Pre-render persistent static components
        sidebarComponent.render();
        breadcrumbComponent.render();
        commandCenterComponent.render();
        newProjectModalComponent.render();
        assistantComponent.render();

        // 3. Render base outer pages
        landingView.render();
        authView.render();

        // 4. Hook lifecycle renders
        this.bindViewListeners();
        this.bindKeyboardShortcuts();
        this.init3DBackgroundCanvas();
        this.initMouseSpotlights();

        // 5. Initial routing check
        if (userState.isLoggedIn()) {
            logger.info("Session found. Entering Console space.");
            uiState.setViewState("console");
            uiState.setConsoleView("dashboard");
        } else {
            logger.info("No active session. Rendering Landing default.");
            uiState.setViewState("landing");
        }
    }

    bindViewListeners() {
        // Console view switches
        eventBus.on("initConsoleView_dashboard", () => dashboardView.render());
        eventBus.on("initConsoleView_repository", () => {
            repositoryView.render();
            // Default to overview subtab on load
            uiState.setRepoSubView(uiState.currentRepoSubView || "overview");
        });
        eventBus.on("initConsoleView_team", () => teamView.render());
        eventBus.on("initConsoleView_integrations", () => integrationsView.render());
        eventBus.on("initConsoleView_playground", () => playgroundView.render());
        eventBus.on("initConsoleView_billing", () => billingView.render());
        eventBus.on("initConsoleView_logs", () => logsView.render());
        eventBus.on("initConsoleView_settings", () => settingsView.render());

        // Repository subtabs switches
        eventBus.on("initRepoSubView_overview", () => repositoryOverview.render());
        eventBus.on("initRepoSubView_code", () => repositoryCodeExplorer.render());
        eventBus.on("initRepoSubView_reviews", () => repositoryReviewPanel.render());
        eventBus.on("initRepoSubView_security", () => repositorySecurity.render());
        eventBus.on("initRepoSubView_chat", () => repositoryChat.render());
        eventBus.on("initRepoSubView_analytics", () => repositoryAnalytics.render());
        eventBus.on("initRepoSubView_reports", () => repositoryReports.render());
        eventBus.on("initRepoSubView_settings", () => repositorySettings.render());

        // Update layouts on workspace project switches
        eventBus.on("projectChanged", () => {
            if (uiState.currentConsoleView === 'repository') {
                repositoryView.render();
                uiState.setRepoSubView("overview");
            }
        });
    }

    bindKeyboardShortcuts() {
        window.addEventListener("keydown", (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                uiState.toggleCommandPalette();
            }
        });
    }

    init3DBackgroundCanvas() {
        // Canvas particle animation representing AST node parser networks
        const canvas = document.getElementById("canvas-ast-network");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const count = 48;

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 2 + 1
            });
        }

        const animate = () => {
            ctx.fillStyle = "rgba(5, 5, 5, 0.2)";
            ctx.fillRect(0, 0, width, height);

            ctx.lineWidth = 0.5;

            // Draw particles & lines
            for (let i = 0; i < count; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                // Bounce borders
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.fillStyle = "rgba(168, 168, 168, 0.15)";
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();

                // Check connections
                for (let j = i + 1; j < count; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 120) {
                        ctx.strokeStyle = `rgba(255, 59, 48, ${0.1 * (1 - dist / 120)})`;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        };

        animate();
    }

    initMouseSpotlights() {
        // Spotlight ambient follow cursor
        document.addEventListener("mousemove", (e) => {
            const x = e.clientX;
            const y = e.clientY;
            document.documentElement.style.setProperty("--mouse-x", `${x}px`);
            document.documentElement.style.setProperty("--mouse-y", `${y}px`);
        });
    }
}

// Bootstrap window loading
if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", () => {
        const app = new App();
        app.init();
    });
} else {
    const app = new App();
    app.init();
}
