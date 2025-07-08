# PXM Number Input Component

Enhanced number input with increment/decrement controls and validation.
This component provides structure and behavior only - all styling is controlled by your CSS.

## Features

✅ **Logic-Only Component** - No Shadow DOM, full CSS control for consumers  
✅ **Dynamic Content Support** - Buttons can be added/removed after initialization  
✅ **Keyboard Navigation** - Arrow keys for increment/decrement, Enter to validate  
✅ **Built-in Validation** - Respects min, max, step with customizable error messages  
✅ **Event-Driven System** - Comprehensive events for custom handling  
✅ **Public API** - Programmatic control and value access  
✅ **Auto-disable** - Buttons disable at limits  
✅ **Form Integration** - Works with standard forms  
✅ **Accessible** - Manages essential ARIA attributes (aria-invalid)  
✅ **Lightweight** - Efficient memory management and performance

## Quick Start

### CDN Usage

```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/number-input.js"></script>

<pxm-number-input>
    <button data-minus>-</button>
    <input type="number" min="0" max="100" step="1" value="5">
    <button data-plus>+</button>
</pxm-number-input>

<pxm-number-input>
    <label>Quantity:</label>
    <button data-minus>−</button>
    <input type="number" min="1" max="10" step="1" value="1" name="quantity">
    <button data-plus>+</button>
</pxm-number-input>
```

### NPM Usage

```typescript
import '@pixelmakers/elements/number-input';

// Or with TypeScript support
import type { PxmNumberInput, NumberInputEventDetail } from '@pixelmakers/elements/number-input';

const numberInput = document.querySelector('pxm-number-input') as PxmNumberInput;
```

## HTML Structure

```html
<pxm-number-input>
    <button data-minus>-</button>
    <input type="number" min="0" max="100" step="1" value="25">
    <button data-plus>+</button>
    <div data-error></div> <!-- Optional: Created automatically if not present -->
</pxm-number-input>
```

### Required Elements

- `pxm-number-input` - Container element
- `input[type="number"]` - The number input field

### Optional Elements

- `[data-minus]` - Decrement button(s) - can have multiple
- `[data-plus]` - Increment button(s) - can have multiple  
- `[data-error]` - Error message container (created automatically if not present)

### Component Attributes

Configure the component behavior using these attributes on `pxm-number-input`:

- `auto-validate="true|false"` - Enable/disable automatic validation (default: true)
- `error-message-min="text"` - Custom message for minimum value errors
- `error-message-max="text"` - Custom message for maximum value errors
- `error-message-step="text"` - Custom message for step validation errors
- `error-message-invalid="text"` - Custom message for invalid input errors

### Input Attributes

The component respects all standard number input attributes:

- `min` - Minimum allowed value
- `max` - Maximum allowed value  
- `step` - Increment/decrement step size
- `value` - Initial value
- `name` - Form field name
- `disabled` - Disables the entire component

## Keyboard Navigation

- **ArrowUp** - Increment value by step amount
- **ArrowDown** - Decrement value by step amount  
- **Enter** - Validate current value
- **Tab** - Standard input navigation

## Error Handling & Validation

### Automatic Validation

```html
<pxm-number-input auto-validate="true">
  <button data-minus>-</button>
  <input type="number" min="0" max="10" value="5">
  <button data-plus>+</button>
</pxm-number-input>
```

### Custom Error Messages

```html
<pxm-number-input 
  error-message-min="Value too low!" 
  error-message-max="Value too high!" 
  error-message-invalid="Please enter a number!">
  <button data-minus>-</button>
  <input type="number" min="0" max="10" value="5">
  <button data-plus>+</button>
</pxm-number-input>
```

### Custom Validation

```typescript
const numberInput = document.querySelector('pxm-number-input') as PxmNumberInput;

// Set custom validation rule
numberInput.setCustomValidator((value) => {
  if (value % 5 !== 0) return 'Value must be divisible by 5';
  return null; // Valid
});

// Clear custom validation
numberInput.clearCustomValidator();
```

## Public API

### Value Management
- `setValue(value: number)` — Set the input value programmatically
- `getValue(): number` — Get the current value
- `increment()` — Increment by step amount (respects max)
- `decrement()` — Decrement by step amount (respects min)

### Validation
- `validate(): boolean` — Validate current value, show errors if invalid
- `isValid(): boolean` — Check if current value is valid
- `hasError(): boolean` — Check if there are validation errors

### Custom Validation
- `setCustomValidator(fn: (value: number) => string | null)` — Set custom validation function
- `clearCustomValidator()` — Remove custom validation

### Focus Management
- `focus()` — Focus the input element
- `blur()` — Blur the input element

### Example: Using the Public API

```typescript
const numberInput = document.querySelector('pxm-number-input') as PxmNumberInput;

// Set value and increment
numberInput.setValue(7);
numberInput.increment();
console.log(numberInput.getValue()); // 8

// Validation
if (!numberInput.validate()) {
  console.log('Validation failed');
}

// Custom validation for even numbers only
numberInput.setCustomValidator((value) => {
  if (value % 2 !== 0) return 'Only even numbers allowed!';
  return null;
});
```

## Events

All events use the `pxm:number-input:` prefix and include detailed event data:

- `pxm:number-input:change` — Value changed (user input or programmatic)
- `pxm:number-input:increment` — Value was incremented  
- `pxm:number-input:decrement` — Value was decremented
- `pxm:number-input:error` — Validation error occurred
- `pxm:number-input:valid` — Validation passed
- `pxm:number-input:buttons-changed` — Buttons were dynamically added/removed

### Event Handling Examples

```typescript
const numberInput = document.querySelector('pxm-number-input');

// Listen for value changes
numberInput.addEventListener('pxm:number-input:change', (e) => {
  console.log(`Value changed from ${e.detail.previousValue} to ${e.detail.value}`);
});

// Listen for validation errors
numberInput.addEventListener('pxm:number-input:error', (e) => {
  console.log(`Validation error: ${e.detail.message} (type: ${e.detail.type})`);
});

// Listen for increment/decrement
numberInput.addEventListener('pxm:number-input:increment', (e) => {
  console.log(`Incremented to ${e.detail.value}`);
});
```

## Dynamic Content Support

Buttons can be added or removed dynamically after component initialization:

```typescript
const numberInput = document.querySelector('pxm-number-input');

// Add a new increment button
const newButton = document.createElement('button');
newButton.setAttribute('data-plus', '');
newButton.textContent = '++';
numberInput.appendChild(newButton); // Automatically initialized

// Listen for dynamic changes
numberInput.addEventListener('pxm:number-input:buttons-changed', (e) => {
  console.log(`Now has ${e.detail.minusButtonCount} minus and ${e.detail.plusButtonCount} plus buttons`);
});
```

## Accessibility

### What the Component Manages
- `aria-invalid` - Set to "true" when validation fails, "false" when valid
- `aria-describedby` - Links input to error message when errors are present
- `tabindex` - For keyboard navigation functionality
- `disabled` - On buttons when limits are reached

### What Consumers Should Provide
- `aria-label` or `aria-labelledby` on input for screen readers
- `role` attributes if needed for complex layouts
- `aria-live` regions for dynamic announcements
- Additional ARIA relationships as needed

### Example: Complete Accessibility

```html
<pxm-number-input>
  <label for="quantity">Quantity</label>
  <button data-minus aria-label="Decrease quantity">−</button>
  <input 
    id="quantity"
    type="number" 
    min="1" max="10" step="1" value="1"
    aria-label="Quantity" 
    aria-describedby="qty-help">
  <button data-plus aria-label="Increase quantity">+</button>
  <div data-error aria-live="polite"></div>
  <div id="qty-help">Choose between 1 and 10 items</div>
</pxm-number-input>
```

### Modern Card Style

```css
pxm-number-input {
    display: inline-flex;
    align-items: center;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s, box-shadow 0.2s;
}

pxm-number-input:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

pxm-number-input input {
    border: none;
    outline: none;
    text-align: center;
    width: 80px;
    padding: 0.75rem;
    font-size: 1.1rem;
    font-weight: 600;
    background: transparent;
}

pxm-number-input button {
    background: #f8fafc;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
    color: #475569;
    transition: all 0.2s;
    margin: 0 4px;
}

pxm-number-input button:hover:not(:disabled) {
    background: #e2e8f0;
    transform: scale(1.05);
}

pxm-number-input button:disabled {
    background: #f1f5f9;
    color: #cbd5e1;
    cursor: not-allowed;
    transform: none;
}

/* Error states */
pxm-number-input [data-error]:not(:empty) {
    color: #dc2626;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

pxm-number-input input[aria-invalid="true"] {
    border-color: #dc2626 !important;
}
```

## Architecture & Philosophy

### Logic-Only Component
- **No Shadow DOM** - Full CSS control for consumers
- **No Internal Styling** - Only functional states (display/opacity for errors)
- **Consumer Responsibility** - All visual design, animations, and comprehensive accessibility
- **Framework Agnostic** - Works with any CSS methodology or design system

### What the Component Provides
- ✅ Structure (HTML element relationships)
- ✅ Behavior (JavaScript logic and interactions) 
- ✅ State management (value, validation, button states)
- ✅ Event system (comprehensive event details)
- ✅ Essential ARIA (aria-invalid, aria-describedby)

### What Consumers Control
- 🎨 All visual styling (colors, fonts, spacing, borders)
- 🎨 Layout and positioning (flexbox, grid, etc.)
- 🎨 Responsive design (media queries, breakpoints)
- 🎨 Animations and transitions
- ♿ Full accessibility (labels, roles, descriptions)

## Platform Integration

### Webflow

1. Add Custom Code to page head:
```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/number-input.js"></script>
```

2. Add HTML structure in Embed element:
```html
<div class="quantity-selector">
    <label>Quantity:</label>
    <pxm-number-input>
        <button data-minus>−</button>
        <input type="number" min="1" max="10" step="1" value="1" name="quantity">
        <button data-plus>+</button>
    </pxm-number-input>
</div>
```

### Shopify

```liquid
<!-- In theme.liquid -->
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/number-input.js"></script>

<!-- In product form -->
<div class="product-quantity">
    <label for="Quantity-{{ product.id }}">Quantity:</label>
    <pxm-number-input>
        <button data-minus type="button">−</button>
        <input 
            id="Quantity-{{ product.id }}"
            type="number" 
            name="quantity" 
            min="1" 
            max="{{ product.selected_or_first_available_variant.inventory_quantity }}"
            step="1" 
            value="1">
        <button data-plus type="button">+</button>
    </pxm-number-input>
    <span class="stock-note">
        {{ product.selected_or_first_available_variant.inventory_quantity }} available
    </span>
</div>
```

### React Integration

```jsx
import { useEffect, useState } from 'react';

function QuantitySelector({ min = 1, max = 99, value = 1, onChange }) {
    const [quantity, setQuantity] = useState(value);
    
    useEffect(() => {
        import('@pixelmakers/elements/number-input');
    }, []);
    
    const handleChange = (event) => {
        const newValue = parseInt(event.target.value);
        setQuantity(newValue);
        onChange?.(newValue);
    };
    
    return (
        <pxm-number-input>
            <button data-minus>−</button>
            <input 
                type="number"
                min={min}
                max={max}
                step={1}
                value={quantity}
                onChange={handleChange}
            />
            <button data-plus>+</button>
        </pxm-number-input>
    );
}
```

## Browser Support

- Chrome 90+ ✅
- Firefox 90+ ✅  
- Safari 14+ ✅
- Edge 90+ ✅

## Related Components

- [Toggle](../toggle/README.md) - For boolean on/off controls
- [Accordion](../accordion/README.md) - For collapsible content sections
- [Tabs](../tabs/README.md) - For content organization 