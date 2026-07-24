/* --- LOGGING UTILITY WRAPPER --- */

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};

const CURRENT_LEVEL = LOG_LEVELS.INFO;

export const logger = {
    debug(msg, ...args) {
        if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
            console.log(`%c[DEBUG] ${msg}`, 'color: #888888', ...args);
        }
    },
    info(msg, ...args) {
        if (CURRENT_LEVEL <= LOG_LEVELS.INFO) {
            console.log(`%c[INFO] %c${msg}`, 'color: #3B82F6; font-weight: bold', 'color: #FFFFFF', ...args);
        }
    },
    warn(msg, ...args) {
        if (CURRENT_LEVEL <= LOG_LEVELS.WARN) {
            console.warn(`%c[WARN] ${msg}`, 'color: #F59E0B; font-weight: bold', ...args);
        }
    },
    error(msg, ...args) {
        if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) {
            console.error(`%c[ERROR] ${msg}`, 'color: #FF3B30; font-weight: bold', ...args);
        }
    }
};
