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
      // Get configuration from parent select
      const selectElement = this.closest('pxm-select') as any;
      const config = selectElement?.config || {};
      const wrapValues = config['wrap-values'] !== false; // Default to true
      const separator = config['value-separator'] || ', '; // Default to ', '
      
      if (wrapValues) {
        // Create wrapped values with spans
        this.innerHTML = '';
        items.forEach((item, index) => {
          const valueElement = item.querySelector('pxm-select-item-text');
          const text = valueElement?.textContent?.trim() || item.textContent?.trim();
          const value = (item as any).getValue?.() || item.getAttribute('value') || text;
          
          if (text) {
            const span = document.createElement('span');
            span.className = 'pxm-select-value-item';
            span.setAttribute('data-value', value);
            span.setAttribute('data-index', index.toString());
            span.textContent = text;
            
            this.appendChild(span);
            
            // Add separator if not the last item and separator is not empty
            if (index < items.length - 1 && separator) {
              const separatorNode = document.createTextNode(separator);
              this.appendChild(separatorNode);
            }
          }
        });
      } else {
        // Fallback to text-only approach
        const values = items.map(item => {
          const valueElement = item.querySelector('pxm-select-item-text');
          return valueElement?.textContent?.trim() || item.textContent?.trim();
        }).filter(Boolean);
        
        this.textContent = values.join(separator);
      }
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