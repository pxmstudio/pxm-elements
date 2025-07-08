/**
 * PXM Number Input Component
 * 
 * Enhanced number input with increment/decrement controls and validation.
 * This component provides structure and behavior only - all styling is controlled by your CSS.
 * 
 * Features:
 * - Increment/decrement buttons with automatic min/max bounds
 * - Built-in validation with customizable error messages
 * - Keyboard navigation support
 * - Dynamic content support (buttons can be added/removed after initialization)
 * - Event-driven system for custom handling
 * - Respects native input attributes (min, max, step, value, disabled)
 * 
 * Keyboard Navigation:
 * - ArrowUp - Increment value
 * - ArrowDown - Decrement value
 * - Enter - Validate current value
 * - Standard input navigation (Tab, etc.)
 * 
 * Basic Usage:
 * <pxm-number-input>
 *   <input type="number" min="0" max="100" step="1" value="10" aria-label="Quantity" />
 *   <button data-minus aria-label="Decrease">-</button>
 *   <button data-plus aria-label="Increase">+</button>
 *   <div data-error aria-live="polite"></div>
 * </pxm-number-input>
 * 
 * Dynamic Content:
 * const numberInput = document.querySelector('pxm-number-input');
 * const newButton = document.createElement('button');
 * newButton.setAttribute('data-plus', '');
 * numberInput.appendChild(newButton); // Automatically initialized
 * 
 * With Custom Validation:
 * const numberInput = document.querySelector('pxm-number-input');
 * numberInput.setCustomValidator((value) => {
 *   if (value % 5 !== 0) return 'Value must be divisible by 5';
 *   return null; // Valid
 * });
 * 
 * Consumer Styling:
 * Use CSS to style pxm-number-input, its input, buttons, and [data-error] elements.
 * The component only manages functional states like disabled attributes and display/opacity for errors.
 * 
 * Events:
 * - pxm:number-input:change - Fired when value changes (user input or programmatic)
 * - pxm:number-input:increment - Fired when value is incremented
 * - pxm:number-input:decrement - Fired when value is decremented
 * - pxm:number-input:error - Fired when validation error occurs
 * - pxm:number-input:valid - Fired when validation passes
 * - pxm:number-input:buttons-changed - Fired when buttons are dynamically added/removed
 * 
 * Accessibility:
 * This component manages only essential ARIA attributes (like aria-invalid for functionality).
 * Additional ARIA attributes, labels, and roles should be added by the consumer as needed.
 */

import { parseAttributes, withErrorBoundary, type AttributeSchema } from '../core/component-utils';

const NUMBER_INPUT_SCHEMA: AttributeSchema = {
    'auto-validate': { type: 'boolean', default: true },
    'error-message-min': { type: 'string', default: '' },
    'error-message-max': { type: 'string', default: '' },
    'error-message-step': { type: 'string', default: '' },
    'error-message-invalid': { type: 'string', default: '' }
};

const NUMBER_INPUT_CONSTANTS = {
    ATTRIBUTES: {
        MINUS: 'data-minus',
        PLUS: 'data-plus',
        ERROR: 'data-error'
    },
    DEFAULT_STEP: 1,
    DEFAULT_ERROR_MESSAGES: {
        MIN: 'Value must be at least {value}',
        MAX: 'Value must be at most {value}',
        STEP: 'Value must be a valid step',
        INVALID: 'Please enter a valid number'
    }
} as const;

interface NumberInputState {
    currentValue: number;
    isValid: boolean;
    hasError: boolean;
}

// Event detail types
export interface NumberInputEventDetail {
    value: number;
    previousValue?: number;
    input: HTMLInputElement;
}

export interface NumberInputErrorEventDetail {
    message: string;
    type: 'min' | 'max' | 'step' | 'invalid' | 'custom';
    value: number;
}

export interface NumberInputValidEventDetail {
    value: number;
    input: HTMLInputElement;
}

class PxmNumberInput extends HTMLElement {
    private config: Record<string, any> = {};
    private state: NumberInputState = {
        currentValue: 0,
        isValid: true,
        hasError: false
    };
    private _input: HTMLInputElement | null = null;
    private _minusButtons: NodeListOf<HTMLElement> | null = null;
    private _plusButtons: NodeListOf<HTMLElement> | null = null;
    private _errorElement: HTMLElement | null = null;
    private mutationObserver?: MutationObserver;
    private customValidator?: (value: number) => string | null;
    private initializedButtons = new WeakSet<HTMLElement>();
    private buttonEventListeners = new WeakMap<HTMLElement, Map<string, EventListener>>();

    // Cache queries to avoid repeated selections
    private get input(): HTMLInputElement | null {
        if (!this._input) {
            this._input = this.querySelector('input[type="number"]');
        }
        return this._input;
    }

    private get minusButtons(): NodeListOf<HTMLElement> {
        if (!this._minusButtons) {
            this._minusButtons = this.querySelectorAll('[data-minus]');
        }
        return this._minusButtons;
    }

    private get plusButtons(): NodeListOf<HTMLElement> {
        if (!this._plusButtons) {
            this._plusButtons = this.querySelectorAll('[data-plus]');
        }
        return this._plusButtons;
    }

    private get errorElement(): HTMLElement | null {
        if (!this._errorElement) {
            this._errorElement = this.querySelector('[data-error]');
        }
        return this._errorElement;
    }

    static get observedAttributes(): string[] {
        return Object.keys(NUMBER_INPUT_SCHEMA);
    }

    constructor() {
        super();
        // NO Shadow DOM - consumers style everything
    }

    connectedCallback(): void {
        withErrorBoundary(() => {
            this.config = parseAttributes(this, NUMBER_INPUT_SCHEMA);
            this.setupNumberInput();
            this.observeChildChanges();
        })();
    }

    disconnectedCallback(): void {
        // Clean up mutation observer
        this.mutationObserver?.disconnect();
        // Clean up event listeners
        this.cleanupAllEventListeners();
        // Clear state
        this.state = {
            currentValue: 0,
            isValid: true,
            hasError: false
        };
        // Clear initialization tracking
        this.initializedButtons = new WeakSet();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) return;

        this.config = parseAttributes(this, NUMBER_INPUT_SCHEMA);

        // Re-validate if auto-validate setting changed
        if (name === 'auto-validate' && this.config['auto-validate']) {
            this.validate();
        }
    }

    /**
     * Set up MutationObserver to watch for dynamically added/removed buttons
     */
    private observeChildChanges(): void {
        this.mutationObserver = new MutationObserver((mutations) => {
            let shouldReinitialize = false;

            for (const mutation of mutations) {
                // Check if buttons were added or removed
                const addedButtons = Array.from(mutation.addedNodes).some(
                    node => node instanceof HTMLElement && this.isButton(node)
                );
                const removedButtons = Array.from(mutation.removedNodes).some(
                    node => node instanceof HTMLElement && this.isButton(node)
                );

                if (addedButtons || removedButtons) {
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
     * Check if an element is a number input button
     */
    private isButton(element: HTMLElement): boolean {
        return element.hasAttribute(NUMBER_INPUT_CONSTANTS.ATTRIBUTES.MINUS) ||
            element.hasAttribute(NUMBER_INPUT_CONSTANTS.ATTRIBUTES.PLUS);
    }

    /**
     * Handle dynamic changes to buttons
     */
    private handleDynamicChanges(): void {
        // Clean up event listeners for buttons that no longer exist
        this.cleanupRemovedButtons();

        // Clear caches to force re-query
        this._minusButtons = null;
        this._plusButtons = null;

        // Re-initialize buttons (only new buttons will be processed)
        this.setupButtons();

        // Dispatch event for dynamic changes
        this.dispatchEvent(new CustomEvent('pxm:number-input:buttons-changed', {
            detail: {
                minusButtonCount: this.minusButtons.length,
                plusButtonCount: this.plusButtons.length
            }
        }));
    }

    /**
     * Clean up event listeners for buttons that have been removed
     */
    private cleanupRemovedButtons(): void {
        // WeakMap will handle most cleanup automatically, but clear for safety
        this.buttonEventListeners = new WeakMap();
    }

    /**
     * Set up the number input component
     */
    private setupNumberInput(): void {
        // Clear caches to get fresh elements
        this._input = null;
        this._minusButtons = null;
        this._plusButtons = null;
        this._errorElement = null;

        if (!this.input) {
            console.warn('PxmNumberInput: No number input found');
            return;
        }

        // Initialize state from input value
        this.syncStateFromInput();

        // Set up error element if it doesn't exist
        this.ensureErrorElement();

        // Set up input event listeners
        this.setupInputListeners();

        // Set up buttons
        this.setupButtons();

        // Initial validation if auto-validate is enabled
        if (this.config['auto-validate']) {
            this.validate();
        }

        // Update button states
        this.updateButtonStates();
    }

    /**
     * Sync internal state from input value
     */
    private syncStateFromInput(): void {
        if (!this.input) return;

        const value = parseFloat(this.input.value) || 0;
        this.state.currentValue = value;
    }

    /**
     * Ensure error element exists
     */
    private ensureErrorElement(): void {
        if (!this.errorElement && this.input) {
            const errorDiv = document.createElement('div');
            errorDiv.setAttribute(NUMBER_INPUT_CONSTANTS.ATTRIBUTES.ERROR, '');
            errorDiv.style.display = 'none';
            this.input.insertAdjacentElement('afterend', errorDiv);
            this._errorElement = errorDiv;
        }
    }

    /**
     * Set up input event listeners
     */
    private setupInputListeners(): void {
        if (!this.input) return;

        // Input change listener
        this.input.addEventListener('input', withErrorBoundary((e: Event) => {
            this.onInputChange(e);
        }));

        // Blur validation listener
        this.input.addEventListener('blur', withErrorBoundary(() => {
            if (this.config['auto-validate']) {
                this.validate();
            }
        }));

        // Keyboard navigation
        this.input.addEventListener('keydown', withErrorBoundary((e: KeyboardEvent) => {
            this.handleKeydown(e);
        }));
    }

    /**
     * Handle keyboard navigation
     */
    private handleKeydown(e: KeyboardEvent): void {
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                this.increment();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.decrement();
                break;
            case 'Enter':
                e.preventDefault();
                this.validate();
                break;
        }
    }

    /**
     * Set up button event listeners
     */
    private setupButtons(): void {
        // Set up minus buttons
        this.minusButtons.forEach(button => {
            if (!this.initializedButtons.has(button)) {
                this.addButtonEventListener(button, 'click', () => this.decrement());
                this.initializedButtons.add(button);
            }
        });

        // Set up plus buttons  
        this.plusButtons.forEach(button => {
            if (!this.initializedButtons.has(button)) {
                this.addButtonEventListener(button, 'click', () => this.increment());
                this.initializedButtons.add(button);
            }
        });
    }

    /**
     * Add an event listener to a button and track it for cleanup
     */
    private addButtonEventListener(button: HTMLElement, eventType: string, listener: EventListener): void {
        if (!this.buttonEventListeners.has(button)) {
            this.buttonEventListeners.set(button, new Map());
        }

        const listeners = this.buttonEventListeners.get(button)!;

        // Remove old listener if exists
        const oldListener = listeners.get(eventType);
        if (oldListener) {
            button.removeEventListener(eventType, oldListener);
        }

        // Add new listener
        const wrappedListener = withErrorBoundary(listener);
        button.addEventListener(eventType, wrappedListener);
        listeners.set(eventType, wrappedListener);
    }

    /**
     * Clean up all event listeners for all buttons
     */
    private cleanupAllEventListeners(): void {
        // WeakMap will be garbage collected automatically when buttons are removed
        // Just create a new WeakMap to release references
        this.buttonEventListeners = new WeakMap();
    }

    /**
     * Handle input value changes
     */
    private onInputChange(e: Event): void {
        const input = e.target as HTMLInputElement;
        const previousValue = this.state.currentValue;
        const newValue = parseFloat(input.value) || 0;

        this.state.currentValue = newValue;
        this.hideError();

        // Auto-validate if enabled
        if (this.config['auto-validate']) {
            this.validate();
        }

        this.updateButtonStates();

        // Dispatch change event
        this.dispatchEvent(new CustomEvent('pxm:number-input:change', {
            detail: {
                value: newValue,
                previousValue,
                input
            } as NumberInputEventDetail
        }));
    }

    /**
     * Update button disabled states based on current value and constraints
     */
    private updateButtonStates(): void {
        if (!this.input) return;

        const value = this.state.currentValue;
        const min = this.input.hasAttribute('min') ? parseFloat(this.input.getAttribute('min')!) : null;
        const max = this.input.hasAttribute('max') ? parseFloat(this.input.getAttribute('max')!) : null;

        // Update minus buttons
        this.minusButtons.forEach(button => {
            if (min !== null && value <= min) {
                button.setAttribute('disabled', '');
            } else {
                button.removeAttribute('disabled');
            }
        });

        // Update plus buttons
        this.plusButtons.forEach(button => {
            if (max !== null && value >= max) {
                button.setAttribute('disabled', '');
            } else {
                button.removeAttribute('disabled');
            }
        });
    }

    /**
     * Show error message
     */
    private showError(message: string, type: NumberInputErrorEventDetail['type']): void {
        if (!this.input || !this.errorElement) return;

        this.state.hasError = true;
        this.state.isValid = false;

        // Defer inline styles to prevent SSR hydration flash
        requestAnimationFrame(() => {
            this.errorElement!.textContent = message;
            this.errorElement!.style.display = 'block';
        });

        // Set ARIA attributes for accessibility
        this.input.setAttribute('aria-invalid', 'true');
        if (this.errorElement.id) {
            this.input.setAttribute('aria-describedby', this.errorElement.id);
        }

        // Dispatch error event
        this.dispatchEvent(new CustomEvent('pxm:number-input:error', {
            detail: {
                message,
                type,
                value: this.state.currentValue
            } as NumberInputErrorEventDetail
        }));
    }

    /**
     * Hide error message
     */
    private hideError(): void {
        if (!this.input || !this.errorElement) return;

        this.state.hasError = false;
        this.state.isValid = true;

        // Defer inline styles to prevent SSR hydration flash
        requestAnimationFrame(() => {
            this.errorElement!.textContent = '';
            this.errorElement!.style.display = 'none';
        });

        // Clear ARIA attributes
        this.input.setAttribute('aria-invalid', 'false');
        this.input.removeAttribute('aria-describedby');

        // Dispatch valid event
        this.dispatchEvent(new CustomEvent('pxm:number-input:valid', {
            detail: {
                value: this.state.currentValue,
                input: this.input
            } as NumberInputValidEventDetail
        }));
    }

    /**
     * Get error message for a validation type
     */
    private getErrorMessage(type: 'min' | 'max' | 'step' | 'invalid', value?: number): string {
        // Check for custom error message attribute
        const customMessage = this.config[`error-message-${type}`];
        if (customMessage) {
            return customMessage.replace('{value}', value?.toString() || '');
        }

        // Use default messages
        switch (type) {
            case 'min':
                return NUMBER_INPUT_CONSTANTS.DEFAULT_ERROR_MESSAGES.MIN.replace('{value}', value?.toString() || '');
            case 'max':
                return NUMBER_INPUT_CONSTANTS.DEFAULT_ERROR_MESSAGES.MAX.replace('{value}', value?.toString() || '');
            case 'step':
                return NUMBER_INPUT_CONSTANTS.DEFAULT_ERROR_MESSAGES.STEP;
            case 'invalid':
                return NUMBER_INPUT_CONSTANTS.DEFAULT_ERROR_MESSAGES.INVALID;
            default:
                return 'Invalid value';
        }
    }

    // Public API methods

    /**
     * Increment the value by the step amount
     */
    public increment(): void {
        if (!this.input) return;

        const step = parseFloat(this.input.getAttribute('step') || NUMBER_INPUT_CONSTANTS.DEFAULT_STEP.toString());
        const currentValue = this.state.currentValue;
        const max = this.input.hasAttribute('max') ? parseFloat(this.input.getAttribute('max')!) : null;

        let newValue = currentValue + step;

        // Respect max constraint
        if (max !== null && newValue > max) {
            newValue = max;
        }

        // Only proceed if value actually changed
        if (newValue === currentValue) return;

        this.setValue(newValue);

        // Dispatch increment event
        this.dispatchEvent(new CustomEvent('pxm:number-input:increment', {
            detail: {
                value: newValue,
                previousValue: currentValue,
                input: this.input
            } as NumberInputEventDetail
        }));
    }

    /**
     * Decrement the value by the step amount
     */
    public decrement(): void {
        if (!this.input) return;

        const step = parseFloat(this.input.getAttribute('step') || NUMBER_INPUT_CONSTANTS.DEFAULT_STEP.toString());
        const currentValue = this.state.currentValue;
        const min = this.input.hasAttribute('min') ? parseFloat(this.input.getAttribute('min')!) : null;

        let newValue = currentValue - step;

        // Respect min constraint
        if (min !== null && newValue < min) {
            newValue = min;
        }

        // Only proceed if value actually changed
        if (newValue === currentValue) return;

        this.setValue(newValue);

        // Dispatch decrement event
        this.dispatchEvent(new CustomEvent('pxm:number-input:decrement', {
            detail: {
                value: newValue,
                previousValue: currentValue,
                input: this.input
            } as NumberInputEventDetail
        }));
    }

    /**
     * Set the input value programmatically
     */
    public setValue(value: number): void {
        if (!this.input) return;

        const previousValue = this.state.currentValue;
        this.input.value = value.toString();
        this.state.currentValue = value;

        this.hideError();
        this.updateButtonStates();

        // Auto-validate if enabled
        if (this.config['auto-validate']) {
            this.validate();
        }

        // Dispatch change event
        this.dispatchEvent(new CustomEvent('pxm:number-input:change', {
            detail: {
                value,
                previousValue,
                input: this.input
            } as NumberInputEventDetail
        }));
    }

    /**
     * Get the current input value
     */
    public getValue(): number {
        return this.state.currentValue;
    }

    /**
     * Focus the input element
     */
    public focus(): void {
        this.input?.focus();
    }

    /**
     * Blur the input element
     */
    public blur(): void {
        this.input?.blur();
    }

    /**
     * Validate the current value against constraints
     */
    public validate(): boolean {
        if (!this.input) return false;

        const value = this.state.currentValue;

        this.hideError();

        // Check if value is a valid number
        if (isNaN(value)) {
            this.showError(this.getErrorMessage('invalid'), 'invalid');
            return false;
        }

        // Check min constraint
        if (this.input.hasAttribute('min')) {
            const min = parseFloat(this.input.getAttribute('min')!);
            if (value < min) {
                this.showError(this.getErrorMessage('min', min), 'min');
                return false;
            }
        }

        // Check max constraint
        if (this.input.hasAttribute('max')) {
            const max = parseFloat(this.input.getAttribute('max')!);
            if (value > max) {
                this.showError(this.getErrorMessage('max', max), 'max');
                return false;
            }
        }

        // Check step constraint
        if (this.input.hasAttribute('step')) {
            const step = parseFloat(this.input.getAttribute('step')!);
            const min = this.input.hasAttribute('min') ? parseFloat(this.input.getAttribute('min')!) : 0;
            if ((value - min) % step !== 0) {
                this.showError(this.getErrorMessage('step'), 'step');
                return false;
            }
        }

        // Check custom validation
        if (this.customValidator) {
            const customError = this.customValidator(value);
            if (customError) {
                this.showError(customError, 'custom');
                return false;
            }
        }

        this.state.isValid = true;
        this.state.hasError = false;
        return true;
    }

    /**
     * Set a custom validation function
     */
    public setCustomValidator(validator: (value: number) => string | null): void {
        this.customValidator = validator;

        // Re-validate if auto-validate is enabled
        if (this.config['auto-validate']) {
            this.validate();
        }
    }

    /**
     * Clear the custom validation function
     */
    public clearCustomValidator(): void {
        this.customValidator = undefined;

        // Re-validate if auto-validate is enabled
        if (this.config['auto-validate']) {
            this.validate();
        }
    }

    /**
     * Get the current validation state
     */
    public isValid(): boolean {
        return this.state.isValid;
    }

    /**
     * Check if there are any validation errors
     */
    public hasError(): boolean {
        return this.state.hasError;
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

// Export types for TypeScript users
export type { PxmNumberInput };

// Make available globally for advanced usage
if (typeof window !== 'undefined') {
    (window as any).PxmNumberInput = PxmNumberInput;
}