/**
 * PXM Switch Component
 *
 * A logic-only, accessible switch (toggle) component. No Shadow DOM, no styling—bring your own CSS. Follows the PXM Elements architecture.
 */

export interface SwitchToggleEventDetail {
  checked: boolean;
  element: HTMLElement;
  thumb?: HTMLElement;
  complete: () => void;
}

export interface PxmSwitch extends HTMLElement {
  toggle(): Promise<void>;
  isChecked(): boolean;
  setChecked(checked: boolean): void;
  isDisabled(): boolean;
  setDisabled(disabled: boolean): void;
}

export interface PxmSwitchThumb extends HTMLElement {} 