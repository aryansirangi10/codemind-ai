/* --- DECOUPLED EVENT BUS --- */

import { logger } from './logger.js';

class EventBus {
    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
        logger.debug(`Event Bus: Registered listener for [${event}]`);
        
        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        logger.debug(`Event Bus: Removed listener for [${event}]`);
    }

    emit(event, data) {
        if (!this.listeners[event]) return;
        logger.info(`Event Bus: Emitting [${event}]`, data);
        this.listeners[event].forEach(callback => {
            try {
                callback(data);
            } catch (err) {
                logger.error(`Event Bus: Callback failure on [${event}]`, err);
            }
        });
    }
}

export const eventBus = new EventBus();
