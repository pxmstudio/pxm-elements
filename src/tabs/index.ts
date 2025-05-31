class PxmTabs extends HTMLElement {
    private triggersWrap: HTMLElement;
    private triggers: NodeListOf<HTMLElement>;
    private panels: NodeListOf<HTMLElement>;

    constructor() {
        super();

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            pxm-panel {
                display: none;
            }
            pxm-panel[aria-hidden="false"] {
                display: block;
            }
        `;
        this.appendChild(style);

        this.triggersWrap = this.querySelector("pxm-triggers") as HTMLElement;
        this.triggers = this.triggersWrap.querySelectorAll("[data-tab]");
        this.panels = this.querySelectorAll("pxm-panel");
    }

    connectedCallback() {
        this.triggersWrap.setAttribute("role", "tablist");

        // First hide all panels
        this.panels.forEach((panel: HTMLElement) => {
            panel.setAttribute("aria-hidden", "true");
        });

        this.triggers.forEach((trigger: HTMLElement) => {
            trigger.setAttribute("role", "tab");
            if (!trigger.id) {
                trigger.id = `pxm-tab-${trigger.dataset.tab}`;
            }
            trigger.addEventListener("click", this.handleTriggerClick);
            trigger.addEventListener("keydown", this.handleKeyDown);
        });

        this.panels.forEach((panel: HTMLElement) => {
            panel.setAttribute("role", "tabpanel");
            const correspondingTrigger = Array.from(this.triggers).find(
                (trigger: HTMLElement) => trigger.dataset.tab === panel.dataset.tab
            );
            if (correspondingTrigger) {
                panel.setAttribute("aria-labelledby", correspondingTrigger.id);
            }
        });

        // Activate initial tab if specified, otherwise activate first tab
        const initialTab = this.dataset.initial;
        if (initialTab) {
            this.activateTab(initialTab);
        } else {
            const firstTab = this.triggers[0].dataset.tab;
            if (firstTab) {
                this.activateTab(firstTab);
            }
        }
    }

    private handleTriggerClick = (event: MouseEvent) => {
        const target = event.currentTarget as HTMLElement;
        const tabName = target.dataset.tab;
        if (tabName) {
            this.activateTab(tabName);
            target.focus();
        }
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        const target = event.currentTarget as HTMLElement;
        const { key } = event;
        const currentIndex = Array.from(this.triggers).indexOf(target);
        let newIndex: number | null = null;

        if (key === "ArrowRight" || key === "ArrowDown") {
            newIndex = (currentIndex + 1) % this.triggers.length;
        } else if (key === "ArrowLeft" || key === "ArrowUp") {
            newIndex = (currentIndex - 1 + this.triggers.length) % this.triggers.length;
        } else if (key === "Home") {
            newIndex = 0;
        } else if (key === "End") {
            newIndex = this.triggers.length - 1;
        } else if (key === "Enter" || key === " ") {
            const tabName = target.dataset.tab;
            if (tabName) {
                this.activateTab(tabName);
            }
            return;
        }

        if (newIndex !== null) {
            event.preventDefault();
            this.triggers[newIndex].focus();
        }
    }

    private activateTab(tabName: string) {
        this.triggers.forEach((trigger: HTMLElement) => {
            if (trigger.dataset.tab === tabName) {
                trigger.setAttribute("aria-selected", "true");
                trigger.tabIndex = 0;
            } else {
                trigger.setAttribute("aria-selected", "false");
                trigger.tabIndex = -1;
            }
        });

        this.panels.forEach((panel: HTMLElement) => {
            if (panel.dataset.tab === tabName) {
                panel.setAttribute("aria-hidden", "false");
            } else {
                panel.setAttribute("aria-hidden", "true");
            }
        });
    }
}

customElements.define("pxm-tabs", PxmTabs);
