/**
 * PXM Select Item Component
 * 
 * Individual selectable option within the dropdown
 */

import { withErrorBoundary } from '../../core/component-utils';

export class PxmSelectItem extends HTMLElement {
  private selectRoot?: HTMLElement;
  private initialized = false;
  private itemValue: string = '';
  private itemText: string = '';

  static get observedAttributes(): string[] {
    return ['value', 'disabled'];
  }

  constructor() {
    super();
    // Set essential attributes for functionality
    this.setAttribute('role', 'option');
    this.setAttribute('tabindex', '-1');
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

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'value':
        this.itemValue = newValue || '';
        break;
      case 'disabled':
        this.updateDisabledState(newValue === 'true');
        break;
    }
  }

  private initialize(): void {
    this.findSelectRoot();
    this.parseItemData();
    this.setupEventListeners();
    this.initialized = true;
  }

  private findSelectRoot(): void {
    this.selectRoot = this.closest('pxm-select') as HTMLElement;
    if (!this.selectRoot) {
      console.warn('PxmSelectItem must be inside a pxm-select element');
      return;
    }
    
    // Ensure the select instance is available
    if (!(this.selectRoot as any).selectInstance) {
      console.warn('PxmSelectItem: Select instance not found on parent element');
    }
  }

  private parseItemData(): void {
    // Get value from attribute or use text content
    this.itemValue = this.getAttribute('value') || '';
    
    // Get text from pxm-select-item-text child or use textContent
    const textElement = this.querySelector('pxm-select-item-text');
    this.itemText = textElement ? textElement.textContent?.trim() || '' : this.textContent?.trim() || '';
    
    // If no explicit value, use text as value
    if (!this.itemValue && this.itemText) {
      this.itemValue = this.itemText;
    }
  }

  private setupEventListeners(): void {
    // Click to select item
    this.addEventListener('click', this.handleClick.bind(this));
    
    // Mouse events for hover state
    this.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    
    // Focus events
    this.addEventListener('focus', this.handleFocus.bind(this));
    this.addEventListener('blur', this.handleBlur.bind(this));
  }

  private handleClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (this.isDisabled()) {
      return;
    }
    
    if (this.selectRoot) {
      const selectInstance = (this.selectRoot as any).selectInstance;
      if (selectInstance) {
        selectInstance.selectItem(this);
      }
    }
  }

  private handleMouseEnter(_event: MouseEvent): void {
    if (this.selectRoot) {
      const selectInstance = (this.selectRoot as any).selectInstance;
      if (selectInstance) {
        selectInstance.focusItem(this);
      }
    }
  }

  private handleMouseLeave(_event: MouseEvent): void {
    // Optional: Handle mouse leave if needed
  }

  private handleFocus(_event: FocusEvent): void {
    // Focus styling is handled by updateAttributes
  }

  private handleBlur(_event: FocusEvent): void {
    // Blur styling is handled by updateAttributes
  }

  private updateDisabledState(disabled: boolean): void {
    // Set both ARIA (accessibility) and data (styling) attributes
    this.setAttribute('aria-disabled', String(disabled));
    this.setAttribute('data-disabled', String(disabled));
    
    if (disabled) {
      this.setAttribute('tabindex', '-1');
    } else {
      this.setAttribute('tabindex', '-1'); // Items are not directly focusable
    }
  }

  // Public methods for the parent select to call
  public updateAttributes(isSelected: boolean, isFocused: boolean): void {
    // Set both ARIA (accessibility) and data (styling) attributes
    this.setAttribute('aria-selected', String(isSelected));
    this.setAttribute('data-selected', String(isSelected));
    this.setAttribute('data-focused', String(isFocused));
    this.setAttribute('data-state', isSelected ? 'selected' : 'unselected');
    
    // Make the focused item focusable
    if (isFocused) {
      this.setAttribute('tabindex', '0');
    } else {
      this.setAttribute('tabindex', '-1');
    }
  }

  public focus(): void {
    super.focus();
  }

  public getValue(): string {
    return this.itemValue;
  }

  public getText(): string {
    return this.itemText;
  }

  public isDisabled(): boolean {
    return this.getAttribute('disabled') === 'true' || this.getAttribute('aria-disabled') === 'true';
  }

  public isSelected(): boolean {
    return this.getAttribute('aria-selected') === 'true';
  }

  public getTextElement(): HTMLElement | null {
    return this.querySelector('pxm-select-item-text');
  }
}

// Helper component for item text content
export class PxmSelectItemText extends HTMLElement {
  constructor() {
    super();
  }
}

// Register the custom elements
customElements.define('pxm-select-item', PxmSelectItem);
customElements.define('pxm-select-item-text', PxmSelectItemText); 