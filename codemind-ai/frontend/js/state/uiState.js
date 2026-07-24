/* --- UI INTERACTION STATE STORE --- */

import { logger } from '../utils/logger.js';
import { eventBus } from '../utils/eventBus.js';

class UIState {
    constructor() {
        this.currentView = 'landing';         // 'landing', 'auth', 'console'
        this.currentConsoleView = 'dashboard'; // 'dashboard', 'repository', 'team', 'integrations', etc.
        this.currentRepoSubView = 'overview'; // 'overview', 'code', 'reviews', 'security', 'analytics', 'reports', 'settings'
        this.commandPaletteOpen = false;
        this.assistantOpen = false;
        this.settingsModalOpen = false;
        this.newProjectModalOpen = false;
    }

    setViewState(view) {
        this.currentView = view;
        logger.info(`UI State: Main View set to [${view}]`);
        eventBus.emit("viewChanged", { view });
    }

    setConsoleView(consoleView) {
        this.currentConsoleView = consoleView;
        logger.info(`UI State: Console View set to [${consoleView}]`);
        eventBus.emit("consoleViewChanged", { consoleView });
    }

    setRepoSubView(subView) {
        this.currentRepoSubView = subView;
        logger.info(`UI State: Repository Sub-View set to [${subView}]`);
        eventBus.emit("repoSubViewChanged", { subView });
    }

    toggleCommandPalette(force) {
        this.commandPaletteOpen = (force !== undefined) ? force : !this.commandPaletteOpen;
        eventBus.emit("commandPaletteToggled", this.commandPaletteOpen);
    }

    toggleAssistant(force) {
        this.assistantOpen = (force !== undefined) ? force : !this.assistantOpen;
        eventBus.emit("assistantToggled", this.assistantOpen);
    }
}

export const uiState = new UIState();
