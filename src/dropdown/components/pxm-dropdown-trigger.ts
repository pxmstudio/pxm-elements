import { withErrorBoundary } from '../../core/component-utils';
import type { PxmDropdownTrigger as PxmDropdownTriggerElement } from '../types';

/**
 * PXM Dropdown Trigger Component
 *
 * Acts as a button to open/close the parent <pxm-dropdown>.
 * No Shadow DOM, no styling. All appearance is consumer-controlled.
 */
export class PxmDropdownTrigger extends HTMLElement {
  constructor() {
    super();
    // No Shadow DOM
  }

  connectedCallback() {
    withErrorBoundary(() => {
      this.setAttribute('role', 'button');
      this.setAttribute('tabindex', '0');
      this.setAttribute('aria-haspopup', 'menu');
      this._updateState();
      this.addEventListener('click', this._onClick);
      this.addEventListener('keydown', this._onKeyDown);
    })();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeyDown);
  }

  private _onClick = (e: Event) => {
    this._toggleDropdown();
  };

  private _onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._toggleDropdown();
    }
  };

  private _toggleDropdown() {
    const dropdown = this._findDropdown();
    if (dropdown) {
      (dropdown as any).toggleDropdown();
      this._updateState();
    }
  }

  private _findDropdown(): HTMLElement | null {
    let parent = this.parentElement;
    while (parent && parent.tagName.toLowerCase() !== 'pxm-dropdown') {
      parent = parent.parentElement;
    }
    return parent;
  }

  private _updateState() {
    const dropdown = this._findDropdown();
    const isOpen = dropdown ? (dropdown as any).open : false;
    this.setAttribute('aria-expanded', String(isOpen));
    this.setAttribute('data-state', isOpen ? 'open' : 'closed');
  }
}

export type { PxmDropdownTriggerElement }; 