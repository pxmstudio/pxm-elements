import { withErrorBoundary } from '../../core/component-utils';

/**
 * PXM Dropdown Submenu Wrapper Component
 *
 * Wraps a submenu trigger and content, managing open/close state and interaction mode.
 * Usage:
 * <pxm-dropdown-submenu open-on="hover|click">
 *   <pxm-dropdown-submenu-trigger>More…</pxm-dropdown-submenu-trigger>
 *   <pxm-dropdown-submenu-content>...</pxm-dropdown-submenu-content>
 * </pxm-dropdown-submenu>
 */
export class PxmDropdownSubmenu extends HTMLElement {
  private _open = false;
  private _openOn: 'hover' | 'click' = 'hover';
  private _trigger: HTMLElement | null = null;
  private _content: HTMLElement | null = null;

  static get observedAttributes() {
    return ['open-on'];
  }

  constructor() {
    super();
    // No Shadow DOM
  }

  connectedCallback() {
    withErrorBoundary(() => {
      this._findParts();
      this._applyOpenOn();
      this._updateState();
    })();
  }

  disconnectedCallback() {
    this._removeListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'open-on') {
      this._applyOpenOn();
    }
  }

  private _findParts() {
    this._trigger = this.querySelector('pxm-dropdown-submenu-trigger');
    this._content = this.querySelector('pxm-dropdown-submenu-content');
  }

  private _applyOpenOn() {
    this._removeListeners();
    this._openOn = (this.getAttribute('open-on') === 'click') ? 'click' : 'hover';
    if (!this._trigger) this._findParts();
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
    // Notify parent to close other submenus
    this.dispatchEvent(new CustomEvent('pxm:submenu:open', { bubbles: true, detail: { submenu: this } }));
    this._open = true;
    this._updateState();
  };

  private _onClose = () => {
    this._open = false;
    this._updateState();
  };

  private _onToggle = (e: Event) => {
    e.preventDefault();
    if (!this._open) {
      this.dispatchEvent(new CustomEvent('pxm:submenu:open', { bubbles: true, detail: { submenu: this } }));
    }
    this._open = !this._open;
    this._updateState();
  };

  private _onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._onOpen();
      if (this._content) {
        const firstItem = this._content.querySelector('pxm-dropdown-item:not([disabled])');
        if (firstItem) (firstItem as HTMLElement).focus();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'Escape') {
      this._onClose();
      if (this._trigger) (this._trigger as HTMLElement).focus();
    }
  };

  private _onPointerLeave = (e: PointerEvent) => {
    // Only close if the pointer is truly leaving the submenu region
    const related = e.relatedTarget as Node | null;
    if (!related || !this.contains(related)) {
      this._onClose();
    }
  };

  private _updateState() {
    if (this._trigger) {
      this._trigger.setAttribute('aria-expanded', String(this._open));
    }
    if (this._content) {
      (this._content as any).submenuOpen = this._open;
      this._content.setAttribute('data-state', this._open ? 'open' : 'closed');
      let animationDone = false;
      if (this._open) {
        // Before open event
        const beforeOpen = new CustomEvent('pxm:dropdown:before-open', {
          bubbles: true,
          cancelable: true,
          detail: {
            content: this._content,
            complete: () => { animationDone = true; }
          }
        });
        if (!this._content.dispatchEvent(beforeOpen) || beforeOpen.defaultPrevented) {
          if (!animationDone) return;
        }
        this._content.setAttribute('aria-hidden', 'false');
        this._content.style.display = '';
      } else {
        // Before close event
        const beforeClose = new CustomEvent('pxm:dropdown:before-close', {
          bubbles: true,
          cancelable: true,
          detail: {
            content: this._content,
            complete: () => { animationDone = true; }
          }
        });
        if (!this._content.dispatchEvent(beforeClose) || beforeClose.defaultPrevented) {
          if (!animationDone) return;
        }
        this._content.setAttribute('aria-hidden', 'true');
        this._content.style.display = 'none';
      }
    }
  }

  public closeSubmenu() {
    this._open = false;
    this._updateState();
    // Recursively close nested submenus
    const nested = this.querySelectorAll('pxm-dropdown-submenu');
    nested.forEach((el) => {
      if (el !== this && typeof (el as any).closeSubmenu === 'function') {
        (el as any).closeSubmenu();
      }
    });
  }
} 