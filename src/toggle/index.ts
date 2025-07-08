/**
 * PXM Toggle Component
 * 
 * A two-state button that can be either on or off. Perfect for toggleable UI states like formatting buttons.
 * This component provides structure and behavior only - all styling is controlled by your CSS.
 * 
 * Features:
 * - Full keyboard support (Enter, Space)
 * - Event-driven animation system for custom animations
 * - CSS-based styling via state attributes
 * - Button semantics with pressed state
 * - Dynamic attribute synchronization
 * - Lightweight and performant
 * 
 * Keyboard Navigation:
 * - `Enter` or `Space` - Toggle the button state
 * 
 * Basic Usage:
 * ```html
 * <!-- Formatting toggle -->
 * <pxm-toggle aria-label="Toggle italic">
 *   <svg><!-- italic icon --></svg>
 * </pxm-toggle>
 * 
 * <!-- Pre-pressed toggle -->
 * <pxm-toggle pressed="true" aria-label="Toggle bold">
 *   <svg><!-- bold icon --></svg>
 * </pxm-toggle>
 * 
 * <!-- Form integration toggle -->
 * <pxm-toggle form="true" name="notifications" aria-label="Enable notifications">
 *   <svg><!-- notification icon --></svg>
 * </pxm-toggle>
 * 
 * <!-- Disabled toggle -->
 * <pxm-toggle disabled="true" aria-label="Toggle underline">
 *   <svg><!-- underline icon --></svg>
 * </pxm-toggle>
 * ```
 * 
 * Dynamic Content:
 * ```javascript
 * // Programmatic control
 * const toggle = document.querySelector('pxm-toggle');
 * toggle.checked = true;
 * toggle.disabled = false;
 * 
 * // Listen for changes
 * toggle.addEventListener('pxm:toggle:change', (e) => {
 *   console.log(`Toggle is now ${e.detail.checked ? 'ON' : 'OFF'}`);
 * });
 * ```
 * 
 * With Animation Library (via events - recommended for CDN):
 * ```javascript
 * const toggle = document.querySelector('pxm-toggle');
 * 
 * toggle.addEventListener('pxm:toggle:before-change', (e) => {
 *   const { element, checked, complete } = e.detail;
 *   e.preventDefault(); // Take over the animation
 *   
 *   // Custom animation with GSAP, Anime.js, etc.
 *   gsap.to(element, {
 *     scale: checked ? 1.1 : 1.0,
 *     duration: 0.2,
 *     ease: "back.out(1.7)",
 *     onComplete: () => {
 *       complete(); // Signal animation complete
 *     }
 *   });
 * });
 * ```
 * 
 * With CSS Transitions:
 * ```css
 * pxm-toggle {
 *   transition: all 0.3s ease;
 * }
 * 
 * pxm-toggle[data-state="on"] {
 *   background-color: #3b82f6;
 * }
 * 
 * pxm-toggle[data-disabled="true"] {
 *   opacity: 0.5;
 *   cursor: not-allowed;
 * }
 * ```
 * 
 * With Tailwind CSS:
 * ```html
 * <pxm-toggle 
 *   class="px-4 py-2 rounded transition-all
 *          data-[state=on]:bg-blue-500 data-[state=on]:text-white
 *          data-[state=off]:bg-gray-200 data-[state=off]:text-gray-700
 *          data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed"
 *   aria-label="Toggle notifications">
 *   <span>Notifications</span>
 * </pxm-toggle>
 * ```
 * 
 * Consumer Styling Examples:
 * Style the toggle element directly with CSS. Use data-state="on|off" and 
 * data-disabled="true" attributes to target different states. The component 
 * provides no default styling - you have complete control over appearance.
 * 
 * SSR / Hydration Support:
 * ```css
 * / Prevent hydration flash /
 * pxm-toggle:not(:defined) {
 *   opacity: 0;
 * }
 * 
 * pxm-toggle {
 *   opacity: 1;
 *   transition: opacity 0.1s ease;
 * }
 * ```
 * 
 * Events:
 * - `pxm:toggle:before-change` - Cancelable. Fired before toggle state changes.
 * - `pxm:toggle:after-change` - Fired after toggle state changes.
 * - `pxm:toggle:change` - Fired when toggle state changes (for compatibility).
 * 
 * Accessibility:
 * This component implements the dual-attribute pattern:
 * - ARIA attributes (aria-pressed, aria-disabled) for screen readers and assistive technology
 * - Data attributes (data-state, data-disabled) for CSS styling and JavaScript interaction
 * Additional ARIA attributes, labels, and roles should be added by the consumer as needed.
 */

import { parseAttributes, withErrorBoundary, type AttributeSchema } from '../core/component-utils';

const TOGGLE_SCHEMA: AttributeSchema = {
  'pressed': { type: 'boolean', default: false },
  'disabled': { type: 'boolean', default: false },
  'form': { type: 'boolean', default: false },
  'name': { type: 'string', default: '' }
};

interface ToggleState {
  isAnimating: boolean;
}

// Event detail types
export interface ToggleEventDetail {
  pressed: boolean;
  element: HTMLElement;
  complete: () => void;
}

export interface TogglePressedChangeEventDetail {
  pressed: boolean;
  element: HTMLElement;
}

export class PxmToggle extends HTMLElement {
  private config: Record<string, any> = {};
  private state: ToggleState = {
    isAnimating: false
  };
  private input?: HTMLInputElement;
  private animationPromises = new Map<string, { resolve: () => void }>();

  static get observedAttributes(): string[] {
    return Object.keys(TOGGLE_SCHEMA);
  }

  constructor() {
    super();
    // NO Shadow DOM - consumers control all styling
    // Only set functionally necessary attributes
    this.setAttribute('role', 'button');
    this.setAttribute('type', 'button');
  }

  connectedCallback(): void {
    withErrorBoundary(() => {
      this.config = parseAttributes(this, TOGGLE_SCHEMA);
      this.setupToggle();
      this.updateState();
    })();
  }

  disconnectedCallback(): void {
    // Clean up any animation promises
    this.state.isAnimating = false;
    this.animationPromises.forEach(({ resolve }) => resolve());
    this.animationPromises.clear();
  }

  attributeChangedCallback(_: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    
    this.config = parseAttributes(this, TOGGLE_SCHEMA);
    this.updateState();
  }





  private setupToggle(): void {
    // Create hidden checkbox for form integration if form="true"
    if (this.config.form) {
      this.input = this.querySelector('input[type="checkbox"]') || this.createHiddenCheckbox();
    }

    // Set up click handler
    this.addEventListener('click', withErrorBoundary(() => {
      if (!this.config.disabled && !this.state.isAnimating) {
        this.toggle();
      }
    }));

    // Set up keyboard handler  
    this.addEventListener('keydown', withErrorBoundary((event: KeyboardEvent) => {
      if ((event.key === 'Enter' || event.key === ' ') && !this.config.disabled && !this.state.isAnimating) {
        event.preventDefault();
        this.toggle();
      }
    }));

    // Make focusable if not already set
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  private createHiddenCheckbox(): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.style.display = 'none';
    input.name = this.config.name;
    input.checked = this.config.pressed;
    this.appendChild(input);
    return input;
  }

  private updateState(): void {
    const isPressed = this.config.pressed;
    const isDisabled = this.config.disabled;

    // Dual-attribute pattern: Set both ARIA (accessibility) and data (styling) attributes
    
    // ARIA attributes for screen readers and assistive technology
    this.setAttribute('aria-pressed', String(isPressed));
    
    if (isDisabled) {
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute('aria-disabled');
    }

    // Data attributes for CSS targeting and JavaScript interaction
    this.setAttribute('data-state', isPressed ? 'on' : 'off');
    
    if (isDisabled) {
      this.setAttribute('data-disabled', 'true');
      this.setAttribute('tabindex', '-1');
    } else {
      this.removeAttribute('data-disabled');
      this.setAttribute('tabindex', '0');
    }

    // Update hidden checkbox for form submission (if form="true")
    if (this.input) {
      this.input.checked = isPressed;
      this.input.name = this.config.name;
    }
  }

  /**
   * Create a promise that resolves when animation completes
   */
  private createAnimationPromise(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.animationPromises.set(id, { resolve });
    });
  }

  /**
   * Resolve an animation promise
   */
  private resolveAnimation(id: string): void {
    const promise = this.animationPromises.get(id);
    if (promise) {
      promise.resolve();
      this.animationPromises.delete(id);
    }
  }

  private async toggle(): Promise<void> {
    if (this.state.isAnimating) {
      return;
    }
    
    this.state.isAnimating = true;
    const newPressed = !this.config.pressed;
    const animationId = `toggle-${Date.now()}`;

    try {
      // Dispatch cancelable before event
      const beforeEvent = new CustomEvent('pxm:toggle:before-change', {
        detail: {
          pressed: newPressed,
          element: this,
          complete: () => this.resolveAnimation(animationId)
        },
        cancelable: true
      });

      const eventPrevented = !this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented;

      if (eventPrevented) {
        // Wait for custom animation
        await this.createAnimationPromise(animationId);
      }

      // Update state
      this.config.pressed = newPressed;
      this.setAttribute('pressed', String(newPressed));

      // Dispatch after event
      this.dispatchEvent(new CustomEvent('pxm:toggle:after-change', {
        detail: {
          pressed: newPressed,
          element: this
        }
      }));

      // Dispatch pressed change event
      this.dispatchEvent(new CustomEvent('pxm:toggle:pressed-change', {
        detail: {
          pressed: newPressed,
          element: this
        },
        bubbles: true
      }));

    } finally {
      this.state.isAnimating = false;
    }
  }

  // Public API
  /**
   * Get the current pressed state
   */
  get pressed(): boolean {
    return this.config.pressed;
  }

  /**
   * Set the pressed state
   */
  set pressed(value: boolean) {
    this.setAttribute('pressed', String(value));
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
   * Get the form integration state
   */
  get form(): boolean {
    return this.config.form;
  }

  /**
   * Set the form integration state
   */
  set form(value: boolean) {
    this.setAttribute('form', String(value));
  }

  /**
   * Get the form name (only used when form="true")
   */
  get name(): string {
    return this.config.name;
  }

  /**
   * Set the form name (only used when form="true")
   */
  set name(value: string) {
    this.setAttribute('name', value);
  }



  /**
   * Programmatically toggle the button
   */
  public async performToggle(): Promise<void> {
    if (!this.config.disabled) {
      await this.toggle();
    }
  }

  /**
   * Check if the toggle is currently animating
   */
  public isAnimating(): boolean {
    return this.state.isAnimating;
  }


}

// Register the custom element
customElements.define('pxm-toggle', PxmToggle);

// Make available globally for advanced usage
if (typeof window !== 'undefined') {
  (window as any).PxmToggle = PxmToggle;
}

/**
 * Public TypeScript interface for the Toggle Component
 */
export interface PxmToggle extends HTMLElement {
  /**
   * Get/set the pressed state
   */
  pressed: boolean;
  
  /**
   * Get/set the disabled state
   */
  disabled: boolean;

  /**
   * Get/set the form integration state
   */
  form: boolean;

  /**
   * Get/set the form name (only used when form="true")
   */
  name: string;
  
  /**
   * Programmatically toggle the button
   */
  performToggle(): Promise<void>;
  
  /**
   * Check if the toggle is currently animating
   */
  isAnimating(): boolean;
} 