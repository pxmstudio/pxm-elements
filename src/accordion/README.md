# Accordion Component

Create collapsible content sections with smooth animations and full accessibility support.

## Features

✅ **Accessible** - Full keyboard navigation and screen reader support  
✅ **Smooth animations** - Configurable duration and easing  
✅ **Icon rotation** - Built-in support for animated icons  
✅ **Multiple modes** - Single or multiple sections open  
✅ **Lightweight** - Only 5.6KB gzipped

## Quick Start

### CDN Usage

```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/accordion.js"></script>

<pxm-accordion>
    <pxm-accordion-item>
        <pxm-accordion-trigger>What is PXM Elements?</pxm-accordion-trigger>
        <pxm-accordion-content>
            A collection of lightweight, accessible web components that work everywhere.
        </pxm-accordion-content>
    </pxm-accordion-item>
    <pxm-accordion-item>
        <pxm-accordion-trigger>How do I get started?</pxm-accordion-trigger>
        <pxm-accordion-content>
            Just include the script and add the HTML structure - it works immediately!
        </pxm-accordion-content>
    </pxm-accordion-item>
</pxm-accordion>
```

### NPM Usage

```typescript
import '@pixelmakers/elements/accordion';

// Or with TypeScript support
import type { PxmAccordion } from '@pixelmakers/elements/accordion';

const accordion = document.querySelector('pxm-accordion') as PxmAccordion;
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `allow-multiple` | boolean | `false` | Allow multiple sections to be open simultaneously |
| `animation-duration` | number | `300` | Animation duration in milliseconds |
| `icon-rotation` | number | `90` | Degrees to rotate icons when expanded |

## HTML Structure

```html
<pxm-accordion>
    <pxm-accordion-item>
        <pxm-accordion-trigger>
            <span>Section title</span>
            <span data-accordion-icon>+</span>
        </pxm-accordion-trigger>
        <pxm-accordion-content>
            <p>Section content goes here...</p>
        </pxm-accordion-content>
    </pxm-accordion-item>
</pxm-accordion>
```

### Required Elements

- `pxm-accordion` - Container
- `pxm-accordion-item` - Individual accordion section
- `pxm-accordion-trigger` - Clickable header (button element)
- `pxm-accordion-content` - Collapsible content area

### Optional Elements

- `[data-accordion-icon]` - Element to rotate when expanded

## Styling Examples

### Basic Styling

```css
pxm-accordion {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
}

pxm-accordion-item {
    border-bottom: 1px solid #e5e7eb;
}

pxm-accordion-item:last-child {
    border-bottom: none;
}

pxm-accordion-trigger {
    width: 100%;
    padding: 1rem;
    text-align: left;
    background: white;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    transition: background-color 0.2s;
}

pxm-accordion-trigger:hover {
    background: #f9fafb;
}

pxm-accordion-content {
    padding: 0 1rem;
    background: white;
    overflow: hidden;
    transition: height 0.3s ease, opacity 0.3s ease;
}

/* Icon rotation styling */
[data-accordion-icon] {
    transition: transform 0.3s ease;
    font-weight: bold;
    font-size: 1.2em;
}

pxm-accordion-item[active="true"] [data-accordion-icon] {
    transform: rotate(90deg); /* Will be overridden by icon-rotation attribute */
}

/* Active state styling */
pxm-accordion-item[active="true"] pxm-accordion-trigger {
    background: #f0f9ff;
    color: #1e40af;
}
```

### Tailwind CSS

```html
<pxm-accordion class="border border-gray-200 rounded-lg overflow-hidden">
    <pxm-accordion-item class="border-b border-gray-200 last:border-b-0">
        <pxm-accordion-trigger class="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 flex justify-between items-center font-medium transition-colors">
            <span>Frequently Asked Question</span>
            <span data-accordion-icon class="transform transition-transform duration-300 text-gray-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </span>
        </pxm-accordion-trigger>
        <pxm-accordion-content class="px-4 pb-3 text-gray-600 bg-white">
            The answer to your question goes here with all the details you need.
        </pxm-accordion-content>
    </pxm-accordion-item>
</pxm-accordion>
```

## Accessibility

The accordion automatically provides:

- **Keyboard Navigation**
  - `Enter/Space` - Toggle accordion item
  - `Arrow Up/Down` - Move between items
  - `Home/End` - Go to first/last item

- **ARIA Attributes**
  - `role="list"` on container
  - `role="listitem"` on items
  - `role="button"` on triggers
  - `aria-expanded` indicates open/closed state
  - `aria-controls` links trigger to content
  - `aria-labelledby` provides content labels

- **Focus Management**
  - Proper tab order
  - Visible focus indicators
  - Logical navigation flow

## Events

The accordion dispatches custom events you can listen to:

```javascript
const accordion = document.querySelector('pxm-accordion');

// Listen for item toggle events
accordion.addEventListener('toggle', (event) => {
    console.log('Item toggled:', event.detail);
});
```

## JavaScript API

```typescript
// Get accordion instance
const accordion = document.querySelector('pxm-accordion') as PxmAccordion;

// Programmatically expand/collapse items
accordion.expandItem(0);    // Expand first item
accordion.collapseItem(0);  // Collapse first item
accordion.toggleItem(0);    // Toggle first item

// Get state
const isExpanded = accordion.isItemExpanded(0);
const expandedItems = accordion.getExpandedItems();
```

## Examples

### FAQ Section

```html
<pxm-accordion allow-multiple="false">
    <pxm-accordion-item>
        <pxm-accordion-trigger>
            How do I install PXM Elements?
            <span data-accordion-icon>+</span>
        </pxm-accordion-trigger>
        <pxm-accordion-content>
            <p>You can install PXM Elements via CDN or NPM:</p>
            <ul>
                <li><strong>CDN:</strong> Include the script tag</li>
                <li><strong>NPM:</strong> Run <code>npm install @pixelmakers/elements</code></li>
            </ul>
        </pxm-accordion-content>
    </pxm-accordion-item>
    
    <pxm-accordion-item>
        <pxm-accordion-trigger>
            Does it work with my framework?
            <span data-accordion-icon>+</span>
        </pxm-accordion-trigger>
        <pxm-accordion-content>
            <p>Yes! PXM Elements works with any framework or vanilla HTML:</p>
            <ul>
                <li>React, Vue, Angular</li>
                <li>Webflow, Shopify</li>
                <li>WordPress, Drupal</li>
                <li>Plain HTML/CSS/JS</li>
            </ul>
        </pxm-accordion-content>
    </pxm-accordion-item>
</pxm-accordion>
```

### Settings Panel

```html
<pxm-accordion allow-multiple="true" icon-rotation="180">
    <pxm-accordion-item active="true">
        <pxm-accordion-trigger>
            Account Settings
            <span data-accordion-icon>▼</span>
        </pxm-accordion-trigger>
        <pxm-accordion-content>
            <form>
                <label>Email: <input type="email" value="user@example.com"></label>
                <label>Name: <input type="text" value="John Doe"></label>
            </form>
        </pxm-accordion-content>
    </pxm-accordion-item>
    
    <pxm-accordion-item>
        <pxm-accordion-trigger>
            Privacy Settings
            <span data-accordion-icon>▼</span>
        </pxm-accordion-trigger>
        <pxm-accordion-content>
            <label><input type="checkbox" checked> Email notifications</label>
            <label><input type="checkbox"> Marketing emails</label>
        </pxm-accordion-content>
    </pxm-accordion-item>
</pxm-accordion>
```

## Platform Integration

### Webflow

1. Add Custom Code to page head:
```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/accordion.js"></script>
```

2. Add HTML structure in Embed element:
```html
<pxm-accordion>
    <pxm-accordion-item>
        <pxm-accordion-trigger>Your CMS content here</pxm-accordion-trigger>
        <pxm-accordion-content>Your CMS content here</pxm-accordion-content>
    </pxm-accordion-item>
</pxm-accordion>
```

### Shopify

```liquid
<!-- In theme.liquid -->
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/accordion.js"></script>

<!-- In product template -->
<pxm-accordion>
    {% for faq in product.metafields.custom.faqs.value %}
        <pxm-accordion-item>
            <pxm-accordion-trigger>{{ faq.question }}</pxm-accordion-trigger>
            <pxm-accordion-content>{{ faq.answer }}</pxm-accordion-content>
        </pxm-accordion-item>
    {% endfor %}
</pxm-accordion>
```

## Browser Support

- Chrome 90+ ✅
- Firefox 90+ ✅  
- Safari 14+ ✅
- Edge 90+ ✅

## Related Components

- [Tabs](../tabs/README.md) - For switching between content panels
- [Toggle](../toggle/README.md) - For simple on/off states 