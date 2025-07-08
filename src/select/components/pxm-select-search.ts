import { withErrorBoundary } from '../../core/component-utils';

/**
 * PXM Select Search Component
 * 
 * Provides search/filter functionality within the select dropdown.
 * 
 * Usage:
 * ```html
 * <pxm-select-content>
 *   <pxm-select-search placeholder="Search options...">
 *     <input type="text" />
 *     <button data-clear>×</button>
 *   </pxm-select-search>
 *   <pxm-select-item value="apple">Apple</pxm-select-item>
 *   <!-- ... more items ... -->
 * </pxm-select-content>
 * ```
 */
class PxmSelectSearch extends HTMLElement {
  private selectRoot?: HTMLElement;
  private inputElement?: HTMLInputElement;
  private clearButton?: HTMLElement;
  private initialized = false;
  private searchQuery = '';

  constructor() {
    super();
  }

  connectedCallback(): void {
    withErrorBoundary(() => {
      if (this.initialized) return;
      
      // Set up elements and event listeners immediately to prevent race conditions
      this.findSelectRoot();
      this.findElements();
      this.setupAttributes();
      this.setupEventListeners();
      
      this.initialized = true;
    })();
  }

  disconnectedCallback(): void {
    // Cleanup handled by parent
  }

  private findSelectRoot(): void {
    this.selectRoot = this.closest('pxm-select') as HTMLElement;
    if (!this.selectRoot) {
      console.warn('PxmSelectSearch must be inside a pxm-select element');
    }
  }

  private findElements(): void {
    // Find input element (either direct child or nested)
    this.inputElement = this.querySelector('input[type="text"], input:not([type])') as HTMLInputElement;
    
    // If no input found, create one
    if (!this.inputElement) {
      this.inputElement = document.createElement('input');
      this.inputElement.type = 'text';
      this.inputElement.setAttribute('role', 'searchbox');
      this.prepend(this.inputElement);
    }

    // Find clear button - look for data-clear attribute first, then any button
    this.clearButton = this.querySelector('[data-clear]') as HTMLElement;
    
    // If no clear button found but there's another button, use that and add data-clear
    if (!this.clearButton) {
      const existingButton = this.querySelector('button') as HTMLElement;
      if (existingButton) {
        this.clearButton = existingButton;
        this.clearButton.setAttribute('data-clear', '');
        this.clearButton.setAttribute('type', 'button');
        this.clearButton.setAttribute('aria-label', 'Clear search');
      }
    }
    
    // If still no clear button found, create one
    if (!this.clearButton) {
      this.clearButton = document.createElement('button');
      this.clearButton.setAttribute('data-clear', '');
      this.clearButton.setAttribute('type', 'button');
      this.clearButton.setAttribute('aria-label', 'Clear search');
      this.clearButton.textContent = '×';
      this.append(this.clearButton);
    }
  }

  private setupAttributes(): void {
    // Set up input attributes
    if (this.inputElement) {
      this.inputElement.setAttribute('autocomplete', 'off');
      this.inputElement.setAttribute('spellcheck', 'false');
      
      // Use placeholder from component attribute or default
      const placeholder = this.getAttribute('placeholder') || 'Search options...';
      this.inputElement.setAttribute('placeholder', placeholder);
    }

    // Set up clear button attributes
    if (this.clearButton) {
      this.clearButton.style.display = 'none'; // Hidden by default
    }
  }

  private setupEventListeners(): void {
    if (this.inputElement) {
      this.inputElement.addEventListener('input', this.handleInput.bind(this));
      this.inputElement.addEventListener('keydown', this.handleKeydown.bind(this), { capture: true });
      this.inputElement.addEventListener('focus', this.handleFocus.bind(this));
      this.inputElement.addEventListener('blur', this.handleBlur.bind(this));
    }

    if (this.clearButton) {
      this.clearButton.addEventListener('click', this.handleClear.bind(this));
    }
  }

  private handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.toLowerCase().trim();
    
    // Prevent event from bubbling up
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    // Show/hide clear button based on whether there's text
    if (this.clearButton) {
      this.clearButton.style.display = this.searchQuery ? 'block' : 'none';
    }

    // Trigger filtering in the parent select
    if (this.selectRoot) {
      const selectInstance = (this.selectRoot as any).selectInstance;
      if (selectInstance?.filterItems) {
        selectInstance.filterItems(this.searchQuery);
      }
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    // Always stop propagation for search input events to prevent interference
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.clearSearch();
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        // Let the parent select handle navigation
        event.preventDefault();
        if (this.selectRoot) {
          const selectInstance = (this.selectRoot as any).selectInstance;
          if (selectInstance) {
            if (event.key === 'ArrowDown') {
              selectInstance.focusFirstVisibleItem();
            } else {
              selectInstance.focusLastVisibleItem();
            }
          }
        }
        break;
      case 'Enter':
        // Select the first visible item or currently focused item
        event.preventDefault();
        if (this.selectRoot) {
          const selectInstance = (this.selectRoot as any).selectInstance;
          if (selectInstance) {
            selectInstance.selectFocusedOrFirstVisibleItem();
          }
        }
        break;
      default:
        // For all other keys, just prevent them from bubbling up
        // This includes letters, numbers, backspace, etc.
        break;
    }
  }

  private handleFocus(_event: FocusEvent): void {
    // Add focused state for styling
    this.setAttribute('data-focused', 'true');
    
    // Clear any type-ahead state when search input gets focus
    if (this.selectRoot) {
      const selectInstance = (this.selectRoot as any).selectInstance;
      if (selectInstance?.clearTypeAhead) {
        selectInstance.clearTypeAhead();
      }
    }
  }

  private handleBlur(_event: FocusEvent): void {
    // Remove focused state
    this.setAttribute('data-focused', 'false');
  }

  private handleClear(_event: Event): void {
    this.clearSearch();
  }

  private clearSearch(): void {
    if (this.inputElement) {
      this.inputElement.value = '';
      this.searchQuery = '';
      
      // Hide clear button
      if (this.clearButton) {
        this.clearButton.style.display = 'none';
      }

      // Clear filtering in parent select
      if (this.selectRoot) {
        const selectInstance = (this.selectRoot as any).selectInstance;
        if (selectInstance && typeof selectInstance.filterItems === 'function') {
          selectInstance.filterItems('');
        }
      }

      // Focus back to input
      this.inputElement.focus();
    }
  }

  // Public methods
  public focus(): void {
    if (this.inputElement) {
      this.inputElement.focus();
    }
  }

  public getQuery(): string {
    return this.searchQuery;
  }

  public setQuery(query: string): void {
    if (this.inputElement) {
      this.inputElement.value = query;
      // Trigger input event properly
      const event = new Event('input', { bubbles: true });
      Object.defineProperty(event, 'target', { value: this.inputElement, enumerable: true });
      this.handleInput(event);
    }
  }

  public clear(): void {
    this.clearSearch();
  }
}

// Register the custom element
customElements.define('pxm-select-search', PxmSelectSearch);

export { PxmSelectSearch }; 