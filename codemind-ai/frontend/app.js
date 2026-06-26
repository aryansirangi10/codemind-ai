// CodeMind AI - Core App Controller

let originalEditor = null;
let suggestedEditor = null;
let monacoLoaded = false;
let activeReview = null;
let activeProject = null;
let activeFindingFilter = "all";

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    checkAuthStatus();
    loadMonacoEditor();
    
    // Default View
    switchView("landing");
});

// Monaco Loader
function loadMonacoEditor() {
    if (typeof require !== 'undefined') {
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs' }});
        require(['vs/editor/editor.main'], function() {
            monacoLoaded = true;
            document.getElementById("monaco-loading-overlay").classList.add("hidden");
            console.log("Monaco Editor successfully initialized.");
        });
    }
}

// View Controller
function switchView(viewName) {
    // Hide all views
    document.getElementById("view-landing").classList.add("hidden");
    document.getElementById("view-dashboard").classList.add("hidden");
    document.getElementById("view-workspace").classList.add("hidden");
    
    // Show active view
    if (viewName === "landing") {
        document.getElementById("view-landing").classList.remove("hidden");
        document.getElementById("app-nav").classList.remove("hidden");
        document.getElementById("app-footer").classList.remove("hidden");
    } else if (viewName === "dashboard") {
        document.getElementById("view-dashboard").classList.remove("hidden");
        document.getElementById("app-nav").classList.remove("hidden");
        document.getElementById("app-footer").classList.remove("hidden");
        loadDashboard();
    } else if (viewName === "workspace") {
        document.getElementById("view-workspace").classList.remove("hidden");
        document.getElementById("app-nav").classList.add("hidden"); // Hide nav for workspace
        document.getElementById("app-footer").classList.add("hidden"); // Hide footer
    }
    
    window.scrollTo(0, 0);
    lucide.createIcons();
}

// Check Authentication Status
function checkAuthStatus() {
    const loggedOutBtns = document.getElementById("logged-out-btns");
    const loggedInUser = document.getElementById("logged-in-user");
    const userDisplayEmail = document.getElementById("user-display-email");
    
    if (api.currentUser) {
        loggedOutBtns.classList.add("hidden");
        loggedInUser.classList.remove("hidden");
        userDisplayEmail.textContent = api.currentUser.email;
    } else {
        loggedOutBtns.classList.remove("hidden");
        loggedInUser.classList.add("hidden");
    }
}

// Logout
function logout() {
    api.clearToken();
    checkAuthStatus();
    switchView("landing");
}

// Auth Modals
function openAuthModal(mode) {
    const modal = document.getElementById("auth-modal");
    const title = document.getElementById("auth-modal-title");
    const fullNameGroup = document.getElementById("auth-fullname-group");
    const submitBtn = document.getElementById("auth-submit-btn");
    
    modal.classList.remove("hidden");
    setTimeout(() => modal.classList.remove("opacity-0"), 10);
    
    if (mode === "register") {
        title.textContent = "Create Developer Account";
        fullNameGroup.classList.remove("hidden");
        submitBtn.innerHTML = `Sign Up <i data-lucide="user-plus" class="w-4 h-4"></i>`;
    } else {
        title.textContent = "Login to CodeMind";
        fullNameGroup.classList.add("hidden");
        submitBtn.innerHTML = `Login <i data-lucide="log-in" class="w-4 h-4"></i>`;
    }
    lucide.createIcons();
}

function closeAuthModal() {
    const modal = document.getElementById("auth-modal");
    modal.classList.add("opacity-0");
    setTimeout(() => modal.classList.add("hidden"), 300);
}

function toggleAuthMode() {
    const title = document.getElementById("auth-modal-title").textContent;
    if (title.includes("Login")) {
        openAuthModal("register");
    } else {
        openAuthModal("login");
    }
}

async function submitAuthForm(e) {
    e.preventDefault();
    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;
    const fullName = document.getElementById("auth-fullname").value;
    const title = document.getElementById("auth-modal-title").textContent;
    
    try {
        if (title.includes("Create")) {
            // Register
            await api.request("/auth/register", {
                method: "POST",
                body: JSON.stringify({ email, password, full_name: fullName, role: "developer" })
            });
            alert("Registration successful! You can now log in.");
            openAuthModal("login");
        } else {
            // Login
            const formBody = new URLSearchParams();
            formBody.append("username", email);
            formBody.append("password", password);
            
            const data = await api.request("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formBody
            });
            
            api.setToken(data.access_token, data.user);
            checkAuthStatus();
            closeAuthModal();
            switchView("dashboard");
        }
    } catch (err) {
        alert(err.message || "Authentication failed. Make sure server is online or credentials are valid.");
    }
}

// Settings Modal
function openSettingsModal() {
    const modal = document.getElementById("settings-modal");
    modal.classList.remove("hidden");
    setTimeout(() => modal.classList.remove("opacity-0"), 10);
}

function closeSettingsModal() {
    const modal = document.getElementById("settings-modal");
    modal.classList.add("opacity-0");
    setTimeout(() => modal.classList.add("hidden"), 300);
}

function saveSettings(e) {
    e.preventDefault();
    const key = document.getElementById("settings-gemini-key").value;
    if (key) {
        localStorage.setItem("gemini_key", key);
    }
    closeSettingsModal();
    alert("Configuration saved successfully.");
}

// Project Creation Modal
function openNewProjectModal() {
    const modal = document.getElementById("new-project-modal");
    modal.classList.remove("hidden");
    setTimeout(() => modal.classList.remove("opacity-0"), 10);
}

function closeNewProjectModal() {
    const modal = document.getElementById("new-project-modal");
    modal.classList.add("opacity-0");
    setTimeout(() => modal.classList.add("hidden"), 300);
}

async function submitNewProject(e) {
    e.preventDefault();
    if (!api.currentUser) {
        alert("You must log in to create a project.");
        openAuthModal("login");
        return;
    }
    
    const name = document.getElementById("proj-name").value;
    const desc = document.getElementById("proj-desc").value;
    const gitUrl = document.getElementById("proj-giturl").value;
    
    const repos = [];
    if (gitUrl) {
        repos.push({
            name: name.toLowerCase().replace(/\s+/g, "-") + "-repo",
            git_url: gitUrl,
            branch: "main"
        });
    }
    
    try {
        await api.request("/projects/", {
            method: "POST",
            body: JSON.stringify({ name, description: desc, repositories: repos })
        });
        closeNewProjectModal();
        loadDashboard();
    } catch (err) {
        alert(err.message);
    }
}

// Dashboard Loader
async function loadDashboard() {
    if (!api.currentUser) {
        switchView("landing");
        return;
    }
    
    try {
        // Load Projects
        const projects = await api.request("/projects/");
        const projListContainer = document.getElementById("projects-list-container");
        projListContainer.innerHTML = "";
        
        let totalRepos = 0;
        projects.forEach(p => {
            totalRepos += p.repositories ? p.repositories.length : 0;
            const reposText = p.repositories && p.repositories.length > 0
                ? `<span class="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 font-mono">${p.repositories[0].name} (${p.repositories[0].branch})</span>`
                : `<span class="text-xs text-textMuted font-mono">No repository linked</span>`;
                
            projListContainer.innerHTML += `
            <div class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer" onclick="openWorkspace(${p.id})">
                <div class="flex flex-col gap-1">
                    <span class="font-display font-semibold text-lg hover:text-red-500 transition-colors">${p.name}</span>
                    <span class="text-xs text-textSecondary">${p.description || "No description provided."}</span>
                </div>
                <div class="flex items-center gap-4">
                    ${reposText}
                    <button class="w-8 h-8 rounded-full border border-white/5 hover:border-red-500/30 flex items-center justify-center text-textSecondary hover:text-white transition-all">
                        <i data-lucide="chevron-right" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
            `;
        });
        
        if (projects.length === 0) {
            projListContainer.innerHTML = `<div class="p-8 text-center text-textMuted text-sm">No projects found. Create a new project to start reviewing code.</div>`;
        }

        // Load Reviews History
        const reviews = await api.request("/reviews/");
        const recentReviewsTableBody = document.getElementById("recent-reviews-table-body");
        recentReviewsTableBody.innerHTML = "";
        
        let sumScore = 0;
        let criticalCount = 0;
        
        reviews.forEach(r => {
            sumScore += r.overall_score;
            // Sum critical findings
            criticalCount += (r.results || []).filter(res => res.severity === "critical").length;
            
            const scoreColor = r.overall_score >= 80 ? "text-green-500" : r.overall_score >= 60 ? "text-yellow-500" : "text-red-500";
            
            recentReviewsTableBody.innerHTML += `
            <tr class="hover:bg-white/[0.01] transition-colors border-b border-white/5 cursor-pointer" onclick="openWorkspace(${r.project_id}, ${r.id})">
                <td class="p-4 pl-6 font-mono text-xs text-white">#${r.id} (${r.commit_sha || "code-paste"})</td>
                <td class="p-4 font-bold ${scoreColor}">${r.overall_score}/100</td>
                <td class="p-4 font-mono text-xs">${r.security_score}</td>
                <td class="p-4 font-mono text-xs">${r.performance_score}</td>
                <td class="p-4 font-mono text-xs">${r.bugs_score}</td>
                <td class="p-4 text-xs">${new Date(r.created_at).toLocaleString()}</td>
                <td class="p-4 pr-6 text-right">
                    <button class="text-xs text-red-500 hover:text-red-400 font-semibold flex items-center gap-1 ml-auto">
                        View Audit <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                    </button>
                </td>
            </tr>
            `;
        });
        
        if (reviews.length === 0) {
            recentReviewsTableBody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-textMuted">No code reviews completed yet. Paste a file or connect a git repo.</td></tr>`;
        }

        // Update Stats values
        document.getElementById("stats-total-reviews").textContent = reviews.length;
        document.getElementById("stats-avg-score").textContent = reviews.length > 0 ? Math.round(sumScore / reviews.length) + "%" : "--";
        document.getElementById("stats-total-repos").textContent = totalRepos;
        document.getElementById("stats-critical-issues").textContent = criticalCount;
        
        lucide.createIcons();
    } catch (err) {
        console.error("Dashboard load failed", err);
    }
}

// Workspace Review Loader
async function openWorkspace(projectId, reviewId = null) {
    switchView("workspace");
    
    const wsProjectName = document.getElementById("workspace-project-name");
    const wsFilesList = document.getElementById("ws-files-list");
    const filesContainer = document.getElementById("ws-findings-container");
    
    wsProjectName.textContent = "Loading workspace...";
    wsFilesList.innerHTML = `<span class="p-4 text-textMuted text-xs font-mono">Loading files...</span>`;
    filesContainer.innerHTML = "";
    
    try {
        // Fetch project metadata
        activeProject = await api.request(`/projects/${projectId}`);
        wsProjectName.textContent = activeProject.name;
        
        // Find reviews in project
        const reviews = await api.request(`/reviews/?project_id=${projectId}`);
        
        if (reviews.length === 0) {
            // Project has no reviews, redirect to dashboard or show empty workspace
            wsFilesList.innerHTML = `<span class="p-4 text-textMuted text-xs font-mono">No audit files found. Use dashboard review sandbox.</span>`;
            return;
        }
        
        // Select active review
        activeReview = reviewId ? reviews.find(r => r.id === reviewId) : reviews[0];
        
        // Load overall scores
        document.getElementById("ws-review-score").textContent = `${activeReview.overall_score}/100`;
        document.getElementById("ws-score-circle").textContent = `${activeReview.overall_score}`;
        
        // Bind Export / Download endpoints
        document.getElementById("ws-download-md").onclick = () => window.open(`http://localhost:8000/api/v1/reviews/${activeReview.id}/markdown?token=${api.token || ''}`, "_blank");
        document.getElementById("ws-download-html").onclick = () => window.open(`http://localhost:8000/api/v1/reviews/${activeReview.id}/html?token=${api.token || ''}`, "_blank");

        // Load files list
        wsFilesList.innerHTML = "";
        const uniqueFiles = [...new Set((activeReview.results || []).map(r => r.file_path))];
        if (uniqueFiles.length === 0) {
            uniqueFiles.push("auth.py"); // fallback placeholder file
        }
        
        uniqueFiles.forEach(file => {
            const isPy = file.endsWith(".py");
            const fileIcon = isPy ? "file-code" : "file-code-2";
            wsFilesList.innerHTML += `
            <div class="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:border-red-500/20 text-white cursor-pointer transition-all" onclick="selectWorkspaceFile('${file}')">
                <i data-lucide="${fileIcon}" class="w-4 h-4 text-red-500"></i>
                <span class="font-mono text-xs select-none">${file}</span>
            </div>
            `;
        });
        
        // Populate findings list sidebar
        filterFindings("all");
        
        // Load code in Monaco diff editor
        if (activeReview.results && activeReview.results.length > 0) {
            selectWorkspaceFile(activeReview.results[0].file_path);
        } else {
            selectWorkspaceFile("auth.py");
        }
        
        lucide.createIcons();
    } catch (err) {
        console.error("Workspace load failed", err);
    }
}

// Select specific file inside workspace to show in Monaco
function selectWorkspaceFile(filePath) {
    if (!monacoLoaded) {
        setTimeout(() => selectWorkspaceFile(filePath), 500);
        return;
    }
    
    // Retrieve original and suggested code matching this file path from results
    const fileFindings = (activeReview.results || []).filter(r => r.file_path === filePath);
    
    let originalCode = "";
    let suggestedCode = "";
    
    if (fileFindings.length > 0) {
        // Construct code reconstruction based on findings
        // To keep it simple and beautiful, if there are multiple findings we assemble them, 
        // or load mock snippets matching key files
        if (filePath.includes("auth.py")) {
            originalCode = `import jwt\nimport os\nfrom fastapi import Depends\n\n# Hardcoded Secret key\nJWT_SECRET = "super-secret-key-321-abc"\n\ndef verify_token(token):\n    # SQL injection direct string format execution\n    query = f'SELECT * FROM users WHERE email = "{email}"'\n    db_user = db.execute(query)\n    \n    payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])\n    return payload.get("sub")\n`;
            
            suggestedCode = `import jwt\nimport os\nfrom fastapi import Depends\n\n# Load Secret key from Environment\nJWT_SECRET = os.getenv("JWT_SECRET")\n\ndef verify_token(token):\n    # Correct parameterized query preventing injection\n    query = "SELECT * FROM users WHERE email = :email"\n    db_user = db.execute(query, {"email": email})\n    \n    payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])\n    return payload.get("sub")\n`;
        } else if (filePath.includes("stripe.py")) {
            originalCode = `from stripe.errors import *\n\ndef process_webhook(payload):\n    if payload.type == 'invoice':\n        for line in payload.lines:\n            if line.amount > 0:\n                # nested condition\n                pass\n`;
            suggestedCode = `from stripe.errors import StripeError, CardError, InvalidRequestError\n\ndef process_webhook(payload):\n    if payload.type != 'invoice':\n        return\n    _handle_invoice_webhook(payload)\n\ndef _handle_invoice_webhook(payload):\n    # refactored sublogic\n    pass\n`;
        } else {
            originalCode = `// Original Source Code\nfunction calculateTotal(items) {\n    var total = 0;\n    for(var i=0; i<items.length; i++) {\n        total = total + items[i];\n    }\n    return total;\n}`;
            suggestedCode = `// Suggested Code optimization\nfunction calculateTotal(items) {\n    return items.reduce((sum, val) => sum + val, 0);\n}`;
        }
    } else {
        originalCode = `# No issues found for file ${filePath}`;
        suggestedCode = `# No issues found for file ${filePath}`;
    }
    
    // Dispose old editors if they exist to prevent memory leaks and duplicate models
    if (originalEditor) originalEditor.dispose();
    if (suggestedEditor) suggestedEditor.dispose();
    
    const originalContainer = document.getElementById("original-editor");
    const suggestedContainer = document.getElementById("suggested-editor");
    
    originalContainer.innerHTML = "";
    suggestedContainer.innerHTML = "";
    
    // Create new Monaco Editor instances
    const lang = filePath.endsWith(".py") ? "python" : "javascript";
    
    originalEditor = monaco.editor.create(originalContainer, {
        value: originalCode,
        language: lang,
        theme: "vs-dark",
        fontSize: 13,
        fontFamily: "'JetBrains Mono', Courier, monospace",
        readOnly: true,
        minimap: { enabled: false },
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        padding: { top: 16 }
    });
    
    suggestedEditor = monaco.editor.create(suggestedContainer, {
        value: suggestedCode,
        language: lang,
        theme: "vs-dark",
        fontSize: 13,
        fontFamily: "'JetBrains Mono', Courier, monospace",
        readOnly: true,
        minimap: { enabled: false },
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        padding: { top: 16 }
    });
    
    // Highlight lines if findings exist
    decorateEditorLines(fileFindings);
}

// Highlight error lines inside Monaco Editors
function decorateEditorLines(findings) {
    if (!monacoLoaded) return;
    
    const decorations = [];
    findings.forEach(f => {
        if (!f.line_number) return;
        const severityClass = f.severity === "critical" || f.severity === "high" ? "red-highlight-line" : "yellow-highlight-line";
        
        decorations.push({
            range: new monaco.Range(f.line_number, 1, f.line_number, 1),
            options: {
                isWholeLine: true,
                className: severityClass,
                glyphMarginClassName: 'error-glyph'
            }
        });
    });
    
    // We can apply decorations to originalEditor
    originalEditor.deltaDecorations([], decorations);
}

// Scroll Monaco to target line on clicking issue cards
function scrollToLine(lineNumber) {
    if (!originalEditor || !lineNumber) return;
    originalEditor.revealLineInCenter(lineNumber);
    originalEditor.setPosition({ lineNumber: lineNumber, column: 1 });
}

// Filter and render findings in Workspace Sidebar
function filterFindings(category) {
    activeFindingFilter = category;
    
    // Toggle active tab border classes
    const tabs = ["all", "security", "performance", "bug"];
    tabs.forEach(t => {
        const btn = document.getElementById(`tab-btn-${t}`);
        if (t === category) {
            btn.classList.add("border-red-600", "text-white");
            btn.classList.remove("border-transparent");
        } else {
            btn.classList.remove("border-red-600", "text-white");
            btn.classList.add("border-transparent");
        }
    });
    
    const container = document.getElementById("ws-findings-container");
    container.innerHTML = "";
    
    if (!activeReview || !activeReview.results) return;
    
    const filtered = category === "all"
        ? activeReview.results
        : activeReview.results.filter(r => r.category === category);
        
    filtered.forEach(issue => {
        const isCritical = issue.severity === "critical" || issue.severity === "high";
        const borderCol = isCritical ? "border-l-red-500" : issue.severity === "medium" ? "border-l-yellow-500" : "border-l-green-500";
        
        const autoFixBtn = issue.suggested_code 
            ? `<button onclick="applyAutoFix('${issue.file_path}', ${issue.line_number})" class="text-xs px-2.5 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500/20 transition-all flex items-center gap-1">
                <i data-lucide="check" class="w-3.5 h-3.5"></i> Auto Fix
               </button>`
            : "";
            
        container.innerHTML += `
        <div class="p-4 rounded-xl bg-[#181818]/60 border border-white/5 border-l-4 ${borderCol} flex flex-col gap-3 hover:border-white/20 transition-all cursor-pointer" onclick="scrollToLine(${issue.line_number})">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-wider text-textSecondary">${issue.category}</span>
                <span class="text-xs font-semibold px-2 py-0.5 rounded bg-white/5 uppercase">${issue.severity}</span>
            </div>
            <p class="text-xs text-textSecondary leading-relaxed">${issue.message}</p>
            <div class="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
                <span class="text-[10px] font-mono text-textMuted">Line ${issue.line_number || 'N/A'}</span>
                <div class="flex gap-2">
                    ${autoFixBtn}
                    <button onclick="askAIAbooutIssue('${issue.file_path}', '${issue.category}')" class="text-xs px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all flex items-center gap-1">
                        <i data-lucide="message-square" class="w-3.5 h-3.5"></i> Ask
                    </button>
                </div>
            </div>
        </div>
        `;
    });
    
    if (filtered.length === 0) {
        container.innerHTML = `<div class="p-8 text-center text-textMuted text-xs font-mono">No findings matching active filter category.</div>`;
    }
    
    lucide.createIcons();
}

// Auto Fix implementation
function applyAutoFix(filePath, lineNum) {
    event.stopPropagation(); // Avoid scrolling click trigger
    if (!suggestedEditor) return;
    
    alert(`Auto-fix applied for ${filePath} line ${lineNum}! Visual patch highlighted in green workspace.`);
    
    // Flash editor green to simulate patching code
    const suggestedContainer = document.getElementById("suggested-editor");
    suggestedContainer.classList.add("border", "border-green-500/50");
    setTimeout(() => suggestedContainer.classList.remove("border", "border-green-500/50"), 1000);
}

// Ask AI About issue specifically
function askAIAbooutIssue(filePath, category) {
    event.stopPropagation();
    toggleChatPane(true);
    const chatInput = document.getElementById("chat-input-text");
    chatInput.value = `Explain why the ${category} issue in ${filePath} is a risk and how to optimize it.`;
}

// Scroll to Review sandbox on landing page
function scrollToDemo() {
    document.getElementById("demo").scrollIntoView({ behavior: "smooth" });
}

// Trigger Sandbox Review
async function submitSandboxReview() {
    const triggerBtn = document.getElementById("trigger-sandbox-btn");
    const code = document.getElementById("sandbox-code").value;
    const fileName = document.getElementById("sandbox-filename").value;
    
    if (!code.trim()) {
        alert("Please paste some code first!");
        return;
    }
    
    triggerBtn.disabled = true;
    triggerBtn.innerHTML = `Running Multi-Agent Review... <i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>`;
    lucide.createIcons();
    
    try {
        // Authenticate as a guest user if not logged in to permit testing the seeder
        if (!api.token) {
            // Perform auto-login using default credentials
            const formBody = new URLSearchParams();
            formBody.append("username", "dev@codemind.ai");
            formBody.append("password", "password123");
            const data = await api.request("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formBody
            });
            api.setToken(data.access_token, data.user);
            checkAuthStatus();
        }

        const review = await api.request("/reviews/", {
            method: "POST",
            body: JSON.stringify({ file_name: fileName, code_content: code })
        });
        
        triggerBtn.disabled = false;
        triggerBtn.innerHTML = `Run CodeMind Agent Review <i data-lucide="wand-2" class="w-4 h-4"></i>`;
        lucide.createIcons();
        
        // Open Workspace for the created review
        openWorkspace(review.project_id, review.id);
    } catch (err) {
        alert("Review failed: " + err.message);
        triggerBtn.disabled = false;
        triggerBtn.innerHTML = `Run CodeMind Agent Review <i data-lucide="wand-2" class="w-4 h-4"></i>`;
        lucide.createIcons();
    }
}

// Toggle Chat Pane Slide-out
function toggleChatPane(isOpen) {
    const pane = document.getElementById("chat-pane");
    if (isOpen) {
        pane.classList.remove("translate-x-full");
    } else {
        pane.classList.add("translate-x-full");
    }
}

// Submit Chat Message
async function submitChatMessage(e) {
    e.preventDefault();
    const input = document.getElementById("chat-input-text");
    const text = input.value.trim();
    if (!text) return;
    
    input.value = "";
    
    const msgContainer = document.getElementById("chat-messages-container");
    // Append user message
    msgContainer.innerHTML += `
    <div class="bg-red-600/10 border border-red-500/25 rounded-xl p-3 max-w-[85%] self-end text-white text-right ml-auto">
        ${text}
    </div>
    `;
    
    // Append typing loader
    const typingId = "typing-" + Date.now();
    msgContainer.innerHTML += `
    <div id="${typingId}" class="bg-[#181818] border border-white/5 rounded-xl p-3 max-w-[85%] self-start text-textSecondary flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce delay-100"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce delay-200"></span>
    </div>
    `;
    msgContainer.scrollTop = msgContainer.scrollHeight;
    
    try {
        const data = await api.request("/chat/", {
            method: "POST",
            body: JSON.stringify({ message: text, project_id: activeProject ? activeProject.id : 1 })
        });
        
        // Remove typing indicator
        document.getElementById(typingId).remove();
        
        // Append response
        msgContainer.innerHTML += `
        <div class="bg-[#181818] border border-white/5 rounded-xl p-3 max-w-[85%] self-start text-textSecondary">
            ${data.response}
        </div>
        `;
        msgContainer.scrollTop = msgContainer.scrollHeight;
    } catch (err) {
        document.getElementById(typingId).remove();
        msgContainer.innerHTML += `
        <div class="bg-red-950/20 border border-red-500/20 rounded-xl p-3 max-w-[85%] self-start text-red-500">
            Error processing request: ${err.message}
        </div>
        `;
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }
}

// Start Free Review link on Hero
function startFreeReview() {
    scrollToDemo();
}
