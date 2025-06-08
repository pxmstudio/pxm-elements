class PxmNumberInput extends HTMLElement {
    private minusButton: HTMLElement | null = null;
    private plusButton: HTMLElement | null = null;
    private input: HTMLInputElement | null = null;

    constructor() {
        super();
    }

    connectedCallback() {
        // Get the minus button, plus button, and the number input
        this.minusButton = this.querySelector('[data-minus]');
        this.plusButton = this.querySelector('[data-plus]');
        this.input = this.querySelector('input[type="number"]');

        // If no input is found, exit early.
        if (!this.input) {
            console.warn('pxm-number-input: No number input found');
            return;
        }

        // Add event listeners to the buttons
        if (this.minusButton) {
            this.minusButton.addEventListener("click", this.decrement.bind(this));
        }
        if (this.plusButton) {
            this.plusButton.addEventListener("click", this.increment.bind(this));
        }

        // Listen for manual changes by the user on the input field
        this.input.addEventListener("input", this.onInputChange.bind(this));
        
        // Set initial disabled states
        this.updateDisabledStates();
    }

    private updateDisabledStates() {
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

    onInputChange(e: Event) {
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

    increment() {
        if (!this.input) return;
        
        // Use the "step" attribute if provided, defaulting to 1
        const step = parseFloat(this.input.getAttribute("step") || "1");
        let currentValue = parseFloat(this.input.value);
        if (isNaN(currentValue)) currentValue = 0;

        // If max is provided and current value is already at max, do nothing.
        if (this.input.hasAttribute("max")) {
            const max = parseFloat(this.input.getAttribute("max") || "0");
            if (currentValue >= max) return;

            let newValue = currentValue + step;
            // Ensure that newValue does not exceed max.
            if (newValue > max) {
                newValue = max;
            }
            this.input.value = newValue.toString();
        } else {
            this.input.value = (currentValue + step).toString();
        }

        // Dispatch a change event if needed so listeners can catch the update.
        this.input.dispatchEvent(new Event("change"));
        this.updateDisabledStates();
    }

    decrement() {
        if (!this.input) return;
        
        // Use the "step" attribute if provided, defaulting to 1
        const step = parseFloat(this.input.getAttribute("step") || "1");
        let currentValue = parseFloat(this.input.value);
        if (isNaN(currentValue)) currentValue = 0;

        // If min is provided and current value is already at min, do nothing.
        if (this.input.hasAttribute("min")) {
            const min = parseFloat(this.input.getAttribute("min") || "0");
            if (currentValue <= min) return;

            let newValue = currentValue - step;
            // Ensure that newValue does not fall below min.
            if (newValue < min) {
                newValue = min;
            }
            this.input.value = newValue.toString();
        } else {
            this.input.value = (currentValue - step).toString();
        }

        // Dispatch a change event if needed so listeners can catch the update.
        this.input.dispatchEvent(new Event("change"));
        this.updateDisabledStates();
    }
}

// Inject dependencies if requested (for CDN usage)
import { injectComponentDependencies } from '../dependency-injector';
injectComponentDependencies('number-input').catch(error => {
    console.warn('Failed to inject number-input dependencies:', error);
});

customElements.define("pxm-number-input", PxmNumberInput);