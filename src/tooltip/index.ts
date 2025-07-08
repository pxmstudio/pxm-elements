/**
 * PXM Tooltip Component
 * 
 * A flexible tooltip system with trigger-based activation and intelligent positioning.
 * This component provides structure and behavior only - all styling is controlled by your CSS.
 * 
 * Features:
 * - Multiple positioning options (top, bottom, left, right)
 * - Hover and focus triggers with configurable delays
 * - Keyboard support (Escape to close)
 * - Event-driven animation system for custom animations
 * - CSS-based styling via state attributes
 * - Portal rendering for z-index management
 * - Dynamic content support
 * - Lightweight and performant
 * 
 * Basic Usage:
 * ```html
 * <pxm-tooltip>
 *   <pxm-tooltip-trigger>
 *     <button>Hover me</button>
 *   </pxm-tooltip-trigger>
 *   <pxm-tooltip-content>
 *     This is a helpful tooltip!
 *   </pxm-tooltip-content>
 * </pxm-tooltip>
 * ```
 * 
 * Events:
 * - pxm:tooltip:before-show - Cancelable. Fired before tooltip shows.
 * - pxm:tooltip:after-show - Fired after tooltip shows.
 * - pxm:tooltip:show - Fired when tooltip shows (for compatibility).
 * - pxm:tooltip:before-hide - Cancelable. Fired before tooltip hides.
 * - pxm:tooltip:after-hide - Fired after tooltip hides.
 * - pxm:tooltip:hide - Fired when tooltip hides (for compatibility).
 * 
 * Accessibility:
 * This component implements the dual-attribute pattern:
 * - ARIA attributes (aria-describedby, aria-expanded) for screen readers and assistive technology
 * - Data attributes (data-state, data-side, data-disabled) for CSS styling and JavaScript interaction
 * Additional ARIA attributes, labels, and roles should be added by the consumer as needed.
 */

import { parseAttributes, withErrorBoundary, setupKeyboardNav, type AttributeSchema } from '../core/component-utils';

const TOOLTIP_SCHEMA: AttributeSchema = {
  'side': { type: 'string', default: 'top' },
  'delay-open': { type: 'number', default: 700 },
  'delay-close': { type: 'number', default: 300 },
  'disabled': { type: 'boolean', default: false },
  'portal': { type: 'boolean', default: false },
  'open': { type: 'boolean', default: false }
};

interface TooltipState {
  isOpen: boolean;
  isAnimating: boolean;
  isHovering: boolean;
  isFocused: boolean;
  openTimeout?: number;
  closeTimeout?: number;
}

// Event detail types
export interface TooltipEventDetail {
  content: HTMLElement;
  trigger: HTMLElement;
  element: HTMLElement;
  complete: () => void;
}

export interface TooltipStateEventDetail {
  content: HTMLElement;
  trigger: HTMLElement;
  element: HTMLElement;
  open: boolean;
}

class PxmTooltip extends HTMLElement {
  private config: Record<string, any> = {};
  private state: TooltipState = {
    isOpen: false,
    isAnimating: false,
    isHovering: false,
    isFocused: false
  };
  private trigger?: PxmTooltipTrigger;
  private content?: PxmTooltipContent;
  private arrow?: PxmTooltipArrow;
  private mutationObserver?: MutationObserver;
  private animationPromises = new Map<string, { resolve: () => void }>();
  private portalContainer?: HTMLElement;
  private resizeObserver?: ResizeObserver;

  static get observedAttributes(): string[] {
    return Object.keys(TOOLTIP_SCHEMA);
  }

  constructor() {
    super();
    // NO Shadow DOM - consumers control all styling
  }

  connectedCallback(): void {
    withErrorBoundary(() => {
      this.config = parseAttributes(this, TOOLTIP_SCHEMA);
      this.setupTooltip();
      this.updateState();
      this.observeChanges();
    })();
  }

  disconnectedCallback(): void {
    this.cleanup();
  }

  attributeChangedCallback(_name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    
    this.config = parseAttributes(this, TOOLTIP_SCHEMA);
    this.updateState();
  }

  private setupTooltip(): void {
    // Find child components
    this.trigger = this.querySelector('pxm-tooltip-trigger') as PxmTooltipTrigger;
    this.content = this.querySelector('pxm-tooltip-content') as PxmTooltipContent;
    this.arrow = this.querySelector('pxm-tooltip-arrow') as PxmTooltipArrow;

    if (!this.trigger || !this.content) {
      console.warn('Tooltip missing required trigger or content elements:', this);
      return;
    }

    // Setup portal if requested
    if (this.config.portal) {
      this.setupPortal();
    }

    // Setup trigger events
    this.setupTriggerEvents();

    // Setup keyboard navigation
    this.setupKeyboardHandling();

    // Set up initial positioning
    this.setupPositioning();
  }

  private setupPortal(): void {
    if (!this.content) return;

    // Create portal container in body
    this.portalContainer = document.createElement('div');
    this.portalContainer.style.position = 'absolute';
    this.portalContainer.style.top = '0';
    this.portalContainer.style.left = '0';
    this.portalContainer.style.zIndex = '9999';
    document.body.appendChild(this.portalContainer);

    // Move content to portal
    this.portalContainer.appendChild(this.content);
  }

  private setupTriggerEvents(): void {
    if (!this.trigger) return;

    const triggerElement = this.trigger.querySelector('*') || this.trigger;

    // Mouse events
    triggerElement.addEventListener('mouseenter', withErrorBoundary(() => {
      if (!this.config.disabled) {
        this.state.isHovering = true;
        this.scheduleShow();
      }
    }));

    triggerElement.addEventListener('mouseleave', withErrorBoundary(() => {
      this.state.isHovering = false;
      this.scheduleHide();
    }));

    // Focus events
    triggerElement.addEventListener('focus', withErrorBoundary(() => {
      if (!this.config.disabled) {
        this.state.isFocused = true;
        this.scheduleShow();
      }
    }));

    triggerElement.addEventListener('blur', withErrorBoundary(() => {
      this.state.isFocused = false;
      this.scheduleHide();
    }));

    // Content hover (prevent hiding when hovering content)
    if (this.content) {
      this.content.addEventListener('mouseenter', withErrorBoundary(() => {
        this.state.isHovering = true;
        this.clearHideTimeout();
      }));

      this.content.addEventListener('mouseleave', withErrorBoundary(() => {
        this.state.isHovering = false;
        this.scheduleHide();
      }));
    }
  }

  private setupKeyboardHandling(): void {
    setupKeyboardNav(this, {
      'Escape': withErrorBoundary(() => {
        if (this.state.isOpen) {
          this.hide();
        }
      })
    });
  }

  private setupPositioning(): void {
    if (!this.content || !this.trigger) return;

    // Set up resize observer for dynamic positioning
    this.resizeObserver = new ResizeObserver(withErrorBoundary(() => {
      if (this.state.isOpen) {
        this.updatePosition();
      }
    }));

    this.resizeObserver.observe(this.trigger);
    this.resizeObserver.observe(document.body);
  }

  private scheduleShow(): void {
    this.clearHideTimeout();
    
    if (this.state.isOpen || this.state.isAnimating) {
      return;
    }

    this.state.openTimeout = window.setTimeout(() => {
      if (this.state.isHovering || this.state.isFocused) {
        this.show();
      }
    }, this.config['delay-open']);
  }

  private scheduleHide(): void {
    this.clearShowTimeout();

    if (!this.state.isOpen || this.state.isAnimating) {
      return;
    }

    this.state.closeTimeout = window.setTimeout(() => {
      if (!this.state.isHovering && !this.state.isFocused) {
        this.hide();
      }
    }, this.config['delay-close']);
  }

  private clearShowTimeout(): void {
    if (this.state.openTimeout) {
      clearTimeout(this.state.openTimeout);
      this.state.openTimeout = undefined;
    }
  }

  private clearHideTimeout(): void {
    if (this.state.closeTimeout) {
      clearTimeout(this.state.closeTimeout);
      this.state.closeTimeout = undefined;
    }
  }

  private updatePosition(): void {
    if (!this.content || !this.trigger) return;

    const triggerRect = this.trigger.getBoundingClientRect();
    const contentRect = this.content.getBoundingClientRect();
    
    this.calculateTooltipPosition(triggerRect, contentRect);
  }

  private calculateTooltipPosition(triggerRect: DOMRect, contentRect: DOMRect): void {
    if (!this.content || !this.trigger) return;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const gap = 8; // Gap between trigger and content

    let top = 0;
    let left = 0;
    let actualSide = this.config.side;

    // Calculate position based on side
    switch (this.config.side) {
      case 'top':
        top = triggerRect.top - contentRect.height - gap;
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
        
        // Flip to bottom if not enough space
        if (top < 0) {
          actualSide = 'bottom';
          top = triggerRect.bottom + gap;
        }
        break;

      case 'bottom':
        top = triggerRect.bottom + gap;
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
        
        // Flip to top if not enough space
        if (top + contentRect.height > viewportHeight) {
          actualSide = 'top';
          top = triggerRect.top - contentRect.height - gap;
        }
        break;

      case 'left':
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        left = triggerRect.left - contentRect.width - gap;
        
        // Flip to right if not enough space
        if (left < 0) {
          actualSide = 'right';
          left = triggerRect.right + gap;
        }
        break;

      case 'right':
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        left = triggerRect.right + gap;
        
        // Flip to left if not enough space
        if (left + contentRect.width > viewportWidth) {
          actualSide = 'left';
          left = triggerRect.left - contentRect.width - gap;
        }
        break;
    }

    // Adjust horizontal position to stay in viewport
    if (left < 0) {
      left = 8;
    } else if (left + contentRect.width > viewportWidth) {
      left = viewportWidth - contentRect.width - 8;
    }

    // Adjust vertical position to stay in viewport
    if (top < 0) {
      top = 8;
    } else if (top + contentRect.height > viewportHeight) {
      top = viewportHeight - contentRect.height - 8;
    }

    // Provide positioning data as CSS custom properties and data attributes
    // Consumer CSS can use these values for positioning
    this.content.style.setProperty('--tooltip-top', top + 'px');
    this.content.style.setProperty('--tooltip-left', left + 'px');
    this.content.style.setProperty('--tooltip-position-type', this.config.portal ? 'fixed' : 'absolute');
    
    // Update side data attribute for styling
    this.setAttribute('data-side', actualSide);
    
    // Update arrow positioning if present
    if (this.arrow) {
      this.updateArrowPosition(actualSide, triggerRect, contentRect);
    }
  }

  private updateArrowPosition(side: string, triggerRect: DOMRect, contentRect: DOMRect): void {
    if (!this.arrow) return;

    this.arrow.setAttribute('data-side', side);
    
    // Position arrow based on side - provide as CSS custom properties
    switch (side) {
      case 'top':
      case 'bottom':
        const horizontalCenter = triggerRect.left + triggerRect.width / 2 - contentRect.left;
        const arrowLeft = Math.max(12, Math.min(horizontalCenter, contentRect.width - 12));
        this.arrow.style.setProperty('--arrow-left', arrowLeft + 'px');
        this.arrow.style.removeProperty('--arrow-top');
        break;
        
      case 'left':
      case 'right':
        const verticalCenter = triggerRect.top + triggerRect.height / 2 - contentRect.top;
        const arrowTop = Math.max(12, Math.min(verticalCenter, contentRect.height - 12));
        this.arrow.style.setProperty('--arrow-top', arrowTop + 'px');
        this.arrow.style.removeProperty('--arrow-left');
        break;
    }
  }

  private createAnimationPromise(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.animationPromises.set(id, { resolve });
    });
  }

  private resolveAnimation(id: string): void {
    const promise = this.animationPromises.get(id);
    if (promise) {
      promise.resolve();
      this.animationPromises.delete(id);
    }
  }

  private async show(): Promise<void> {
    if (this.state.isOpen || this.state.isAnimating || this.config.disabled) {
      return;
    }

    if (!this.content || !this.trigger) {
      console.warn('Cannot show tooltip: missing content or trigger');
      return;
    }

    this.state.isAnimating = true;
    const animationId = 'show-' + Date.now();

    try {
      // Update position before showing
      this.updatePosition();

      // Dispatch cancelable before event
      const beforeEvent = new CustomEvent('pxm:tooltip:before-show', {
        detail: {
          content: this.content,
          trigger: this.trigger,
          element: this,
          complete: () => this.resolveAnimation(animationId)
        },
        cancelable: true
      });

      const eventPrevented = !this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented;

      // Update state first - CSS will handle visibility via data attributes
      this.state.isOpen = true;
      this.config.open = true;
      this.setAttribute('open', 'true');
      this.updateState();

      if (eventPrevented) {
        // Wait for custom animation
        await this.createAnimationPromise(animationId);
      } else {
        // Default show behavior - state is updated, CSS handles the rest
        // Consumer CSS should target [data-state="open"] for showing
      }

      // Dispatch after event
      this.dispatchEvent(new CustomEvent('pxm:tooltip:after-show', {
        detail: {
          content: this.content,
          trigger: this.trigger,
          element: this,
          open: true
        }
      }));

      // Dispatch show event for compatibility
      this.dispatchEvent(new CustomEvent('pxm:tooltip:show', {
        detail: {
          content: this.content,
          trigger: this.trigger,
          element: this,
          open: true
        }
      }));

    } finally {
      this.state.isAnimating = false;
    }
  }

  private async hide(): Promise<void> {
    if (!this.state.isOpen || this.state.isAnimating) {
      return;
    }

    if (!this.content || !this.trigger) {
      return;
    }

    this.state.isAnimating = true;
    const animationId = 'hide-' + Date.now();

    try {
      // Dispatch cancelable before event
      const beforeEvent = new CustomEvent('pxm:tooltip:before-hide', {
        detail: {
          content: this.content,
          trigger: this.trigger,
          element: this,
          complete: () => this.resolveAnimation(animationId)
        },
        cancelable: true
      });

      const eventPrevented = !this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented;

      if (eventPrevented) {
        // Wait for custom animation
        await this.createAnimationPromise(animationId);
      } else {
        // Default hide behavior - state will be updated, CSS handles the rest
        // Consumer CSS should target [data-state="closed"] for hiding
      }

      // Update state - CSS will handle visibility via data attributes
      this.state.isOpen = false;
      this.config.open = false;
      this.removeAttribute('open');
      this.updateState();

      // Dispatch after event
      this.dispatchEvent(new CustomEvent('pxm:tooltip:after-hide', {
        detail: {
          content: this.content,
          trigger: this.trigger,
          element: this,
          open: false
        }
      }));

      // Dispatch hide event for compatibility
      this.dispatchEvent(new CustomEvent('pxm:tooltip:hide', {
        detail: {
          content: this.content,
          trigger: this.trigger,
          element: this,
          open: false
        }
      }));

    } finally {
      this.state.isAnimating = false;
    }
  }

  private updateState(): void {
    const isOpen = this.state.isOpen;
    const isDisabled = this.config.disabled;
    const side = this.config.side;

    // Dual-attribute pattern: Set both ARIA (accessibility) and data (styling) attributes
    
    // ARIA attributes for screen readers and assistive technology
    if (this.trigger && this.content) {
      const triggerId = this.trigger.id || 'tooltip-trigger-' + Date.now();
      const contentId = this.content.id || 'tooltip-content-' + Date.now();
      
      if (!this.trigger.id) this.trigger.id = triggerId;
      if (!this.content.id) this.content.id = contentId;
      
      this.trigger.setAttribute('aria-describedby', isOpen ? contentId : '');
      this.content.setAttribute('role', 'tooltip');
    }

    if (isDisabled) {
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute('aria-disabled');
    }

    // Data attributes for CSS targeting and JavaScript interaction
    this.setAttribute('data-state', isOpen ? 'open' : 'closed');
    this.setAttribute('data-side', side);
    
    if (isDisabled) {
      this.setAttribute('data-disabled', 'true');
    } else {
      this.removeAttribute('data-disabled');
    }

    // Update content attributes - let CSS handle visibility via data-state
    if (this.content) {
      this.content.setAttribute('data-state', isOpen ? 'open' : 'closed');
      this.content.setAttribute('data-side', side);
      
      // Note: Consumer CSS should handle show/hide via:
      // pxm-tooltip-content[data-state="closed"] { display: none; }
      // pxm-tooltip-content[data-state="open"] { display: block; }
    }

    // Update arrow attributes
    if (this.arrow) {
      this.arrow.setAttribute('data-side', side);
    }
  }

  private observeChanges(): void {
    // Observe child changes for dynamic content
    this.mutationObserver = new MutationObserver(withErrorBoundary((mutations) => {
      let shouldReinitialize = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if trigger or content elements were added/removed
          const hasNewTrigger = this.querySelector('pxm-tooltip-trigger');
          const hasNewContent = this.querySelector('pxm-tooltip-content');
          
          if ((hasNewTrigger && !this.trigger) || (hasNewContent && !this.content)) {
            shouldReinitialize = true;
          }
        }
      });
      
      if (shouldReinitialize) {
        this.setupTooltip();
        this.updateState();
      }
    }));

    this.mutationObserver.observe(this, {
      childList: true,
      subtree: true
    });
  }

  private cleanup(): void {
    // Clear timeouts
    this.clearShowTimeout();
    this.clearHideTimeout();

    // Clean up observers
    this.mutationObserver?.disconnect();
    this.resizeObserver?.disconnect();

    // Clean up animation promises
    this.state.isAnimating = false;
    this.animationPromises.forEach(({ resolve }) => resolve());
    this.animationPromises.clear();

    // Clean up portal
    if (this.portalContainer && this.portalContainer.parentNode) {
      this.portalContainer.parentNode.removeChild(this.portalContainer);
    }
  }

  // Public API
  /**
   * Get the current open state
   */
  get open(): boolean {
    return this.state.isOpen;
  }

  /**
   * Set the open state
   */
  set open(value: boolean) {
    if (value && !this.state.isOpen) {
      this.show();
    } else if (!value && this.state.isOpen) {
      this.hide();
    }
  }

  /**
   * Get the current side
   */
  get side(): string {
    return this.config.side;
  }

  /**
   * Set the side
   */
  set side(value: string) {
    this.setAttribute('side', value);
  }

  /**
   * Get the current disabled state
   */
  get disabled(): boolean {
    return this.config.disabled;
  }

  /**
   * Set the disabled state
   */
  set disabled(value: boolean) {
    this.setAttribute('disabled', String(value));
  }

  /**
   * Programmatically show the tooltip
   */
  public async showTooltip(): Promise<void> {
    await this.show();
  }

  /**
   * Programmatically hide the tooltip
   */
  public async hideTooltip(): Promise<void> {
    await this.hide();
  }

  /**
   * Check if the tooltip is currently animating
   */
  public isAnimating(): boolean {
    return this.state.isAnimating;
  }

  /**
   * Remove default animations (useful when using custom animation libraries)
   */
  public removeDefaultAnimations(): void {
    // Mark that default animations should be disabled
    this.setAttribute('data-no-default-animations', 'true');
  }
}

// Sub-component: Trigger
class PxmTooltipTrigger extends HTMLElement {
  connectedCallback(): void {
    // Make focusable if not already set and no focusable child
    if (!this.hasAttribute('tabindex') && !this.querySelector('[tabindex], button, a, input, select, textarea')) {
      this.setAttribute('tabindex', '0');
    }
  }
}

// Sub-component: Content
class PxmTooltipContent extends HTMLElement {
  connectedCallback(): void {
    // Component will manage state - no initial styling needed
    // Consumer CSS handles all appearance and behavior
  }
}

// Sub-component: Arrow
class PxmTooltipArrow extends HTMLElement {
  connectedCallback(): void {
    // Arrow is purely presentational
    this.setAttribute('aria-hidden', 'true');
  }
}

// Register the custom elements
customElements.define('pxm-tooltip', PxmTooltip);
customElements.define('pxm-tooltip-trigger', PxmTooltipTrigger);
customElements.define('pxm-tooltip-content', PxmTooltipContent);
customElements.define('pxm-tooltip-arrow', PxmTooltipArrow);

// Export the main component class for main.ts
export { PxmTooltip };

// Make available globally for advanced usage
if (typeof window !== 'undefined') {
  (window as any).PxmTooltip = PxmTooltip;
  (window as any).PxmTooltipTrigger = PxmTooltipTrigger;
  (window as any).PxmTooltipContent = PxmTooltipContent;
  (window as any).PxmTooltipArrow = PxmTooltipArrow;
} 