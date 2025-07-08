/**
 * PXM Accordion Component
 *
 * A flexible, accessible accordion component that allows users to expand/collapse content sections.
 * Bring your own animation library (GSAP, Anime.js, etc.) or use CSS transitions.
 */

// Event detail types
export interface AccordionEventDetail {
  index: number;
  item: HTMLElement;
  content: HTMLElement;
  trigger: HTMLElement;
  complete: () => void;
}

export interface AccordionToggleEventDetail {
  index: number;
  item: HTMLElement;
  isExpanding: boolean;
}

// Component interfaces
export interface PxmAccordion extends HTMLElement {
  // Basic operations
  toggleItem(index: number): Promise<void>;
  expandItem(index: number): Promise<void>;
  collapseItem(index: number): Promise<void>;
  
  // Bulk operations
  expandAll(): Promise<void>;
  collapseAll(): Promise<void>;
  
  // State queries
  getActiveItems(): number[];
  isItemActive(index: number): boolean;
  
  // Animation control
  removeDefaultAnimations(): void;
}

export interface PxmAccordionItem extends HTMLElement {}

export interface PxmAccordionTrigger extends HTMLElement {}

export interface PxmAccordionContent extends HTMLElement {}
