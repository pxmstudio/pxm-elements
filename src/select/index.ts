/**
 * PXM Select Component
 * 
 * A flexible, accessible select component that provides dropdown functionality with single
 * and multiple selection support. Bring your own styling and animation.
 * This component provides structure and behavior only - all styling is controlled by your CSS.
 * 
 * Features:
 * - Single and multiple selection modes
 * - Keyboard navigation with arrow keys, home/end, enter/space, escape
 * - Type-ahead search functionality
 * - Dynamic content support (items can be added/removed after initialization)
 * - Event-driven animation system (bring your own animation library)
 * - Accessibility-first design with proper ARIA attributes
 * - Scroll lock option for modal-like behavior
 * - Grouping and labeling support
 * - Custom value display formatting
 * 
 * Keyboard Navigation:
 * - `Enter` or `Space` - Open dropdown / Select focused item
 * - `ArrowDown` - Open dropdown / Focus next item
 * - `ArrowUp` - Open dropdown / Focus previous item  
 * - `Home` - Focus first item
 * - `End` - Focus last item
 * - `Escape` - Close dropdown
 * - `Tab` - Close dropdown and move to next focusable element
 * - `A-Z` - Type-ahead search
 * 
 * Basic Usage:
 * ```html
 * <pxm-select>
 *   <pxm-select-trigger>
 *     <pxm-select-value>Choose an option...</pxm-select-value>
 *     <span data-select-icon>▼</span>
 *   </pxm-select-trigger>
 *   
 *   <pxm-select-content>
 *     <pxm-select-item value="apple">
 *       <pxm-select-item-text>Apple</pxm-select-item-text>
 *     </pxm-select-item>
 *     <pxm-select-item value="banana">
 *       <pxm-select-item-text>Banana</pxm-select-item-text>
 *     </pxm-select-item>
 *     <pxm-select-item value="cherry">
 *       <pxm-select-item-text>Cherry</pxm-select-item-text>
 *     </pxm-select-item>
 *   </pxm-select-content>
 * </pxm-select>
 * ```
 * 
 * With Custom Icon Rotation:
 * ```html
 * <!-- Default is 180deg, customize with icon-rotation attribute -->
 * <pxm-select icon-rotation="90">
 *   <pxm-select-trigger>
 *     <pxm-select-value>Choose an option...</pxm-select-value>
 *     <span data-select-icon>▶</span>
 *   </pxm-select-trigger>
 *   <pxm-select-content>
 *     <!-- items -->
 *   </pxm-select-content>
 * </pxm-select>
 * ```
 * 
 * With Search/Filter Functionality:
 * ```html
 * <pxm-select>
 *   <pxm-select-trigger>
 *     <pxm-select-value>Choose an option...</pxm-select-value>
 *     <span data-select-icon>▼</span>
 *   </pxm-select-trigger>
 *   
 *   <pxm-select-content>
 *     <!-- Search input with clear button -->
 *     <pxm-select-search placeholder="Search fruits...">
 *       <input type="text" />
 *       <button data-clear>×</button>
 *     </pxm-select-search>
 *     
 *     <pxm-select-group>
 *       <pxm-select-item value="apple">Apple</pxm-select-item>
 *       <pxm-select-item value="banana">Banana</pxm-select-item>
 *       <pxm-select-item value="cherry">Cherry</pxm-select-item>
 *       <pxm-select-item value="grape">Grape</pxm-select-item>
 *     </pxm-select-group>
 *   </pxm-select-content>
 * </pxm-select>
 * ```
 * 
 * Multiple Selection:
 * ```html
 * <pxm-select multiple="true" close-on-select="false">
 *   <pxm-select-trigger>
 *     <pxm-select-value>Select multiple...</pxm-select-value>
 *   </pxm-select-trigger>
 *   <pxm-select-content>
 *     <pxm-select-item value="red">Red</pxm-select-item>
 *     <pxm-select-item value="green">Green</pxm-select-item>
 *     <pxm-select-item value="blue">Blue</pxm-select-item>
 *   </pxm-select-content>
 * </pxm-select>
 * ```
 * 
 * Multiple Selection with Custom Separator and Wrapped Values:
 * ```html
 * <!-- Custom separator (default is ', ') -->
 * <pxm-select multiple="true" value-separator=" | ">
 *   <pxm-select-trigger>
 *     <pxm-select-value>Select colors...</pxm-select-value>
 *   </pxm-select-trigger>
 *   <pxm-select-content>
 *     <pxm-select-item value="red">Red</pxm-select-item>
 *     <pxm-select-item value="green">Green</pxm-select-item>
 *   </pxm-select-content>
 * </pxm-select>
 * 
 * <!-- No separator between values -->
 * <pxm-select multiple="true" value-separator="">
 *   <pxm-select-trigger>
 *     <pxm-select-value>Select tags...</pxm-select-value>
 *   </pxm-select-trigger>
 *   <pxm-select-content>
 *     <pxm-select-item value="tag1">Tag 1</pxm-select-item>
 *     <pxm-select-item value="tag2">Tag 2</pxm-select-item>
 *   </pxm-select-content>
 * </pxm-select>
 * 
 * <!-- Disable value wrapping (no spans, just text) -->
 * <pxm-select multiple="true" wrap-values="false">
 *   <pxm-select-trigger>
 *     <pxm-select-value>Select options...</pxm-select-value>
 *   </pxm-select-trigger>
 *   <pxm-select-content>
 *     <pxm-select-item value="opt1">Option 1</pxm-select-item>
 *     <pxm-select-item value="opt2">Option 2</pxm-select-item>
 *   </pxm-select-content>
 * </pxm-select>
 * ```
 * 
 * With Groups and Labels:
 * ```html
 * <pxm-select>
 *   <pxm-select-trigger>
 *     <pxm-select-value>Select a fruit...</pxm-select-value>
 *   </pxm-select-trigger>
 *   
 *   <pxm-select-content>
 *     <pxm-select-group>
 *       <pxm-select-label>Citrus</pxm-select-label>
 *       <pxm-select-item value="orange">Orange</pxm-select-item>
 *       <pxm-select-item value="lemon">Lemon</pxm-select-item>
 *     </pxm-select-group>
 *     
 *     <pxm-select-separator></pxm-select-separator>
 *     
 *     <pxm-select-group>
 *       <pxm-select-label>Berries</pxm-select-label>
 *       <pxm-select-item value="strawberry">Strawberry</pxm-select-item>
 *       <pxm-select-item value="blueberry">Blueberry</pxm-select-item>
 *     </pxm-select-group>
 *   </pxm-select-content>
 * </pxm-select>
 * ```
 * 
 * Dynamic Content:
 * ```javascript
 * // Items can be added/removed dynamically
 * const select = document.querySelector('pxm-select');
 * const content = select.querySelector('pxm-select-content');
 * 
 * const newItem = document.createElement('pxm-select-item');
 * newItem.setAttribute('value', 'grape');
 * newItem.innerHTML = '<pxm-select-item-text>Grape</pxm-select-item-text>';
 * content.appendChild(newItem); // Automatically initialized
 * 
 * // Listen for changes
 * select.addEventListener('pxm:select:items-changed', (e) => {
 *   console.log(`Select now has ${e.detail.itemCount} items`);
 * });
 * 
 * // Get/set values programmatically
 * select.setValue('apple');
 * console.log(select.getValue()); // 'apple'
 * 
 * select.setValues(['apple', 'banana']); // For multiple selection
 * console.log(select.getValues()); // ['apple', 'banana']
 * 
 * // Interact with individual wrapped values (when wrap-values="true")
 * const valueElement = select.querySelector('pxm-select-value');
 * const valueSpans = valueElement.querySelectorAll('.pxm-select-value-item');
 * 
 * valueSpans.forEach(span => {
 *   span.addEventListener('click', (e) => {
 *     e.stopPropagation(); // Prevent select from opening
 *     const value = span.getAttribute('data-value');
 *     console.log(`Clicked value: ${value}`);
 *     
 *     // Example: Remove value on click
 *     const currentValues = select.getValues();
 *     const newValues = currentValues.filter(v => v !== value);
 *     select.setValues(newValues);
 *   });
 * });
 * ```
 * 
 * With Animation Library (via events - recommended for CDN):
 * ```javascript
 * const select = document.querySelector('pxm-select');
 * 
 * select.addEventListener('pxm:select:before-open', (e) => {
 *   const { contentElement } = e.detail;
 *   e.preventDefault(); // Take over the animation
 *   
 *   gsap.fromTo(contentElement, 
 *     { opacity: 0, y: -10, scaleY: 0.8 }, 
 *     { 
 *       opacity: 1, 
 *       y: 0, 
 *       scaleY: 1, 
 *       duration: 0.2,
 *       transformOrigin: 'top',
 *       onComplete: () => {
 *         e.detail.complete(); // Signal animation complete
 *       }
 *     }
 *   );
 * });
 * 
 * select.addEventListener('pxm:select:before-close', (e) => {
 *   const { contentElement } = e.detail;
 *   e.preventDefault(); // Take over the animation
 *   
 *   gsap.to(contentElement, { 
 *     opacity: 0, 
 *     y: -10,
 *     scaleY: 0.8,
 *     duration: 0.15,
 *     transformOrigin: 'top',
 *     onComplete: () => {
 *       e.detail.complete(); // Signal animation complete
 *     }
 *   });
 * });
 * ```
 * 
 * With CSS Transitions (default):
 * ```css
 * pxm-select-content {
 *   opacity: 0;
 *   transform: translateY(-8px) scaleY(0.9);
 *   transform-origin: top;
 *   transition: opacity 0.2s ease, transform 0.2s ease;
 * }
 * 
 * pxm-select-content[data-open="true"] {
 *   opacity: 1;
 *   transform: translateY(0) scaleY(1);
 * }
 * ```
 * 
 * Consumer Styling Examples:
 * ```css
 * /* Style the component structure *\/
 * pxm-select {
 *   /* Your layout styles *\/
 *   position: relative;
 *   display: inline-block;
 * }
 * 
 * pxm-select-trigger {
 *   /* Your trigger button styles *\/
 *   display: flex;
 *   align-items: center;
 *   padding: 8px 12px;
 *   border: 1px solid #ccc;
 *   border-radius: 4px;
 *   cursor: pointer;
 * }
 * 
 * pxm-select-content {
 *   /* Your dropdown styles *\/
 *   position: absolute;
 *   top: 100%;
 *   left: 0;
 *   right: 0;
 *   background: white;
 *   border: 1px solid #ccc;
 *   border-radius: 4px;
 *   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
 *   z-index: 1000;
 * }
 * 
 * /* ✅ DO: Style based on data attributes (for CSS/JS targeting) *\/
 * pxm-select[data-open="true"] pxm-select-trigger {
 *   /* Open state styling *\/
 *   border-color: #007bff;
 * }
 * 
 * pxm-select-item[data-selected="true"] {
 *   /* Selected item styling *\/
 *   background: #007bff;
 *   color: white;
 * }
 * 
 * pxm-select-item[data-focused="true"] {
 *   /* Focused item styling *\/
 *   background: #f0f0f0;
 * }
 * 
 * pxm-select-item[data-disabled="true"] {
 *   /* Disabled item styling *\/
 *   opacity: 0.5;
 *   cursor: not-allowed;
 * }
 * 
 * pxm-select[data-disabled="true"] {
 *   /* Disabled select styling *\/
 *   opacity: 0.6;
 * }
 * 
 * /* Multiple value styling (when wrap-values="true") *\/
 * .pxm-select-value-item {
 *   /* Style individual selected values *\/
 *   background: #e3f2fd;
 *   border-radius: 4px;
 *   padding: 2px 6px;
 *   display: inline-block;
 *   font-size: 0.875em;
 * }
 * 
 * .pxm-select-value-item[data-value="important"] {
 *   /* Style specific values by their data-value attribute *\/
 *   background: #ffebee;
 *   color: #c62828;
 * }
 * 
 * /* ❌ DON'T: Style based on ARIA attributes (bad practice) *\/
 * pxm-select-item[aria-selected="true"] {
 *   /* Don't use ARIA for styling *\/
 * }
 * ```
 * 
 * With Tailwind CSS:
 * ```html
 * <!-- ✅ DO: Use data attributes for styling -->
 * <pxm-select 
 *   class="relative inline-block min-w-48
 *          data-[open=true]:z-50
 *          data-[disabled=true]:opacity-60">
 *   <pxm-select-trigger 
 *     class="flex items-center justify-between w-full px-3 py-2
 *            border border-gray-300 rounded-md bg-white
 *            data-[open=true]:border-blue-500 data-[open=true]:ring-1 data-[open=true]:ring-blue-500
 *            data-[focused=true]:border-blue-500
 *            data-[disabled=true]:bg-gray-100 data-[disabled=true]:cursor-not-allowed
 *            hover:border-gray-400 focus:outline-none">
 *     <pxm-select-value 
 *       class="text-left data-[placeholder=true]:text-gray-500">Choose your option...</pxm-select-value>
 *     <span data-select-icon 
 *           class="ml-2 transition-transform duration-200 data-[open=true]:rotate-180">▼</span>
 *   </pxm-select-trigger>
 *   
 *   <pxm-select-content 
 *     class="absolute top-full left-0 right-0 mt-1
 *            bg-white border border-gray-300 rounded-md shadow-lg
 *            data-[open=false]:hidden
 *            max-h-60 overflow-auto z-50">
 *     <pxm-select-item 
 *       value="apple"
 *       class="px-3 py-2 cursor-pointer
 *              data-[focused=true]:bg-blue-50
 *              data-[selected=true]:bg-blue-100 data-[selected=true]:font-medium
 *              data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed
 *              hover:bg-gray-50">
 *       <pxm-select-item-text>Apple</pxm-select-item-text>
 *     </pxm-select-item>
 *   </pxm-select-content>
 * </pxm-select>
 * 
 * <!-- Style wrapped values in multiple selection -->
 * <style>
 *   .pxm-select-value-item {
 *     @apply inline-flex items-center bg-blue-100 text-blue-800 text-xs 
 *            px-2 py-1 rounded-md mr-1 last:mr-0;
 *   }
 *   
 *   .pxm-select-value-item[data-value^="tag-"] {
 *     @apply bg-green-100 text-green-800;
 *   }
 * </style>
 * ```
 * 
 * SSR / Hydration Support:
 * ```css
 * /* Recommended: Set initial styles in CSS to prevent hydration flash *\/
 * pxm-select-content:not([data-open="true"]) {
 *   display: none;
 * }
 * 
 * pxm-select-content[data-open="true"] {
 *   display: block;
 * }
 * 
 * /* Optional: Hide content during hydration *\/
 * pxm-select:not(:defined) pxm-select-content {
 *   display: none;
 * }
 * ```
 * 
 * Accessibility:
 * This component manages both ARIA attributes (for accessibility) and data attributes (for styling/JS).
 * - ARIA attributes (aria-expanded, aria-selected, etc.) are automatically managed for screen readers
 * - Data attributes (data-open, data-selected, etc.) are provided for CSS styling and JavaScript hooks
 * - Additional ARIA attributes, labels, and roles should be added by the consumer as needed
 * 
 * Events:
 * - `pxm:select:before-open` - Cancelable. Fired before dropdown opens.
 * - `pxm:select:after-open` - Fired after dropdown opens.
 * - `pxm:select:before-close` - Cancelable. Fired before dropdown closes.
 * - `pxm:select:after-close` - Fired after dropdown closes.
 * - `pxm:select:before-select` - Cancelable. Fired before item selection.
 * - `pxm:select:after-select` - Fired after item selection.
 * - `pxm:select:value-change` - Fired when the selected value(s) change.
 * - `pxm:select:state-change` - Fired when open/closed state changes.
 * - `pxm:select:items-changed` - Fired when items are dynamically added/removed.
 * - `pxm:select:icon-rotate` - Fired when the icon should rotate (open/close states).
 * - `pxm:select:items-filtered` - Fired when items are filtered by search query.
 */

import { parseAttributes, withErrorBoundary } from '../core/component-utils';
import { SELECT_SCHEMA, SELECT_CONSTANTS } from './config';
import type { SelectConfig, SelectState, SelectEventDetail, SelectItemEventDetail, SelectStateChangeDetail, SelectItemData } from './types';

// Import all sub-components
import { PxmSelectTrigger } from './components/pxm-select-trigger';
import { PxmSelectValue } from './components/pxm-select-value';
import { PxmSelectContent } from './components/pxm-select-content';
import { PxmSelectItem } from './components/pxm-select-item';
import { PxmSelectGroup } from './components/pxm-select-group';
import { PxmSelectLabel } from './components/pxm-select-label';
import { PxmSelectSeparator } from './components/pxm-select-separator';
import { PxmSelectSearch } from './components/pxm-select-search';

class PxmSelect extends HTMLElement {
  private config: SelectConfig = {} as SelectConfig;
  private state: SelectState = {
    isOpen: false,
    focusedIndex: -1,
    selectedValues: new Set<string>()
  };

  // Component references
  private triggerElement?: PxmSelectTrigger;
  private valueElement?: PxmSelectValue;
  private contentElement?: PxmSelectContent;
  private _items?: NodeListOf<PxmSelectItem>;

  // Observers and cleanup
  private mutationObserver?: MutationObserver;
  private outsideClickListener?: EventListener;
  private animationPromises = new Map<string, { resolve: () => void }>();

  // Animation control
  private hasCustomAnimations = false;
  private defaultListeners = new Map<string, EventListener>();

  // Type-ahead functionality
  private typeAheadString = '';
  private typeAheadTimeout?: NodeJS.Timeout;

  // Cache items to avoid repeated queries
  private get items(): NodeListOf<PxmSelectItem> {
    return this._items ??= this.querySelectorAll('pxm-select-item');
  }

  static get observedAttributes(): string[] {
    return Object.keys(SELECT_SCHEMA);
  }

  constructor() {
    super();
    // Store instance reference for sub-components to access
    (this as any).selectInstance = this;
  }

  connectedCallback(): void {
    withErrorBoundary(() => {
      this.config = parseAttributes(this, SELECT_SCHEMA) as SelectConfig;
      this.setupComponents();
      this.setupDefaultAnimations();
      this.observeChildChanges();
      this.updateAllAttributes();
    })();
  }

  disconnectedCallback(): void {
    this.cleanup();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    this.config = parseAttributes(this, SELECT_SCHEMA) as SelectConfig;
    
    if (name === 'icon-rotation') {
      this.updateIconRotation();
    }
    
    this.updateAllAttributes();
  }

  private setupComponents(): void {
    this.findComponents();
    this.setupEventListeners();
    this.initializeItems();
    // Set initial icon rotation
    this.updateIcon(this.state.isOpen);
  }

  private findComponents(): void {
    this.triggerElement = this.querySelector('pxm-select-trigger') as PxmSelectTrigger;
    this.valueElement = this.querySelector('pxm-select-value') as PxmSelectValue;
    this.contentElement = this.querySelector('pxm-select-content') as PxmSelectContent;

    if (!this.triggerElement) {
      console.warn('PxmSelect: pxm-select-trigger element is required');
    }
    if (!this.contentElement) {
      console.warn('PxmSelect: pxm-select-content element is required');
    }

    // Initially hide content
    if (this.contentElement) {
      this.contentElement.hide();
    }
  }

  private setupEventListeners(): void {
    // Setup outside click detection
    this.outsideClickListener = this.handleOutsideClick.bind(this);
  }

  private initializeItems(): void {
    // Clear cache to ensure fresh query
    this._items = undefined;

    // Cache selected values for faster lookups
    const selectedValuesArray = Array.from(this.state.selectedValues);
    const hasSelections = selectedValuesArray.length > 0;

    // Batch item initialization
    this.items.forEach((item, index) => {
      const value = item.getValue();
      const isSelected = hasSelections && this.state.selectedValues.has(value);
      const isFocused = this.state.focusedIndex === index;
      
      item.updateAttributes(isSelected, isFocused);
    });

    // Update value display once after all items are processed
    this.updateValueDisplay();
  }

  private observeChildChanges(): void {
    this.mutationObserver = new MutationObserver((mutations) => {
      let shouldReinitialize = false;

      for (const mutation of mutations) {
        // Check if select items were added or removed
        const addedSelectItems = Array.from(mutation.addedNodes).some(
          node => node instanceof HTMLElement && node.tagName === 'PXM-SELECT-ITEM'
        );
        const removedSelectItems = Array.from(mutation.removedNodes).some(
          node => node instanceof HTMLElement && node.tagName === 'PXM-SELECT-ITEM'
        );

        if (addedSelectItems || removedSelectItems) {
          shouldReinitialize = true;
          break;
        }
      }

      if (shouldReinitialize) {
        this.handleDynamicChanges();
      }
    });

    this.mutationObserver.observe(this, {
      childList: true,
      subtree: true
    });
  }

  private handleDynamicChanges(): void {
    // Clear cache to force re-query
    this._items = undefined;

    // Re-initialize items
    this.initializeItems();

    // Dispatch event for dynamic changes
    this.dispatchEvent(new CustomEvent(SELECT_CONSTANTS.EVENTS.ITEMS_CHANGED, {
      detail: { itemCount: this.items.length }
    }));
  }

  // Animation system
  private setupDefaultAnimations(): void {
    // Track if custom listeners exist to disable defaults
    const openListener = (e: Event) => {
      if (this.hasCustomAnimations) return;

      const event = e as CustomEvent<SelectEventDetail>;
      const { contentElement } = event.detail;

      if (contentElement) {
        requestAnimationFrame(() => {
          contentElement.style.opacity = '1';
          contentElement.style.transform = 'translateY(0) scaleY(1)';
        });
      }
    };

    const closeListener = (e: Event) => {
      if (this.hasCustomAnimations) return;

      const event = e as CustomEvent<SelectEventDetail>;
      const { contentElement } = event.detail;

      if (contentElement) {
        requestAnimationFrame(() => {
          contentElement.style.opacity = '0';
          contentElement.style.transform = 'translateY(-8px) scaleY(0.9)';
        });
      }
    };

    const iconRotateListener = (e: Event) => {
      const { icon, isOpen } = (e as CustomEvent).detail;
      requestAnimationFrame(() => {
        icon.style.transition = 'transform 0.2s ease-in-out';
        icon.style.transform = isOpen ? `rotate(${this.config['icon-rotation']}deg)` : 'rotate(0deg)';
      });
    };

    this.defaultListeners.set(SELECT_CONSTANTS.EVENTS.AFTER_OPEN, openListener);
    this.defaultListeners.set(SELECT_CONSTANTS.EVENTS.AFTER_CLOSE, closeListener);
    this.defaultListeners.set(SELECT_CONSTANTS.EVENTS.ICON_ROTATE, iconRotateListener);

    // Only add if no custom listeners exist
    if (!this.hasEventListener(SELECT_CONSTANTS.EVENTS.BEFORE_OPEN)) {
      this.addEventListener(SELECT_CONSTANTS.EVENTS.AFTER_OPEN, openListener);
    }
    if (!this.hasEventListener(SELECT_CONSTANTS.EVENTS.BEFORE_CLOSE)) {
      this.addEventListener(SELECT_CONSTANTS.EVENTS.AFTER_CLOSE, closeListener);
    }
    // Always add icon rotate listener since it's a default behavior
    this.addEventListener(SELECT_CONSTANTS.EVENTS.ICON_ROTATE, iconRotateListener);
  }

  private hasEventListener(eventType: string): boolean {
    // Check if element has event listeners for this event type
    const listeners = (this as any)._eventListeners;
    return listeners && listeners[eventType] && listeners[eventType].length > 0;
  }

  // Override addEventListener to track custom animation listeners
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
    super.addEventListener(type, listener, options);

    // Track custom animation listeners
    if (type === SELECT_CONSTANTS.EVENTS.BEFORE_OPEN || type === SELECT_CONSTANTS.EVENTS.BEFORE_CLOSE) {
      this.hasCustomAnimations = true;
      this.removeDefaultAnimations();
    }
  }

  public removeDefaultAnimations(): void {
    this.defaultListeners.forEach((listener, eventType) => {
      this.removeEventListener(eventType, listener);
    });
    this.defaultListeners.clear();
  }

  // Public API methods
  public async open(): Promise<void> {
    if (this.state.isOpen || this.config.disabled) return;

    const beforeEvent = new CustomEvent(SELECT_CONSTANTS.EVENTS.BEFORE_OPEN, {
      detail: {
        triggerElement: this.triggerElement!,
        contentElement: this.contentElement,
        value: this.getValue(),
        complete: () => this.resolveAnimation('open')
      } as SelectEventDetail,
      cancelable: true
    });

    const eventPrevented = !this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented;

    // Batch state updates
    this.state.isOpen = true;
    this.updateAllAttributes();

    // Batch DOM operations
    if (this.contentElement) {
      this.contentElement.show();
    }
    this.updateIcon(true);

    // Use constant for timing
    setTimeout(() => {
      document.addEventListener('click', this.outsideClickListener!);
      // Focus management in same timeout to batch operations
      this.focusInitialItem();
      if (this.contentElement) {
        this.contentElement.focus();
      }
    }, SELECT_CONSTANTS.PERFORMANCE.ANIMATION_DELAY);

    if (eventPrevented) {
      await this.createAnimationPromise('open');
    }

    this.dispatchEvent(new CustomEvent(SELECT_CONSTANTS.EVENTS.AFTER_OPEN, {
      detail: {
        triggerElement: this.triggerElement!,
        contentElement: this.contentElement,
        value: this.getValue()
      } as SelectEventDetail
    }));

    this.dispatchStateChange();
  }

  public async close(): Promise<void> {
    if (!this.state.isOpen) return;

    const beforeEvent = new CustomEvent(SELECT_CONSTANTS.EVENTS.BEFORE_CLOSE, {
      detail: {
        triggerElement: this.triggerElement!,
        contentElement: this.contentElement,
        value: this.getValue(),
        complete: () => this.resolveAnimation('close')
      } as SelectEventDetail,
      cancelable: true
    });

    const eventPrevented = !this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented;

    this.state.isOpen = false;
    this.state.focusedIndex = -1;
    this.updateAllAttributes();

    // Update icon rotation
    this.updateIcon(false);

    // Remove outside click listener
    document.removeEventListener('click', this.outsideClickListener!);

    // Clear type-ahead state
    this.clearTypeAhead();

    if (eventPrevented) {
      // Wait for custom animation
      await this.createAnimationPromise('close');
    }

    if (this.contentElement) {
      this.contentElement.hide();
    }

    // Focus back to trigger
    setTimeout(() => {
      if (this.triggerElement) {
        this.triggerElement.focus();
      }
    }, SELECT_CONSTANTS.PERFORMANCE.FOCUS_DELAY);

    this.dispatchEvent(new CustomEvent(SELECT_CONSTANTS.EVENTS.AFTER_CLOSE, {
      detail: {
        triggerElement: this.triggerElement!,
        contentElement: this.contentElement,
        value: this.getValue()
      } as SelectEventDetail
    }));

    this.dispatchStateChange();
  }

  public async toggle(): Promise<void> {
    if (this.state.isOpen) {
      await this.close();
    } else {
      await this.open();
    }
  }

  public async selectItem(item: PxmSelectItem): Promise<void> {
    if (item.isDisabled()) return;

    const value = item.getValue();
    const index = Array.from(this.items).indexOf(item);
    const wasSelected = this.state.selectedValues.has(value);

    const beforeEvent = new CustomEvent(SELECT_CONSTANTS.EVENTS.BEFORE_SELECT, {
      detail: {
        value,
        item,
        index,
        selected: !wasSelected,
        complete: () => this.resolveAnimation('select')
      } as SelectItemEventDetail,
      cancelable: true
    });

    const eventPrevented = !this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented;

    if (eventPrevented) {
      await this.createAnimationPromise('select');
      return;
    }

    // Handle selection based on mode
    if (this.config.multiple) {
      if (wasSelected) {
        this.state.selectedValues.delete(value);
      } else {
        this.state.selectedValues.add(value);
      }
    } else {
      this.state.selectedValues.clear();
      this.state.selectedValues.add(value);
    }

    // Update all items
    this.initializeItems();

    // Close if configured to do so
    if (this.config['close-on-select']) {
      await this.close();
    }

    this.dispatchEvent(new CustomEvent(SELECT_CONSTANTS.EVENTS.AFTER_SELECT, {
      detail: {
        value,
        item,
        index,
        selected: this.state.selectedValues.has(value)
      } as SelectItemEventDetail
    }));

    this.dispatchValueChange();
  }

  // Navigation methods
  public focusItem(item: PxmSelectItem): void {
    const index = Array.from(this.items).indexOf(item);
    if (index !== -1) {
      this.focusItemByIndex(index);
    }
  }

  public focusItemByIndex(index: number): void {
    if (index < 0 || index >= this.items.length) return;

    const previousFocusedIndex = this.state.focusedIndex;
    this.state.focusedIndex = index;

    // Batch DOM updates: only update changed items
    if (previousFocusedIndex >= 0 && previousFocusedIndex < this.items.length) {
      const previousItem = this.items[previousFocusedIndex];
      const isSelected = this.state.selectedValues.has(previousItem.getValue());
      previousItem.updateAttributes(isSelected, false);
    }

    // Update new focused item
    const focusedItem = this.items[index];
    const isSelected = this.state.selectedValues.has(focusedItem.getValue());
    focusedItem.updateAttributes(isSelected, true);
    focusedItem.focus();

    // Scroll to item
    if (this.contentElement) {
      this.contentElement.scrollToItem(focusedItem);
    }
  }

  public focusNextItem(): void {
    let nextIndex = this.state.focusedIndex + 1;

    // Skip disabled and hidden items
    while (nextIndex < this.items.length && 
           (this.items[nextIndex].isDisabled() || this.items[nextIndex].style.display === 'none')) {
      nextIndex++;
    }

    if (nextIndex < this.items.length) {
      this.focusItemByIndex(nextIndex);
    }
  }

  public focusPreviousItem(): void {
    let prevIndex = this.state.focusedIndex - 1;

    // Skip disabled and hidden items
    while (prevIndex >= 0 && 
           (this.items[prevIndex].isDisabled() || this.items[prevIndex].style.display === 'none')) {
      prevIndex--;
    }

    if (prevIndex >= 0) {
      this.focusItemByIndex(prevIndex);
    }
  }

  public focusFirstItem(): void {
    for (let i = 0; i < this.items.length; i++) {
      if (!this.items[i].isDisabled()) {
        this.focusItemByIndex(i);
        return;
      }
    }
  }

  public focusLastItem(): void {
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (!this.items[i].isDisabled()) {
        this.focusItemByIndex(i);
        return;
      }
    }
  }

  public focusFirstVisibleItem(): void {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.style.display !== 'none' && !item.isDisabled()) {
        this.focusItemByIndex(i);
        return;
      }
    }
  }

  public focusLastVisibleItem(): void {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      if (item.style.display !== 'none' && !item.isDisabled()) {
        this.focusItemByIndex(i);
        return;
      }
    }
  }

  public selectFocusedOrFirstVisibleItem(): void {
    // Try focused item first
    if (this.state.focusedIndex >= 0 && this.state.focusedIndex < this.items.length) {
      const focusedItem = this.items[this.state.focusedIndex];
      if (focusedItem.style.display !== 'none' && !focusedItem.isDisabled()) {
        this.selectItem(focusedItem);
        return;
      }
    }
    
    // Fallback to first visible item
    this.selectFirstVisibleItem();
  }

  private selectFirstVisibleItem(): void {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.style.display !== 'none' && !item.isDisabled()) {
        this.selectItem(item);
        return;
      }
    }
  }

  private focusInitialItem(): void {
    // Focus first selected item, or first item if none selected
    const firstSelectedIndex = Array.from(this.items).findIndex(item =>
      this.state.selectedValues.has(item.getValue()) && !item.isDisabled()
    );

    if (firstSelectedIndex !== -1) {
      this.focusItemByIndex(firstSelectedIndex);
    } else {
      this.focusFirstItem();
    }
  }

  // Search/Filter functionality
  public filterItems(query: string): void {
    const searchQuery = query.toLowerCase().trim();
    
    let visibleCount = 0;
    let firstVisibleIndex = -1;
    const itemsArray = Array.from(this.items); // This returns PxmSelectItem[]
    
    // Batch DOM operations
    itemsArray.forEach((item, index) => {
      const text = item.getText().toLowerCase();
      const isVisible = searchQuery === '' || text.includes(searchQuery);
      
      // Batch style and attribute updates
      if (isVisible) {
        item.style.display = '';
        item.setAttribute('data-filtered', 'false');
        visibleCount++;
        if (firstVisibleIndex === -1) {
          firstVisibleIndex = index;
        }
      } else {
        item.style.display = 'none';
        item.setAttribute('data-filtered', 'true');
      }
    });
    
    // Handle focus management for filtered items
    this.handleFilteredFocus(firstVisibleIndex, itemsArray);
    
    // Dispatch filter event using constant
    this.dispatchEvent(new CustomEvent(SELECT_CONSTANTS.EVENTS.ITEMS_FILTERED, {
      detail: {
        query: searchQuery,
        visibleCount,
        totalCount: itemsArray.length
      }
    }));
  }

  private handleFilteredFocus(firstVisibleIndex: number, itemsArray: PxmSelectItem[]): void {
    // Don't auto-focus items if search input is currently focused
    const searchInput = this.querySelector('pxm-select-search input');
    if (searchInput && document.activeElement === searchInput) {
      // Clear focus from any previously focused item
      if (this.state.focusedIndex >= 0 && this.state.focusedIndex < itemsArray.length) {
        const previousItem = itemsArray[this.state.focusedIndex];
        const isSelected = this.state.selectedValues.has(previousItem.getValue());
        previousItem.updateAttributes(isSelected, false);
      }
      // Set focused index to -1 without actually focusing any item
      this.state.focusedIndex = -1;
      return;
    }

    const currentFocusedItem = this.state.focusedIndex >= 0 ? itemsArray[this.state.focusedIndex] : null;
    if (currentFocusedItem && currentFocusedItem.style.display === 'none') {
      if (firstVisibleIndex >= 0) {
        this.focusItemByIndex(firstVisibleIndex);
      } else {
        this.state.focusedIndex = -1;
      }
    }
  }

  // Value management
  public getValue(): string | string[] {
    const values = Array.from(this.state.selectedValues);
    return this.config.multiple ? values : values[0] || '';
  }

  public getValues(): string[] {
    return Array.from(this.state.selectedValues);
  }

  public setValue(value: string): void {
    this.state.selectedValues.clear();
    if (value) {
      this.state.selectedValues.add(value);
    }
    this.initializeItems();
    this.dispatchValueChange();
  }

  public setValues(values: string[]): void {
    this.state.selectedValues.clear();
    values.forEach(value => this.state.selectedValues.add(value));
    this.initializeItems();
    this.dispatchValueChange();
  }

  public clearSelection(): void {
    this.state.selectedValues.clear();
    this.initializeItems();
    this.dispatchValueChange();
  }

  // Event handling
  private handleOutsideClick(event: Event): void {
    const target = event.target as Element;
    if (!this.contains(target)) {
      this.close();
    }
  }

  // Animation promises
  private createAnimationPromise(id: string): Promise<void> {
    return new Promise(resolve => {
      this.animationPromises.set(id, { resolve });
    });
  }

  private resolveAnimation(id: string): void {
    const promise = this.animationPromises.get(id);
    if (promise) {
      promise.resolve();
      this.animationPromises.delete(id);
    }
  }

  // State management
  private updateAllAttributes(): void {
    // Update main select attributes
    this.setAttribute('data-open', String(this.state.isOpen));
    this.setAttribute('data-disabled', String(this.config.disabled));
    this.setAttribute('data-multiple', String(this.config.multiple));
    this.setAttribute('data-state', this.state.isOpen ? 'open' : 'closed');

    // Update sub-components
    if (this.triggerElement) {
      this.triggerElement.updateAttributes(this.config, this.state);
    }
    if (this.contentElement) {
      this.contentElement.updateAttributes(this.config, this.state);
    }

    this.updateValueDisplay();
  }

  private updateValueDisplay(): void {
    if (this.valueElement) {
      const selectedItems = Array.from(this.items).filter(item =>
        this.state.selectedValues.has(item.getValue())
      );
      this.valueElement.updateValue(this.config, selectedItems);
    }
  }

  private dispatchValueChange(): void {
    this.dispatchEvent(new CustomEvent(SELECT_CONSTANTS.EVENTS.VALUE_CHANGE, {
      detail: {
        value: this.getValue(),
        selectedItems: Array.from(this.items).filter(item =>
          this.state.selectedValues.has(item.getValue())
        )
      }
    }));
  }

  private dispatchStateChange(): void {
    this.dispatchEvent(new CustomEvent(SELECT_CONSTANTS.EVENTS.STATE_CHANGE, {
      detail: {
        isOpen: this.state.isOpen,
        value: this.getValue(),
        selectedCount: this.state.selectedValues.size
      } as SelectStateChangeDetail
    }));
  }

  // Cleanup
  private cleanup(): void {
    this.mutationObserver?.disconnect();
    document.removeEventListener('click', this.outsideClickListener!);
    this.animationPromises.forEach(({ resolve }) => resolve());
    this.animationPromises.clear();
    this.defaultListeners.clear();
  }

  // Public utility methods
  public getSelectedItems(): PxmSelectItem[] {
    return Array.from(this.items).filter(item =>
      this.state.selectedValues.has(item.getValue())
    );
  }

  public getAllItems(): PxmSelectItem[] {
    return Array.from(this.items);
  }

  public isOpen(): boolean {
    return this.state.isOpen;
  }

  public isMultiple(): boolean {
    return this.config.multiple;
  }

  /**
   * Update icon rotation when icon-rotation attribute changes
   */
  private updateIconRotation(): void {
    this.updateIcon(this.state.isOpen);
  }

  /**
   * Update icon for the select trigger
   */
  private updateIcon(isOpen: boolean): void {
    if (!this.triggerElement) return;
    
    const icon = this.triggerElement.querySelector('[data-select-icon]') as HTMLElement;
    if (icon) {
      // Try event first
      const event = new CustomEvent(SELECT_CONSTANTS.EVENTS.ICON_ROTATE, {
        detail: { icon, isOpen },
        cancelable: true
      });

      if (!this.dispatchEvent(event) || event.defaultPrevented) {
        // Event was handled
        return;
      }
    }
  }

  public selectFocusedItem(): void {
    if (this.state.focusedIndex >= 0 && this.state.focusedIndex < this.items.length) {
      this.selectItem(this.items[this.state.focusedIndex]);
    }
  }

  // Type-ahead functionality
  public handleTypeAhead(key: string): boolean {
    // Don't handle type-ahead if search input is focused
    const searchInput = this.querySelector('pxm-select-search input');
    if (searchInput && document.activeElement === searchInput) {
      return false;
    }

    // Only handle single printable characters
    if (key.length !== 1 || key < ' ' || key > '~') {
      return false;
    }

    // Only work when dropdown is open
    if (!this.state.isOpen) {
      return false;
    }

    const char = key.toLowerCase();
    
    // Clear previous timeout
    if (this.typeAheadTimeout) {
      clearTimeout(this.typeAheadTimeout);
    }

    // If same character pressed, cycle through matches
    if (this.typeAheadString === char) {
      this.focusNextTypeAheadMatch(char);
    } else {
      // New character - start new search
      this.typeAheadString = char;
      this.focusFirstTypeAheadMatch(char);
    }

    // Set timeout to clear type-ahead string
    this.typeAheadTimeout = setTimeout(() => {
      this.typeAheadString = '';
    }, SELECT_CONSTANTS.TYPE_AHEAD.TIMEOUT);

    return true;
  }

  private focusFirstTypeAheadMatch(char: string): void {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (this.itemMatchesTypeAhead(item, char)) {
        this.focusItemByIndex(i);
        return;
      }
    }
  }

  private focusNextTypeAheadMatch(char: string): void {
    const startIndex = this.state.focusedIndex + 1;
    
    // Search from current position forward
    for (let i = startIndex; i < this.items.length; i++) {
      const item = this.items[i];
      if (this.itemMatchesTypeAhead(item, char)) {
        this.focusItemByIndex(i);
        return;
      }
    }
    
    // Wrap around to beginning
    for (let i = 0; i < startIndex; i++) {
      const item = this.items[i];
      if (this.itemMatchesTypeAhead(item, char)) {
        this.focusItemByIndex(i);
        return;
      }
    }
  }

  private itemMatchesTypeAhead(item: PxmSelectItem, char: string): boolean {
    // Don't match disabled or hidden items
    if (item.isDisabled() || item.style.display === 'none') {
      return false;
    }
    
    const text = item.getText().toLowerCase();
    return text.startsWith(char);
  }

  public clearTypeAhead(): void {
    this.typeAheadString = '';
    if (this.typeAheadTimeout) {
      clearTimeout(this.typeAheadTimeout);
      this.typeAheadTimeout = undefined;
    }
  }
}

// Export main class
export { PxmSelect };

// Export sub-components
export {
  PxmSelectTrigger,
  PxmSelectValue,
  PxmSelectContent,
  PxmSelectItem,
  PxmSelectGroup,
  PxmSelectLabel,
  PxmSelectSeparator,
  PxmSelectSearch
};

// Export types
export type {
  SelectEventDetail,
  SelectItemEventDetail,
  SelectStateChangeDetail,
  SelectConfig,
  SelectState,
  SelectItemData
};

// Register the custom element
customElements.define('pxm-select', PxmSelect);

// Make available globally for advanced usage
if (typeof window !== 'undefined') {
  (window as any).PxmSelect = PxmSelect;
}