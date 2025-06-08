/**
 * PXM Accordion Component
 * 
 * A simple, accessible accordion component that allows users to expand/collapse content sections.
 * Each accordion item consists of a trigger and content section.
 */

import { parseAttributes, setupKeyboardNav, setAriaAttributes, withErrorBoundary, type AttributeSchema } from '../core/component-utils';

const ACCORDION_SCHEMA: AttributeSchema = {
  'allow-multiple': { type: 'boolean', default: false },
  'animation-duration': { type: 'number', default: 300, min: 0 },
  'icon-rotation': { type: 'number', default: 90 }
};

interface AccordionState {
  activeItems: Set<number>;
}

class PxmAccordion extends HTMLElement {
    private config: Record<string, any> = {};
    private state: AccordionState = { activeItems: new Set() };
    private _items?: NodeListOf<PxmAccordionItem>;

    // Cache items to avoid repeated queries
    private get items(): NodeListOf<PxmAccordionItem> {
      return this._items ??= this.querySelectorAll('pxm-accordion-item');
    }

    static get observedAttributes(): string[] {
      return Object.keys(ACCORDION_SCHEMA);
    }

    constructor() {
      super();
      this.setAttribute('role', 'list');
    }

    connectedCallback(): void {
      withErrorBoundary(() => {
        this.config = parseAttributes(this, ACCORDION_SCHEMA);
        this.setupItems();
      })();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
      if (oldValue === newValue) return;
      
      this.config = parseAttributes(this, ACCORDION_SCHEMA);
      
      if (name === 'icon-rotation') {
        this.updateIconRotations();
      }
    }

    /**
     * Set up accordion items with event listeners
     */
    private setupItems(): void {
      // Clear cache to get fresh items
      this._items = undefined;

      this.items.forEach((item, index) => {
        const trigger = item.querySelector('pxm-accordion-trigger');
        const content = item.querySelector('pxm-accordion-content');

        if (!trigger || !content) {
          console.warn('Accordion item missing required elements:', item);
          return;
        }

        // Set ARIA attributes and roles  
        setAriaAttributes(item as HTMLElement, { 'role': 'listitem' });
        setAriaAttributes(trigger as HTMLElement, {
          'role': 'button',
          'aria-expanded': 'false',
          'aria-controls': `accordion-content-${index}`,
          'id': `accordion-trigger-${index}`
        });
        setAriaAttributes(content as HTMLElement, {
          'id': `accordion-content-${index}`,
          'role': 'region',
          'aria-labelledby': `accordion-trigger-${index}`
        });

        // Set initial state
        const isActive = item.getAttribute('active') === 'true';
        if (isActive) {
          this.state.activeItems.add(index);
          this.expandItem(item, content as HTMLElement, trigger as HTMLElement);
        } else {
          this.collapseItem(item, content as HTMLElement, trigger as HTMLElement);
        }

        // Add click handler
        trigger.addEventListener('click', withErrorBoundary(() => 
          this.toggleItem(index, item, content as HTMLElement, trigger as HTMLElement)
        ));

        // Add keyboard navigation
        setupKeyboardNav(trigger as HTMLElement, {
          'Enter': (e) => { e.preventDefault(); this.toggleItem(index, item, content as HTMLElement, trigger as HTMLElement); },
          ' ': (e) => { e.preventDefault(); this.toggleItem(index, item, content as HTMLElement, trigger as HTMLElement); },
          'ArrowUp': (e) => { e.preventDefault(); this.focusPreviousItem(index); },
          'ArrowDown': (e) => { e.preventDefault(); this.focusNextItem(index); },
          'Home': (e) => { e.preventDefault(); this.focusFirstItem(); },
          'End': (e) => { e.preventDefault(); this.focusLastItem(); }
        });
      });
    }

    /**
     * Focus the previous accordion item
     */
    private focusPreviousItem(currentIndex: number): void {
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        const prevTrigger = this.items[prevIndex].querySelector('pxm-accordion-trigger') as HTMLElement;
        prevTrigger?.focus();
      }
    }

    /**
     * Focus the next accordion item
     */
    private focusNextItem(currentIndex: number): void {
      const nextIndex = currentIndex + 1;
      if (nextIndex < this.items.length) {
        const nextTrigger = this.items[nextIndex].querySelector('pxm-accordion-trigger') as HTMLElement;
        nextTrigger?.focus();
      }
    }

    /**
     * Focus the first accordion item
     */
    private focusFirstItem(): void {
      const firstTrigger = this.items[0].querySelector('pxm-accordion-trigger') as HTMLElement;
      firstTrigger?.focus();
    }

    /**
     * Focus the last accordion item
     */
    private focusLastItem(): void {
      const lastTrigger = this.items[this.items.length - 1].querySelector('pxm-accordion-trigger') as HTMLElement;
      lastTrigger?.focus();
    }

    /**
     * Update icon rotations for all items
     */
    private updateIconRotations(): void {
      // Guard against calling before items are initialized
      if (!this.items) return;
      
      this.items.forEach((item, index) => {
        const icon = item.querySelector('[data-accordion-icon]');
        if (icon) {
          const isActive = this.state.activeItems.has(index);
          this.updateIconRotation(icon as HTMLElement, isActive);
        }
      });
    }

    /**
     * Update icon rotation for a specific item
     */
    private updateIconRotation(icon: HTMLElement, isActive: boolean): void {
      icon.style.transform = isActive ? `rotate(${this.config['icon-rotation']}deg)` : 'rotate(0deg)';
    }

    /**
     * Toggle an accordion item's state
     */
    private toggleItem(index: number, item: Element, content: HTMLElement, trigger: HTMLElement): void {
      const isActive = this.state.activeItems.has(index);
      const icon = item.querySelector('[data-accordion-icon]');

      if (isActive) {
        this.collapseItem(item, content, trigger);
        this.state.activeItems.delete(index);
        if (icon) {
          this.updateIconRotation(icon as HTMLElement, false);
        }
      } else {
        if (!this.config['allow-multiple']) {
          // Close all other items if multiple items are not allowed
          this.items.forEach((otherItem, otherIndex) => {
            if (otherIndex !== index && this.state.activeItems.has(otherIndex)) {
              const otherContent = otherItem.querySelector('pxm-accordion-content');
              const otherTrigger = otherItem.querySelector('pxm-accordion-trigger');
              const otherIcon = otherItem.querySelector('[data-accordion-icon]');
              if (otherContent && otherTrigger) {
                this.collapseItem(otherItem, otherContent as HTMLElement, otherTrigger as HTMLElement);
                this.state.activeItems.delete(otherIndex);
                if (otherIcon) {
                  this.updateIconRotation(otherIcon as HTMLElement, false);
                }
              }
            }
          });
        }
        this.expandItem(item, content, trigger);
        this.state.activeItems.add(index);
        if (icon) {
          this.updateIconRotation(icon as HTMLElement, true);
        }
      }
    }

    /**
     * Expand an accordion item
     */
    private expandItem(item: Element, content: HTMLElement, trigger: HTMLElement): void {
      item.setAttribute('active', 'true');
      trigger.setAttribute('aria-expanded', 'true');
      content.style.height = "auto";
      content.style.opacity = '1';
    }

    /**
     * Collapse an accordion item
     */
    private collapseItem(item: Element, content: HTMLElement, trigger: HTMLElement): void {
      item.setAttribute('active', 'false');
      trigger.setAttribute('aria-expanded', 'false');
      content.style.height = '0';
      content.style.opacity = '0';
    }
}

// Inject dependencies if requested (for CDN usage)
async function injectAccordionDependencies() {
  try {
    const { injectComponentDependencies } = await import('../dependency-injector');
    await injectComponentDependencies('accordion');
  } catch (error) {
    console.warn('Failed to inject accordion dependencies:', error);
  }
}
injectAccordionDependencies();

// Define the custom elements
customElements.define('pxm-accordion', PxmAccordion);

// Accordion Item Component
class PxmAccordionItem extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define('pxm-accordion-item', PxmAccordionItem);

// Accordion Trigger Component
class PxmAccordionTrigger extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define('pxm-accordion-trigger', PxmAccordionTrigger);

// Accordion Content Component
class PxmAccordionContent extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define('pxm-accordion-content', PxmAccordionContent);

// Make classes available globally for advanced usage
if (typeof window !== 'undefined') {
  (window as any).PxmAccordion = PxmAccordion;
  (window as any).PxmAccordionItem = PxmAccordionItem;
  (window as any).PxmAccordionTrigger = PxmAccordionTrigger;
  (window as any).PxmAccordionContent = PxmAccordionContent;
}
