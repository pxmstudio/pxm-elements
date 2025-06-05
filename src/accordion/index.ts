/**
 * PXM Accordion Component
 * 
 * A simple, accessible accordion component that allows users to expand/collapse content sections.
 * Each accordion item consists of a trigger and content section.
 */

interface AccordionConfig {
  allowMultiple: boolean;
  animationDuration: number;
  iconRotation: number;
}

interface AccordionState {
  activeItems: Set<number>;
}

export class PxmAccordion extends HTMLElement {
  private config: AccordionConfig;
  private state: AccordionState;
  private items!: NodeListOf<PxmAccordionItem>;

  /**
   * Observed attributes for the custom element
   */
  static get observedAttributes(): string[] {
    return ['allow-multiple', 'animation-duration', 'icon-rotation'];
  }

  constructor() {
    super();

    // Initialize configuration with defaults
    this.config = {
      allowMultiple: false,
      animationDuration: 300,
      iconRotation: 90
    };

    // Initialize state
    this.state = {
      activeItems: new Set()
    };

    // Set ARIA role for the accordion
    this.setAttribute('role', 'list');
  }

  /**
   * Called when the element is added to the DOM
   */
  connectedCallback(): void {
    this.initializeFromAttributes();
    this.setupItems();
  }

  /**
   * Called when an observed attribute changes
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'allow-multiple':
        this.config.allowMultiple = newValue === 'true';
        break;
      case 'animation-duration':
        this.config.animationDuration = parseInt(newValue, 10) || 300;
        break;
      case 'icon-rotation':
        this.config.iconRotation = parseInt(newValue, 10) || 90;
        this.updateIconRotations();
        break;
    }
  }

  /**
   * Initialize configuration from HTML attributes
   */
  private initializeFromAttributes(): void {
    this.config.allowMultiple = this.getAttribute('allow-multiple') === 'true';
    const duration = this.getAttribute('animation-duration');
    if (duration) {
      this.config.animationDuration = parseInt(duration, 10);
    }
    const rotation = this.getAttribute('icon-rotation');
    if (rotation) {
      this.config.iconRotation = parseInt(rotation, 10);
    }
  }

  /**
   * Set up accordion items with event listeners
   */
  private setupItems(): void {
    this.items = this.querySelectorAll('pxm-accordion-item');

    this.items.forEach((item, index) => {
      const trigger = item.querySelector('pxm-accordion-trigger');
      const content = item.querySelector('pxm-accordion-content');

      if (!trigger || !content) {
        console.warn('Accordion item missing required elements:', item);
        return;
      }

      // Set ARIA attributes and roles
      item.setAttribute('role', 'listitem');
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', `accordion-content-${index}`);
      content.setAttribute('id', `accordion-content-${index}`);
      content.setAttribute('role', 'region');
      content.setAttribute('aria-labelledby', `accordion-trigger-${index}`);
      trigger.setAttribute('id', `accordion-trigger-${index}`);

      // Set initial state
      const isActive = item.getAttribute('active') === 'true';
      if (isActive) {
        this.state.activeItems.add(index);
        this.expandItem(item, content as HTMLElement, trigger as HTMLElement);
      } else {
        this.collapseItem(item, content as HTMLElement, trigger as HTMLElement);
      }

      // Add click handler
      trigger.addEventListener('click', () => this.toggleItem(index, item, content as HTMLElement, trigger as HTMLElement));

      // Add keyboard navigation
      trigger.addEventListener('keydown', ((event: Event) => {
        const keyboardEvent = event as KeyboardEvent;
        switch (keyboardEvent.key) {
          case 'Enter':
          case ' ':
            event.preventDefault();
            this.toggleItem(index, item, content as HTMLElement, trigger as HTMLElement);
            break;
          case 'ArrowUp':
            event.preventDefault();
            this.focusPreviousItem(index);
            break;
          case 'ArrowDown':
            event.preventDefault();
            this.focusNextItem(index);
            break;
          case 'Home':
            event.preventDefault();
            this.focusFirstItem();
            break;
          case 'End':
            event.preventDefault();
            this.focusLastItem();
            break;
        }
      }));
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
    icon.style.transform = isActive ? `rotate(${this.config.iconRotation}deg)` : 'rotate(0deg)';
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
      if (!this.config.allowMultiple) {
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
