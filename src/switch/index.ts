/**
 * PXM Switch Component
 *
 * A logic-only, accessible switch (toggle) component with thumb sub-component for enhanced styling control.
 * No Shadow DOM, no styling—bring your own CSS. Follows the PXM Elements architecture.
 *
 * Features:
 * - Accessible (manages aria-checked, aria-disabled, tabindex)
 * - Keyboard support (Space/Enter toggles)
 * - Event-driven animation system (bring your own animation library)
 * - Dynamic content support
 * - Dual-attribute pattern: ARIA for accessibility, data attributes for styling/JS
 * - Thumb sub-component for enhanced styling control
 *
 * Basic Usage:
 * ```html
 * <pxm-switch>
 *   <pxm-switch-thumb></pxm-switch-thumb>
 * </pxm-switch>
 * ```
 *
 * With Animation Library (via events):
 * ```javascript
 * const sw = document.querySelector('pxm-switch');
 * 
 * sw.addEventListener('pxm:switch:before-toggle', (e) => {
 *   const { thumb, checked, complete } = e.detail;
 *   e.preventDefault(); // Take over the animation
 *   
 *   gsap.to(thumb, {
 *     x: checked ? 20 : 0,
 *     duration: 0.2,
 *     onComplete: complete // Signal animation complete
 *   });
 * });
 * ```
 *
 * Accessibility:
 * This component manages both ARIA attributes (for accessibility) and data attributes (for styling/JS).
 * - ARIA attributes (aria-checked, aria-disabled) are automatically managed for screen readers
 * - Data attributes (data-state, data-disabled) are provided for CSS styling and JavaScript hooks
 * - Additional ARIA attributes, labels, and roles should be added by the consumer as needed
 *
 * Events:
 * - `pxm:switch:before-toggle` - Cancelable. Fired before toggle starts.
 * - `pxm:switch:after-toggle` - Fired after toggle completes.
 * - `pxm:switch:state-sync` - Fired when internal state syncs with manually changed DOM attributes.
 */

import { parseAttributes, withErrorBoundary, type AttributeSchema } from '../core/component-utils';

const SWITCH_SCHEMA: AttributeSchema = {
  'checked': { type: 'boolean', default: false },
  'disabled': { type: 'boolean', default: false }
};

interface SwitchState {
  checked: boolean;
  disabled: boolean;
}

export interface SwitchToggleEventDetail {
  checked: boolean;
  element: HTMLElement;
  thumb?: HTMLElement;
  complete: () => void;
}

class PxmSwitch extends HTMLElement {
  private config: Record<string, any> = {};
  private state: SwitchState = { checked: false, disabled: false };
  private mutationObserver?: MutationObserver;
  private animationPromises = new Map<string, { resolve: () => void }>();
  private isUpdatingState = false;

  private get thumb(): HTMLElement | null {
    return this.querySelector('pxm-switch-thumb');
  }

  static get observedAttributes(): string[] {
    return Object.keys(SWITCH_SCHEMA);
  }

  constructor() {
    super();
    // NO Shadow DOM - never use this.attachShadow()
    // Set only functionally necessary attributes (not styling)
  }

  connectedCallback(): void {
    withErrorBoundary(() => {
      this.config = parseAttributes(this, SWITCH_SCHEMA);
      this.state.checked = !!this.config.checked;
      this.state.disabled = !!this.config.disabled;
      this.initializeComponent();
      this.setupEventListeners();
      this.observeAttributeChanges();
    })();
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.handleClick);
    this.removeEventListener('keydown', this.handleKeyDown);
    this.mutationObserver?.disconnect();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue || this.isUpdatingState) return;
    
    this.config = parseAttributes(this, SWITCH_SCHEMA);
    const oldChecked = this.state.checked;
    const oldDisabled = this.state.disabled;
    
    this.state.checked = !!this.config.checked;
    this.state.disabled = !!this.config.disabled;
    
    this.updateState();
    
    // Only dispatch sync event if state actually changed
    if (oldChecked !== this.state.checked || oldDisabled !== this.state.disabled) {
      this.dispatchEvent(new CustomEvent('pxm:switch:state-sync', {
        detail: { 
          checked: this.state.checked, 
          disabled: this.state.disabled, 
          element: this,
          thumb: this.thumb 
        },
        bubbles: true
      }));
    }
  }

  private initializeComponent(): void {
    // Set essential ARIA attributes
    this.setAttribute('role', 'switch');
    this.updateState();
  }

  private observeAttributeChanges(): void {
    this.mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && 
            mutation.attributeName && 
            SWITCH_SCHEMA[mutation.attributeName] &&
            !this.isUpdatingState) {
          
          const oldValue = mutation.oldValue;
          const newValue = this.getAttribute(mutation.attributeName);
          
          if (oldValue !== newValue) {
            this.attributeChangedCallback(mutation.attributeName, oldValue || '', newValue || '');
          }
        }
      }
    });
    
    this.mutationObserver.observe(this, { 
      attributes: true, 
      attributeOldValue: true,
      attributeFilter: Object.keys(SWITCH_SCHEMA)
    });
  }

  private setupEventListeners(): void {
    this.addEventListener('click', this.handleClick);
    this.addEventListener('keydown', this.handleKeyDown);
  }

  private updateState(): void {
    this.isUpdatingState = true;
    
    // ARIA attributes for accessibility
    this.setAttribute('aria-checked', String(this.state.checked));
    this.setAttribute('aria-disabled', String(this.state.disabled));
    
    // Data attributes for CSS/JS targeting
    this.setAttribute('data-state', this.state.checked ? 'on' : 'off');
    this.setAttribute('data-disabled', String(this.state.disabled));
    
    // Tabindex management
    this.tabIndex = this.state.disabled ? -1 : 0;
    
    // Update thumb data attributes if it exists
    if (this.thumb) {
      this.thumb.setAttribute('data-state', this.state.checked ? 'on' : 'off');
      this.thumb.setAttribute('data-disabled', String(this.state.disabled));
    }
    
    this.isUpdatingState = false;
  }

  private handleClick = (evt: MouseEvent): void => {
    if (this.state.disabled) return;
    evt.preventDefault();
    this.toggle();
  };

  private handleKeyDown = (evt: KeyboardEvent): void => {
    if (this.state.disabled) return;
    if (evt.key === ' ' || evt.key === 'Enter') {
      evt.preventDefault();
      this.toggle();
    }
  };

  private createAnimationPromise(id: string): Promise<void> {
    return new Promise<void>((resolve) => {
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

  public async toggle(): Promise<void> {
    if (this.state.disabled) return;

    const newChecked = !this.state.checked;
    const animationId = `toggle-${Date.now()}`;
    
    // Dispatch cancelable before event
    const beforeEvent = new CustomEvent<SwitchToggleEventDetail>('pxm:switch:before-toggle', {
      detail: {
        checked: newChecked,
        element: this,
        thumb: this.thumb || undefined,
        complete: () => this.resolveAnimation(animationId)
      },
      cancelable: true,
      bubbles: true
    });

    const eventPrevented = !this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented;

    // Update state
    this.state.checked = newChecked;
    this.setAttribute('checked', String(this.state.checked));
    this.updateState();

    if (eventPrevented) {
      // Wait for custom animation
      await this.createAnimationPromise(animationId);
    }

    // Dispatch after event
    this.dispatchEvent(new CustomEvent('pxm:switch:after-toggle', {
      detail: { 
        checked: this.state.checked, 
        element: this,
        thumb: this.thumb || undefined
      },
      bubbles: true
    }));
  }

  public isChecked(): boolean {
    return this.state.checked;
  }

  public setChecked(checked: boolean): void {
    if (this.state.checked !== checked) {
      this.state.checked = checked;
      this.setAttribute('checked', String(checked));
      this.updateState();
    }
  }

  public isDisabled(): boolean {
    return this.state.disabled;
  }

  public setDisabled(disabled: boolean): void {
    if (this.state.disabled !== disabled) {
      this.state.disabled = disabled;
      this.setAttribute('disabled', String(disabled));
      this.updateState();
    }
  }
}

// Thumb sub-component
class PxmSwitchThumb extends HTMLElement {
  constructor() {
    super();
    // Simple placeholder component for styling
  }
}

// Register components
customElements.define('pxm-switch', PxmSwitch);
customElements.define('pxm-switch-thumb', PxmSwitchThumb);

// Global assignment for advanced usage
if (typeof window !== 'undefined') {
  (window as any).PxmSwitch = PxmSwitch;
  (window as any).PxmSwitchThumb = PxmSwitchThumb;
} 