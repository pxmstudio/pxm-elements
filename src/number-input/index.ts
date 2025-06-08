/**
 * PXM Number Input Component
 * 
 * Enhanced number input with increment/decrement controls and validation.
 * Respects min, max, and step attributes from the input element.
 */

import { withErrorBoundary, createQueryCache } from '../core/component-utils';

class PxmNumberInput extends HTMLElement {
    private queryCache = createQueryCache<HTMLElement>();
    private _input: HTMLInputElement | null = null;

    // Cache DOM queries for performance
    private get minusButton(): HTMLElement | null {
        return this.queryCache.query('[data-minus]', this);
    }

    private get plusButton(): HTMLElement | null {
        return this.queryCache.query('[data-plus]', this);
    }

    private get input(): HTMLInputElement | null {
        if (!this._input) {
            this._input = this.querySelector('input[type="number"]');
        }
        return this._input;
    }

    constructor() {
        super();
    }

    connectedCallback(): void {
        withErrorBoundary(() => {
            this.setupNumberInput();
        })();
    }

    private setupNumberInput(): void {
        // Clear cache to get fresh elements
        this.queryCache.clear();
        this._input = null;

        // If no input is found, exit early
        if (!this.input) {
            console.warn('pxm-number-input: No number input found');
            return;
        }

        // Add event listeners to buttons
        if (this.minusButton) {
            this.minusButton.addEventListener('click', withErrorBoundary(() => this.decrement()));
        }
        if (this.plusButton) {
            this.plusButton.addEventListener('click', withErrorBoundary(() => this.increment()));
        }

        // Listen for manual changes by the user
        this.input.addEventListener('input', withErrorBoundary((e: Event) => this.onInputChange(e)));

        // Set initial disabled states
        this.updateDisabledStates();
    }

    private updateDisabledStates(): void {
        if (!this.input) return;

        const value = parseFloat(this.input.value);
        if (isNaN(value)) return;

        // Update minus button state
        if (this.minusButton) {
            if (this.input.hasAttribute('min')) {
                const min = parseFloat(this.input.getAttribute('min') || '0');
                if (value <= min) {
                    this.minusButton.setAttribute('disabled', '');
                } else {
                    this.minusButton.removeAttribute('disabled');
                }
            }
        }

        // Update plus button state
        if (this.plusButton) {
            if (this.input.hasAttribute('max')) {
                const max = parseFloat(this.input.getAttribute('max') || '0');
                if (value >= max) {
                    this.plusButton.setAttribute('disabled', '');
                } else {
                    this.plusButton.removeAttribute('disabled');
                }
            }
        }
    }

    private onInputChange(e: Event): void {
        const input = e.target as HTMLInputElement;
        const value = parseFloat(input.value);

        // Validate against min/max if set
        if (input.hasAttribute('min')) {
            const min = parseFloat(input.getAttribute('min') || '0');
            if (value < min) {
                input.value = min.toString();
            }
        }

        if (input.hasAttribute('max')) {
            const max = parseFloat(input.getAttribute('max') || '0');
            if (value > max) {
                input.value = max.toString();
            }
        }

        this.updateDisabledStates();
    }

    private increment(): void {
        if (!this.input) return;

        // Use the "step" attribute if provided, defaulting to 1
        const step = parseFloat(this.input.getAttribute('step') || '1');
        let currentValue = parseFloat(this.input.value);
        if (isNaN(currentValue)) currentValue = 0;

        // If max is provided and current value is already at max, do nothing
        if (this.input.hasAttribute('max')) {
            const max = parseFloat(this.input.getAttribute('max') || '0');
            if (currentValue >= max) return;

            let newValue = currentValue + step;
            // Ensure that newValue does not exceed max
            if (newValue > max) {
                newValue = max;
            }
            this.input.value = newValue.toString();
        } else {
            this.input.value = (currentValue + step).toString();
        }

        // Dispatch a change event so listeners can catch the update
        this.input.dispatchEvent(new Event('change'));
        this.updateDisabledStates();
    }

    private decrement(): void {
        if (!this.input) return;

        // Use the "step" attribute if provided, defaulting to 1
        const step = parseFloat(this.input.getAttribute('step') || '1');
        let currentValue = parseFloat(this.input.value);
        if (isNaN(currentValue)) currentValue = 0;

        // If min is provided and current value is already at min, do nothing
        if (this.input.hasAttribute('min')) {
            const min = parseFloat(this.input.getAttribute('min') || '0');
            if (currentValue <= min) return;

            let newValue = currentValue - step;
            // Ensure that newValue does not fall below min
            if (newValue < min) {
                newValue = min;
            }
            this.input.value = newValue.toString();
        } else {
            this.input.value = (currentValue - step).toString();
        }

        // Dispatch a change event so listeners can catch the update
        this.input.dispatchEvent(new Event('change'));
        this.updateDisabledStates();
    }
}

// Inject dependencies if requested (for CDN usage)
async function injectNumberInputDependencies() {
    try {
        const { injectComponentDependencies } = await import('../dependency-injector');
        await injectComponentDependencies('number-input');
    } catch (error) {
        console.warn('Failed to inject number-input dependencies:', error);
    }
}
injectNumberInputDependencies();

// Define the custom element
customElements.define('pxm-number-input', PxmNumberInput);

// Make available globally
if (typeof window !== 'undefined') {
    (window as any).PxmNumberInput = PxmNumberInput;
}