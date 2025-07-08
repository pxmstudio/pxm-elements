# PXM Dropdown Component

Logic-only dropdown menu component. No Shadow DOM, no internal styling. All styling and ARIA labeling is controlled by the consumer.

## Features
- Custom elements: `<pxm-dropdown>`, `<pxm-dropdown-trigger>`, `<pxm-dropdown-content>`, `<pxm-dropdown-item>`
- **Submenu support**: `<pxm-dropdown-submenu>`, `<pxm-dropdown-submenu-trigger>`, `<pxm-dropdown-submenu-content>`
- Open/close logic
- Keyboard navigation (including submenus)
- ARIA and data attributes for accessibility and styling
- Event-driven: `pxm:dropdown:open`, `pxm:dropdown:close`, `pxm:dropdown:select`
- Dynamic content support
- SSR friendly

## Accessibility
- Uses ARIA attributes for menu, menuitem, expanded state, and submenus
- Uses data attributes for styling and JS targeting
- Consumer is responsible for additional ARIA labeling (e.g., `aria-label`)

## Basic Usage
```html
<!-- Opens on hover (default) -->
<pxm-dropdown>
  <pxm-dropdown-trigger>Open Menu</pxm-dropdown-trigger>
  <pxm-dropdown-content>
    <pxm-dropdown-item value="profile">Profile</pxm-dropdown-item>
    <pxm-dropdown-item value="settings">Settings</pxm-dropdown-item>
    <pxm-dropdown-item value="logout">Logout</pxm-dropdown-item>
  </pxm-dropdown-content>
</pxm-dropdown>

<!-- Opens on click -->
<pxm-dropdown open-on="click">
  <pxm-dropdown-trigger>Open Menu</pxm-dropdown-trigger>
  <pxm-dropdown-content>
    <pxm-dropdown-item value="profile">Profile</pxm-dropdown-item>
    <pxm-dropdown-item value="settings">Settings</pxm-dropdown-item>
    <pxm-dropdown-item value="logout">Logout</pxm-dropdown-item>
  </pxm-dropdown-content>
</pxm-dropdown>
```

## Submenus (Nested Dropdowns)
Submenus are wrapped in `<pxm-dropdown-submenu>`, which manages open/close state and interaction mode. Use the `open-on` attribute to control whether the submenu opens on hover (default) or click.

```html
<!-- Main dropdown opens on click, submenus on hover/click as needed -->
<pxm-dropdown open-on="click">
  <pxm-dropdown-trigger>Actions</pxm-dropdown-trigger>
  <pxm-dropdown-content>
    <pxm-dropdown-item value="edit">Edit</pxm-dropdown-item>
    <pxm-dropdown-submenu open-on="hover">
      <pxm-dropdown-submenu-trigger>More…</pxm-dropdown-submenu-trigger>
      <pxm-dropdown-submenu-content>
        <pxm-dropdown-item value="duplicate">Duplicate</pxm-dropdown-item>
        <pxm-dropdown-item value="archive">Archive</pxm-dropdown-item>
        <pxm-dropdown-submenu open-on="click">
          <pxm-dropdown-submenu-trigger>Advanced</pxm-dropdown-submenu-trigger>
          <pxm-dropdown-submenu-content>
            <pxm-dropdown-item value="export">Export</pxm-dropdown-item>
            <pxm-dropdown-item value="delete">Delete</pxm-dropdown-item>
          </pxm-dropdown-submenu-content>
        </pxm-dropdown-submenu>
      </pxm-dropdown-submenu-content>
    </pxm-dropdown-submenu>
    <pxm-dropdown-item value="logout">Logout</pxm-dropdown-item>
  </pxm-dropdown-content>
</pxm-dropdown>
```

- `open-on="hover"` (default): Dropdown or submenu opens on mouse hover or focus.
- `open-on="click"`: Dropdown or submenu opens on click or keyboard activation.

### ARIA & Keyboard Notes
- Triggers have `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls`.
- Content has `role="menu"`, `aria-orientation`, and is labelled by the trigger.
- **Keyboard:**
  - Right arrow (→) or Enter/Space on a submenu trigger opens the submenu and focuses its first item.
  - Left arrow (←) or Escape closes the submenu and returns focus to the parent trigger.
  - Up/Down/Home/End navigate within the menu or submenu.
  - Only one submenu is open at a time.

## Consumer Styling Example
```css
pxm-dropdown-content[data-state="open"],
pxm-dropdown-submenu-content[data-state="open"] {
  display: block;
  /* Your menu styles */
}
pxm-dropdown-content[data-state="closed"],
pxm-dropdown-submenu-content[data-state="closed"] {
  display: none;
}
pxm-dropdown-item,
pxm-dropdown-submenu-trigger {
  cursor: pointer;
  padding: 8px 16px;
}
pxm-dropdown-item[data-disabled="true"],
pxm-dropdown-submenu-trigger[data-disabled="true"] {
  opacity: 0.5;
  pointer-events: none;
}
pxm-dropdown-item[data-state="active"],
pxm-dropdown-submenu-trigger[data-state="active"] {
  background: #e0e7ff;
}
```

## Events
- `pxm:dropdown:open` — Fired when dropdown opens
- `pxm:dropdown:close` — Fired when dropdown closes
- `pxm:dropdown:select` — Fired when an item is selected (`detail.value` contains the value)

## ARIA & Data Attribute Patterns
- `<pxm-dropdown aria-expanded data-state open-on>`
- `<pxm-dropdown-trigger aria-haspopup aria-expanded data-state>`
- `<pxm-dropdown-content role="menu" aria-hidden data-state>`
- `<pxm-dropdown-item role="menuitem" data-state data-disabled aria-disabled>`
- `<pxm-dropdown-submenu aria-haspopup aria-expanded aria-controls open-on>`
- `<pxm-dropdown-submenu-trigger aria-haspopup="menu" aria-expanded aria-controls data-state>`
- `<pxm-dropdown-submenu-content role="menu" aria-orientation aria-hidden data-state>`

## Notes
- All appearance and ARIA labeling is consumer-controlled
- No Shadow DOM, no internal styles
- Keyboard navigation and advanced features follow Radix UI patterns 