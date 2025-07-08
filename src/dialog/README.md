# PXM Dialog Component

A flexible, accessible dialog (modal) component inspired by Radix UI Dialog. Bring your own styling and animation—this component provides structure and behavior only.

## Features
- Keyboard navigation (Escape to close, Tab trap)
- Focus management (auto-focus, return focus)
- Event-driven animation system (bring your own animation library)
- Dynamic content support
- ARIA and data attributes for accessibility and styling

## Basic Usage
```html
<pxm-dialog>
  <pxm-dialog-trigger>Open Dialog</pxm-dialog-trigger>
  <pxm-dialog-content>
    <h2>Dialog Title</h2>
    <p>Dialog content goes here...</p>
    <button data-close>Close</button>
  </pxm-dialog-content>
</pxm-dialog>
```

## Consumer Styling Examples
```css
pxm-dialog-content[data-state="open"] { display: block; }
pxm-dialog-content[data-state="closed"] { display: none; }
pxm-dialog[data-disabled="true"] { opacity: 0.5; }
```

## Accessibility
- Manages ARIA attributes (aria-modal, aria-hidden, aria-expanded)
- Manages data attributes (data-state, data-disabled)
- Consumer should provide labels/roles as needed

## Events
- `pxm:dialog:before-open` (cancelable)
- `pxm:dialog:after-open`
- `pxm:dialog:before-close` (cancelable)
- `pxm:dialog:after-close`

## Keyboard Navigation
- **Escape**: Close dialog
- **Tab**: Trap focus within dialog

## Dynamic Content
Dialog supports dynamic addition/removal of trigger/content elements. The component will automatically re-initialize listeners and state.

## Animation Integration
You can override open/close animations by listening to `pxm:dialog:before-open` and `pxm:dialog:before-close` events and calling `e.detail.complete()` when your animation is finished.

## API Inspiration
This component is API-compatible with [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) where possible, but follows the PXM logic-only, no-shadow-DOM, dual-attribute, event-driven approach. 