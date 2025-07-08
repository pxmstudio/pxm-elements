/**
 * Public TypeScript interfaces for PXM Dropdown components
 */

export interface PxmDropdown extends HTMLElement {
  open: boolean;
  openDropdown(): void;
  closeDropdown(): void;
  toggleDropdown(): void;
}

export interface PxmDropdownTrigger extends HTMLElement {}
export interface PxmDropdownContent extends HTMLElement {}
export interface PxmDropdownItem extends HTMLElement {
  focus(): void;
}

export interface PxmDropdownSelectEventDetail {
  value: string | null;
}

export interface PxmDropdownSubmenuTrigger extends HTMLElement {}
export interface PxmDropdownSubmenuContent extends HTMLElement {
  openSubmenu(): void;
  closeSubmenu(): void;
  focusFirstItem(): void;
}

export interface PxmDropdownSubmenu extends HTMLElement {} 