/**
 * PXM Select Component Types
 * 
 * Type definitions for the select component system
 */

// Event detail interfaces
export interface SelectEventDetail {
  value: string | string[];
  selectedItem?: HTMLElement;
  selectedItems?: HTMLElement[];
  triggerElement: HTMLElement;
  contentElement?: HTMLElement;
  complete?: () => void;
}

export interface SelectItemEventDetail {
  value: string;
  item: HTMLElement;
  index: number;
  selected: boolean;
  complete?: () => void;
}

export interface SelectStateChangeDetail {
  isOpen: boolean;
  value: string | string[];
  selectedCount: number;
}

// Configuration interfaces
export interface SelectConfig {
  multiple: boolean;
  required: boolean;
  disabled: boolean;
  'close-on-select': boolean;
  'scroll-lock': boolean;
  'icon-rotation': number;
}

// Internal state interface
export interface SelectState {
  isOpen: boolean;
  focusedIndex: number;
  selectedValues: Set<string>;
}

// Item data interface
export interface SelectItemData {
  value: string;
  text: string;
  disabled: boolean;
  element: HTMLElement;
  group?: string;
} 