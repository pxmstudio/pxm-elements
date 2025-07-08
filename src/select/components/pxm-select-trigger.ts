/**
 * PXM Select Trigger Component
 * 
 * The clickable button that opens/closes the select dropdown
 */

import { withErrorBoundary } from '../../core/component-utils';
import { SELECT_CONSTANTS } from '../config';

export class PxmSelectTrigger extends HTMLElement {
  private selectRoot?: HTMLElement;
  private initialized = false;

  constructor() {
    super();
    // Set essential attributes for functionality
    this.setAttribute('role', 'combobox');
    this.setAttribute('tabindex', '0');
  }

  connectedCallback(): void {
    withErrorBoundary(() => {
      if (this.initialized) return;
      this.initialize();
    })();
  }

  disconnectedCallback(): void {
    // Cleanup will be handled by the parent select component
  }

  private initialize(): void {
    this.findSelectRoot();
    this.setupEventListeners();
    this.initialized = true;
  }

  private findSelectRoot(): void {
    this.selectRoot = this.closest('pxm-select') as HTMLElement;
    if (!this.selectRoot) {
      console.warn('PxmSelectTrigger must be inside a pxm-select element');
    }
  }

  private setupEventListeners(): void {
    // Click to toggle dropdown
    this.addEventListener('click', this.handleClick.bind(this));
    
    // Keyboard navigation
    this.addEventListener('keydown', this.handleKeydown.bind(this));
    
    // Focus management
    this.addEventListener('focus', this.handleFocus.bind(this));
    this.addEventListener('blur', this.handleBlur.bind(this));
  }

  private handleClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (this.selectRoot) {
      const selectInstance = (this.selectRoot as any).selectInstance;
      if (selectInstance) {
        selectInstance.toggle();
      }
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (!this.selectRoot) return;
    
    const selectInstance = (this.selectRoot as any).selectInstance;
    if (!selectInstance) return;

    // Don't handle keyboard events if search input is focused
    const searchInput = this.selectRoot.querySelector('pxm-select-search input');
    if (searchInput && document.activeElement === searchInput) {
      return;
    }

    const isOpen = selectInstance.isOpen();

    switch (event.key) {
      case SELECT_CONSTANTS.KEYS.ENTER:
      case SELECT_CONSTANTS.KEYS.SPACE:
        event.preventDefault();
        if (isOpen) {
          selectInstance.selectFocusedItem();
        } else {
          selectInstance.open();
        }
        break;
        
      case SELECT_CONSTANTS.KEYS.ARROW_DOWN:
        event.preventDefault();
        if (isOpen) {
          selectInstance.focusNextItem();
        } else {
          selectInstance.open();
        }
        break;
        
      case SELECT_CONSTANTS.KEYS.ARROW_UP:
        event.preventDefault();
        if (isOpen) {
          selectInstance.focusPreviousItem();
        } else {
          selectInstance.open();
        }
        break;
        
      case SELECT_CONSTANTS.KEYS.ESCAPE:
        if (isOpen) {
          event.preventDefault();
          selectInstance.close();
        }
        break;
        
      case SELECT_CONSTANTS.KEYS.HOME:
        if (isOpen) {
          event.preventDefault();
          selectInstance.focusFirstItem();
        }
        break;
        
      case SELECT_CONSTANTS.KEYS.END:
        if (isOpen) {
          event.preventDefault();
          selectInstance.focusLastItem();
        }
        break;
        
      default:
        // Try type-ahead for printable characters
        if (selectInstance.handleTypeAhead && selectInstance.handleTypeAhead(event.key)) {
          event.preventDefault();
        }
        break;
    }
  }

  private handleFocus(_event: FocusEvent): void {
    this.setAttribute('data-focused', 'true');
  }

  private handleBlur(_event: FocusEvent): void {
    this.setAttribute('data-focused', 'false');
  }

  // Public methods for the parent select to call
  public updateAttributes(config: Record<string, any>, state: any): void {
    // Set both ARIA (accessibility) and data (styling) attributes
    this.setAttribute('aria-expanded', String(state.isOpen));
    this.setAttribute('aria-disabled', String(config.disabled));
    this.setAttribute('aria-required', String(config.required));
    
    this.setAttribute('data-open', String(state.isOpen));
    this.setAttribute('data-disabled', String(config.disabled));
    this.setAttribute('data-state', state.isOpen ? 'open' : 'closed');
  }

  public focus(): void {
    super.focus();
  }
}

// Register the custom element
customElements.define('pxm-select-trigger', PxmSelectTrigger); 