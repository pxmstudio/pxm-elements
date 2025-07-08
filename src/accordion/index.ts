/**
 * PXM Accordion Component
 * 
 * A flexible, accessible accordion component that allows users to expand/collapse content sections.
 * Bring your own animation library (GSAP, Anime.js, etc.) or use CSS transitions.
 * 
 * Features:
 * - Keyboard navigation
 * - Arrow key navigation with wrapping (Up/Down arrows wrap to first/last item)
 * - Dynamic content support (items can be added/removed after initialization)
 * - Event-driven animation system (bring your own animation library)
 * - Single or multiple items can be expanded simultaneously
 * 
 * Keyboard Navigation:
 * - `Enter` or `Space` - Toggle current item
 * - `ArrowUp` - Focus previous item (wraps to last item if at first)
 * - `ArrowDown` - Focus next item (wraps to first item if at last)
 * - `Home` - Focus first item
 * - `End` - Focus last item
 * 
 * Basic Usage:
 * ```html
 * <pxm-accordion>
 *   <pxm-accordion-item>
 *     <pxm-accordion-trigger>
 *       <h3>Section 1</h3>
 *       <span data-accordion-icon>▼</span>
 *     </pxm-accordion-trigger>
 *     <pxm-accordion-content>
 *       <p>Content goes here...</p>
 *     </pxm-accordion-content>
 *   </pxm-accordion-item>
 * </pxm-accordion>
 * ```
 * 
 * Dynamic Content:
 * ```javascript
 * // Items can be added/removed dynamically
 * const accordion = document.querySelector('pxm-accordion');
 * const newItem = document.createElement('pxm-accordion-item');
 * newItem.innerHTML = `
 *   <pxm-accordion-trigger>New Section</pxm-accordion-trigger>
 *   <pxm-accordion-content>New content</pxm-accordion-content>
 * `;
 * accordion.appendChild(newItem); // Automatically initialized
 * 
 * // Listen for changes
 * accordion.addEventListener('pxm:accordion:items-changed', (e) => {
 *   console.log(`Accordion now has ${e.detail.itemCount} items`);
 * });
 * ```
 * 
 * With GSAP Animation (via events - recommended for CDN):
 * ```javascript
 * const accordion = document.querySelector('pxm-accordion');
 * 
 * accordion.addEventListener('pxm:accordion:before-expand', (e) => {
 *   const { content, item, index } = e.detail;
 *   e.preventDefault(); // Take over the animation
 *   
 *   gsap.fromTo(content, 
 *     { height: 0, opacity: 0 }, 
 *     { height: 'auto', opacity: 1, duration: 0.3, onComplete: () => {
 *       e.detail.complete(); // Signal animation complete
 *     }}
 *   );
 * });
 * 
 * accordion.addEventListener('pxm:accordion:before-collapse', (e) => {
 *   const { content, item, index } = e.detail;
 *   e.preventDefault(); // Take over the animation
 *   
 *   gsap.to(content, { 
 *     height: 0, 
 *     opacity: 0, 
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
 * pxm-accordion-content {
 *   transition: opacity 0.3s ease-in-out;
 * }
 * ```
 * 
 * Consumer Styling Examples:
 * ```css
 * /* Style the component structure *\/
 * pxm-accordion {
 *   /* Your layout styles *\/
 * }
 * 
 * pxm-accordion-item {
 *   /* Your item styles *\/
 * }
 * 
 * /* ✅ DO: Style based on data attributes (for CSS/JS targeting) /
 * pxm-accordion-item[data-expanded="true"] pxm-accordion-content {
 *   /* Expanded state styling *\/
 *   display: block;
 *   opacity: 1;
 * }
 * 
 * pxm-accordion-item[data-state="active"] {
 *   /* Active state styling *\/
 *   background: #f0f0f0;
 * }
 * 
 * pxm-accordion-item[data-disabled="true"] {
 *   /* Disabled state styling *\/
 *   opacity: 0.5;
 * }
 * 
 * /* ❌ DON'T: Style based on ARIA attributes (bad practice) *\/
 * pxm-accordion-item[aria-expanded="true"] {
 *   /* Don't use ARIA for styling *\/
 * }
 * ```
 * 
 * With Tailwind CSS:
 * ```html
 * <!-- ✅ DO: Use data attributes for styling -->
 * <pxm-accordion>
 *   <pxm-accordion-item 
 *     class="transition-all duration-300
 *            data-[expanded=true]:bg-blue-50 
 *            data-[state=active]:border-blue-200
 *            data-[disabled=true]:opacity-50"
 *     aria-expanded="false"
 *     aria-labelledby="accordion-header-1">
 *     <pxm-accordion-trigger 
 *       id="accordion-header-1"
 *       class="data-[expanded=true]:font-bold">
 *       <h3>Section Title</h3>
 *       <span data-accordion-icon class="data-[expanded=true]:rotate-90">▶</span>
 *     </pxm-accordion-trigger>
 *     <pxm-accordion-content class="data-[expanded=true]:block data-[expanded=false]:hidden">
 *       Content here
 *     </pxm-accordion-content>
 *   </pxm-accordion-item>
 * </pxm-accordion>
 * ```
 * 
 * SSR / Hydration Support:
 * ```css
 * /* Recommended: Set initial styles in CSS to prevent hydration flash *\/
 * pxm-accordion-item:not([data-expanded="true"]) pxm-accordion-content {
 *   display: none;
 *   opacity: 0;
 * }
 * 
 * pxm-accordion-item[data-expanded="true"] pxm-accordion-content {
 *   display: block;
 *   opacity: 1;
 * }
 * 
 * /* Optional: Hide content during hydration *\/
 * pxm-accordion:not(:defined) pxm-accordion-content {
 *   display: none;
 * }
 * ```
 * 
 * Accessibility:
 * This component manages both ARIA attributes (for accessibility) and data attributes (for styling/JS).
 * - ARIA attributes (aria-expanded) are automatically managed for screen readers
 * - Data attributes (data-expanded, data-state) are provided for CSS styling and JavaScript hooks
 * - Additional ARIA attributes, labels, and roles should be added by the consumer as needed
 *
 * Events:
 * - `pxm:accordion:before-expand` - Cancelable. Fired before expansion starts.
 * - `pxm:accordion:after-expand` - Fired after expansion completes.
 * - `pxm:accordion:before-collapse` - Cancelable. Fired before collapse starts.
 * - `pxm:accordion:after-collapse` - Fired after collapse completes.
 * - `pxm:accordion:toggle` - Fired when an item is toggled.
 * - `pxm:accordion:items-changed` - Fired when items are dynamically added/removed.
 * - `pxm:accordion:state-sync` - Fired when internal state syncs with manually changed DOM attributes.
 * 
 * State Synchronization:
 * ```javascript
 * // Manual data attribute changes are automatically synced
 * const item = document.querySelector('pxm-accordion-item');
 * item.setAttribute('data-expanded', 'true'); // Component state automatically updates
 * item.setAttribute('data-state', 'active');  // Both data attributes should be set
 * 
 * // Listen for sync events
 * accordion.addEventListener('pxm:accordion:state-sync', (e) => {
 *   console.log(`Item ${e.detail.index} was ${e.detail.action}`);
 *   // Possible actions: 'activated-from-dom', 'deactivated-from-dom'
 * });
 * ```
 */

import { parseAttributes, withErrorBoundary, type AttributeSchema } from '../core/component-utils';

const ACCORDION_SCHEMA: AttributeSchema = {
  'allow-multiple': { type: 'boolean', default: false },
  'icon-rotation': { type: 'number', default: 90 }
};

interface AccordionState {
  activeItems: Set<number>;
  isAnimating: boolean;
}

// Event detail types
export interface AccordionEventDetail {
  index: number;
  item: HTMLElement;
  content: HTMLElement;
  trigger: HTMLElement;
  complete: () => void;
}

export interface AccordionToggleEventDetail {
  index: number;
  item: HTMLElement;
  isExpanding: boolean;
}

class PxmAccordion extends HTMLElement {
  private config: Record<string, any> = {};
  private state: AccordionState = {
    activeItems: new Set(),
    isAnimating: false
  };
  private _items?: NodeListOf<PxmAccordionItem>;
  private animationPromises = new Map<number, { resolve: () => void }>();
  private mutationObserver?: MutationObserver;
  private attributeObserver?: MutationObserver;
  private itemStates = new Map<HTMLElement, boolean>();
  private initializedItems = new WeakSet<HTMLElement>();
  private itemEventListeners = new WeakMap<HTMLElement, Map<string, EventListener>>();

  // Cache items to avoid repeated queries
  private get items(): NodeListOf<PxmAccordionItem> {
    return this._items ??= this.querySelectorAll('pxm-accordion-item');
  }

  static get observedAttributes(): string[] {
    return Object.keys(ACCORDION_SCHEMA);
  }

  constructor() {
    super();
    this.setAttribute('role', 'list');
  }

  connectedCallback(): void {
    withErrorBoundary(() => {
      this.config = parseAttributes(this, ACCORDION_SCHEMA);
      this.setupItems();
      this.setupDefaultAnimations();
      this.observeChildChanges();
      this.observeAttributeChanges();
    })();
  }

  disconnectedCallback(): void {
    // Clean up mutation observers
    this.mutationObserver?.disconnect();
    this.attributeObserver?.disconnect();
    // Clean up event listeners
    this.cleanupAllEventListeners();
    // Clean up any animation frames or timeouts if needed
    this.state.isAnimating = false;
    // Resolve any pending animation promises
    this.animationPromises.forEach(({ resolve }) => resolve());
    this.animationPromises.clear();
    // Clear item states
    this.itemStates.clear();
    // Clear initialization tracking (WeakSet will be garbage collected)
    this.initializedItems = new WeakSet();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    this.config = parseAttributes(this, ACCORDION_SCHEMA);

    if (name === 'icon-rotation') {
      this.updateIconRotations();
    }
  }

  /**
   * Set up MutationObserver to watch for dynamically added/removed items
   */
  private observeChildChanges(): void {
    this.mutationObserver = new MutationObserver((mutations) => {
      let shouldReinitialize = false;

      for (const mutation of mutations) {
        // Check if accordion items were added or removed
        const addedAccordionItems = Array.from(mutation.addedNodes).some(
          node => node instanceof HTMLElement && node.tagName === 'PXM-ACCORDION-ITEM'
        );
        const removedAccordionItems = Array.from(mutation.removedNodes).some(
          node => node instanceof HTMLElement && node.tagName === 'PXM-ACCORDION-ITEM'
        );

        if (addedAccordionItems || removedAccordionItems) {
          shouldReinitialize = true;
          break;
        }
      }

      if (shouldReinitialize) {
        this.handleDynamicChanges();
      }
    });

    // Observe direct children changes
    this.mutationObserver.observe(this, {
      childList: true,
      subtree: false // Only watch direct children
    });
  }

  /**
   * Set up MutationObserver to watch for data attribute changes on items
   */
  private observeAttributeChanges(): void {
    this.attributeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && (
          mutation.attributeName === 'data-expanded' || 
          mutation.attributeName === 'data-state'
        )) {
          const item = mutation.target as HTMLElement;
          if (item.tagName === 'PXM-ACCORDION-ITEM') {
            this.syncStateFromDOM(item);
          }
        }
      }
    });

    // Observe attribute changes on all current items
    this.items.forEach(item => {
      this.attributeObserver!.observe(item, {
        attributes: true,
        attributeFilter: ['data-expanded', 'data-state']
      });
    });
  }

  /**
   * Sync internal state when data attributes are manually changed
   */
  private syncStateFromDOM(item: HTMLElement): void {
    const items = Array.from(this.items);
    const index = items.indexOf(item as PxmAccordionItem);

    if (index === -1) return;

    const isExpandedInDOM = item.getAttribute('data-expanded') === 'true';
    const isActiveInState = this.state.activeItems.has(index);

    // Always sync the internal state, but don't interfere with animations visually
    if (isExpandedInDOM !== isActiveInState) {
      const content = item.querySelector('pxm-accordion-content') as HTMLElement;
      const trigger = item.querySelector('pxm-accordion-trigger') as HTMLElement;

      if (isExpandedInDOM) {
        // DOM says expanded, but state says inactive - sync to active
        this.state.activeItems.add(index);

        if (content && trigger && !this.state.isAnimating && !this.hasCustomAnimations) {
          // Only apply visual changes if not animating and no custom animations
          requestAnimationFrame(() => {
            content.style.display = 'block';
            content.style.opacity = '1';
          });
        }

        // Set both ARIA (accessibility) and data (styling) attributes
        trigger?.setAttribute('aria-expanded', 'true');
        item.setAttribute('data-state', 'active');
        this.updateIcon(item, true);

        // Dispatch sync event
        this.dispatchEvent(new CustomEvent('pxm:accordion:state-sync', {
          detail: { index, item, action: 'activated-from-dom' }
        }));
      } else {
        // DOM says collapsed, but state says active - sync to inactive
        this.state.activeItems.delete(index);

        if (content && trigger && !this.state.isAnimating && !this.hasCustomAnimations) {
          // Only apply visual changes if not animating and no custom animations
          requestAnimationFrame(() => {
            content.style.display = 'none';
            content.style.opacity = '0';
          });
        }

        // Set both ARIA (accessibility) and data (styling) attributes
        trigger?.setAttribute('aria-expanded', 'false');
        item.setAttribute('data-expanded', 'false');
        item.setAttribute('data-state', 'inactive');
        this.updateIcon(item, false);

        // Dispatch sync event
        this.dispatchEvent(new CustomEvent('pxm:accordion:state-sync', {
          detail: { index, item, action: 'deactivated-from-dom' }
        }));
      }
    }
  }

  /**
   * Handle dynamic changes to accordion items
   */
  private handleDynamicChanges(): void {
    // Save current state before re-initialization
    this.saveItemStates();

    // Clean up event listeners for items that no longer exist
    this.cleanupRemovedItems();

    // Clear cache to force re-query
    this._items = undefined;

    // Clear active items but keep the saved states
    this.state.activeItems.clear();

    // Re-initialize items (only new items will be processed)
    this.setupItems();

    // Restore states for existing items
    this.restoreItemStates();

    // Re-setup attribute observation for all items (including new ones)
    this.attributeObserver?.disconnect();
    this.observeAttributeChanges();

    // Dispatch event for dynamic changes
    this.dispatchEvent(new CustomEvent('pxm:accordion:items-changed', {
      detail: { itemCount: this.items.length }
    }));
  }

  /**
 * Clean up event listeners for items that have been removed from the DOM
 */
  private cleanupRemovedItems(): void {
    // Clean up event listeners for any items that might have been removed
    // This is a safety measure since WeakMap/WeakSet handle most cleanup automatically
    this.itemEventListeners = new WeakMap();
  }

  /**
   * Save the current state of all items
   */
  private saveItemStates(): void {
    this.itemStates.clear();
    this.items.forEach((item, index) => {
      const isActive = this.state.activeItems.has(index);
      this.itemStates.set(item, isActive);
    });
  }

  /**
   * Restore the state of items that still exist
   */
  private restoreItemStates(): void {
    this.items.forEach((item, index) => {
      if (this.itemStates.has(item)) {
        const wasActive = this.itemStates.get(item);
        if (wasActive) {
          this.state.activeItems.add(index);
          // Restore visual state without animation
          const content = item.querySelector('pxm-accordion-content') as HTMLElement;
          const trigger = item.querySelector('pxm-accordion-trigger') as HTMLElement;
          if (content && trigger) {
            content.style.display = 'block';
            content.style.opacity = '1';
            // Set both ARIA (accessibility) and data (styling) attributes
            item.setAttribute('data-expanded', 'true');
            item.setAttribute('data-state', 'active');
            trigger.setAttribute('aria-expanded', 'true');
            this.updateIcon(item, true);
          }
        }
      }
    });
    this.itemStates.clear();
  }

  // Store default listeners so we can remove them later
  private defaultListeners = new Map<string, EventListener>();
  private hasCustomAnimations = false;
  private shouldSkipDefaultAnimations = false;

  /**
   * Set up default CSS-based animations if no hooks are provided and no event listeners exist
   */
  private setupDefaultAnimations(): void {
    // If removeDefaultAnimations() was called, skip setup entirely
    if (this.shouldSkipDefaultAnimations) {
      return;
    }

    // Clean up existing default listeners first
    this.defaultListeners.forEach((listener, eventType) => {
      this.removeEventListener(eventType, listener);
    });
    this.defaultListeners.clear();

    // Clear tracking attributes to get fresh state
    this.clearEventListenerTracking();

    // Re-check if any event listeners are attached for animation events after clearing
    const hasExpandListener = this.hasEventListener('pxm:accordion:before-expand');
    const hasCollapseListener = this.hasEventListener('pxm:accordion:before-collapse');
    const hasAfterCollapseListener = this.hasEventListener('pxm:accordion:after-collapse');
    const hasIconRotateListener = this.hasEventListener('pxm:accordion:icon-rotate');

    // Only set defaults if user hasn't provided custom animations via properties or events
    if (!hasExpandListener) {
      const expandListener = (e: Event) => {
        const { content, complete } = (e as CustomEvent).detail;
        e.preventDefault(); // Take over the animation

        // Simple show animation with proper setup
        content.style.display = 'block';
        content.style.opacity = '1';
        content.style.height = 'auto';
        // Signal animation complete immediately
        complete();
      };
      super.addEventListener('pxm:accordion:before-expand', expandListener);
      this.defaultListeners.set('pxm:accordion:before-expand', expandListener);
    }

    if (!hasCollapseListener) {
      const collapseListener = (e: Event) => {
        const { content, complete } = (e as CustomEvent).detail;
        e.preventDefault(); // Take over the animation

        // Simple hide animation with proper cleanup
        content.style.opacity = '0';
        content.style.height = '';
        content.style.display = 'none';
        // Signal animation complete immediately
        complete();
      };
      super.addEventListener('pxm:accordion:before-collapse', collapseListener);
      this.defaultListeners.set('pxm:accordion:before-collapse', collapseListener);
    }

    // Add default after-collapse listener to ensure cleanup
    if (!hasAfterCollapseListener) {
      const afterCollapseListener = (e: Event) => {
        const { content } = (e as CustomEvent).detail;
        // Ensure content is hidden
        content.style.display = 'none';
        content.style.opacity = '0';
        content.style.height = '';
      };
      super.addEventListener('pxm:accordion:after-collapse', afterCollapseListener);
      this.defaultListeners.set('pxm:accordion:after-collapse', afterCollapseListener);
    }

    if (!hasIconRotateListener) {
      const iconRotateListener = (e: Event) => {
        const { icon, isExpanding } = (e as CustomEvent).detail;
        requestAnimationFrame(() => {
          icon.style.transition = 'transform 0.3s ease-in-out';
          icon.style.transform = isExpanding ? `rotate(${this.config['icon-rotation']}deg)` : 'rotate(0deg)';
        });
      };
      super.addEventListener('pxm:accordion:icon-rotate', iconRotateListener);
      this.defaultListeners.set('pxm:accordion:icon-rotate', iconRotateListener);
    }
  }

  /**
   * Helper to check if event listeners exist (for determining if we should use default animations)
   */
  private hasEventListener(eventType: string): boolean {
    // This is a simplified check - in production you might want a more robust solution
    return this.getAttribute(`data-has-${eventType}-listener`) === 'true';
  }

  /**
   * Clear all event listener tracking attributes to reset to defaults
   */
  private clearEventListenerTracking(): void {
    const trackingAttributes = [
      'data-has-pxm:accordion:before-expand-listener',
      'data-has-pxm:accordion:before-collapse-listener',
      'data-has-pxm:accordion:after-collapse-listener',
      'data-has-pxm:accordion:icon-rotate-listener'
    ];

    trackingAttributes.forEach(attr => {
      this.removeAttribute(attr);
    });
  }

  /**
   * Override addEventListener to track when animation events are added
   */
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
    super.addEventListener(type, listener, options);

    // Mark that we have listeners for animation events
    if (type === 'pxm:accordion:before-expand' ||
      type === 'pxm:accordion:before-collapse' ||
      type === 'pxm:accordion:after-collapse' ||
      type === 'pxm:accordion:icon-rotate') {
      this.setAttribute(`data-has-${type}-listener`, 'true');
      // Re-setup animations to disable defaults
      this.setupDefaultAnimations();
    }
  }

  /**
   * Set up accordion items with event listeners
   */
  private setupItems(): void {
    // Clear cache to get fresh items
    this._items = undefined;

    this.items.forEach((item, index) => {
      // Skip items that are already initialized
      if (this.initializedItems.has(item)) {
        return;
      }

      const trigger = item.querySelector('pxm-accordion-trigger');
      const content = item.querySelector('pxm-accordion-content');

      if (!trigger || !content) {
        console.warn('Accordion item missing required elements:', item);
        return;
      }

      // Set initial state - check data-expanded for styling state
      const isExpanded = item.getAttribute('data-expanded') === 'true';
      if (isExpanded) {
        this.state.activeItems.add(index);
        // Set initial expanded state without animation
        // Defer inline styles to prevent SSR hydration flash
        requestAnimationFrame(() => {
          (content as HTMLElement).style.display = 'block';
          (content as HTMLElement).style.opacity = '1';
        });
        // Set both ARIA (accessibility) and data (styling) attributes
        trigger.setAttribute('aria-expanded', 'true');
        item.setAttribute('data-state', 'active');
        this.updateIcon(item, true);
      } else {
        // Ensure collapsed state
        // Defer inline styles to prevent SSR hydration flash
        requestAnimationFrame(() => {
          (content as HTMLElement).style.display = 'none';
          (content as HTMLElement).style.opacity = '0';
        });
        // Set both ARIA (accessibility) and data (styling) attributes
        item.setAttribute('data-expanded', 'false');
        item.setAttribute('data-state', 'inactive');
        trigger.setAttribute('aria-expanded', 'false');
      }

      // Add click handler using tracked event listeners
      const clickHandler = withErrorBoundary(() => this.toggleItem(index));
      this.addItemEventListener(item, trigger as HTMLElement, 'click', clickHandler);

      // Add keyboard navigation using tracked event listeners
      const keydownHandler: EventListener = (evt: Event) => {
        const e = evt as KeyboardEvent;
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            this.toggleItem(index);
            break;
          case ' ':
            e.preventDefault();
            this.toggleItem(index);
            break;
          case 'ArrowUp':
            e.preventDefault();
            this.focusPreviousItem(index);
            break;
          case 'ArrowDown':
            e.preventDefault();
            this.focusNextItem(index);
            break;
          case 'Home':
            e.preventDefault();
            this.focusFirstItem();
            break;
          case 'End':
            e.preventDefault();
            this.focusLastItem();
            break;
        }
      };

      this.addItemEventListener(item, trigger as HTMLElement, 'keydown', keydownHandler);

      // Mark this item as initialized
      this.initializedItems.add(item);
    });
  }

  /**
   * Focus the previous accordion item (wraps to last item if at first)
   */
  private focusPreviousItem(currentIndex: number): void {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      const prevTrigger = this.items[prevIndex].querySelector('pxm-accordion-trigger') as HTMLElement;
      prevTrigger?.focus();
    } else {
      // Wrap to last item
      this.focusLastItem();
    }
  }

  /**
   * Focus the next accordion item (wraps to first item if at last)
   */
  private focusNextItem(currentIndex: number): void {
    const nextIndex = currentIndex + 1;
    if (nextIndex < this.items.length) {
      const nextTrigger = this.items[nextIndex].querySelector('pxm-accordion-trigger') as HTMLElement;
      nextTrigger?.focus();
    } else {
      // Wrap to first item
      this.focusFirstItem();
    }
  }

  /**
   * Focus the first accordion item
   */
  private focusFirstItem(): void {
    const firstTrigger = this.items[0].querySelector('pxm-accordion-trigger') as HTMLElement;
    firstTrigger?.focus();
  }

  /**
   * Focus the last accordion item
   */
  private focusLastItem(): void {
    const lastTrigger = this.items[this.items.length - 1].querySelector('pxm-accordion-trigger') as HTMLElement;
    lastTrigger?.focus();
  }

  /**
   * Update icon rotation for all items
   */
  private updateIconRotations(): void {
    if (!this.items) return;

    this.items.forEach((item, index) => {
      const isActive = this.state.activeItems.has(index);
      this.updateIcon(item, isActive);
    });
  }

  /**
   * Update icon for a specific item
   */
  private updateIcon(item: HTMLElement, isExpanding: boolean): void {
    const icon = item.querySelector('[data-accordion-icon]') as HTMLElement;
    if (icon) {
      // Try event first
      const event = new CustomEvent('pxm:accordion:icon-rotate', {
        detail: { icon, isExpanding },
        cancelable: true
      });

      if (!this.dispatchEvent(event) || event.defaultPrevented) {
        // Event was handled
        return;
      }
    }
  }

  /**
   * Create animation promise that can be resolved externally
   */
  private createAnimationPromise(index: number): Promise<void> {
    return new Promise((resolve) => {
      this.animationPromises.set(index, { resolve });
    });
  }

  /**
   * Expand an accordion item
   */
  public async expandItem(index: number): Promise<void> {
    const item = this.items[index];
    if (!item) return;

    const content = item.querySelector('pxm-accordion-content') as HTMLElement;
    const trigger = item.querySelector('pxm-accordion-trigger') as HTMLElement;
    if (!content || !trigger) return;

    // Create animation promise
    const animationPromise = this.createAnimationPromise(index);

    // Dispatch before event
    const beforeEvent = new CustomEvent('pxm:accordion:before-expand', {
      detail: {
        index,
        item,
        content,
        trigger,
        complete: () => {
          this.animationPromises.get(index)?.resolve();
        }
      } as AccordionEventDetail,
      cancelable: true
    });

    const eventPrevented = !this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented;

    if (eventPrevented) {
      // Custom animation - update state first for expand, then wait
      // Set both ARIA (accessibility) and data (styling) attributes
      item.setAttribute('data-expanded', 'true');
      item.setAttribute('data-state', 'active');
      trigger.setAttribute('aria-expanded', 'true');
      this.updateIcon(item, true);

      // Wait for external animation to complete
      await animationPromise;
    } else {
      // Default animation - update state immediately
      // Set both ARIA (accessibility) and data (styling) attributes
      item.setAttribute('data-expanded', 'true');
      item.setAttribute('data-state', 'active');
      trigger.setAttribute('aria-expanded', 'true');
      this.updateIcon(item, true);
      this.animationPromises.get(index)?.resolve();
    }

    // Clean up
    this.animationPromises.delete(index);

    // Dispatch after event
    this.dispatchEvent(new CustomEvent('pxm:accordion:after-expand', {
      detail: { index, item, content, trigger }
    }));
  }

  /**
   * Collapse an accordion item
   */
  public async collapseItem(index: number): Promise<void> {
    const item = this.items[index];
    if (!item) return;

    const content = item.querySelector('pxm-accordion-content') as HTMLElement;
    const trigger = item.querySelector('pxm-accordion-trigger') as HTMLElement;
    if (!content || !trigger) return;

    // Create animation promise
    const animationPromise = this.createAnimationPromise(index);

    // Dispatch before event
    const beforeEvent = new CustomEvent('pxm:accordion:before-collapse', {
      detail: {
        index,
        item,
        content,
        trigger,
        complete: () => {
          this.animationPromises.get(index)?.resolve();
        }
      } as AccordionEventDetail,
      cancelable: true
    });

    const eventPrevented = !this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented;

    // Always update ARIA for accessibility, but delay 'active' for custom animations
    trigger.setAttribute('aria-expanded', 'false');
    this.updateIcon(item, false);

    if (eventPrevented) {
      // Custom animation - delay data attributes until after animation
      await animationPromise;
      // Now update state after animation is complete
      // Set both ARIA (accessibility) and data (styling) attributes
      item.setAttribute('data-expanded', 'false');
      item.setAttribute('data-state', 'inactive');
    } else {
      // Default animation - update state immediately
      // Set both ARIA (accessibility) and data (styling) attributes
      item.setAttribute('data-expanded', 'false');
      item.setAttribute('data-state', 'inactive');
      this.animationPromises.get(index)?.resolve();
    }

    // Clean up
    this.animationPromises.delete(index);

    // Dispatch after event
    this.dispatchEvent(new CustomEvent('pxm:accordion:after-collapse', {
      detail: { index, item, content, trigger }
    }));
  }

  /**
   * Toggle an accordion item's state
   */
  public async toggleItem(index: number): Promise<void> {
    // Prevent multiple animations
    if (this.state.isAnimating) {
      return;
    }

    this.state.isAnimating = true;

    try {
      const isActive = this.state.activeItems.has(index);

      // Dispatch toggle event
      this.dispatchEvent(new CustomEvent('pxm:accordion:toggle', {
        detail: {
          index,
          item: this.items[index],
          isExpanding: !isActive
        } as AccordionToggleEventDetail
      }));

      if (isActive) {
        await this.collapseItem(index);
        // Don't manually update state here - let syncStateFromDOM handle it
      } else {
        if (!this.config['allow-multiple']) {
          // Close other items first
          const openIndexes = Array.from(this.state.activeItems);
          for (const openIndex of openIndexes) {
            if (openIndex !== index) {
              await this.collapseItem(openIndex);
            }
          }
        }
        await this.expandItem(index);
        // Don't manually update state here - let syncStateFromDOM handle it
      }
    } finally {
      this.state.isAnimating = false;
    }
  }

  /**
   * Remove default animation listeners (useful when using custom animation libraries)
   */
  public removeDefaultAnimations(): void {
    // Set flags to prevent default animations
    this.hasCustomAnimations = true;
    this.shouldSkipDefaultAnimations = true;

    // Remove any existing default listeners
    this.defaultListeners.forEach((listener, eventType) => {
      this.removeEventListener(eventType, listener);
    });
    this.defaultListeners.clear();
  }

  /**
   * Public API methods
   */
  public async expandAll(): Promise<void> {
    if (!this.config['allow-multiple']) return;

    for (let i = 0; i < this.items.length; i++) {
      if (!this.state.activeItems.has(i)) {
        await this.expandItem(i);
        this.state.activeItems.add(i);
      }
    }
  }

  public async collapseAll(): Promise<void> {
    const openIndexes = Array.from(this.state.activeItems);
    for (const index of openIndexes) {
      await this.collapseItem(index);
      this.state.activeItems.delete(index);
    }
  }

  public getActiveItems(): number[] {
    return Array.from(this.state.activeItems);
  }

  public isItemActive(index: number): boolean {
    return this.state.activeItems.has(index);
  }

  /**
   * Clean up all event listeners for all items
   */
  private cleanupAllEventListeners(): void {
    this.items.forEach((item) => {
      this.cleanupItemEventListeners(item);
    });
  }

  /**
   * Clean up event listeners for a specific item
   */
  private cleanupItemEventListeners(item: HTMLElement): void {
    const listeners = this.itemEventListeners.get(item);
    if (listeners) {
      const trigger = item.querySelector('pxm-accordion-trigger') as HTMLElement;
      if (trigger) {
        listeners.forEach((listener, eventType) => {
          trigger.removeEventListener(eventType, listener);
        });
      }
      this.itemEventListeners.delete(item);
    }
  }

  /**
   * Add an event listener to an item and track it for cleanup
   */
  private addItemEventListener(item: HTMLElement, element: HTMLElement, eventType: string, listener: EventListener): void {
    if (!this.itemEventListeners.has(item)) {
      this.itemEventListeners.set(item, new Map());
    }

    const listeners = this.itemEventListeners.get(item)!;

    // Remove old listener if exists
    const oldListener = listeners.get(eventType);
    if (oldListener) {
      element.removeEventListener(eventType, oldListener);
    }

    // Add new listener
    element.addEventListener(eventType, listener);
    listeners.set(eventType, listener);
  }
}

// Define the custom elements
customElements.define('pxm-accordion', PxmAccordion);

// Accordion Item Component
class PxmAccordionItem extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define('pxm-accordion-item', PxmAccordionItem);

// Accordion Trigger Component
class PxmAccordionTrigger extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define('pxm-accordion-trigger', PxmAccordionTrigger);

// Accordion Content Component
class PxmAccordionContent extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define('pxm-accordion-content', PxmAccordionContent);

// Export types for TypeScript users
export type { PxmAccordion };
export type { PxmAccordionItem };
export type { PxmAccordionTrigger };
export type { PxmAccordionContent };

// Make classes available globally for advanced usage
if (typeof window !== 'undefined') {
  (window as any).PxmAccordion = PxmAccordion;
  (window as any).PxmAccordionItem = PxmAccordionItem;
  (window as any).PxmAccordionTrigger = PxmAccordionTrigger;
  (window as any).PxmAccordionContent = PxmAccordionContent;
}