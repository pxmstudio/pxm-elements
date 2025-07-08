/**
 * PXM Select Separator Component
 * 
 * Visual separator between items or groups
 */

export class PxmSelectSeparator extends HTMLElement {
  constructor() {
    super();
    // Set essential attributes for functionality
    this.setAttribute('role', 'separator');
    this.setAttribute('aria-hidden', 'true');
    this.setAttribute('data-separator', 'true');
  }

  connectedCallback(): void {
    // No initialization needed - this is a simple presentational component
  }

  disconnectedCallback(): void {
    // No cleanup needed
  }
}

// Register the custom element
customElements.define('pxm-select-separator', PxmSelectSeparator); 