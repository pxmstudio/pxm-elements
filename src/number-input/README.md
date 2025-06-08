# Number Input Component

Enhanced number input with increment/decrement controls and built-in validation.

## Features

✅ **Accessible** - Keyboard navigation and screen reader support  
✅ **Validation** - Respects min, max, and step attributes  
✅ **Auto-disable** - Buttons disable at limits  
✅ **Form integration** - Works with standard forms  
✅ **Lightweight** - Only 4.1KB gzipped

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
import type { PxmNumberInput } from '@pixelmakers/elements/number-input';

const numberInput = document.querySelector('pxm-number-input') as PxmNumberInput;
```

## HTML Structure

```html
<pxm-number-input>
    <button data-minus>-</button>
    <input type="number" min="0" max="100" step="1" value="25">
    <button data-plus>+</button>
</pxm-number-input>
```

### Required Elements

- `pxm-number-input` - Container
- `input[type="number"]` - The number input field
- `[data-minus]` - Decrement button (optional)
- `[data-plus]` - Increment button (optional)

### Input Attributes

The component respects all standard number input attributes:

- `min` - Minimum allowed value
- `max` - Maximum allowed value  
- `step` - Increment/decrement step size
- `value` - Initial value
- `name` - Form field name
- `disabled` - Disables the entire component

## Styling Examples

### Basic Styling

```css
pxm-number-input {
    display: inline-flex;
    align-items: center;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    overflow: hidden;
}

pxm-number-input input {
    border: none;
    outline: none;
    text-align: center;
    width: 60px;
    padding: 0.5rem;
    font-size: 1rem;
}

pxm-number-input button {
    background: #f9fafb;
    border: none;
    width: 32px;
    height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    transition: background-color 0.2s;
}

pxm-number-input button:hover:not(:disabled) {
    background: #f3f4f6;
}

pxm-number-input button:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
}

pxm-number-input button[data-minus] {
    border-right: 1px solid #d1d5db;
}

pxm-number-input button[data-plus] {
    border-left: 1px solid #d1d5db;
}
```

### Tailwind CSS

```html
<pxm-number-input class="inline-flex items-center border border-gray-300 rounded-md overflow-hidden">
    <button data-minus class="w-8 h-8 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed border-r border-gray-300 flex items-center justify-center font-semibold text-gray-700">
        −
    </button>
    <input type="number" min="0" max="100" step="1" value="1" 
           class="w-16 px-2 py-1 text-center border-none outline-none focus:ring-2 focus:ring-blue-500">
    <button data-plus class="w-8 h-8 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed border-l border-gray-300 flex items-center justify-center font-semibold text-gray-700">
        +
    </button>
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
```

### Inline Label Style

```html
<pxm-number-input class="quantity-input">
    <label>Qty:</label>
    <button data-minus>−</button>
    <input type="number" min="1" max="99" step="1" value="1">
    <button data-plus>+</button>
</pxm-number-input>

<style>
.quantity-input {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
}

.quantity-input label {
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
}

.quantity-input input {
    width: 50px;
    text-align: center;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    padding: 0.25rem;
}

.quantity-input button {
    width: 24px;
    height: 24px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background: #f9fafb;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
}
</style>
```

## Accessibility

The component automatically provides:

- **Keyboard Support**
  - Standard number input keyboard navigation
  - Button activation with Enter/Space
  - Arrow keys for increment/decrement

- **Button Management**
  - Automatically disables buttons at min/max limits
  - Clear focus indicators
  - Proper button roles

- **Screen Reader Support**
  - Maintains semantic input element
  - Buttons announce their purpose
  - Value changes are announced

## Validation & Behavior

### Automatic Validation

```html
<!-- This input validates against min/max automatically -->
<pxm-number-input>
    <button data-minus>-</button>
    <input type="number" min="0" max="10" step="1" value="5">
    <button data-plus>+</button>
</pxm-number-input>
```

- Values below `min` are automatically corrected
- Values above `max` are automatically corrected  
- Buttons disable when limits are reached
- Invalid input is sanitized on blur

### Step Behavior

```html
<!-- Increment/decrement by 0.5 -->
<pxm-number-input>
    <button data-minus>-</button>
    <input type="number" min="0" max="10" step="0.5" value="2.5">
    <button data-plus>+</button>
</pxm-number-input>

<!-- Increment/decrement by 5 -->
<pxm-number-input>
    <button data-minus>-5</button>
    <input type="number" min="0" max="100" step="5" value="10">
    <button data-plus>+5</button>
</pxm-number-input>
```

## Events

The component dispatches standard input events:

```javascript
const numberInput = document.querySelector('pxm-number-input input');

// Listen for value changes
numberInput.addEventListener('change', (event) => {
    console.log('Value changed to:', event.target.value);
});

numberInput.addEventListener('input', (event) => {
    console.log('Value is:', event.target.value);
});
```

## Examples

### E-commerce Quantity Selector

```html
<div class="product-quantity">
    <label for="qty">Quantity:</label>
    <pxm-number-input>
        <button data-minus aria-label="Decrease quantity">
            <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>
        <input id="qty" type="number" min="1" max="99" step="1" value="1" name="quantity">
        <button data-plus aria-label="Increase quantity">
            <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>
    </pxm-number-input>
    <span class="stock-info">23 in stock</span>
</div>

<style>
.product-quantity {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0;
}

.stock-info {
    color: #059669;
    font-size: 0.875rem;
}
</style>
```

### Settings Slider Alternative

```html
<div class="setting-group">
    <div class="setting-info">
        <h4>Auto-save interval</h4>
        <p>How often to save your work (seconds)</p>
    </div>
    
    <pxm-number-input>
        <button data-minus>−</button>
        <input type="number" min="10" max="300" step="10" value="60" name="autosave_interval">
        <button data-plus>+</button>
    </pxm-number-input>
</div>

<div class="setting-group">
    <div class="setting-info">
        <h4>Max file size</h4>
        <p>Maximum upload size (MB)</p>
    </div>
    
    <pxm-number-input>
        <button data-minus>−</button>
        <input type="number" min="1" max="100" step="1" value="10" name="max_file_size">
        <button data-plus>+</button>
    </pxm-number-input>
</div>
```

### Form Integration

```html
<form id="order-form">
    <div class="order-items">
        <div class="item">
            <img src="product1.jpg" alt="Product 1">
            <div class="item-details">
                <h3>Premium Widget</h3>
                <p>$19.99 each</p>
            </div>
            <pxm-number-input>
                <button data-minus>−</button>
                <input type="number" min="0" max="10" step="1" value="1" name="item_1_qty">
                <button data-plus>+</button>
            </pxm-number-input>
        </div>
        
        <div class="item">
            <img src="product2.jpg" alt="Product 2">
            <div class="item-details">
                <h3>Deluxe Gadget</h3>
                <p>$39.99 each</p>
            </div>
            <pxm-number-input>
                <button data-minus>−</button>
                <input type="number" min="0" max="5" step="1" value="0" name="item_2_qty">
                <button data-plus>+</button>
            </pxm-number-input>
        </div>
    </div>
    
    <button type="submit">Add to Cart</button>
</form>

<script>
document.getElementById('order-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    console.log({
        item_1_qty: formData.get('item_1_qty'),
        item_2_qty: formData.get('item_2_qty')
    });
});
</script>
```

### Responsive Design

```html
<div class="responsive-number-input">
    <label>Amount ($)</label>
    <pxm-number-input>
        <button data-minus>−</button>
        <input type="number" min="0" max="1000" step="0.01" value="0.00" name="amount">
        <button data-plus>+</button>
    </pxm-number-input>
</div>

<style>
.responsive-number-input {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.responsive-number-input pxm-number-input {
    display: flex;
    width: 100%;
}

.responsive-number-input input {
    flex: 1;
    min-width: 0;
    text-align: center;
    padding: 0.75rem;
    font-size: 1.1rem;
}

.responsive-number-input button {
    width: 44px;
    height: 44px;
    font-size: 1.2rem;
}

@media (min-width: 640px) {
    .responsive-number-input {
        flex-direction: row;
        align-items: center;
    }
    
    .responsive-number-input pxm-number-input {
        width: auto;
    }
    
    .responsive-number-input input {
        width: 100px;
        flex: none;
    }
}
</style>
```

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