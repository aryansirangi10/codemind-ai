/* --- REPOSITORY WORKSPACE SERVICE --- */

import { apiRequest } from './api.js';
import { repoState } from '../state/repoState.js';
import { logger } from '../utils/logger.js';

export const repositoryService = {
    async loadProjects() {
        logger.info("Repository Service: Fetching active workspace repositories...");
        try {
            const data = await apiRequest('/projects/');
            repoState.projects = data.map(p => ({
                id: p.id,
                name: p.name,
                description: p.description,
                stars: p.stars || Math.floor(Math.random() * 200) + 10,
                issues: p.issues || Math.floor(Math.random() * 15),
                contributors: p.contributors || Math.floor(Math.random() * 5) + 1,
                commits: p.commits || Math.floor(Math.random() * 100) + 20,
                health: p.health || (Math.random() > 0.3 ? "Healthy" : "Needs Review"),
                score: p.score || Math.floor(Math.random() * 25) + 75,
                language: p.language || "Python"
            }));
            
            // Set first project as active if none set
            if (repoState.projects.length > 0 && !repoState.activeProject) {
                repoState.setProject(repoState.projects[0]);
            }
            return repoState.projects;
        } catch (err) {
            logger.warn("Repository Service: Backend connection failed. Loading local mock repository listings.", err);
            // Fallback mock repositories
            const mockRepos = [
                { id: 1, name: "Backend API", description: "Core enterprise auth & database scanner engines", stars: 128, issues: 3, contributors: 4, commits: 142, health: "Healthy", score: 92, language: "Python" },
                { id: 2, name: "Mobile Core", description: "iOS and Android client auditing workspace SDK", stars: 45, issues: 8, contributors: 2, commits: 64, health: "Needs Review", score: 74, language: "Dart" },
                { id: 3, name: "Vulnerability Database", description: "Local parser vectors and OWASP security mappings", stars: 89, issues: 0, contributors: 1, commits: 12, health: "Healthy", score: 98, language: "Python" }
            ];
            repoState.projects = mockRepos;
            if (!repoState.activeProject) {
                repoState.setProject(mockRepos[0]);
            }
            return mockRepos;
        }
    },

    async createProject(name, description, language = "Python") {
        logger.info(`Repository Service: Creating repository [${name}]`);
        try {
            const data = await apiRequest('/projects/', 'POST', { name, description, language });
            await this.loadProjects();
            return data;
        } catch (err) {
            // Mock local creation
            const newRepo = {
                id: Date.now(),
                name,
                description,
                stars: 0,
                issues: 0,
                contributors: 1,
                commits: 1,
                health: "Healthy",
                score: 100,
                language
            };
            repoState.projects.push(newRepo);
            repoState.setProject(newRepo);
            return newRepo;
        }
    }
};
