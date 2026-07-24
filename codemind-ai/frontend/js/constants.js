/* --- SYSTEM CONSTANTS & CONFIGURATIONS --- */

export const ReviewStates = {
    QUEUED: 'Queued',
    RUNNING: 'Running',
    NEEDS_REVIEW: 'Needs Review',
    FIX_APPLIED: 'Fix Applied',
    VERIFIED: 'Verified',
    COMPLETED: 'Completed'
};

export const Severities = {
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
    INFO: 'info'
};

export const UserRoles = {
    OWNER: 'Organization Owner',
    ADMIN: 'Admin',
    REVIEWER: 'Reviewer',
    DEVELOPER: 'Developer',
    VIEWER: 'Viewer'
};

export const API_BASE = "http://localhost:8000/api/v1";

export const FeatureFlags = {
    AI_CHAT: true,
    API_PLAYGROUND: true,
    ANALYTICS: true,
    SKELETON_LOADERS: true,
    ORGANIZATIONS: true
};

export const MOCK_NOTIFICATIONS = [
    { id: 1, title: "Security Review Complete", desc: "Backend API review completed successfully.", type: "success" },
    { id: 2, title: "Critical Vulnerability Found", desc: "SQL injection warning flagged inside auth.py.", type: "danger" },
    { id: 3, title: "New Workspace Created", desc: "OpenAI > Node API project initialized.", type: "info" },
    { id: 4, title: "Agent Execution Failed", desc: "Performance agent timed out loading references.", type: "warning" }
];
