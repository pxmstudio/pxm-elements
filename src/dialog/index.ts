/**
 * PXM Dialog Component
 *
 * A flexible, accessible dialog (modal) component inspired by Radix UI Dialog.
 * Bring your own styling and animation. This component provides structure and behavior only.
 *
 * Features:
 * - Keyboard navigation (Escape to close, Tab trap)
 * - Focus management (auto-focus, return focus)
 * - Event-driven animation system (bring your own animation library)
 * - Dynamic content support
 * - ARIA and data attributes for accessibility and styling
 *
 * Basic Usage:
 * ```html
 * <pxm-dialog>
 *   <pxm-dialog-trigger>Open Dialog</pxm-dialog-trigger>
 *   <pxm-dialog-content>
 *     <h2>Dialog Title</h2>
 *     <p>Dialog content goes here...</p>
 *     <button data-close>Close</button>
 *   </pxm-dialog-content>
 * </pxm-dialog>
 * ```
 *
 * Consumer Styling Examples:
 * ```css
 * pxm-dialog-content[data-state="open"] { display: block; }
 * pxm-dialog-content[data-state="closed"] { display: none; }
 * pxm-dialog[data-disabled="true"] { opacity: 0.5; }
 * ```
 *
 * Accessibility:
 * - Manages ARIA attributes (aria-modal, aria-hidden, aria-expanded)
 * - Manages data attributes (data-state, data-disabled)
 * - Consumer should provide labels/roles as needed
 *
 * Events:
 * - `pxm:dialog:before-open` (cancelable)
 * - `pxm:dialog:after-open`
 * - `pxm:dialog:before-close` (cancelable)
 * - `pxm:dialog:after-close`
 *
 * Keyboard:
 * - Escape: Close dialog
 * - Tab: Trap focus within dialog
 */

import { parseAttributes, withErrorBoundary } from '../core/component-utils';

const DIALOG_SCHEMA = {
    disabled: { type: 'boolean' as const, default: false }
};

interface DialogState {
    open: boolean;
    isAnimating: boolean;
}

export interface DialogEventDetail {
    dialog: HTMLElement;
    trigger?: HTMLElement;
    content?: HTMLElement;
    complete?: () => void;
}

class PxmDialog extends HTMLElement {
    private config: Record<string, any> = {};
    private state: DialogState = { open: false, isAnimating: false };
    private trigger?: HTMLElement;
    private content?: HTMLElement;
    private lastFocusedElement?: HTMLElement | null;
    private mutationObserver?: MutationObserver;
    private originalParent?: HTMLElement;
    private originalNextSibling?: Node | null;
    private teleportContainer?: HTMLElement;

    static get observedAttributes() {
        return Object.keys(DIALOG_SCHEMA);
    }

    constructor() {
        super();
    }

    connectedCallback() {
        withErrorBoundary(() => {
            this.config = parseAttributes(this, DIALOG_SCHEMA);
            this.trigger = this.querySelector('pxm-dialog-trigger') as HTMLElement;
            this.content = this.querySelector('pxm-dialog-content') as HTMLElement;
            this.setupTrigger();
            this.setupContent();
            this.setupDialogListeners();
            this.observeChildChanges();
            this.updateState();
        })();
    }

    disconnectedCallback() {
        this.mutationObserver?.disconnect();
        this.removeListeners();
        this.state.isAnimating = false;
        // Return content if it was teleported
        if (this.state.open) {
            this.returnContent();
        }
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;
        this.config = parseAttributes(this, DIALOG_SCHEMA);
        this.updateState();
    }

    private setupTrigger() {
        if (!this.trigger) return;
        this.trigger.addEventListener('click', this.handleTriggerClick);
        this.trigger.setAttribute('aria-haspopup', 'dialog');
        this.trigger.setAttribute('aria-expanded', String(this.state.open));
        this.trigger.setAttribute('data-state', this.state.open ? 'open' : 'closed');
    }

    private setupContent() {
        if (!this.content) return;
        this.content.setAttribute('tabindex', '-1');
        this.content.setAttribute('role', 'dialog');
        this.content.setAttribute('aria-modal', 'true');
        this.content.setAttribute('aria-hidden', String(!this.state.open));
        this.content.setAttribute('data-state', this.state.open ? 'open' : 'closed');
        this.content.setAttribute('data-disabled', String(this.config.disabled));
        this.content.addEventListener('keydown', this.handleKeyDown);
    }

    private observeChildChanges() {
        this.mutationObserver = new MutationObserver(() => {
            // Don't re-query content if it's currently teleported
            if (!this.teleportContainer) {
                this.trigger = this.querySelector('pxm-dialog-trigger') as HTMLElement;
                this.content = this.querySelector('pxm-dialog-content') as HTMLElement;
                this.removeListeners();
                this.setupTrigger();
                this.setupContent();
                this.updateState();
            }
        });
        this.mutationObserver.observe(this, { childList: true, subtree: true });
    }

    private setupDialogListeners() {
        // Listen for data-close clicks on the entire dialog (only when not teleported)
        this.addEventListener('click', this.handleDialogClick);
    }

    private handleDialogClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const closeElement = target.closest('[data-close]');
        if (closeElement) {
            e.preventDefault();
            e.stopPropagation();
            this.closeDialog();
        }
    };

    private handleTriggerClick = (e: Event) => {
        e.preventDefault();
        this.openDialog();
    };

    private removeListeners() {
        this.trigger?.removeEventListener('click', this.handleTriggerClick);
        this.content?.removeEventListener('keydown', this.handleKeyDown);
        this.removeEventListener('click', this.handleDialogClick);
    }

    private openDialog = (e?: Event) => {
        if (this.config.disabled || this.state.open) return;
        
        const beforeEvent = new CustomEvent('pxm:dialog:before-open', {
            detail: { dialog: this, trigger: this.trigger, content: this.content, complete: this.finishOpen },
            cancelable: true
        });
        
        if (!this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented) return;
        
        this.lastFocusedElement = document.activeElement as HTMLElement;
        this.state.open = true;
        this.teleportContent();
        this.updateState();
        // Show content with default styling
        if (this.content) {
            this.content.style.display = 'flex';
        }
        this.content?.focus();
        this.dispatchEvent(new CustomEvent('pxm:dialog:after-open', { detail: { dialog: this, trigger: this.trigger, content: this.content } }));
    };

    private teleportContent() {
        if (!this.content) return;
        
        // Store original position
        this.originalParent = this.content.parentElement as HTMLElement;
        this.originalNextSibling = this.content.nextSibling;
        
        // Create or reuse teleport container
        let container = document.getElementById('pxm-dialog-teleport');
        if (!container) {
            container = document.createElement('div');
            container.id = 'pxm-dialog-teleport';
            document.body.appendChild(container);
        }
        this.teleportContainer = container;
        
        // Move content to teleport container
        container.appendChild(this.content);
        
        // Add click listener to teleported content for data-close
        this.content.addEventListener('click', this.handleDialogClick);
    }

    private returnContent() {
        if (!this.content || !this.originalParent) return;
        
        // Remove click listener from teleported content
        this.content.removeEventListener('click', this.handleDialogClick);
        
        // Return content to original position
        if (this.originalNextSibling) {
            this.originalParent.insertBefore(this.content, this.originalNextSibling);
        } else {
            this.originalParent.appendChild(this.content);
        }
        
        // Clean up
        this.originalParent = undefined;
        this.originalNextSibling = undefined;
        
        // Remove teleport container if empty
        if (this.teleportContainer && this.teleportContainer.children.length === 0) {
            this.teleportContainer.remove();
            this.teleportContainer = undefined;
        }
    }

    private finishOpen = () => {
        this.lastFocusedElement = document.activeElement as HTMLElement;
        this.state.open = true;
        this.teleportContent();
        this.updateState();
        this.content?.focus();
        this.dispatchEvent(new CustomEvent('pxm:dialog:after-open', { detail: { dialog: this, trigger: this.trigger, content: this.content } }));
    };

    private closeDialog = (e?: Event) => {
        if (this.config.disabled || !this.state.open) return;
        
        const beforeEvent = new CustomEvent('pxm:dialog:before-close', {
            detail: { dialog: this, trigger: this.trigger, content: this.content, complete: this.finishClose },
            cancelable: true
        });
        
        if (!this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented) return;
        
        this.state.open = false;
        
        // Update content attributes while it's still teleported
        if (this.content) {
            this.content.setAttribute('aria-hidden', 'true');
            this.content.setAttribute('data-state', 'closed');
            this.content.style.display = 'none';
        }
        
        // Update dialog and trigger attributes
        this.updateState();
        
        // Now return content to original position
        this.returnContent();
        this.dispatchEvent(new CustomEvent('pxm:dialog:after-close', { detail: { dialog: this, trigger: this.trigger, content: this.content } }));
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
    };

    private finishClose = () => {
        this.returnContent();
        this.state.open = false;
        this.updateState();
        this.dispatchEvent(new CustomEvent('pxm:dialog:after-close', { detail: { dialog: this, trigger: this.trigger, content: this.content } }));
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
    };

    private handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            e.stopPropagation();
            this.closeDialog();
        } else if (e.key === 'Tab') {
            this.trapFocus(e);
        }
    };



    private trapFocus(e: KeyboardEvent) {
        if (!this.content) return;
        const focusable = this.content.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (focusable.length === 0) {
            e.preventDefault();
            return;
        }
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    private updateState(fireEvents = true) {
        // ARIA/data attributes for dialog
        this.setAttribute('aria-disabled', String(this.config.disabled));
        this.setAttribute('data-disabled', String(this.config.disabled));
        this.setAttribute('data-state', this.state.open ? 'open' : 'closed');
        if (this.trigger) {
            this.trigger.setAttribute('aria-expanded', String(this.state.open));
            this.trigger.setAttribute('data-state', this.state.open ? 'open' : 'closed');
        }
        if (this.content) {
            this.content.setAttribute('aria-hidden', String(!this.state.open));
            this.content.setAttribute('data-state', this.state.open ? 'open' : 'closed');
            this.content.setAttribute('data-disabled', String(this.config.disabled));
        }
    }

    /**
     * Remove default animation listeners (useful when using custom animation libraries)
     */
    public removeDefaultAnimations(): void {
        // This will be called by GSAP setup to prevent conflicts
        // For now, just a placeholder - dialog doesn't have default animations yet
    }

    // Public API
    public open() { this.openDialog(); }
    public close() { this.closeDialog(); }
    public isOpen() { return this.state.open; }
}

customElements.define('pxm-dialog', PxmDialog);

class PxmDialogTrigger extends HTMLElement {
    constructor() { super(); }
}
customElements.define('pxm-dialog-trigger', PxmDialogTrigger);

class PxmDialogContent extends HTMLElement {
    constructor() { super(); }
}
customElements.define('pxm-dialog-content', PxmDialogContent);

export type { PxmDialog, PxmDialogTrigger, PxmDialogContent };

if (typeof window !== 'undefined') {
    (window as any).PxmDialog = PxmDialog;
    (window as any).PxmDialogTrigger = PxmDialogTrigger;
    (window as any).PxmDialogContent = PxmDialogContent;
} 