# Switch Component

A logic-only, accessible switch (toggle) component. No Shadow DOM, no styling—bring your own CSS. Follows the PXM Elements architecture.

## Features

✅ **Accessible** - Manages `aria-checked`, `aria-disabled`, and `tabindex`
✅ **Keyboard support** - Space/Enter toggles, Arrow keys for group navigation
✅ **Event-driven** - Custom events for before/after toggle and state sync
✅ **Dynamic content support**
✅ **Dual-attribute pattern** - ARIA for accessibility, data attributes for styling/JS
✅ **Framework agnostic** - Works with any CSS methodology
✅ **SSR friendly** - No style isolation issues

## Quick Start

### CDN Usage

```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/switch.js"></script>

<pxm-switch aria-checked="false" tabindex="0"></pxm-switch>
```

### NPM Usage

```typescript
import '@pixelmakers/elements/switch';

// Or with TypeScript support
import type { PxmSwitch } from '@pixelmakers/elements/switch';

const sw = document.querySelector('pxm-switch') as PxmSwitch;
```

## Attributes

| Attribute   | Type    | Default | Description                        |
|-------------|---------|---------|------------------------------------|
| `checked`   | boolean | `false` | Whether the switch is on           |
| `disabled`  | boolean | `false` | Whether the switch is disabled     |

## HTML Structure

```html
<pxm-switch aria-checked="false" tabindex="0"></pxm-switch>
```

## Accessibility

The component manages only the following ARIA attributes:
- `aria-checked` (true/false)
- `aria-disabled` (true/false)
- `tabindex` (0 or -1)
- `role="switch"` (set automatically)

**You are responsible for:**
- Adding `aria-label`, `aria-labelledby`, or `role` as needed for your use case
- All visual styling

### Keyboard Navigation
- `Space` or `Enter` - Toggle the switch
- Arrow keys - (For group navigation, implement in consumer code if needed)

## Events

| Event                        | Cancelable | Description                                 |
|------------------------------|------------|---------------------------------------------|
| `pxm:switch:before-toggle`   | ✅         | Fired before toggle, can be canceled         |
| `pxm:switch:after-toggle`    | ❌         | Fired after toggle completes                |
| `pxm:switch:state-sync`      | ❌         | Fired when state is synced from attributes   |

### Example: Custom Animation

```javascript
const sw = document.querySelector('pxm-switch');
sw.addEventListener('pxm:switch:before-toggle', (e) => {
  // e.detail.checked is the new state
  // e.detail.complete() can be called after animation
  e.preventDefault();
  // Animate, then call complete
  setTimeout(() => e.detail.complete(), 200);
});
```

## Styling

**No styles are provided.**
- Use `data-state="on"` or `data-state="off"` for styling
- Use `data-disabled="true"` for disabled state

```css
pxm-switch[data-state="on"] {
  background: #4ade80;
}
pxm-switch[data-state="off"] {
  background: #e5e7eb;
}
pxm-switch[data-disabled="true"] {
  opacity: 0.5;
  pointer-events: none;
}
```

## SSR / Hydration Support
- No Shadow DOM, so SSR works out of the box
- Set initial state with attributes in HTML

## Public API

```typescript
const sw = document.querySelector('pxm-switch') as PxmSwitch;
sw.toggle();
sw.isChecked();
sw.setChecked(true);
sw.isDisabled();
sw.setDisabled(true);
```

## Testing
- Test toggling via click and keyboard
- Test ARIA and data attributes
- Test disabled state
- Test event firing and cancelation

## Summary
- **Logic-only**: All styling and ARIA labeling is up to the consumer
- **Accessible**: Manages only essential ARIA attributes
- **Customizable**: Use events and data attributes for full control 