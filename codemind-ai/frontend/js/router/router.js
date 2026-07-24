/* --- ROUTING & VIEW CONTROLLER --- */

import { uiState } from '../state/uiState.js';
import { repoState } from '../state/repoState.js';
import { logger } from '../utils/logger.js';
import { eventBus } from '../utils/eventBus.js';

class Router {
    constructor() {
        this.viewSections = ["landing", "auth", "console"];
    }

    init() {
        // Listen to state changes
        eventBus.on("viewChanged", ({ view }) => this.renderMainView(view));
        eventBus.on("consoleViewChanged", ({ consoleView }) => this.renderConsoleView(consoleView));
        eventBus.on("repoSubViewChanged", ({ subView }) => this.renderRepoSubView(subView));
    }

    navigate(view) {
        uiState.setViewState(view);
    }

    navigateConsole(consoleView) {
        uiState.setConsoleView(consoleView);
    }

    navigateRepoSubView(subView) {
        uiState.setRepoSubView(subView);
    }

    renderMainView(view) {
        logger.info(`Router: Routing to main view [${view}]`);
        
        this.viewSections.forEach(id => {
            const el = document.getElementById(`view-${id}`);
            if (el) {
                el.classList.add("hidden");
                el.classList.remove("active");
            }
        });

        const target = document.getElementById(`view-${view}`);
        if (target) {
            target.classList.remove("hidden");
            // Simple requestAnimationFrame trigger for CSS transitions
            requestAnimationFrame(() => {
                target.classList.add("active");
            });
        }
        
        // Hide/Show sidebar console wrapper elements
        const consoleWrapper = document.getElementById("console-layout");
        if (view === "console") {
            consoleWrapper.classList.remove("hidden");
        } else {
            consoleWrapper.classList.add("hidden");
        }
    }

    renderConsoleView(consoleView) {
        logger.info(`Router: Routing console workspace to [${consoleView}]`);
        
        // Hide all main console pages
        document.querySelectorAll(".console-page-view").forEach(el => {
            el.classList.add("hidden");
        });
        
        const target = document.getElementById(`console-view-${consoleView}`);
        if (target) {
            target.classList.remove("hidden");
        }

        // Highlight sidebar items
        document.querySelectorAll(".sidebar-nav-item").forEach(el => {
            el.classList.remove("active");
            if (el.getAttribute("data-view") === consoleView) {
                el.classList.add("active");
            }
        });

        // Trigger view specific initialization
        eventBus.emit(`initConsoleView_${consoleView}`);
        this.updateBreadcrumbs();
    }

    renderRepoSubView(subView) {
        logger.info(`Router: Routing repo workspace sub-tab to [${subView}]`);
        
        document.querySelectorAll(".repo-sub-view").forEach(el => {
            el.classList.add("hidden");
        });
        
        const target = document.getElementById(`repo-sub-view-${subView}`);
        if (target) {
            target.classList.remove("hidden");
        }

        // Highlight sub-tab headers
        document.querySelectorAll(".repo-sub-tab").forEach(el => {
            el.classList.remove("active");
            if (el.getAttribute("data-sub-view") === subView) {
                el.classList.add("active");
            }
        });

        eventBus.emit(`initRepoSubView_${subView}`);
        this.updateBreadcrumbs();
    }

    updateBreadcrumbs() {
        const orgBreadcrumb = document.getElementById("breadcrumb-org");
        const repoBreadcrumb = document.getElementById("breadcrumb-repo");
        const subViewBreadcrumb = document.getElementById("breadcrumb-subview");
        
        if (orgBreadcrumb) orgBreadcrumb.textContent = repoState.activeOrg.name;
        
        if (uiState.currentConsoleView === 'repository') {
            if (repoBreadcrumb) {
                repoBreadcrumb.classList.remove("hidden");
                repoBreadcrumb.querySelector("span").textContent = repoState.activeProject ? repoState.activeProject.name : "Select Repository";
            }
            if (subViewBreadcrumb) {
                subViewBreadcrumb.classList.remove("hidden");
                subViewBreadcrumb.querySelector("span").textContent = uiState.currentRepoSubView.charAt(0).toUpperCase() + uiState.currentRepoSubView.slice(1);
            }
        } else {
            if (repoBreadcrumb) repoBreadcrumb.classList.add("hidden");
            if (subViewBreadcrumb) {
                subViewBreadcrumb.classList.remove("hidden");
                subViewBreadcrumb.querySelector("span").textContent = uiState.currentConsoleView.charAt(0).toUpperCase() + uiState.currentConsoleView.slice(1);
            }
        }
    }
}

export const router = new Router();
export default router;
