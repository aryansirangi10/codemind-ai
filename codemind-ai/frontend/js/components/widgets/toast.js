/* --- TOAST NOTIFICATIONS COMPONENT --- */

import { eventBus } from '../../utils/eventBus.js';

export const toastWidget = {
    init() {
        let container = document.getElementById("toast-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "toast-container";
            container.className = "flex flex-col gap-3 font-code text-xs";
            container.style.position = "fixed";
            container.style.bottom = "24px";
            container.style.right = "24px";
            container.style.zIndex = "1000";
            container.style.pointerEvents = "none";
            document.body.appendChild(container);
        }

        // Register global listener
        eventBus.on("toastAlert", ({ title, desc = "", type = "info" }) => {
            this.show(title, desc, type);
        });
    },

    show(title, desc, type) {
        const container = document.getElementById("toast-container");
        if (!container) return;

        const el = document.createElement("div");
        el.className = "glass-panel p-4 flex flex-col gap-1 border-l-4 animate-fade-in";
        el.style.width = "280px";
        el.style.pointerEvents = "auto";
        el.style.background = "rgba(17, 17, 17, 0.9)";
        
        if (type === "success") el.classList.add("border-success");
        else if (type === "danger") el.classList.add("border-danger");
        else if (type === "warning") el.classList.add("border-warning");
        else el.classList.add("border-info");

        el.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="font-bold text-white">${title}</span>
                <button class="text-muted hover:text-white text-[10px] btn-close-toast">✕</button>
            </div>
            ${desc ? `<div class="text-[10px] text-muted leading-relaxed">${desc}</div>` : ""}
        `;

        container.appendChild(el);

        // Bind close button
        el.querySelector(".btn-close-toast").addEventListener("click", () => {
            el.remove();
        });

        // Auto remove
        setTimeout(() => {
            el.style.opacity = "0";
            el.style.transform = "translateY(8px)";
            el.style.transition = "opacity 300ms ease, transform 300ms ease";
            setTimeout(() => el.remove(), 300);
        }, 3000);
    }
};
export default toastWidget;
