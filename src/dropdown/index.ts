// Main export and registration for PXM Dropdown
import { PxmDropdown } from "./dropdown"
import { PxmDropdownTrigger } from './components/pxm-dropdown-trigger';
import { PxmDropdownContent } from "./components/pxm-dropdown-content"
import { PxmDropdownItem } from "./components/pxm-dropdown-item"
import { PxmDropdownSubmenuTrigger } from './components/pxm-dropdown-submenu-trigger';
import { PxmDropdownSubmenuContent } from './components/pxm-dropdown-submenu-content';
import { PxmDropdownSubmenu } from './components/pxm-dropdown-submenu';

customElements.define('pxm-dropdown', PxmDropdown);
customElements.define('pxm-dropdown-trigger', PxmDropdownTrigger);
customElements.define('pxm-dropdown-content', PxmDropdownContent);
customElements.define('pxm-dropdown-item', PxmDropdownItem);
customElements.define('pxm-dropdown-submenu-trigger', PxmDropdownSubmenuTrigger);
customElements.define('pxm-dropdown-submenu-content', PxmDropdownSubmenuContent);
customElements.define('pxm-dropdown-submenu', PxmDropdownSubmenu);

export { PxmDropdown, PxmDropdownTrigger, PxmDropdownContent, PxmDropdownItem, PxmDropdownSubmenuTrigger, PxmDropdownSubmenuContent, PxmDropdownSubmenu };

// Make available globally for advanced usage
if (typeof window !== 'undefined') {
  (window as any).PxmDropdown = PxmDropdown;
  (window as any).PxmDropdownTrigger = PxmDropdownTrigger;
  (window as any).PxmDropdownContent = PxmDropdownContent;
  (window as any).PxmDropdownItem = PxmDropdownItem;
  (window as any).PxmDropdownSubmenuTrigger = PxmDropdownSubmenuTrigger;
  (window as any).PxmDropdownSubmenuContent = PxmDropdownSubmenuContent;
  (window as any).PxmDropdownSubmenu = PxmDropdownSubmenu;
}

export type {
  PxmDropdown as PxmDropdownElement,
  PxmDropdownTrigger as PxmDropdownTriggerElement,
  PxmDropdownContent as PxmDropdownContentElement,
  PxmDropdownItem as PxmDropdownItemElement,
  PxmDropdownSelectEventDetail,
  PxmDropdownSubmenuTrigger as PxmDropdownSubmenuTriggerElement,
  PxmDropdownSubmenuContent as PxmDropdownSubmenuContentElement,
  PxmDropdownSubmenu as PxmDropdownSubmenuElement
} from './types'; 