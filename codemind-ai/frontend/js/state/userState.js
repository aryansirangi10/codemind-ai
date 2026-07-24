/* --- USER SESSION STATE STORE --- */

import { logger } from '../utils/logger.js';
import { eventBus } from '../utils/eventBus.js';

class UserState {
    constructor() {
        this.token = localStorage.getItem("token") || null;
        this.currentUser = JSON.parse(localStorage.getItem("user")) || null;
    }

    setSession(token, user) {
        this.token = token;
        this.currentUser = user;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        logger.info(`User State: Session established for [${user.email}]`);
        eventBus.emit("sessionChanged", { loggedIn: true, user });
    }

    clearSession() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        logger.info("User State: Session cleared");
        eventBus.emit("sessionChanged", { loggedIn: false });
    }

    isLoggedIn() {
        return !!this.token;
    }

    getEmail() {
        return this.currentUser ? this.currentUser.email : "";
    }

    getInitial() {
        const email = this.getEmail();
        return email ? email.charAt(0).toUpperCase() : "D";
    }
}

export const userState = new UserState();
