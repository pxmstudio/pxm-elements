/**
 * PXM Toggle Component
 * 
 * A simple, accessible toggle/switch component for boolean states.
 * Demonstrates the power of our lightweight utilities.
 */

import { parseAttributes, setAriaAttributes, withErrorBoundary, type AttributeSchema } from '../core/component-utils';

const TOGGLE_SCHEMA: AttributeSchema = {
  'checked': { type: 'boolean', default: false },
  'disabled': { type: 'boolean', default: false },
  'name': { type: 'string', default: '' },
  'value': { type: 'string', default: 'on' }
};

class PxmToggle extends HTMLElement {
    private config: Record<string, any> = {};
    private input?: HTMLInputElement;

    static get observedAttributes(): string[] {
      return Object.keys(TOGGLE_SCHEMA);
    }

    constructor() {
      super();
      this.setAttribute('role', 'switch');
    }

    connectedCallback(): void {
      withErrorBoundary(() => {
        this.config = parseAttributes(this, TOGGLE_SCHEMA);
        this.setupToggle();
        this.updateState();
      })();
    }

    attributeChangedCallback(_name: string, oldValue: string, newValue: string): void {
      if (oldValue === newValue) return;
      
      this.config = parseAttributes(this, TOGGLE_SCHEMA);
      this.updateState();
    }

    private setupToggle(): void {
      // Find or create hidden input for form integration
      this.input = this.querySelector('input[type="hidden"]') || this.createHiddenInput();
      
      // Set up click handler
      this.addEventListener('click', withErrorBoundary(() => {
        if (!this.config.disabled) {
          this.toggle();
        }
      }));

      // Set up keyboard handler  
      this.addEventListener('keydown', withErrorBoundary((event: KeyboardEvent) => {
        if ((event.key === 'Enter' || event.key === ' ') && !this.config.disabled) {
          event.preventDefault();
          this.toggle();
        }
      }));

      // Make focusable
      if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', '0');
      }
    }

    private createHiddenInput(): HTMLInputElement {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = this.config.name;
      input.value = this.config.checked ? this.config.value : '';
      this.appendChild(input);
      return input;
    }

    private updateState(): void {
      const isChecked = this.config.checked;
      const isDisabled = this.config.disabled;

      // Update ARIA attributes
      setAriaAttributes(this, {
        'aria-checked': String(isChecked),
        'aria-disabled': String(isDisabled)
      });

      // Update visual state
      this.setAttribute('data-state', isChecked ? 'checked' : 'unchecked');
      
      if (isDisabled) {
        this.setAttribute('data-disabled', 'true');
        this.setAttribute('tabindex', '-1');
      } else {
        this.removeAttribute('data-disabled');
        this.setAttribute('tabindex', '0');
      }

      // Update hidden input
      if (this.input) {
        this.input.value = isChecked ? this.config.value : '';
        this.input.name = this.config.name;
      }

      // Dispatch change event
      this.dispatchEvent(new CustomEvent('change', {
        detail: { checked: isChecked },
        bubbles: true
      }));
    }

    private toggle(): void {
      this.config.checked = !this.config.checked;
      this.setAttribute('checked', String(this.config.checked));
    }

    // Public API
    get checked(): boolean {
      return this.config.checked;
    }

    set checked(value: boolean) {
      this.setAttribute('checked', String(value));
    }

    get disabled(): boolean {
      return this.config.disabled;
    }

    set disabled(value: boolean) {
      this.setAttribute('disabled', String(value));
    }
}

// Register the custom element
customElements.define('pxm-toggle', PxmToggle);

// Make available globally
if (typeof window !== 'undefined') {
  (window as any).PxmToggle = PxmToggle;
} 