import { withErrorBoundary, parseAttributes } from '../core/component-utils';
import type { PxmDropdown as PxmDropdownElement } from './types';

/**
 * PXM Dropdown Component
 *
 * Logic-only dropdown menu. No Shadow DOM, no internal styling. All styling is controlled by the consumer.
 *
 * Features:
 * - Open/close logic
 * - Keyboard navigation (to be implemented)
 * - ARIA and data attributes for accessibility and styling
 * - Event-driven (pxm:dropdown:open, pxm:dropdown:close, pxm:dropdown:select)
 *
 * Consumer controls all appearance and ARIA labeling.
 */
export class PxmDropdown extends HTMLElement {
  private _open = false;
  private _openOn: 'hover' | 'click' = 'hover';
  private _trigger: HTMLElement | null = null;
  private _observer?: MutationObserver;

  static get observedAttributes() {
    return ['open', 'open-on'];
  }

  constructor() {
    super();
    // No Shadow DOM
  }

  connectedCallback() {
    withErrorBoundary(() => {
      this._findTrigger();
      this._applyOpenOn();
      this._updateState();
      this._observeTriggerChanges();
      // Microtask fallback: ensure listeners are attached after DOM updates
      setTimeout(() => {
        this._findTrigger();
        this._applyOpenOn();
      }, 0);
    })();
  }

  disconnectedCallback() {
    this._removeListeners();
    if (this._observer) {
      this._observer.disconnect();
      this._observer = undefined;
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    if (name === 'open' || name === 'open-on') {
      this._findTrigger();
      this._applyOpenOn();
    }
    if (name === 'open') {
      this._open = this.hasAttribute('open');
      this._updateState();
    }
  }

  private _findTrigger() {
    this._trigger = this.querySelector('pxm-dropdown-trigger');
  }

  private _observeTriggerChanges() {
    if (this._observer) this._observer.disconnect();
    this._observer = new MutationObserver(() => {
      this._findTrigger();
      this._applyOpenOn();
    });
    this._observer.observe(this, { childList: true, subtree: true });
  }

  private _applyOpenOn() {
    this._removeListeners();
    this._openOn = (this.getAttribute('open-on') === 'click') ? 'click' : 'hover';
    if (!this._trigger) this._findTrigger();
    if (!this._trigger) return;
    if (this._openOn === 'hover') {
      this._trigger.addEventListener('mouseenter', this._onOpen);
      this._trigger.addEventListener('focus', this._onOpen);
      this.addEventListener('pointerleave', this._onPointerLeave);
    } else {
      this._trigger.addEventListener('click', this._onToggle);
      this._trigger.addEventListener('keydown', this._onKeyDown);
    }
  }

  private _removeListeners() {
    if (this._trigger) {
      this._trigger.removeEventListener('mouseenter', this._onOpen);
      this._trigger.removeEventListener('focus', this._onOpen);
      this._trigger.removeEventListener('click', this._onToggle);
      this._trigger.removeEventListener('keydown', this._onKeyDown);
    }
    this.removeEventListener('pointerleave', this._onPointerLeave);
  }

  private _onOpen = () => {
    this.open = true;
    this.dispatchEvent(new CustomEvent('pxm:dropdown:open', { bubbles: true }));
  };

  private _onClose = () => {
    this.open = false;
    this.dispatchEvent(new CustomEvent('pxm:dropdown:close', { bubbles: true }));
  };

  private _onToggle = (e: Event) => {
    e.preventDefault();
    this.open ? this._onClose() : this._onOpen();
  };

  private _onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._onToggle(e);
    }
  };

  private _onPointerLeave = (e: PointerEvent) => {
    // Only close if the pointer is truly leaving the dropdown region
    const related = e.relatedTarget as Node | null;
    if (!related || !this.contains(related)) {
      this._onClose();
    }
  };

  // Property for open state
  get open() {
    return this._open;
  }
  set open(val: boolean) {
    if (val) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  // Toggle open/close
  public openDropdown() {
    this.open = true;
    this.dispatchEvent(new CustomEvent('pxm:dropdown:open', { bubbles: true }));
  }
  public closeDropdown() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('pxm:dropdown:close', { bubbles: true }));
  }
  public toggleDropdown() {
    this.open ? this.closeDropdown() : this.openDropdown();
  }

  private _updateState() {
    // ARIA and data attributes
    this.setAttribute('aria-expanded', String(this._open));
    this.setAttribute('data-state', this._open ? 'open' : 'closed');
  }

  // Upgrade property if set before element definition
  private _upgradeProperty(prop: string) {
    if (this.hasOwnProperty(prop)) {
      const value = (this as any)[prop];
      delete (this as any)[prop];
      (this as any)[prop] = value;
    }
  }
}

export type { PxmDropdownElement }; 