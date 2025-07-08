/**
 * PXM Select Label Component
 * 
 * Label for select groups
 */

export class PxmSelectLabel extends HTMLElement {
  constructor() {
    super();
    // Set essential attributes for functionality
    this.setAttribute('role', 'presentation');
    this.setAttribute('data-label', 'true');
  }

  connectedCallback(): void {
    // No initialization needed - this is a simple presentational component
  }

  disconnectedCallback(): void {
    // No cleanup needed
  }
}

// Register the custom element
customElements.define('pxm-select-label', PxmSelectLabel); 