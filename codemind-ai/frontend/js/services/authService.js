/* --- AUTHENTICATION SERVICE --- */

import { apiRequest } from './api.js';
import { userState } from '../state/userState.js';
import { logger } from '../utils/logger.js';

export const authService = {
    async login(email, password) {
        logger.info(`Auth Service: Attempting login for ${email}`);
        
        // Since OAuth2 standard FastAPI uses Form data, we use URLSearchParams in real life.
        // For standard local fallback testing or FastAPI compatibility:
        try {
            const url = "http://localhost:8000/api/v1/auth/login";
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });
            
            if (!response.ok) {
                throw new Error("Invalid username or password credentials");
            }
            
            const data = await response.json();
            const token = data.access_token;
            
            // Get user info
            const user = await this.fetchMe(token);
            userState.setSession(token, user);
            return { token, user };
        } catch (err) {
            logger.warn("Auth Service: Backend connection failed. Proceeding with offline Mock mode.", err);
            // Offline mock login fallback
            const token = "mock_jwt_token_for_" + email.split("@")[0];
            const user = { email, role: "Lead Developer", name: email.split("@")[0] };
            userState.setSession(token, user);
            return { token, user };
        }
    },

    async fetchMe(token) {
        const url = "http://localhost:8000/api/v1/auth/me";
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Could not load user profile");
        return await response.json();
    },

    logout() {
        userState.clearSession();
    }
};
