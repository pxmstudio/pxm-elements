/**
 * PXM Select Content Component
 * 
 * The dropdown container that holds select items
 */

import { withErrorBoundary } from '../../core/component-utils';
import { SELECT_CONSTANTS } from '../config';

export class PxmSelectContent extends HTMLElement {
  private selectRoot?: HTMLElement;
  private initialized = false;
  private originalBodyOverflow?: string;

  constructor() {
    super();
    // Set essential attributes for functionality
    this.setAttribute('role', 'listbox');
    this.setAttribute('tabindex', '-1'); // Make focusable but not in tab order
  }

  connectedCallback(): void {
    withErrorBoundary(() => {
      if (this.initialized) return;
      this.initialize();
    })();
  }

  disconnectedCallback(): void {
    this.restoreBodyScroll();
  }

  private initialize(): void {
    this.findSelectRoot();
    this.setupEventListeners();
    this.initialized = true;
  }

  private findSelectRoot(): void {
    this.selectRoot = this.closest('pxm-select') as HTMLElement;
    if (!this.selectRoot) {
      console.warn('PxmSelectContent must be inside a pxm-select element');
    }
  }

  private setupEventListeners(): void {
    // Handle clicks on the content itself
    this.addEventListener('click', this.handleContentClick.bind(this));
    
    // Handle keyboard navigation when content is focused
    this.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  private handleContentClick(event: Event): void {
    // Allow clicks to propagate to items, but prevent them from closing the dropdown
    event.stopPropagation();
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (!this.selectRoot) return;
    
    const selectInstance = (this.selectRoot as any).selectInstance;
    if (!selectInstance) return;

    // Don't handle keyboard events if search input is focused
    const searchInput = this.selectRoot.querySelector('pxm-select-search input');
    if (searchInput && document.activeElement === searchInput) {
      return;
    }

    switch (event.key) {
      case SELECT_CONSTANTS.KEYS.ARROW_DOWN:
        event.preventDefault();
        selectInstance.focusNextItem();
        break;
        
      case SELECT_CONSTANTS.KEYS.ARROW_UP:
        event.preventDefault();
        selectInstance.focusPreviousItem();
        break;
        
      case SELECT_CONSTANTS.KEYS.ENTER:
      case SELECT_CONSTANTS.KEYS.SPACE:
        event.preventDefault();
        selectInstance.selectFocusedItem();
        break;
        
      case SELECT_CONSTANTS.KEYS.ESCAPE:
        event.preventDefault();
        selectInstance.close();
        break;
        
      case SELECT_CONSTANTS.KEYS.HOME:
        event.preventDefault();
        selectInstance.focusFirstItem();
        break;
        
      case SELECT_CONSTANTS.KEYS.END:
        event.preventDefault();
        selectInstance.focusLastItem();
        break;
        
      default:
        // Try type-ahead for printable characters
        if (selectInstance.handleTypeAhead && selectInstance.handleTypeAhead(event.key)) {
          event.preventDefault();
        }
        break;
    }
  }

  // Public methods for the parent select to call
  public updateAttributes(config: Record<string, any>, state: any): void {
    // Set both ARIA (accessibility) and data (styling) attributes
    this.setAttribute('aria-multiselectable', String(config.multiple));
    this.setAttribute('aria-hidden', String(!state.isOpen));
    
    this.setAttribute('data-open', String(state.isOpen));
    this.setAttribute('data-state', state.isOpen ? 'open' : 'closed');
    this.setAttribute('data-multiple', String(config.multiple));

    // Handle scroll lock
    if (config['scroll-lock']) {
      if (state.isOpen) {
        this.lockBodyScroll();
      } else {
        this.restoreBodyScroll();
      }
    }
  }

  public show(): void {
    this.style.display = 'block';
    this.setAttribute('data-open', 'true');
    this.setAttribute('data-state', 'open');
    this.setAttribute('aria-hidden', 'false');
  }

  public hide(): void {
    this.style.display = 'none';
    this.setAttribute('data-open', 'false');
    this.setAttribute('data-state', 'closed');
    this.setAttribute('aria-hidden', 'true');
    this.restoreBodyScroll();
  }

  private lockBodyScroll(): void {
    if (document.body.style.overflow !== 'hidden') {
      this.originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
  }

  private restoreBodyScroll(): void {
    if (this.originalBodyOverflow !== undefined) {
      document.body.style.overflow = this.originalBodyOverflow;
      this.originalBodyOverflow = undefined;
    }
  }

  public getItems(): NodeListOf<HTMLElement> {
    return this.querySelectorAll('pxm-select-item');
  }

  public scrollToItem(item: HTMLElement): void {
    if (item && this.contains(item)) {
      item.scrollIntoView({ 
        block: 'nearest', 
        inline: 'nearest' 
      });
    }
  }
}

// Register the custom element
customElements.define('pxm-select-content', PxmSelectContent); 