/**
 * PXM Tabs Component
 * 
 * A flexible, accessible tabs component for organizing content into separate panels.
 * Bring your own animation library (GSAP, Anime.js, etc.) or use CSS transitions.
 * This component provides structure and behavior only - all styling is controlled by your CSS.
 * 
 * Features:
 * - Keyboard navigation with arrow keys, Home/End support
 * - Dynamic content support (tabs can be added/removed after initialization)
 * - Event-driven animation system (bring your own animation library)
 * - State synchronization with DOM attributes
 * - Initial tab selection via initial attribute
 * 
 * Keyboard Navigation:
 * - `Enter` or `Space` - Activate current tab
 * - `ArrowLeft` / `ArrowUp` - Focus previous tab
 * - `ArrowRight` / `ArrowDown` - Focus next tab  
 * - `Home` - Focus first tab
 * - `End` - Focus last tab
 * 
 * Basic Usage:
 * ```html
 * <pxm-tabs initial="tab2">
 *   <pxm-triggers>
 *     <button data-tab="tab1">Tab 1</button>
 *     <button data-tab="tab2">Tab 2</button>
 *     <button data-tab="tab3">Tab 3</button>
 *   </pxm-triggers>
 *   <pxm-panel data-tab="tab1">
 *     <h2>Panel 1 Content</h2>
 *     <p>Content for tab 1...</p>
 *   </pxm-panel>
 *   <pxm-panel data-tab="tab2">
 *     <h2>Panel 2 Content</h2>
 *     <p>Content for tab 2...</p>
 *   </pxm-panel>
 *   <pxm-panel data-tab="tab3">
 *     <h2>Panel 3 Content</h2>
 *     <p>Content for tab 3...</p>
 *   </pxm-panel>
 * </pxm-tabs>
 * ```
 * 
 * Dynamic Content:
 * ```javascript
 * // Tabs can be added/removed dynamically
 * const tabs = document.querySelector('pxm-tabs');
 * const newTrigger = document.createElement('button');
 * newTrigger.setAttribute('data-tab', 'new-tab');
 * newTrigger.textContent = 'New Tab';
 * tabs.querySelector('pxm-triggers').appendChild(newTrigger);
 * 
 * const newPanel = document.createElement('pxm-panel');
 * newPanel.setAttribute('data-tab', 'new-tab');
 * newPanel.innerHTML = '<p>New content</p>';
 * tabs.appendChild(newPanel);
 * 
 * // Listen for dynamic changes
 * tabs.addEventListener('pxm:tabs:tabs-changed', (e) => {
 *   console.log(`Tabs now has ${e.detail.tabCount} tabs`);
 * });
 * ```
 * 
 * With Animation Library (via events - recommended for CDN):
 * ```javascript
 * const tabs = document.querySelector('pxm-tabs');
 * 
 * tabs.addEventListener('pxm:tabs:before-show', (e) => {
 *   const { panel, tabName } = e.detail;
 *   e.preventDefault(); // Take over the animation
 *   
 *   gsap.fromTo(panel, 
 *     { opacity: 0, y: 20 }, 
 *     { opacity: 1, y: 0, duration: 0.3, onComplete: () => {
 *       e.detail.complete(); // Signal animation complete
 *     }}
 *   );
 * });
 * 
 * tabs.addEventListener('pxm:tabs:before-hide', (e) => {
 *   const { panel, tabName } = e.detail;
 *   e.preventDefault(); // Take over the animation
 *   
 *   gsap.to(panel, { 
 *     opacity: 0, 
 *     y: -20, 
 *     duration: 0.3, 
 *     onComplete: () => {
 *       e.detail.complete(); // Signal animation complete
 *     }
 *   });
 * });
 * ```
 * 
 * With CSS Transitions (default):
 * ```css
 * pxm-panel {
 *   transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
 * }
 * 
 * /* ✅ DO: Style based on data attributes *\/
 * pxm-panel[data-visible="true"] {
 *   opacity: 1;
 *   transform: translateY(0);
 * }
 * 
 * pxm-panel[data-visible="false"] {
 *   opacity: 0;
 *   transform: translateY(10px);
 * }
 * ```
 * 
 * Consumer Styling Examples:
 * ```css
 * /* Style the tabs structure *\/
 * pxm-tabs {
 *   display: block;
 * }
 * 
 * pxm-triggers {
 *   display: flex;
 *   border-bottom: 1px solid #ccc;
 * }
 * 
 * pxm-triggers button {
 *   padding: 12px 24px;
 *   border: none;
 *   background: transparent;
 *   cursor: pointer;
 * }
 * 
 * /* ✅ DO: Style based on data attributes (for CSS/JS targeting) *\/
 * pxm-triggers button[data-selected="true"] {
 *   background: #007cba;
 *   color: white;
 * }
 * 
 * pxm-panel {
 *   padding: 24px;
 * }
 * 
 * pxm-panel[data-visible="false"] {
 *   display: none;
 * }
 * 
 * /* ❌ DON'T: Style based on ARIA attributes (bad practice) *\/
 * /* pxm-triggers button[aria-selected="true"] { } *\/
 * /* pxm-panel[aria-hidden="true"] { } *\/
 * ```
 * 
 * SSR / Hydration Support:
 * ```css
 * /* Prevent hydration flash *\/
 * pxm-tabs:not(:defined) pxm-panel {
 *   display: none;
 * }
 * 
 * /* ✅ DO: Style based on data attributes *\/
 * pxm-panel[data-visible="false"] {
 *   display: none;
 *   opacity: 0;
 * }
 * 
 * pxm-panel[data-visible="true"] {
 *   display: block;
 *   opacity: 1;
 * }
 * ```
 * 
 * Events:
 * - `pxm:tabs:before-show` - Cancelable. Fired before a panel is shown.
 * - `pxm:tabs:after-show` - Fired after a panel is completely shown.
 * - `pxm:tabs:before-hide` - Cancelable. Fired before a panel is hidden.
 * - `pxm:tabs:after-hide` - Fired after a panel is completely hidden.
 * - `pxm:tabs:change` - Fired when the active tab changes.
 * - `pxm:tabs:tabs-changed` - Fired when tabs are dynamically added/removed.
 * - `pxm:tabs:state-sync` - Fired when internal state syncs with manually changed DOM attributes.
 * 
 * Accessibility:
 * This component manages only essential ARIA attributes (like aria-selected and aria-hidden for functionality).
 * Additional ARIA attributes, labels, and roles should be added by the consumer as needed.
 */

import { parseAttributes, withErrorBoundary, type AttributeSchema } from '../core/component-utils';

const TABS_SCHEMA: AttributeSchema = {
  'initial': { type: 'string', default: '' }
};

interface TabsState {
  activeTab: string | null;
  isAnimating: boolean;
}

// Event detail types
export interface TabsEventDetail {
  tabName: string;
  panel: HTMLElement;
  trigger: HTMLElement;
  complete: () => void;
}

export interface TabsChangeEventDetail {
  previousTab: string | null;
  activeTab: string;
  panel: HTMLElement;
  trigger: HTMLElement;
}

class InternalPxmTabs extends HTMLElement {
  private config: Record<string, any> = {};
  private state: TabsState = {
    activeTab: null,
    isAnimating: false
  };
  private isInitialized = false;
  private _triggersWrap?: HTMLElement;
  private _triggers?: NodeListOf<HTMLElement>;
  private _panels?: NodeListOf<HTMLElement>;
  private animationPromises = new Map<string, { resolve: () => void }>();
  private mutationObserver?: MutationObserver;
  private attributeObserver?: MutationObserver;
  private initializedTriggers = new WeakSet<HTMLElement>();
  private triggerEventListeners = new WeakMap<HTMLElement, Map<string, EventListener>>();

  // Cache DOM queries to avoid repeated selections
  private get triggersWrap(): HTMLElement {
    return this._triggersWrap ??= this.querySelector("pxm-triggers") as HTMLElement;
  }

  private get triggers(): NodeListOf<HTMLElement> {
    if (!this._triggers) {
      if (this.triggersWrap) {
        this._triggers = this.triggersWrap.querySelectorAll("[data-tab]");
      } else {
        // Return empty NodeList if triggersWrap doesn't exist
        this._triggers = document.querySelectorAll("nonexistent-element") as NodeListOf<HTMLElement>;
      }
    }
    return this._triggers;
  }

  private get panels(): NodeListOf<HTMLElement> {
    return this._panels ??= this.querySelectorAll("pxm-panel[data-tab]");
  }

  // Animation is now handled directly in showPanel/hidePanel methods

  static get observedAttributes(): string[] {
    return Object.keys(TABS_SCHEMA);
  }

  constructor() {
    super();
    // Only set functionally necessary attributes
    this.setAttribute('role', 'tablist');
  }

  connectedCallback(): void {
    withErrorBoundary(() => {
      this.config = parseAttributes(this, TABS_SCHEMA);
      this.setupTabs();
      this.observeChildChanges();
      this.observeAttributeChanges();
      this.initializeActiveTab();
    })();
  }

  disconnectedCallback(): void {
    // Clean up observers
    this.mutationObserver?.disconnect();
    this.attributeObserver?.disconnect();

    // Clean up event listeners
    this.cleanupAllEventListeners();

    // Reset animation state
    this.state.isAnimating = false;

    // Resolve any pending animation promises
    this.animationPromises.forEach(({ resolve }) => resolve());
    this.animationPromises.clear();

    // Clear initialization tracking
    this.initializedTriggers = new WeakSet();
    this.isInitialized = false;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    this.config = parseAttributes(this, TABS_SCHEMA);

    if (name === 'initial') {
      // If already initialized, just switch to the new tab instead of re-initializing
      if (this.isInitialized) {
        const newInitialTab = newValue;
        if (newInitialTab && this.isValidTab(newInitialTab)) {
          this.activateTab(newInitialTab);
        }
      } else {
        // Not yet initialized, so initialize normally
        this.initializeActiveTab();
      }
    }
  }

  /**
   * Set up MutationObserver to watch for dynamically added/removed tabs
   */
  private observeChildChanges(): void {
    this.mutationObserver = new MutationObserver((mutations) => {
      let shouldReinitialize = false;

      for (const mutation of mutations) {
        // Check if triggers or panels were added/removed
        const addedElements = Array.from(mutation.addedNodes).some(
          node => node instanceof HTMLElement &&
            (node.tagName === 'PXM-TRIGGERS' || node.tagName === 'PXM-PANEL' ||
              node.hasAttribute('data-tab'))
        );
        const removedElements = Array.from(mutation.removedNodes).some(
          node => node instanceof HTMLElement &&
            (node.tagName === 'PXM-TRIGGERS' || node.tagName === 'PXM-PANEL' ||
              node.hasAttribute('data-tab'))
        );

        if (addedElements || removedElements) {
          shouldReinitialize = true;
          break;
        }
      }

      if (shouldReinitialize) {
        this.handleDynamicChanges();
      }
    });

    this.mutationObserver.observe(this, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Set up MutationObserver to watch for attribute changes on triggers and panels
   */
  private observeAttributeChanges(): void {
    this.attributeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-selected') {
          const trigger = mutation.target as HTMLElement;
          if (trigger.hasAttribute('data-tab')) {
            this.syncStateFromDOM(trigger);
          }
        }
      }
    });

    // Observe attribute changes on current triggers
    this.triggers.forEach(trigger => {
      this.attributeObserver!.observe(trigger, {
        attributes: true,
        attributeFilter: ['aria-selected']
      });
    });
  }

  /**
   * Sync internal state when attributes are manually changed
   */
  private syncStateFromDOM(trigger: HTMLElement): void {
    const tabName = trigger.dataset.tab;
    if (!tabName) return;

    const isSelectedInDOM = trigger.getAttribute('aria-selected') === 'true';
    const isActiveInState = this.state.activeTab === tabName;

    if (isSelectedInDOM && !isActiveInState) {
      // DOM says selected, but state says inactive - sync to active
      this.state.activeTab = tabName;

      // Update other triggers
      this.triggers.forEach(t => {
        if (t !== trigger) {
          t.setAttribute('aria-selected', 'false');  // For accessibility
          t.setAttribute('data-selected', 'false');  // For styling/JS
          t.tabIndex = -1;
        }
      });

      // Update panels
      this.panels.forEach(panel => {
        if (panel.dataset.tab === tabName) {
          panel.setAttribute('aria-hidden', 'false');   // For accessibility
          panel.setAttribute('data-visible', 'true');   // For styling/JS
          panel.style.display = 'block';
          panel.style.opacity = '1';
        } else {
          panel.setAttribute('aria-hidden', 'true');    // For accessibility
          panel.setAttribute('data-visible', 'false');  // For styling/JS
          panel.style.display = 'none';
          panel.style.opacity = '0';
        }
      });

      trigger.tabIndex = 0;

      // Dispatch sync event
      this.dispatchEvent(new CustomEvent('pxm:tabs:state-sync', {
        detail: { tabName, trigger, action: 'activated-from-dom' }
      }));
    }
  }

  /**
   * Handle dynamic changes to tabs
   */
  private handleDynamicChanges(): void {
    // Clear caches to force re-query
    this._triggersWrap = undefined;
    this._triggers = undefined;
    this._panels = undefined;

    // Clean up removed triggers
    this.cleanupRemovedTriggers();

    // Re-initialize tabs
    this.setupTabs();

    // Re-setup attribute observation
    this.attributeObserver?.disconnect();
    this.observeAttributeChanges();

    // Reset initialization state since structure changed
    this.isInitialized = false;
    this.initializeActiveTab();

    // Dispatch event for dynamic changes
    this.dispatchEvent(new CustomEvent('pxm:tabs:tabs-changed', {
      detail: { tabCount: this.triggers.length }
    }));
  }

  /**
   * Clean up event listeners for removed triggers
   */
  private cleanupRemovedTriggers(): void {
    this.triggerEventListeners = new WeakMap();
  }

  // Note: Default animations are now handled directly in showPanel/hidePanel methods
  // This eliminates timing issues and simplifies the code

  // Note: Event listener tracking removed since animations are now handled directly

  /**
   * Override addEventListener to track animation events
   */
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
    super.addEventListener(type, listener, options);

    if (type === 'pxm:tabs:before-show' || type === 'pxm:tabs:before-hide') {
      this.setAttribute(`data-has-${type}-listener`, 'true');
      // Note: Custom animations are handled by preventing default in showPanel/hidePanel
    }
  }

  /**
   * Set up tabs with event listeners and keyboard navigation
   */
  private setupTabs(): void {
    // Clear caches
    this._triggersWrap = undefined;
    this._triggers = undefined;
    this._panels = undefined;

    if (!this.triggersWrap) {
      console.warn('Tabs missing pxm-triggers wrapper:', this);
      return;
    }

    // Set up triggers
    this.triggers.forEach((trigger, index) => {
      // Skip already initialized triggers
      if (this.initializedTriggers.has(trigger)) {
        return;
      }

      const tabName = trigger.dataset.tab;
      if (!tabName) {
        console.warn('Trigger missing data-tab attribute:', trigger);
        return;
      }

      // Set ARIA attributes (accessibility) and data attributes (styling/JS)
      if (!trigger.id) {
        trigger.id = `pxm-tab-${tabName}`;
      }
      trigger.setAttribute('role', 'tab');
      trigger.setAttribute('aria-selected', 'false');  // For accessibility
      trigger.setAttribute('data-selected', 'false');  // For styling/JS
      trigger.tabIndex = -1;

      // Add click handler
      const clickHandler = withErrorBoundary(() => this.activateTab(tabName));
      this.addTriggerEventListener(trigger, 'click', clickHandler);

      // Add keyboard navigation
      const keydownHandler: EventListener = (evt: Event) => {
        const e = evt as KeyboardEvent;
        switch (e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault();
            this.activateTab(tabName);
            break;
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            this.focusNextTrigger(index);
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            this.focusPreviousTrigger(index);
            break;
          case 'Home':
            e.preventDefault();
            this.focusFirstTrigger();
            break;
          case 'End':
            e.preventDefault();
            this.focusLastTrigger();
            break;
        }
      };

      this.addTriggerEventListener(trigger, 'keydown', keydownHandler);

      // Mark as initialized
      this.initializedTriggers.add(trigger);
    });

    // Set up panels
    this.panels.forEach(panel => {
      const tabName = panel.dataset.tab;
      if (!tabName) {
        console.warn('Panel missing data-tab attribute:', panel);
        return;
      }

      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-hidden', 'true');    // For accessibility
      panel.setAttribute('data-visible', 'false');  // For styling/JS

      // Set aria-labelledby if corresponding trigger exists
      const trigger = Array.from(this.triggers).find(t => t.dataset.tab === tabName);
      if (trigger?.id) {
        panel.setAttribute('aria-labelledby', trigger.id);
      }

      // Don't hide panels here - let initializeActiveTab handle initial state
    });
  }

  /**
   * Initialize the active tab based on initial attribute or first tab
   */
  private async initializeActiveTab(): Promise<void> {
    // If already initialized and not forcing re-initialization, skip
    if (this.isInitialized && !this.state.isAnimating) {
      return;
    }

    // If currently animating, wait for it to complete before proceeding
    if (this.state.isAnimating) {
      // Wait a bit and try again
      setTimeout(() => this.initializeActiveTab(), 50);
      return;
    }

    // First, hide all panels and deactivate all triggers to establish clean state
    this.panels.forEach(panel => {
      panel.setAttribute('aria-hidden', 'true');    // For accessibility
      panel.setAttribute('data-visible', 'false');  // For styling/JS
      panel.style.display = 'none';
      panel.style.opacity = '0';
    });

    this.triggers.forEach(trigger => {
      trigger.setAttribute('aria-selected', 'false');  // For accessibility
      trigger.setAttribute('data-selected', 'false');  // For styling/JS
      trigger.tabIndex = -1;
    });

    // Then activate the correct tab
    const initialTab = this.config['initial'] || this.getAttribute('initial');

    if (initialTab && this.isValidTab(initialTab)) {
      await this.activateTab(initialTab);
      this.forceTriggerUpdate(initialTab);
    } else {
      const firstTab = this.triggers[0]?.dataset.tab;
      if (firstTab) {
        await this.activateTab(firstTab);
        this.forceTriggerUpdate(firstTab);
      }
    }

    this.isInitialized = true;
  }

  /**
   * Force update the trigger attributes for a given tab name
   */
  private forceTriggerUpdate(tabName: string): void {
    const triggers = this.triggers;
    if (!triggers || triggers.length === 0) {
      return;
    }
    triggers.forEach(t => {
      if (t.dataset.tab === tabName) {
        t.setAttribute('aria-selected', 'true');
        t.setAttribute('data-selected', 'true');
        t.tabIndex = 0;
      } else {
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('data-selected', 'false');
        t.tabIndex = -1;
      }
    });
  }

  /**
   * Check if a tab name is valid
   */
  private isValidTab(tabName: string): boolean {
    return Array.from(this.triggers).some(trigger => trigger.dataset.tab === tabName) &&
      Array.from(this.panels).some(panel => panel.dataset.tab === tabName);
  }

  /**
   * Create animation promise that can be resolved externally
   */
  private createAnimationPromise(tabName: string): Promise<void> {
    return new Promise((resolve) => {
      this.animationPromises.set(tabName, { resolve });
    });
  }

  /**
   * Show a panel with animation
   */
  private async showPanel(tabName: string): Promise<void> {
    const panel = Array.from(this.panels).find(p => p.dataset.tab === tabName);
    const trigger = Array.from(this.triggers).find(t => t.dataset.tab === tabName);

    if (!panel || !trigger) return;

    // Create animation promise
    const animationPromise = this.createAnimationPromise(`show-${tabName}`);

    // Dispatch before event to allow custom animations
    const beforeEvent = new CustomEvent('pxm:tabs:before-show', {
      detail: {
        tabName,
        panel,
        trigger,
        complete: () => {
          this.animationPromises.get(`show-${tabName}`)?.resolve();
        }
      } as TabsEventDetail,
      cancelable: true
    });

    const hasCustomAnimation = !this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented;

    // Always update ARIA and data attributes first
    panel.setAttribute('aria-hidden', 'false');   // For accessibility
    panel.setAttribute('data-visible', 'true');   // For styling/JS

    if (hasCustomAnimation) {
      // Custom animation is handling the visual transition
      await animationPromise;
    } else {
      // Apply default show styling immediately
      panel.style.display = 'block';
      panel.style.opacity = '1';
      // Resolve immediately since no custom animation
      this.animationPromises.get(`show-${tabName}`)?.resolve();
    }

    // Clean up
    this.animationPromises.delete(`show-${tabName}`);

    // Dispatch after event
    this.dispatchEvent(new CustomEvent('pxm:tabs:after-show', {
      detail: { tabName, panel, trigger }
    }));
  }

  /**
   * Hide a panel with animation
   */
  private async hidePanel(tabName: string): Promise<void> {
    const panel = Array.from(this.panels).find(p => p.dataset.tab === tabName);
    const trigger = Array.from(this.triggers).find(t => t.dataset.tab === tabName);

    if (!panel || !trigger) return;

    // Create animation promise
    const animationPromise = this.createAnimationPromise(`hide-${tabName}`);

    // Dispatch before event to allow custom animations
    const beforeEvent = new CustomEvent('pxm:tabs:before-hide', {
      detail: {
        tabName,
        panel,
        trigger,
        complete: () => {
          this.animationPromises.get(`hide-${tabName}`)?.resolve();
        }
      } as TabsEventDetail,
      cancelable: true
    });

    const hasCustomAnimation = !this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented;

    if (hasCustomAnimation) {
      // Custom animation handles visual transition, then we update ARIA and data attributes
      await animationPromise;
      panel.setAttribute('aria-hidden', 'true');    // For accessibility
      panel.setAttribute('data-visible', 'false');  // For styling/JS
    } else {
      // Apply default hide styling and update ARIA and data attributes immediately
      panel.style.opacity = '0';
      panel.style.display = 'none';
      panel.setAttribute('aria-hidden', 'true');    // For accessibility
      panel.setAttribute('data-visible', 'false');  // For styling/JS
      // Resolve immediately since no custom animation
      this.animationPromises.get(`hide-${tabName}`)?.resolve();
    }

    // Clean up
    this.animationPromises.delete(`hide-${tabName}`);

    // Dispatch after event
    this.dispatchEvent(new CustomEvent('pxm:tabs:after-hide', {
      detail: { tabName, panel, trigger }
    }));
  }

  /**
   * Public API: Activate a tab by name or index
   */
  public async activateTab(tab: string | number): Promise<void> {
    if (this.state.isAnimating) return;

    let tabName: string | undefined;
    if (typeof tab === 'number') {
      tabName = this.triggers[tab]?.dataset.tab;
    } else {
      tabName = tab;
    }

    if (!tabName || !this.isValidTab(tabName)) {
      return;
    }

    this.state.isAnimating = true;
    const previousTab = this.state.activeTab;

    try {
      // Dispatch change event
      const trigger = Array.from(this.triggers).find(t => t.dataset.tab === tabName);
      const panel = Array.from(this.panels).find(p => p.dataset.tab === tabName);

      if (!trigger || !panel) {
        return;
      }

      this.dispatchEvent(new CustomEvent('pxm:tabs:change', {
        detail: {
          previousTab,
          activeTab: tabName,
          panel,
          trigger
        } as TabsChangeEventDetail
      }));

      // Hide current panel if different from new one
      if (previousTab && previousTab !== tabName) {
        await this.hidePanel(previousTab);
      }

      // --- Always update triggers, even if previousTab is null ---
      this.triggers.forEach(t => {
        if (t.dataset.tab === tabName) {
          t.setAttribute('aria-selected', 'true');   // For accessibility
          t.setAttribute('data-selected', 'true');   // For styling/JS
          t.tabIndex = 0;
        } else {
          t.setAttribute('aria-selected', 'false');  // For accessibility
          t.setAttribute('data-selected', 'false');  // For styling/JS
          t.tabIndex = -1;
        }
      });

      // Show new panel
      await this.showPanel(tabName);

      // Update state
      this.state.activeTab = tabName;

    } finally {
      this.state.isAnimating = false;
    }
  }

  /**
   * Focus navigation methods
   */
  public focusNextTrigger(currentIndex: number): void {
    const newIndex = (currentIndex + 1) % this.triggers.length;
    this.triggers[newIndex]?.focus();
  }

  public focusPreviousTrigger(currentIndex: number): void {
    const newIndex = (currentIndex - 1 + this.triggers.length) % this.triggers.length;
    this.triggers[newIndex]?.focus();
  }

  public focusFirstTrigger(): void {
    this.triggers[0]?.focus();
  }

  public focusLastTrigger(): void {
    this.triggers[this.triggers.length - 1]?.focus();
  }

  /**
   * Get the currently active tab
   */
  public getActiveTab(): string | null {
    return this.state.activeTab;
  }

  /**
   * Get all available tab names
   */
  public getTabNames(): string[] {
    return Array.from(this.triggers).map(trigger => trigger.dataset.tab).filter(Boolean) as string[];
  }

  /**
   * Remove default animation listeners (now a no-op since animations are handled directly)
   */
  public removeDefaultAnimations(): void {
    // No-op: Default animations are now handled directly in showPanel/hidePanel
    // Custom animations work by preventing default in event listeners
  }

  /**
   * Clean up all event listeners
   */
  private cleanupAllEventListeners(): void {
    this.triggers.forEach(trigger => {
      this.cleanupTriggerEventListeners(trigger);
    });
  }

  /**
   * Clean up event listeners for a specific trigger
   */
  private cleanupTriggerEventListeners(trigger: HTMLElement): void {
    const listeners = this.triggerEventListeners.get(trigger);
    if (listeners) {
      listeners.forEach((listener, eventType) => {
        trigger.removeEventListener(eventType, listener);
      });
      this.triggerEventListeners.delete(trigger);
    }
  }

  /**
   * Add an event listener to a trigger and track it for cleanup
   */
  private addTriggerEventListener(trigger: HTMLElement, eventType: string, listener: EventListener): void {
    if (!this.triggerEventListeners.has(trigger)) {
      this.triggerEventListeners.set(trigger, new Map());
    }

    const listeners = this.triggerEventListeners.get(trigger)!;

    // Remove old listener if exists
    const oldListener = listeners.get(eventType);
    if (oldListener) {
      trigger.removeEventListener(eventType, oldListener);
    }

    // Add new listener
    trigger.addEventListener(eventType, listener);
    listeners.set(eventType, listener);
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

// Define the custom elements
customElements.define('pxm-tabs', InternalPxmTabs);

// Sub-components (minimal placeholders)
export class PxmTriggers extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define('pxm-triggers', PxmTriggers);

export class PxmPanel extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define('pxm-panel', PxmPanel);

// Make available globally
if (typeof window !== 'undefined') {
  (window as any).PxmTabs = InternalPxmTabs;
  (window as any).PxmTriggers = PxmTriggers;
  (window as any).PxmPanel = PxmPanel;
}

/**
 * Public TypeScript interface for the Tabs component
 */
export interface PxmTabs extends HTMLElement {
  /**
   * Activate a tab by its name (data-tab value) or index
   */
  activateTab(tab: string | number): Promise<void>;
  /**
   * Focus the next tab trigger
   */
  focusNextTrigger(currentIndex: number): void;
  /**
   * Focus the previous tab trigger
   */
  focusPreviousTrigger(currentIndex: number): void;
  /**
   * Focus the first tab trigger
   */
  focusFirstTrigger(): void;
  /**
   * Focus the last tab trigger
   */
  focusLastTrigger(): void;
  /**
   * Get the currently active tab name
   */
  getActiveTab(): string | null;
  /**
   * Get all available tab names
   */
  getTabNames(): string[];
  /**
   * Remove default animation listeners (useful when using custom animation libraries)
   */
  removeDefaultAnimations(): void;
}

/**
 * Public TypeScript interface for the tab triggers wrapper element
 */
export interface PxmTriggers extends HTMLElement { }

/**
 * Public TypeScript interface for a tab panel element
 */
export interface PxmPanel extends HTMLElement { }
