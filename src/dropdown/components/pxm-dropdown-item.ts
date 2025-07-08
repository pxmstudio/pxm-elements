import { withErrorBoundary } from '../../core/component-utils';
import type { PxmDropdownItem as PxmDropdownItemElement } from '../types';

/**
 * PXM Dropdown Item Component
 *
 * Acts as a selectable menu item in <pxm-dropdown-content>.
 * Supports disabled state.
 * No Shadow DOM, no styling. All appearance is consumer-controlled.
 */
export class PxmDropdownItem extends HTMLElement {
  static get observedAttributes() {
    return ['disabled'];
  }

  constructor() {
    super();
    // No Shadow DOM
  }

  connectedCallback() {
    withErrorBoundary(() => {
      this.setAttribute('role', 'menuitem');
      this._updateState();
      this.addEventListener('click', this._onSelect);
      this.addEventListener('keydown', this._onKeyDown);
      this.addEventListener('focus', this._onFocus);
      this.addEventListener('blur', this._onBlur);
    })();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onSelect);
    this.removeEventListener('keydown', this._onKeyDown);
    this.removeEventListener('focus', this._onFocus);
    this.removeEventListener('blur', this._onBlur);
  }

  attributeChangedCallback(name: string) {
    if (name === 'disabled') {
      this._updateState();
    }
  }

  public focus() {
    if (this.disabled) return;
    this.setAttribute('tabindex', '0');
    this.setAttribute('data-state', 'active');
    HTMLElement.prototype.focus.call(this);
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    if (val) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  private _onFocus = () => {
    if (this.disabled) return;
    this.setAttribute('data-state', 'active');
    this.setAttribute('tabindex', '0');
  };

  private _onBlur = () => {
    if (this.disabled) return;
    this.setAttribute('data-state', 'idle');
    this.setAttribute('tabindex', '-1');
  };

  private _onSelect = (e: Event) => {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this._select();
  };

  private _onKeyDown = (e: KeyboardEvent) => {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._select();
    }
  };

  private _select() {
    this.dispatchEvent(new CustomEvent('pxm:dropdown:select', {
      bubbles: true,
      detail: { value: this.getAttribute('value') || this.textContent }
    }));
    this._closeDropdown();
  }

  private _closeDropdown() {
    const dropdown = this._findDropdown();
    if (dropdown) {
      (dropdown as any).closeDropdown();
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
    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true');
      this.setAttribute('data-disabled', 'true');
      this.setAttribute('tabindex', '-1');
      this.setAttribute('data-state', 'idle');
    } else {
      this.removeAttribute('aria-disabled');
      this.removeAttribute('data-disabled');
      this.setAttribute('tabindex', '-1');
      this.setAttribute('data-state', 'idle');
    }
  }
}

export type { PxmDropdownItemElement }; 