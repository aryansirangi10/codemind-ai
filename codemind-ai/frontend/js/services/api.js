/* --- BASE API CLIENT SERVICE --- */

import { API_BASE } from '../constants.js';
import { userState } from '../state/userState.js';
import { logger } from '../utils/logger.js';

export async function apiRequest(endpoint, method = 'GET', body = null) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json'
    };

    if (userState.isLoggedIn()) {
        headers['Authorization'] = `Bearer ${userState.token}`;
    }

    const options = {
        method,
        headers
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    logger.debug(`API Request: ${method} ${url}`, body);

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`API Error ${response.status}: ${errBody || response.statusText}`);
        }
        return await response.json();
    } catch (err) {
        logger.error(`API Client Error: ${method} ${url} failed`, err);
        throw err;
    }
}
