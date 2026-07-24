/* --- CODE EXPLORER PANEL --- */

import { repoState } from '../../state/repoState.js';
import { logger } from '../../utils/logger.js';

export const repositoryCodeExplorer = {
    render() {
        const container = document.getElementById("repo-sub-view-code");
        if (!container) return;

        container.innerHTML = `
            <!-- Left Explorer pane -->
            <div class="workspace-panel-sidebar p-4 select-none font-code text-xs text-left">
                <div class="font-heading font-bold text-white uppercase tracking-wider mb-4">Explorer</div>
                <div class="flex flex-col gap-2" id="explorer-files-tree">
                    <!-- Tree items inserted dynamically -->
                </div>
            </div>

            <!-- Right Editor panel -->
            <div class="workspace-panel-editor flex-1 flex flex-col relative">
                <!-- Monaco editor container -->
                <div id="code-explorer-editor-holder" class="flex-1 w-full bg-[#050505] min-h-0">
                    <div class="flex flex-col items-center justify-center h-full text-muted gap-2" id="code-explorer-editor-placeholder">
                        <span class="w-6 h-6 border border-dashed border-white/20 rounded flex items-center justify-center">⌨</span>
                        <span>Select a file from the explorer tree to inspect code</span>
                    </div>
                    <div id="monaco-explorer-editor" class="w-full h-full hidden"></div>
                </div>
            </div>
        `;

        this.renderFilesTree();
    },

    renderFilesTree() {
        const tree = document.getElementById("explorer-files-tree");
        if (!tree) return;

        // Fetch mock files list based on selected project
        const repoName = repoState.activeProject ? repoState.activeProject.name : "Backend API";
        const orgTree = repoState.mockRepoTree[repoState.activeOrg.id] || {};
        const repoData = orgTree[repoName] || {};

        let html = "";
        
        // Recursive tree builder
        const build = (obj, prefix = "") => {
            let res = "";
            for (let key in obj) {
                const fullPath = prefix ? `${prefix}/${key}` : key;
                if (typeof obj[key] === 'object') {
                    // Folder item
                    res += `
                        <div class="flex flex-col gap-1">
                            <div class="flex items-center gap-2 py-1 text-white font-semibold cursor-pointer hover:bg-white/5 px-2 rounded">
                                <span class="text-[10px]">▼</span> 📁 ${key}
                            </div>
                            <div class="pl-4 flex flex-col gap-1 border-l border-white/5 ml-2">
                                ${build(obj[key], fullPath)}
                            </div>
                        </div>
                    `;
                } else {
                    // File item
                    res += `
                        <div class="flex items-center gap-2 py-1 text-muted cursor-pointer hover:text-white hover:bg-white/5 px-2 rounded file-tree-leaf" data-file-path="${fullPath}">
                            📄 ${key}
                        </div>
                    `;
                }
            }
            return res;
        };

        html = build(repoData);
        tree.innerHTML = html || "<div class='text-muted'>No files found</div>";

        // Bind clicks on leaves
        document.querySelectorAll(".file-tree-leaf").forEach(item => {
            item.addEventListener("click", () => {
                document.querySelectorAll(".file-tree-leaf").forEach(el => el.classList.remove("text-white", "bg-white/5"));
                item.classList.add("text-white", "bg-white/5");
                
                const filePath = item.getAttribute("data-file-path");
                repoState.setFile(filePath);
                this.loadCodeInEditor(filePath);
            });
        });
    },

    async loadCodeInEditor(filePath) {
        logger.info(`Code Explorer: Loading ${filePath} inside editor`);
        
        const placeholder = document.getElementById("code-explorer-editor-placeholder");
        const editorDiv = document.getElementById("monaco-explorer-editor");
        
        if (placeholder) placeholder.classList.add("hidden");
        if (editorDiv) editorDiv.classList.remove("hidden");
        
        const code = repoState.getFileContents(filePath);
        
        // Dynamic loading of Monaco editor (Lazy-load pattern)
        if (window.monaco) {
            this.createMonacoInstance(code, filePath);
        } else {
            logger.info("Code Explorer: Monaco not initialized. Dynamic loading library...");
            // Load Monaco from CDN dynamically
            const loaderScript = document.createElement("script");
            loaderScript.src = "https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js";
            loaderScript.onload = () => {
                window.require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
                window.require(['vs/editor/editor.main'], () => {
                    this.createMonacoInstance(code, filePath);
                });
            };
            document.body.appendChild(loaderScript);
        }
    },

    createMonacoInstance(code, filePath) {
        const container = document.getElementById("monaco-explorer-editor");
        if (!container) return;
        
        // Clean previous instance
        container.innerHTML = "";
        
        // Determine language
        let language = "python";
        if (filePath.endsWith(".swift")) language = "swift";
        if (filePath.endsWith(".dart")) language = "dart";
        if (filePath.endsWith(".js")) language = "javascript";
        
        window.explorerEditor = window.monaco.editor.create(container, {
            value: code,
            language,
            theme: 'vs-dark',
            automaticLayout: true,
            fontSize: 13,
            fontFamily: 'JetBrains Mono',
            minimap: { enabled: false },
            lineHeight: 20
        });
    }
};
export default repositoryCodeExplorer;
