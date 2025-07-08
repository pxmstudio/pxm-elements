/**
 * PXM Select Value Component
 * 
 * Displays the currently selected value(s) in the trigger
 */

import { withErrorBoundary } from '../../core/component-utils';
import { SELECT_CONSTANTS } from '../config';

export class PxmSelectValue extends HTMLElement {
  private selectRoot?: HTMLElement;
  private initialized = false;
  private originalPlaceholderContent = '';

  constructor() {
    super();
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
    // Store the original content as the placeholder
    this.originalPlaceholderContent = this.innerHTML;
    this.initialized = true;
  }

  private findSelectRoot(): void {
    this.selectRoot = this.closest('pxm-select') as HTMLElement;
    if (!this.selectRoot) {
      console.warn('PxmSelectValue must be inside a pxm-select element');
    }
  }

  // Public methods for the parent select to call
  public updateValue(config: Record<string, any>, selectedItems: HTMLElement[]): void {
    const isMultiple = config.multiple;

    if (selectedItems.length === 0) {
      this.showPlaceholder();
    } else if (isMultiple) {
      this.showMultipleValues(selectedItems);
    } else {
      this.showSingleValue(selectedItems[0]);
    }
  }

  private showPlaceholder(): void {
    // Only show placeholder content if one is provided
    if (this.originalPlaceholderContent.trim()) {
      this.innerHTML = this.originalPlaceholderContent;
      this.setAttribute('data-placeholder', 'true');
      this.setAttribute('data-state', 'placeholder');
    } else {
      // No placeholder - show empty content
      this.textContent = '';
      this.setAttribute('data-placeholder', 'false');
      this.setAttribute('data-state', 'empty');
    }
  }

  private showSingleValue(item: HTMLElement): void {
    const valueElement = item.querySelector('pxm-select-item-text');
    const text = valueElement ? valueElement.textContent : item.textContent;
    
    this.textContent = text?.trim() || '';
    this.setAttribute('data-placeholder', 'false');
    this.setAttribute('data-state', 'value');
  }

  private showMultipleValues(items: HTMLElement[]): void {
    if (items.length === 1) {
      this.showSingleValue(items[0]);
      return;
    }

    // Use constant for threshold
    const threshold = SELECT_CONSTANTS.PERFORMANCE.MULTIPLE_DISPLAY_THRESHOLD;
    const shouldShowCount = items.length > threshold;
    
    if (shouldShowCount) {
      this.textContent = `${items.length} ${SELECT_CONSTANTS.UI.MULTIPLE_SELECTION_TEXT}`;
    } else {
      // Optimize text extraction
      const values = items.map(item => {
        const valueElement = item.querySelector('pxm-select-item-text');
        return valueElement?.textContent?.trim() || item.textContent?.trim();
      }).filter(Boolean);
      
      this.textContent = values.join(', ');
    }
    
    this.setAttribute('data-placeholder', 'false');
    this.setAttribute('data-state', 'value');
    this.setAttribute('data-multiple', 'true');
  }

  public clear(): void {
    this.showPlaceholder();
  }

  public getValue(): string {
    return this.textContent || '';
  }

  public isEmpty(): boolean {
    return !this.textContent?.trim();
  }
}

// Register the custom element
customElements.define('pxm-select-value', PxmSelectValue); 