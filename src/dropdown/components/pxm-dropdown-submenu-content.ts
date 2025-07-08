import { withErrorBoundary } from '../../core/component-utils';

/**
 * PXM Dropdown Submenu Content Component
 *
 * Used inside <pxm-dropdown-submenu>. Open state is managed by the wrapper.
 * No Shadow DOM, no styling. All appearance is consumer-controlled.
 */
export class PxmDropdownSubmenuContent extends HTMLElement {
  private _keydownHandler = (e: KeyboardEvent) => this._onKeyDown(e);
  public submenuOpen = false;

  connectedCallback() {
    withErrorBoundary(() => {
      this.setAttribute('role', 'menu');
      this.setAttribute('aria-orientation', 'vertical');
      this.setAttribute('tabindex', '-1');
      this.addEventListener('keydown', this._keydownHandler);
      this.addEventListener('pxm:submenu:open', this._onSubmenuOpen as EventListener);
    })();
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this._keydownHandler);
    this.removeEventListener('pxm:submenu:open', this._onSubmenuOpen as EventListener);
  }

  public focusFirstItem() {
    const items = this._getEnabledItems();
    if (items.length) {
      items[0].setAttribute('tabindex', '0');
      items[0].focus();
    }
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
        this._focusItem(0);
        break;
      case 'End':
        e.preventDefault();
        this._focusItem(items.length - 1);
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
} 