/**
 * PXM Select Group Component
 * 
 * Groups related select items together with an optional label
 */

import { withErrorBoundary } from '../../core/component-utils';

export class PxmSelectGroup extends HTMLElement {
  private initialized = false;

  constructor() {
    super();
    // Set essential attributes for functionality
    this.setAttribute('role', 'group');
  }

  connectedCallback(): void {
    withErrorBoundary(() => {
      if (this.initialized) return;
      this.initialize();
    })();
  }

  disconnectedCallback(): void {
    // Cleanup handled by parent
  }

  private initialize(): void {
    this.setupGroupStructure();
    this.initialized = true;
  }

  private setupGroupStructure(): void {
    // Find label element and associate it with the group
    const labelElement = this.querySelector('pxm-select-label');
    if (labelElement) {
      const labelId = labelElement.id || `pxm-select-group-label-${Date.now()}`;
      labelElement.id = labelId;
      this.setAttribute('aria-labelledby', labelId);
    }
    
    // Set data attributes for styling
    this.setAttribute('data-group', 'true');
  }

  public getItems(): NodeListOf<HTMLElement> {
    return this.querySelectorAll('pxm-select-item');
  }

  public getLabel(): HTMLElement | null {
    return this.querySelector('pxm-select-label');
  }
}

// Register the custom element
customElements.define('pxm-select-group', PxmSelectGroup); 