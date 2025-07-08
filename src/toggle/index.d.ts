/**
 * PXM Toggle Component TypeScript Definitions
 * 
 * A two-state button that can be either on or off. Perfect for toggleable UI states like formatting buttons.
 * This component provides structure and behavior only - all styling is controlled by your CSS.
 */

/**
 * Event detail interface for toggle before/after change events
 */
export interface ToggleEventDetail {
  pressed: boolean;
  element: HTMLElement;
  complete: () => void;
}

/**
 * Event detail interface for toggle pressed change events
 */
export interface TogglePressedChangeEventDetail {
  pressed: boolean;
  element: HTMLElement;
}

/**
 * Public TypeScript interface for the Toggle Component
 */
export interface PxmToggle extends HTMLElement {
  /**
   * Get/set the pressed state
   */
  pressed: boolean;
  
  /**
   * Get/set the disabled state
   */
  disabled: boolean;

  /**
   * Get/set the form integration state
   */
  form: boolean;

  /**
   * Get/set the form name (only used when form="true")
   */
  name: string;
  
  /**
   * Programmatically toggle the button
   */
  performToggle(): Promise<void>;
  
  /**
   * Check if the toggle is currently animating
   */
  isAnimating(): boolean;
  
  /**
   * Remove default animation listeners (useful when using custom animation libraries)
   */
  removeDefaultAnimations(): void;
}

// Global element type augmentation
declare global {
  interface HTMLElementTagNameMap {
    'pxm-toggle': PxmToggle;
  }
  
  interface WindowEventMap {
    'pxm:toggle:before-change': CustomEvent<ToggleEventDetail>;
    'pxm:toggle:after-change': CustomEvent<Pick<ToggleEventDetail, 'pressed' | 'element'>>;
    'pxm:toggle:pressed-change': CustomEvent<TogglePressedChangeEventDetail>;
  }
}
