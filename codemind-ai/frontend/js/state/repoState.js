/* --- REPOSITORY STATE STORE --- */

import { logger } from '../utils/logger.js';
import { eventBus } from '../utils/eventBus.js';

class RepoState {
    constructor() {
        this.organizations = [
            { id: 'openai', name: 'OpenAI', description: 'Enterprise Workspace' },
            { id: 'personal', name: 'Personal', description: 'Individual projects' },
            { id: 'university', name: 'University', description: 'Academic sandbox' }
        ];
        this.activeOrg = this.organizations[0];
        
        this.projects = [];       // Loaded workspaces
        this.activeProject = null; // Selected Repository
        this.activeReview = null;  // Active audit review session
        this.activeFile = null;    // Selected file path
        
        // Demo mock files tree repository explorer
        this.mockRepoTree = {
            "openai": {
                "Backend API": {
                    "app": {
                        "api": {
                            "auth.py": "def verify_token(token):\n    query = f\"SELECT * FROM users WHERE token = '{token}'\"\n    return db.execute(query)",
                            "review.py": "def parse_ast(code):\n    # TODO: implement AST verification compiler\n    pass"
                        },
                        "core": {
                            "config.py": "VITE_API_URL = 'http://localhost:8000'\nVITE_APP_NAME = 'CodeMind AI'"
                        }
                    },
                    "main.py": "import uvicorn\nfrom fastapi import FastAPI\napp = FastAPI()"
                },
                "Mobile Core": {
                    "ios": {
                        "AppDelegate.swift": "import UIKit\n@main class AppDelegate: UIResponder, UIApplicationDelegate {}"
                    },
                    "lib": {
                        "main.dart": "import 'package:flutter/material.dart';\nvoid main() => runApp(MyApp());"
                    }
                }
            }
        };
    }

    setOrganization(orgId) {
        const found = this.organizations.find(o => o.id === orgId);
        if (found) {
            this.activeOrg = found;
            logger.info(`Repo State: Changed active Organization to [${found.name}]`);
            eventBus.emit("orgChanged", found);
        }
    }

    setProject(proj) {
        this.activeProject = proj;
        logger.info(`Repo State: Changed active Repository to [${proj.name}]`);
        eventBus.emit("projectChanged", proj);
    }

    setReview(rev) {
        this.activeReview = rev;
        logger.info(`Repo State: Selected active Review Session [#${rev.id}]`);
        eventBus.emit("reviewChanged", rev);
    }

    setFile(filePath) {
        this.activeFile = filePath;
        logger.info(`Repo State: Focused on file [${filePath}]`);
        eventBus.emit("fileChanged", filePath);
    }

    getFileContents(filePath) {
        // Return file contents from mock tree
        const repoName = this.activeProject ? this.activeProject.name : "Backend API";
        const tree = this.mockRepoTree[this.activeOrg.id] || {};
        const repoFiles = tree[repoName] || {};
        
        // Helper to search nesting
        const search = (obj, path) => {
            const parts = path.split('/');
            let current = obj;
            for (let part of parts) {
                if (!current || typeof current !== 'object') return null;
                current = current[part];
            }
            return (typeof current === 'string') ? current : null;
        };
        
        return search(repoFiles, filePath) || `# Contents of ${filePath}\n\n# CodeMind AI File Reader.`;
    }
}

export const repoState = new RepoState();
