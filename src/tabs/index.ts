/**
 * PXM Tabs Component
 * 
 * A simple, accessible tabs component for organizing content into separate panels.
 * Provides keyboard navigation and ARIA support.
 */

import { parseAttributes, setAriaAttributes, setupKeyboardNav, withErrorBoundary, type AttributeSchema } from '../core/component-utils';

const TABS_SCHEMA: AttributeSchema = {
  'data-initial': { type: 'string', default: '' }
};

class PxmTabs extends HTMLElement {
    private config: Record<string, any> = {};
    private _triggersWrap?: HTMLElement;
    private _triggers?: NodeListOf<HTMLElement>;
    private _panels?: NodeListOf<HTMLElement>;

    // Cache DOM queries to avoid repeated selections
    private get triggersWrap(): HTMLElement {
      return this._triggersWrap ??= this.querySelector("pxm-triggers") as HTMLElement;
    }

    private get triggers(): NodeListOf<HTMLElement> {
      return this._triggers ??= this.triggersWrap.querySelectorAll("[data-tab]");
    }

    private get panels(): NodeListOf<HTMLElement> {
      return this._panels ??= this.querySelectorAll("pxm-panel");
    }

    static get observedAttributes(): string[] {
      return Object.keys(TABS_SCHEMA);
    }

    constructor() {
      super();

      // Add minimal required styles
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
    }

    connectedCallback(): void {
      withErrorBoundary(() => {
        this.config = parseAttributes(this, TABS_SCHEMA);
        this.setupTabs();
        this.initializeActiveTab();
      })();
    }

    attributeChangedCallback(_name: string, oldValue: string, newValue: string): void {
      if (oldValue === newValue) return;
      
      this.config = parseAttributes(this, TABS_SCHEMA);
      this.initializeActiveTab();
    }

    private setupTabs(): void {
      // Clear caches to get fresh elements
      this._triggersWrap = undefined;
      this._triggers = undefined;
      this._panels = undefined;

      // Set up tablist role
      setAriaAttributes(this.triggersWrap, { 'role': 'tablist' });

      // Hide all panels initially
      this.panels.forEach((panel: HTMLElement) => {
        setAriaAttributes(panel, { 'aria-hidden': 'true' });
      });

      // Set up triggers
      this.triggers.forEach((trigger: HTMLElement, index: number) => {
        if (!trigger.id) {
          trigger.id = `pxm-tab-${trigger.dataset.tab || index}`;
        }
        
        setAriaAttributes(trigger, { 'role': 'tab' });
        
        // Add click handler
        trigger.addEventListener('click', withErrorBoundary(() => {
          const tabName = trigger.dataset.tab;
          if (tabName) {
            this.activateTab(tabName);
            trigger.focus();
          }
        }));

        // Add keyboard navigation
        setupKeyboardNav(trigger, {
          'ArrowRight': (e) => { e.preventDefault(); this.focusNextTrigger(index); },
          'ArrowDown': (e) => { e.preventDefault(); this.focusNextTrigger(index); },
          'ArrowLeft': (e) => { e.preventDefault(); this.focusPreviousTrigger(index); },
          'ArrowUp': (e) => { e.preventDefault(); this.focusPreviousTrigger(index); },
          'Home': (e) => { e.preventDefault(); this.focusFirstTrigger(); },
          'End': (e) => { e.preventDefault(); this.focusLastTrigger(); },
          'Enter': (e) => { this.handleActivation(e, trigger); },
          ' ': (e) => { this.handleActivation(e, trigger); }
        });
      });

      // Set up panels
      this.panels.forEach((panel: HTMLElement) => {
        setAriaAttributes(panel, { 'role': 'tabpanel' });
        
        const correspondingTrigger = Array.from(this.triggers).find(
          (trigger: HTMLElement) => trigger.dataset.tab === panel.dataset.tab
        );
        
        if (correspondingTrigger) {
          setAriaAttributes(panel, { 'aria-labelledby': correspondingTrigger.id });
        }
      });
    }

    private initializeActiveTab(): void {
      // Activate initial tab if specified, otherwise activate first tab
      const initialTab = this.config['data-initial'] || this.getAttribute('data-initial');
      if (initialTab) {
        this.activateTab(initialTab);
      } else {
        const firstTab = this.triggers[0]?.dataset.tab;
        if (firstTab) {
          this.activateTab(firstTab);
        }
      }
    }

    private handleActivation(_event: KeyboardEvent, trigger: HTMLElement): void {
      const tabName = trigger.dataset.tab;
      if (tabName) {
        this.activateTab(tabName);
      }
    }

    private focusNextTrigger(currentIndex: number): void {
      const newIndex = (currentIndex + 1) % this.triggers.length;
      this.triggers[newIndex].focus();
    }

    private focusPreviousTrigger(currentIndex: number): void {
      const newIndex = (currentIndex - 1 + this.triggers.length) % this.triggers.length;
      this.triggers[newIndex].focus();
    }

    private focusFirstTrigger(): void {
      this.triggers[0].focus();
    }

    private focusLastTrigger(): void {
      this.triggers[this.triggers.length - 1].focus();
    }

    private activateTab(tabName: string): void {
      this.triggers.forEach((trigger: HTMLElement) => {
        if (trigger.dataset.tab === tabName) {
          setAriaAttributes(trigger, { 'aria-selected': 'true' });
          trigger.tabIndex = 0;
        } else {
          setAriaAttributes(trigger, { 'aria-selected': 'false' });
          trigger.tabIndex = -1;
        }
      });

      this.panels.forEach((panel: HTMLElement) => {
        if (panel.dataset.tab === tabName) {
          setAriaAttributes(panel, { 'aria-hidden': 'false' });
        } else {
          setAriaAttributes(panel, { 'aria-hidden': 'true' });
        }
      });
    }
}

// Inject dependencies if requested (for CDN usage)
async function injectTabsDependencies() {
  try {
    const { injectComponentDependencies } = await import('../dependency-injector');
    await injectComponentDependencies('tabs');
  } catch (error) {
    console.warn('Failed to inject tabs dependencies:', error);
  }
}
injectTabsDependencies();

// Define the custom element
customElements.define('pxm-tabs', PxmTabs);

// Make available globally
if (typeof window !== 'undefined') {
  (window as any).PxmTabs = PxmTabs;
}
