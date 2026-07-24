/* --- THEME MANAGER MODULE --- */

import { logger } from './utils/logger.js';
import { eventBus } from './utils/eventBus.js';

class ThemeManager {
    constructor() {
        this.currentPreset = localStorage.getItem("theme_preset") || "sunset";
    }

    init() {
        this.apply(this.currentPreset);
    }

    apply(presetName) {
        const root = document.documentElement;
        
        if (presetName === "cyber") {
            // Cyber Midnight (Purple / Teal)
            root.style.setProperty("--bg", "#05050C");
            root.style.setProperty("--panel", "#0E0D1B");
            root.style.setProperty("--border", "rgba(108, 71, 255, 0.2)");
            root.style.setProperty("--accent", "#6C47FF");
            root.style.setProperty("--accent2", "#00E5CC");
            root.style.setProperty("--accent-glow", "rgba(108, 71, 255, 0.35)");
            this.currentPreset = "cyber";
        } else {
            // Sunset Matte Red (Default)
            root.style.setProperty("--bg", "#050505");
            root.style.setProperty("--panel", "#111111");
            root.style.setProperty("--border", "rgba(255, 255, 255, 0.08)");
            root.style.setProperty("--accent", "#6C5CE7");
            root.style.setProperty("--accent2", "#FF6B6B");
            root.style.setProperty("--primary", "#FF3B30");
            root.style.setProperty("--secondary", "#FF6B6B");
            root.style.setProperty("--accent-glow", "rgba(255, 59, 48, 0.15)");
            this.currentPreset = "sunset";
        }
        
        localStorage.setItem("theme_preset", this.currentPreset);
        logger.info(`Theme Preset set to [${this.currentPreset}]`);
        eventBus.emit("themeChanged", this.currentPreset);
    }

    toggle() {
        const next = this.currentPreset === "sunset" ? "cyber" : "sunset";
        this.apply(next);
    }
}

export const themeManager = new ThemeManager();
