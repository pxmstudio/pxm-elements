import { SELECT_CONSTANTS } from './config';

/**
 * Shared keyboard handling utilities for select components
 */

export interface KeyboardHandler {
  handleKey(key: string, isOpen: boolean, selectInstance: any): boolean;
}

export class SelectKeyboardHandler implements KeyboardHandler {
  /**
   * Handle keyboard navigation for select components
   * @param key The pressed key
   * @param isOpen Whether the dropdown is open
   * @param selectInstance The select instance
   * @returns true if the event was handled
   */
  handleKey(key: string, isOpen: boolean, selectInstance: any): boolean {
    if (!selectInstance) return false;

    switch (key) {
      case SELECT_CONSTANTS.KEYS.ENTER:
      case SELECT_CONSTANTS.KEYS.SPACE:
        if (isOpen) {
          selectInstance.selectFocusedItem();
        } else {
          selectInstance.open();
        }
        return true;
        
      case SELECT_CONSTANTS.KEYS.ARROW_DOWN:
        if (isOpen) {
          selectInstance.focusNextItem();
        } else {
          selectInstance.open();
        }
        return true;
        
      case SELECT_CONSTANTS.KEYS.ARROW_UP:
        if (isOpen) {
          selectInstance.focusPreviousItem();
        } else {
          selectInstance.open();
        }
        return true;
        
      case SELECT_CONSTANTS.KEYS.ESCAPE:
        if (isOpen) {
          selectInstance.close();
          return true;
        }
        return false;
        
      case SELECT_CONSTANTS.KEYS.HOME:
        if (isOpen) {
          selectInstance.focusFirstItem();
          return true;
        }
        return false;
        
      case SELECT_CONSTANTS.KEYS.END:
        if (isOpen) {
          selectInstance.focusLastItem();
          return true;
        }
        return false;
        
      default:
        return false;
    }
  }
} 