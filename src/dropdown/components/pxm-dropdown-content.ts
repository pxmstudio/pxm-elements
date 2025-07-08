import { withErrorBoundary } from '../../core/component-utils';
import type { PxmDropdownContent as PxmDropdownContentElement } from '../types';

/**
 * PXM Dropdown Content Component
 *
 * Shows/hides dropdown menu content based on parent <pxm-dropdown> state.
 * Handles keyboard navigation and focus management.
 * No Shadow DOM, no styling. All appearance is consumer-controlled.
 */
export class PxmDropdownContent extends HTMLElement {
  private _observer?: MutationObserver;
  private _keydownHandler = (e: KeyboardEvent) => this._onKeyDown(e);
  private _typeaheadBuffer = '';
  private _typeaheadTimeout: any = null;

  constructor() {
    super();
    // No Shadow DOM
  }

  connectedCallback() {
    withErrorBoundary(() => {
      this.setAttribute('role', 'menu');
      this.setAttribute('tabindex', '-1');
      this._updateState();
      this._observeDropdown();
      this.addEventListener('keydown', this._keydownHandler);
      this.addEventListener('pxm:submenu:open', this._onSubmenuOpen as EventListener);
    })();
  }

  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = undefined;
    }
    this.removeEventListener('keydown', this._keydownHandler);
    document.removeEventListener('mousedown', this._onDocumentClick);
    this.removeEventListener('pxm:submenu:open', this._onSubmenuOpen as EventListener);
  }

  private _observeDropdown() {
    const dropdown = this._findDropdown();
    if (!dropdown) return;
    this._observer = new MutationObserver(() => this._updateState());
    this._observer.observe(dropdown, { attributes: true, attributeFilter: ['open'] });
  }

  private _findDropdown(): HTMLElement | null {
    let parent = this.parentElement;
    while (parent && parent.tagName.toLowerCase() !== 'pxm-dropdown') {
      parent = parent.parentElement;
    }
    return parent;
  }

  private _findTrigger(): HTMLElement | null {
    if (!this.parentElement) return null;
    return Array.from(this.parentElement.children).find(
      el => el.tagName.toLowerCase() === 'pxm-dropdown-trigger'
    ) as HTMLElement | null;
  }

  private _getItems(): HTMLElement[] {
    return Array.from(this.querySelectorAll('pxm-dropdown-item')) as HTMLElement[];
  }

  private _getEnabledItems(): HTMLElement[] {
    return this._getItems().filter(item => !item.hasAttribute('disabled'));
  }

  private _focusItem(index: number) {
    const items = this._getEnabledItems();
    items.forEach((item, i) => {
      item.setAttribute('tabindex', i === index ? '0' : '-1');
      item.setAttribute('data-state', i === index ? 'active' : 'idle');
    });
    if (items[index]) {
      (items[index] as HTMLElement).focus();
    }
  }

  private _focusFirstItem() {
    this._focusItem(0);
  }

  private _focusLastItem() {
    const items = this._getEnabledItems();
    if (items.length) this._focusItem(items.length - 1);
  }

  private _focusNextItem() {
    const items = this._getEnabledItems();
    const activeIndex = items.findIndex(item => item.getAttribute('data-state') === 'active');
    const next = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
    this._focusItem(next);
  }

  private _focusPrevItem() {
    const items = this._getEnabledItems();
    const activeIndex = items.findIndex(item => item.getAttribute('data-state') === 'active');
    const prev = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
    this._focusItem(prev);
  }

  private _onKeyDown(e: KeyboardEvent) {
    const items = this._getEnabledItems();
    if (!items.length) return;
    // Typeahead search
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      this._typeaheadBuffer += e.key;
      clearTimeout(this._typeaheadTimeout);
      this._typeaheadTimeout = setTimeout(() => { this._typeaheadBuffer = ''; }, 500);
      const matchIndex = items.findIndex(item => (item.textContent || '').trim().toLowerCase().startsWith(this._typeaheadBuffer.toLowerCase()));
      if (matchIndex !== -1) {
        this._focusItem(matchIndex);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this._focusNextItem();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._focusPrevItem();
        break;
      case 'Home':
        e.preventDefault();
        this._focusFirstItem();
        break;
      case 'End':
        e.preventDefault();
        this._focusLastItem();
        break;
      case 'Escape':
        e.preventDefault();
        this._closeDropdownAndFocusTrigger();
        break;
      case 'Tab':
        this._closeDropdownAndFocusTrigger();
        break;
      case 'Enter':
      case ' ': {
        const activeIndex = items.findIndex(item => item.getAttribute('data-state') === 'active');
        if (activeIndex !== -1) {
          e.preventDefault();
          items[activeIndex].click();
        }
        break;
      }
    }
  }

  private _closeDropdownAndFocusTrigger() {
    const dropdown = this._findDropdown();
    const trigger = this._findTrigger();
    if (dropdown) (dropdown as any).closeDropdown();
    if (trigger) trigger.focus();
  }

  private _onDocumentClick = (e: MouseEvent) => {
    const dropdown = this._findDropdown();
    const trigger = this._findTrigger();
    if (!this.contains(e.target as Node) && (!trigger || !trigger.contains(e.target as Node))) {
      if (dropdown) (dropdown as any).closeDropdown();
    }
  };

  private _onSubmenuOpen = (e: CustomEvent) => {
    const opened = e.detail.submenu;
    const submenus = this.querySelectorAll('pxm-dropdown-submenu');
    submenus.forEach((el) => {
      if (el !== opened && typeof (el as any).closeSubmenu === 'function') {
        (el as any).closeSubmenu();
      }
    });
    e.stopPropagation();
  };

  private _updateState() {
    const dropdown = this._findDropdown();
    const isOpen = dropdown ? (dropdown as any).open : false;
    // Animation event-driven system
    if (isOpen) {
      // Before open event
      let animationDone = false;
      const beforeOpen = new CustomEvent('pxm:dropdown:before-open', {
        bubbles: true,
        cancelable: true,
        detail: {
          content: this,
          complete: () => { animationDone = true; }
        }
      });
      if (!this.dispatchEvent(beforeOpen) || beforeOpen.defaultPrevented) {
        // Wait for animation to complete
        if (!animationDone) return;
      }
    } else {
      // Before close event
      let animationDone = false;
      const beforeClose = new CustomEvent('pxm:dropdown:before-close', {
        bubbles: true,
        cancelable: true,
        detail: {
          content: this,
          complete: () => { animationDone = true; }
        }
      });
      if (!this.dispatchEvent(beforeClose) || beforeClose.defaultPrevented) {
        // Wait for animation to complete
        if (!animationDone) return;
      }
    }
    this.setAttribute('aria-hidden', String(!isOpen));
    this.setAttribute('data-state', isOpen ? 'open' : 'closed');
    this.style.display = isOpen ? '' : 'none'; // Functional only
    if (isOpen) {
      // Focus first item when opened
      setTimeout(() => this._focusFirstItem(), 0);
      document.addEventListener('mousedown', this._onDocumentClick);
    } else {
      document.removeEventListener('mousedown', this._onDocumentClick);
      // Close all submenus
      const submenus = this.querySelectorAll('pxm-dropdown-submenu');
      submenus.forEach((el) => {
        if (typeof (el as any).closeSubmenu === 'function') {
          (el as any).closeSubmenu();
        }
      });
    }
  }
}

export type { PxmDropdownContentElement }; 