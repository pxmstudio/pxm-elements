import { withErrorBoundary } from '../../core/component-utils';

/**
 * PXM Dropdown Submenu Trigger Component
 *
 * Used inside <pxm-dropdown-submenu>. All open/close logic is managed by the wrapper.
 * No Shadow DOM, no styling. All appearance is consumer-controlled.
 */
export class PxmDropdownSubmenuTrigger extends HTMLElement {
  constructor() {
    super();
    // No Shadow DOM
  }

  connectedCallback() {
    withErrorBoundary(() => {
      this.setAttribute('role', 'menuitem');
      this.setAttribute('aria-haspopup', 'menu');
      this.setAttribute('tabindex', '-1');
    })();
  }
} 