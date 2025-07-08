/**
 * PXM Select Component Configuration
 * 
 * Configuration schema and constants for the select component
 */

import type { AttributeSchema } from '../core/component-utils';

export const SELECT_SCHEMA: AttributeSchema = {
  'multiple': { type: 'boolean', default: false },
  'required': { type: 'boolean', default: false },
  'disabled': { type: 'boolean', default: false },
  'close-on-select': { type: 'boolean', default: true },
  'scroll-lock': { type: 'boolean', default: true },
  'icon-rotation': { type: 'number', default: 180 }
};

export const SELECT_CONSTANTS = {
  KEYS: {
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    ARROW_DOWN: 'ArrowDown',
    ARROW_UP: 'ArrowUp',
    HOME: 'Home',
    END: 'End',
    TAB: 'Tab'
  },
  ARIA_LABELS: {
    LISTBOX: 'Select listbox',
    OPTION: 'Select option',
    SELECTED: 'Selected',
    EXPANDED: 'Select expanded',
    COLLAPSED: 'Select collapsed'
  },
  DATA_ATTRIBUTES: {
    OPEN: 'data-open',
    SELECTED: 'data-selected',
    DISABLED: 'data-disabled',
    FOCUSED: 'data-focused',
    PLACEHOLDER: 'data-placeholder',
    STATE: 'data-state',
    MULTIPLE: 'data-multiple'
  },
  EVENTS: {
    BEFORE_OPEN: 'pxm:select:before-open',
    AFTER_OPEN: 'pxm:select:after-open',
    BEFORE_CLOSE: 'pxm:select:before-close',
    AFTER_CLOSE: 'pxm:select:after-close',
    BEFORE_SELECT: 'pxm:select:before-select',
    AFTER_SELECT: 'pxm:select:after-select',
    VALUE_CHANGE: 'pxm:select:value-change',
    STATE_CHANGE: 'pxm:select:state-change',
    ITEMS_CHANGED: 'pxm:select:items-changed',
    ICON_ROTATE: 'pxm:select:icon-rotate',
    ITEMS_FILTERED: 'pxm:select:items-filtered'
  },
  PERFORMANCE: {
    ANIMATION_DELAY: 0,
    MULTIPLE_DISPLAY_THRESHOLD: 3,
    FOCUS_DELAY: 0
  },
  UI: {
    MULTIPLE_SELECTION_TEXT: 'items selected'
  },
  TYPE_AHEAD: {
    TIMEOUT: 1000, // 1 second timeout between keystrokes
    MIN_CHAR_LENGTH: 1 // Minimum character length for type-ahead
  }
} as const; 