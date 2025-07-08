/**
 * PXM Phone Input Component
 * 
 * A logic-only phone input component that provides international phone number validation and formatting.
 * This component provides structure and behavior only - all styling is controlled by your CSS.
 * 
 * Features:
 * - International phone number validation using intl-tel-input
 * - Country code detection and selection
 * - Format-as-you-type functionality
 * - Accessible keyboard navigation
 * - Dynamic validation with error messaging
 * - Hidden input for full international number
 * - Custom validation support
 * 
 * Basic Usage:
 * ```html
 * <pxm-phone-input 
 *   initial-country="US" 
 *   separate-dial-code="true"
 *   placeholder="Enter phone number"
 *   required="true">
 *   <input type="tel" name="phone" />
 * </pxm-phone-input>
 * ```
 * 
 * Dynamic Content:
 * ```javascript
 * const phoneInput = document.querySelector('pxm-phone-input');
 * phoneInput.setAttribute('initial-country', 'UK');
 * phoneInput.setError('Custom error message');
 * ```
 * 
 * Consumer Styling Examples:
 * ```css
 * /\* Style the component container *\/
 * pxm-phone-input {
 *   display: block;
 *   margin-bottom: 1rem;
 * }
 * 
 * /\* Style the input *\/
 * pxm-phone-input input {
 *   width: 100%;
 *   padding: 0.5rem;
 *   border: 1px solid #ccc;
 * }
 * 
 * /\* Style validation states *\/
 * pxm-phone-input[aria-invalid="true"] input {
 *   border-color: #dc3545;
 * }
 * 
 * /\* Style error messages *\/
 * pxm-phone-input [data-pxm-phone-error] {
 *   color: #dc3545;
 *   font-size: 0.875rem;
 *   margin-top: 0.25rem;
 * }
 * 
 * /\* Style ITI components *\/
 * pxm-phone-input .iti {
 *   width: 100%;
 * }
 * ```
 * 
 * Events:
 * - `pxm:phone-input:change` - Fired when the phone number changes
 * - `pxm:phone-input:validation` - Fired when validation state changes
 * - `pxm:phone-input:country-change` - Fired when country selection changes
 * 
 * Accessibility:
 * This component manages essential ARIA attributes for validation states.
 * Additional ARIA attributes, labels, and descriptions should be added by the consumer as needed.
 */

import { parseAttributes, withErrorBoundary, type AttributeSchema } from '../core/component-utils';
import { injectComponentDependencies } from '../dependency-injector';

// ITI integration
import { iti } from './iti';

const PHONE_INPUT_SCHEMA: AttributeSchema = {
  'initial-country': { type: 'string', default: 'us' },
  'separate-dial-code': { type: 'boolean', default: true },
  'format-on-display': { type: 'boolean', default: true },
  'placeholder': { type: 'string', default: '' },
  'required': { type: 'boolean', default: false },
  'disabled': { type: 'boolean', default: false },
  'auto-format': { type: 'boolean', default: true },
  'national-mode': { type: 'boolean', default: false }
};

export interface PhoneInputEventDetail {
  value: string;
  formattedNumber: string;
  isValid: boolean;
  country?: string;
  element: HTMLElement;
}

export interface PhoneInputValidationDetail {
  isValid: boolean;
  error?: string;
  element: HTMLElement;
}

export interface PhoneInputCountryDetail {
  countryCode: string;
  countryName: string;
  dialCode: string;
  element: HTMLElement;
}

interface PhoneInputState {
  isInitialized: boolean;
  hasError: boolean;
  currentValue: string;
  isValidating: boolean;
}

export class PxmPhoneInput extends HTMLElement {
  private config: Record<string, any> = {};
  private state: PhoneInputState = {
    isInitialized: false,
    hasError: false,
    currentValue: '',
    isValidating: false
  };
  
  private input?: HTMLInputElement;
  private hiddenInput?: HTMLInputElement;
  private errorElement?: HTMLElement;
  private itiInstance: any;
  private customValidation?: (value: string) => string | null;

  static get observedAttributes(): string[] {
    return Object.keys(PHONE_INPUT_SCHEMA);
  }

  constructor() {
    super();
    // No Shadow DOM - consumers control all styling
  }

  connectedCallback(): void {
    withErrorBoundary(() => {
      this.config = parseAttributes(this, PHONE_INPUT_SCHEMA);
      this.initializeComponent();
    })();
  }

  disconnectedCallback(): void {
    withErrorBoundary(() => {
      // Clean up ITI instance
      if (this.itiInstance?.destroy) {
        this.itiInstance.destroy();
      }
      
      // Remove event listeners
      this.input?.removeEventListener('input', this.handleInput);
      this.input?.removeEventListener('blur', this.handleBlur);
      
      // Clear state
      this.state = {
        isInitialized: false,
        hasError: false,
        currentValue: '',
        isValidating: false
      };
    })();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    
    withErrorBoundary(() => {
      this.config = parseAttributes(this, PHONE_INPUT_SCHEMA);
      
      if (this.state.isInitialized) {
        this.updateConfiguration();
      }
    })();
  }

  private async initializeComponent(): Promise<void> {
    try {
      // Find required input element
      this.input = this.querySelector('input[type="tel"], input[type="text"], input') as HTMLInputElement;
      
      if (!this.input) {
        console.warn('PXM Phone Input: No input element found. Component requires an input element.');
        return;
      }

      // Inject ITI dependencies if needed
      try {
        await injectComponentDependencies('phone-input');
      } catch (error) {
        console.warn('Failed to inject phone input dependencies:', error);
      }

      // Create hidden input for full international number
      this.createHiddenInput();
      
      // Create error element
      this.createErrorElement();
      
      // Initialize ITI
      await this.initializeITI();
      
      // Apply configuration
      this.applyConfiguration();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Set initial validation state
      this.updateValidationState();
      
      this.state.isInitialized = true;
      
    } catch (error) {
      console.error('Failed to initialize PXM Phone Input:', error);
    }
  }

  private createHiddenInput(): void {
    if (!this.hiddenInput && this.input) {
      this.hiddenInput = document.createElement('input');
      this.hiddenInput.type = 'hidden';
      this.hiddenInput.name = (this.input.name || 'phone') + '_full';
      this.appendChild(this.hiddenInput);
    }
  }

  private createErrorElement(): void {
    if (!this.errorElement) {
      this.errorElement = document.createElement('div');
      this.errorElement.setAttribute('data-pxm-phone-error', '');
      this.errorElement.setAttribute('aria-live', 'polite');
      this.errorElement.style.display = 'none';
      this.appendChild(this.errorElement);
    }
  }

  private async initializeITI(): Promise<void> {
    if (!this.input) return;

    try {
      this.itiInstance = await iti({
        input: this.input,
        initialCountry: this.config['initial-country'],
        separateDialCode: this.config['separate-dial-code'],
        formatOnDisplay: this.config['format-on-display'],
        nationalMode: this.config['national-mode']
      });
    } catch (error) {
      console.error('Failed to initialize intl-tel-input:', error);
      throw error;
    }
  }

  private applyConfiguration(): void {
    if (!this.input) return;

    // Apply input attributes
    if (this.config.placeholder) {
      this.input.placeholder = this.config.placeholder;
    }
    
    if (this.config.required) {
      this.input.required = true;
    }
    
    if (this.config.disabled) {
      this.input.disabled = true;
    }

    // Set ARIA attributes
    if (this.errorElement) {
      this.input.setAttribute('aria-describedby', this.errorElement.id || 'phone-error');
    }
    this.input.setAttribute('aria-invalid', 'false');
  }

  private updateConfiguration(): void {
    if (!this.state.isInitialized) return;

    // Reinitialize ITI if country or formatting options changed
    const countryChanged = this.itiInstance?.getSelectedCountryData?.()?.iso2 !== this.config['initial-country'];
    
    if (countryChanged) {
      this.itiInstance?.setCountry?.(this.config['initial-country']);
    }

    // Update input attributes
    this.applyConfiguration();
  }

  private setupEventListeners(): void {
    if (!this.input) return;

    this.input.addEventListener('input', this.handleInput);
    this.input.addEventListener('blur', this.handleBlur);
    
    // Listen for country changes from ITI
    this.input.addEventListener('countrychange', this.handleCountryChange);
  }

  private handleInput = (): void => {
    withErrorBoundary(() => {
      if (!this.input || !this.itiInstance) return;

      const value = this.input.value;
      const formattedNumber = this.itiInstance.getNumber() || '';
      
      // Update hidden input
      if (this.hiddenInput) {
        this.hiddenInput.value = formattedNumber;
      }

      // Store current value
      this.state.currentValue = value;

      // Clear error on input
      this.clearError();

      // Dispatch change event
      this.dispatchEvent(new CustomEvent('pxm:phone-input:change', {
        detail: {
          value,
          formattedNumber,
          isValid: this.isValid(),
          country: this.itiInstance.getSelectedCountryData?.()?.iso2,
          element: this
        } as PhoneInputEventDetail,
        bubbles: true
      }));
    })();
  };

  private handleBlur = (): void => {
    withErrorBoundary(() => {
      this.validateInput();
    })();
  };

  private handleCountryChange = (): void => {
    withErrorBoundary(() => {
      if (!this.itiInstance) return;

      const countryData = this.itiInstance.getSelectedCountryData?.();
      
      if (countryData) {
        this.dispatchEvent(new CustomEvent('pxm:phone-input:country-change', {
          detail: {
            countryCode: countryData.iso2,
            countryName: countryData.name,
            dialCode: countryData.dialCode,
            element: this
          } as PhoneInputCountryDetail,
          bubbles: true
        }));
      }
    })();
  };

  private validateInput(): boolean {
    if (this.state.isValidating) return this.state.hasError;
    
    this.state.isValidating = true;

    try {
      if (!this.input || !this.itiInstance) {
        this.state.isValidating = false;
        return false;
      }

      const value = this.input.value.trim();
      let isValid = true;
      let errorMessage = '';

      // Check if required and empty
      if (this.config.required && !value) {
        isValid = false;
        errorMessage = 'Phone number is required';
      }
      // Check ITI validation if value exists
      else if (value && !this.itiInstance.isValidNumber?.()) {
        isValid = false;
        errorMessage = 'Invalid phone number';
      }
      // Custom validation
      else if (value && this.customValidation) {
        const customError = this.customValidation(value);
        if (customError) {
          isValid = false;
          errorMessage = customError;
        }
      }

      // Update validation state
      this.updateValidationState(isValid, errorMessage);

      // Dispatch validation event
      this.dispatchEvent(new CustomEvent('pxm:phone-input:validation', {
        detail: {
          isValid,
          error: errorMessage || undefined,
          element: this
        } as PhoneInputValidationDetail,
        bubbles: true
      }));

      this.state.isValidating = false;
      return isValid;

    } catch (error) {
      console.warn('Validation error:', error);
      this.state.isValidating = false;
      return false;
    }
  }

  private updateValidationState(isValid: boolean = true, errorMessage: string = ''): void {
    if (!this.input) return;

    this.state.hasError = !isValid;
    this.input.setAttribute('aria-invalid', isValid ? 'false' : 'true');
    this.setAttribute('aria-invalid', isValid ? 'false' : 'true');

    if (!isValid && errorMessage) {
      this.setError(errorMessage);
    } else if (isValid) {
      this.clearError();
    }
  }

  // Public API Methods

  /**
   * Get the full international phone number
   */
  public getFormattedNumber(): string {
    return this.itiInstance?.getNumber() || '';
  }

  /**
   * Get the national format phone number
   */
  public getNationalNumber(): string {
    return this.itiInstance?.getNumber(1) || ''; // 1 = NATIONAL format
  }

  /**
   * Check if the current phone number is valid
   */
  public isValid(): boolean {
    if (!this.input || !this.itiInstance) return false;
    
    const value = this.input.value.trim();
    if (!value) return !this.config.required;
    
    return this.itiInstance.isValidNumber?.() || false;
  }

  /**
   * Set a custom error message
   */
  public setError(message: string): void {
    if (!this.errorElement || !this.input) return;

    this.state.hasError = true;
    this.input.setAttribute('aria-invalid', 'true');
    this.setAttribute('aria-invalid', 'true');
    
    this.errorElement.textContent = message;
    this.errorElement.style.display = 'block';
  }

  /**
   * Clear the error message
   */
  public clearError(): void {
    if (!this.errorElement || !this.input) return;

    this.state.hasError = false;
    this.input.setAttribute('aria-invalid', 'false');
    this.setAttribute('aria-invalid', 'false');
    
    this.errorElement.textContent = '';
    this.errorElement.style.display = 'none';
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
   * Set the country
   */
  public setCountry(countryCode: string): void {
    this.itiInstance?.setCountry?.(countryCode);
  }

  /**
   * Get the selected country data
   */
  public getSelectedCountryData(): any {
    return this.itiInstance?.getSelectedCountryData?.();
  }

  /**
   * Set custom validation function
   */
  public setCustomValidation(validator: (value: string) => string | null): void {
    this.customValidation = validator;
  }

  /**
   * Get the current input value
   */
  public getValue(): string {
    return this.input?.value || '';
  }

  /**
   * Set the input value
   */
  public setValue(value: string): void {
    if (this.input) {
      this.input.value = value;
      this.handleInput();
    }
  }
}

// Register the custom element
customElements.define('pxm-phone-input', PxmPhoneInput);

// Make available globally for advanced usage
if (typeof window !== 'undefined') {
  (window as any).PxmPhoneInput = PxmPhoneInput;
}

// Types and interfaces are already declared inline above


