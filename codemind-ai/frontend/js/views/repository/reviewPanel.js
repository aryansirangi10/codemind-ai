/* --- AI REVIEWS WORKSPACE PANEL --- */

import { repoState } from '../../state/repoState.js';
import { reviewService } from '../../services/reviewService.js';
import { eventBus } from '../../utils/eventBus.js';
import { logger } from '../../utils/logger.js';

export const repositoryReviewPanel = {
    render() {
        const container = document.getElementById("repo-sub-view-reviews");
        if (!container) return;

        container.innerHTML = `
            <!-- 1. Left explorer tree for target reviews -->
            <div class="workspace-panel-sidebar p-4 select-none font-code text-xs text-left">
                <div class="font-heading font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>Audit Targets</span>
                    <span class="badge-premium badge-premium-accent animate-pulse">Live</span>
                </div>
                <div class="flex flex-col gap-2">
                    <button class="btn-premium btn-premium-primary text-xs h-9 w-full mb-4 justify-center" id="btn-trigger-review-scan">
                        ➔ Run Workspace Scan
                    </button>
                    <div class="flex flex-col gap-1" id="review-files-tree">
                        <div class="py-1 px-2 hover:bg-white/5 rounded text-white cursor-pointer select-none">
                            📄 auth.py <span class="text-[#FF3B30] float-right">●</span>
                        </div>
                        <div class="py-1 px-2 hover:bg-white/5 rounded text-muted cursor-pointer select-none">
                            📄 review.py <span class="text-warning float-right">●</span>
                        </div>
                        <div class="py-1 px-2 hover:bg-white/5 rounded text-muted cursor-pointer select-none">
                            📄 config.py
                        </div>
                    </div>
                </div>
            </div>

            <!-- 2. Center Monaco Diff editor panel -->
            <div class="workspace-panel-editor flex-1 flex flex-col relative min-w-0">
                <!-- Subheader controls -->
                <div class="h-10 border-b border-white/5 px-4 flex items-center justify-between bg-panel/30">
                    <span class="text-xs font-code text-muted" id="review-editor-file-label">auth.py (Original vs Suggested Patch)</span>
                    <div class="flex gap-2">
                        <button class="btn-premium btn-premium-secondary text-[10px] h-7 px-3 hidden" id="btn-review-preview">Preview Diff</button>
                        <button class="btn-premium btn-premium-primary text-[10px] h-7 px-3 hidden" id="btn-review-apply">Apply Patch</button>
                    </div>
                </div>
                
                <div class="flex-1 w-full bg-[#050505] min-h-0 relative">
                    <!-- Placeholder screen -->
                    <div class="flex flex-col items-center justify-center h-full text-muted gap-4" id="review-editor-placeholder">
                        <!-- Custom SVG pipeline map -->
                        <div class="w-full max-w-lg mb-4 flex flex-col items-center">
                            <span class="text-xs font-heading uppercase tracking-widest mb-6">AI Agent Analysis Journey</span>
                            <div id="svg-pipeline-holder" class="w-full h-24">
                                <!-- LangGraph nodes layout SVG -->
                                <svg viewBox="0 0 500 80" class="w-full h-full">
                                    <path d="M 20,40 L 80,40 L 140,40 L 200,40 L 260,40 L 320,40 L 380,40 L 440,40 L 480,40" stroke="rgba(255,255,255,0.06)" stroke-width="2" id="pipeline-svg-path"/>
                                    <path d="M 20,40 L 20,40" stroke="var(--primary)" stroke-width="2" id="pipeline-svg-pulse" fill="none"/>
                                    <circle cx="20" cy="40" r="6" fill="#111" stroke="rgba(255,255,255,0.2)" stroke-width="2" id="node-repo"/>
                                    <circle cx="80" cy="40" r="6" fill="#111" stroke="rgba(255,255,255,0.2)" stroke-width="2" id="node-ast"/>
                                    <circle cx="140" cy="40" r="6" fill="#111" stroke="rgba(255,255,255,0.2)" stroke-width="2" id="node-rag"/>
                                    <circle cx="200" cy="40" r="6" fill="#111" stroke="rgba(255,255,255,0.2)" stroke-width="2" id="node-security"/>
                                    <circle cx="260" cy="40" r="6" fill="#111" stroke="rgba(255,255,255,0.2)" stroke-width="2" id="node-performance"/>
                                    <circle cx="320" cy="40" r="6" fill="#111" stroke="rgba(255,255,255,0.2)" stroke-width="2" id="node-qa"/>
                                    <circle cx="380" cy="40" r="6" fill="#111" stroke="rgba(255,255,255,0.2)" stroke-width="2" id="node-arch"/>
                                    <circle cx="440" cy="40" r="6" fill="#111" stroke="rgba(255,255,255,0.2)" stroke-width="2" id="node-super"/>
                                    <circle cx="480" cy="40" r="6" fill="#111" stroke="rgba(255,255,255,0.2)" stroke-width="2" id="node-report"/>
                                </svg>
                            </div>
                        </div>
                        <span class="text-sm font-code">Click "Run Workspace Scan" to start multi-agent linter pipelines</span>
                    </div>
                    
                    <div id="monaco-diff-container" class="w-full h-full hidden"></div>
                </div>
            </div>

            <!-- 3. Right AI findings detail column -->
            <div class="workspace-panel-reviews p-4 overflow-y-auto select-none font-code text-xs text-left">
                <div class="font-heading font-bold text-white uppercase tracking-wider mb-6">Vulnerability Details</div>
                <div class="flex flex-col gap-4" id="review-findings-list">
                    <div class="text-muted italic">Run scan to view consolidated findings logs.</div>
                </div>
            </div>

            <!-- 4. Far Right timeline logs column -->
            <div class="workspace-panel-timeline p-4 overflow-y-auto font-code text-[11px] text-left">
                <div class="font-heading font-bold text-white uppercase tracking-wider text-xs mb-4">Pipeline Logs</div>
                <div class="flex flex-col gap-3 text-muted" id="pipeline-live-logs">
                    <div class="text-muted italic">Waiting for analysis trigger...</div>
                </div>
            </div>
        `;

        // Bind scan events
        document.getElementById("btn-trigger-review-scan").addEventListener("click", () => this.runScan());
        
        // Listen to progress steps
        eventBus.on("pipelineProgress", (step) => this.logPipelineStep(step));
        eventBus.on("reviewCompleted", (data) => this.renderFindings(data));
    },

    async runScan() {
        const triggerBtn = document.getElementById("btn-trigger-review-scan");
        triggerBtn.disabled = true;
        triggerBtn.innerHTML = "Auditing Code...";
        
        const logsContainer = document.getElementById("pipeline-live-logs");
        if (logsContainer) logsContainer.innerHTML = "";
        
        // Pulse animation start
        const pulse = document.getElementById("pipeline-svg-pulse");
        if (pulse) {
            pulse.setAttribute("d", "M 20,40 L 480,40");
            pulse.style.transition = "stroke-dashoffset 4.8s linear";
            pulse.style.strokeDasharray = "460";
            pulse.style.strokeDashoffset = "460";
            requestAnimationFrame(() => {
                pulse.style.strokeDashoffset = "0";
            });
        }

        const fileCode = repoState.getFileContents("app/api/auth.py");
        await reviewService.runReview(fileCode);
        
        triggerBtn.disabled = false;
        triggerBtn.innerHTML = "➔ Run Workspace Scan";
    },

    logPipelineStep(step) {
        const logsContainer = document.getElementById("pipeline-live-logs");
        if (!logsContainer) return;
        
        // Node green coloring
        const node = document.getElementById(`node-${step.agent}`);
        if (node) {
            node.setAttribute("fill", "var(--success)");
            node.setAttribute("stroke", "var(--success)");
        }

        const log = document.createElement("div");
        log.className = "flex justify-between border-b border-white/5 py-1.5 animate-fade-in";
        log.innerHTML = `
            <span>● ${step.msg}</span>
            <span class="text-success">✓ Done</span>
        `;
        logsContainer.appendChild(log);
        logsContainer.scrollTop = logsContainer.scrollHeight;
    },

    renderFindings(data) {
        const list = document.getElementById("review-findings-list");
        if (!list) return;

        list.innerHTML = data.findings.map(f => `
            <div class="glass-panel p-4 flex flex-col gap-2 border-l-2 ${f.severity === 'critical' ? 'border-[#FF3B30]' : 'border-[#F59E0B]'} bg-[#161212]/10 hover:border-white/20 transition-colors cursor-pointer finding-alert-item" data-finding-id="${f.id}">
                <div class="flex items-center justify-between">
                    <span class="badge-premium ${f.severity === 'critical' ? 'badge-premium-danger' : 'badge-premium-warning'}">${f.severity}</span>
                    <span class="text-muted font-bold">${f.cwe}</span>
                </div>
                <div class="font-heading font-bold text-white text-xs mb-1">${f.title}</div>
                <div class="text-[10px] text-muted mb-2">${f.file}:${f.line}</div>
                <div class="text-[10px] text-muted">OWASP: ${f.owasp}</div>
            </div>
        `).join('');

        // Bind clicks on findings to show Monaco Diff and show buttons
        document.querySelectorAll(".finding-alert-item").forEach(item => {
            item.addEventListener("click", () => {
                const id = parseInt(item.getAttribute("data-finding-id"));
                const finding = data.findings.find(f => f.id === id);
                if (finding) {
                    this.loadDiffEditor(finding);
                }
            });
        });

        // Focus the first finding automatically
        if (data.findings.length > 0) {
            this.loadDiffEditor(data.findings[0]);
        }
    },

    loadDiffEditor(finding) {
        logger.info(`Reviews Panel: Showing diff comparison for [${finding.title}]`);
        
        document.getElementById("review-editor-placeholder").classList.add("hidden");
        document.getElementById("monaco-diff-container").classList.remove("hidden");
        
        // Show buttons
        const previewBtn = document.getElementById("btn-review-preview");
        const applyBtn = document.getElementById("btn-review-apply");
        previewBtn.classList.remove("hidden");
        applyBtn.classList.remove("hidden");
        
        // Clean previous bindings
        const newApplyBtn = applyBtn.cloneNode(true);
        applyBtn.parentNode.replaceChild(newApplyBtn, applyBtn);
        
        newApplyBtn.addEventListener("click", () => {
            eventBus.emit("toastAlert", { title: "Patch Applied", desc: `Modified target code inside ${finding.file}`, type: "success" });
            newApplyBtn.innerHTML = "Applied";
            newApplyBtn.disabled = true;
        });

        // Initialize Monaco Diff Editor
        if (window.monaco) {
            this.createMonacoDiff(finding);
        } else {
            // Load Monaco from CDN dynamically
            const loaderScript = document.createElement("script");
            loaderScript.src = "https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js";
            loaderScript.onload = () => {
                window.require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
                window.require(['vs/editor/editor.main'], () => {
                    this.createMonacoDiff(finding);
                });
            };
            document.body.appendChild(loaderScript);
        }
    },

    createMonacoDiff(finding) {
        const container = document.getElementById("monaco-diff-container");
        if (!container) return;
        
        container.innerHTML = "";
        
        const originalModel = window.monaco.editor.createModel(finding.original, "python");
        const modifiedModel = window.monaco.editor.createModel(finding.suggested, "python");
        
        window.diffEditor = window.monaco.editor.createDiffEditor(container, {
            theme: 'vs-dark',
            automaticLayout: true,
            fontSize: 13,
            fontFamily: 'JetBrains Mono',
            readOnly: true,
            lineHeight: 20
        });
        
        window.diffEditor.setModel({
            original: originalModel,
            modified: modifiedModel
        });
    }
};
export default repositoryReviewPanel;
