# Tabs Component

Create accessible tabbed interfaces for organizing content into panels.

## Features

✅ **Accessible** - Full keyboard navigation and screen reader support  
✅ **Flexible** - Works with any HTML structure inside panels  
✅ **Automatic management** - Handles panel visibility and ARIA states  
✅ **Keyboard navigation** - Arrow keys, Home/End support  
✅ **Lightweight** - Only 4.7KB gzipped

## Quick Start

### CDN Usage

```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/tabs.js"></script>

<pxm-tabs>
    <pxm-triggers>
        <button data-tab="overview">Overview</button>
        <button data-tab="features">Features</button>
        <button data-tab="pricing">Pricing</button>
    </pxm-triggers>
    
    <pxm-panel data-tab="overview">
        <h3>Overview</h3>
        <p>Welcome to our product overview...</p>
    </pxm-panel>
    
    <pxm-panel data-tab="features">
        <h3>Features</h3>
        <ul>
            <li>Feature 1</li>
            <li>Feature 2</li>
        </ul>
    </pxm-panel>
    
    <pxm-panel data-tab="pricing">
        <h3>Pricing</h3>
        <p>Starting at $9/month...</p>
    </pxm-panel>
</pxm-tabs>
```

### NPM Usage

```typescript
import '@pixelmakers/elements/tabs';

// Or with TypeScript support
import type { PxmTabs } from '@pixelmakers/elements/tabs';

const tabs = document.querySelector('pxm-tabs') as PxmTabs;
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-initial` | string | (first tab) | ID of the tab to activate initially |

## HTML Structure

```html
<pxm-tabs>
    <pxm-triggers>
        <button data-tab="tab1">Tab 1</button>
        <button data-tab="tab2">Tab 2</button>
        <button data-tab="tab3">Tab 3</button>
    </pxm-triggers>
    
    <pxm-panel data-tab="tab1">Content for tab 1</pxm-panel>
    <pxm-panel data-tab="tab2">Content for tab 2</pxm-panel>
    <pxm-panel data-tab="tab3">Content for tab 3</pxm-panel>
</pxm-tabs>
```

### Required Elements

- `pxm-tabs` - Container
- `pxm-triggers` - Container for tab buttons
- `[data-tab]` buttons - Clickable tab headers
- `pxm-panel` - Content panels (one per tab)

### Data Attributes

- `data-tab` - Unique identifier linking triggers to panels
- `data-initial` - Set on container to specify initial active tab

## Styling Examples

### Basic Styling

```css
pxm-tabs {
    display: block;
}

pxm-triggers {
    display: flex;
    border-bottom: 2px solid #e5e7eb;
    margin-bottom: 1rem;
}

[data-tab] {
    padding: 0.75rem 1.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.2s ease;
    font-weight: 500;
}

[data-tab]:hover {
    background: #f9fafb;
    color: #374151;
}

[data-tab][aria-selected="true"] {
    border-bottom-color: #3b82f6;
    color: #3b82f6;
    background: #f0f9ff;
}

[data-tab]:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

pxm-panel {
    padding: 1rem 0;
}

pxm-panel[aria-hidden="true"] {
    display: none;
}
```

### Tailwind CSS

```html
<pxm-tabs class="w-full">
    <pxm-triggers class="flex border-b border-gray-200">
        <button data-tab="tab1" class="px-4 py-2 font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-b-2 border-transparent aria-selected:border-blue-500 aria-selected:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Dashboard
        </button>
        <button data-tab="tab2" class="px-4 py-2 font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-b-2 border-transparent aria-selected:border-blue-500 aria-selected:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Analytics
        </button>
        <button data-tab="tab3" class="px-4 py-2 font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-b-2 border-transparent aria-selected:border-blue-500 aria-selected:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Settings
        </button>
    </pxm-triggers>
    
    <pxm-panel data-tab="tab1" class="py-4">
        <h3 class="text-lg font-semibold mb-2">Dashboard</h3>
        <p class="text-gray-600">Overview of your account metrics...</p>
    </pxm-panel>
    
    <pxm-panel data-tab="tab2" class="py-4 hidden aria-hidden:block">
        <h3 class="text-lg font-semibold mb-2">Analytics</h3>
        <p class="text-gray-600">Detailed analytics and reports...</p>
    </pxm-panel>
    
    <pxm-panel data-tab="tab3" class="py-4 hidden aria-hidden:block">
        <h3 class="text-lg font-semibold mb-2">Settings</h3>
        <p class="text-gray-600">Configure your preferences...</p>
    </pxm-panel>
</pxm-tabs>
```

### Vertical Tabs

```css
pxm-tabs {
    display: flex;
    gap: 2rem;
}

pxm-triggers {
    display: flex;
    flex-direction: column;
    min-width: 200px;
    border-right: 2px solid #e5e7eb;
    border-bottom: none;
    padding-right: 1rem;
}

[data-tab] {
    text-align: left;
    border-bottom: none;
    border-right: 3px solid transparent;
    margin-bottom: 0.5rem;
}

[data-tab][aria-selected="true"] {
    border-right-color: #3b82f6;
    border-bottom-color: transparent;
}

pxm-panel {
    flex: 1;
}
```

## Accessibility

The tabs automatically provide:

- **Keyboard Navigation**
  - `Arrow Left/Right` - Move between tabs
  - `Arrow Up/Down` - Move between tabs (alternative)
  - `Home` - Go to first tab
  - `End` - Go to last tab
  - `Enter/Space` - Activate focused tab

- **ARIA Attributes**
  - `role="tablist"` on triggers container
  - `role="tab"` on tab buttons
  - `role="tabpanel"` on content panels
  - `aria-selected` indicates active tab
  - `aria-hidden` controls panel visibility
  - `aria-labelledby` links panels to tabs

- **Focus Management**
  - Only active tab is focusable (tabindex management)
  - Clear focus indicators
  - Logical tab order

## Events

The tabs component dispatches custom events:

```javascript
const tabs = document.querySelector('pxm-tabs');

// Listen for tab changes
tabs.addEventListener('tabchange', (event) => {
    console.log('Tab changed to:', event.detail.tabId);
    console.log('Previous tab:', event.detail.previousTabId);
});
```

## JavaScript API

```typescript
// Get tabs instance
const tabs = document.querySelector('pxm-tabs') as PxmTabs;

// Programmatically activate tabs
tabs.activateTab('tab2');

// Get current active tab
const activeTab = tabs.getActiveTab();

// Get all tab IDs
const allTabs = tabs.getAllTabs();
```

## Examples

### Product Information Tabs

```html
<pxm-tabs data-initial="description">
    <pxm-triggers>
        <button data-tab="description">Description</button>
        <button data-tab="specifications">Specifications</button>
        <button data-tab="reviews">Reviews</button>
        <button data-tab="shipping">Shipping</button>
    </pxm-triggers>
    
    <pxm-panel data-tab="description">
        <h3>Product Description</h3>
        <p>This innovative product combines cutting-edge technology...</p>
    </pxm-panel>
    
    <pxm-panel data-tab="specifications">
        <h3>Technical Specifications</h3>
        <table>
            <tr><td>Dimensions</td><td>10" x 8" x 2"</td></tr>
            <tr><td>Weight</td><td>2.5 lbs</td></tr>
            <tr><td>Material</td><td>Aircraft-grade aluminum</td></tr>
        </table>
    </pxm-panel>
    
    <pxm-panel data-tab="reviews">
        <h3>Customer Reviews</h3>
        <div class="review">
            <strong>★★★★★</strong>
            <p>"Amazing product! Exceeded my expectations."</p>
        </div>
    </pxm-panel>
    
    <pxm-panel data-tab="shipping">
        <h3>Shipping Information</h3>
        <ul>
            <li>Free shipping on orders over $50</li>
            <li>2-3 business days delivery</li>
            <li>International shipping available</li>
        </ul>
    </pxm-panel>
</pxm-tabs>
```

### Settings Dashboard

```html
<pxm-tabs>
    <pxm-triggers>
        <button data-tab="general">General</button>
        <button data-tab="notifications">Notifications</button>
        <button data-tab="privacy">Privacy</button>
        <button data-tab="billing">Billing</button>
    </pxm-triggers>
    
    <pxm-panel data-tab="general">
        <form>
            <h3>General Settings</h3>
            <label>
                Name: <input type="text" value="John Doe">
            </label>
            <label>
                Email: <input type="email" value="john@example.com">
            </label>
            <button type="submit">Save Changes</button>
        </form>
    </pxm-panel>
    
    <pxm-panel data-tab="notifications">
        <h3>Notification Preferences</h3>
        <label>
            <input type="checkbox" checked> Email notifications
        </label>
        <label>
            <input type="checkbox"> SMS notifications
        </label>
        <label>
            <input type="checkbox" checked> Browser notifications
        </label>
    </pxm-panel>
    
    <pxm-panel data-tab="privacy">
        <h3>Privacy Settings</h3>
        <label>
            Profile visibility:
            <select>
                <option>Public</option>
                <option selected>Friends only</option>
                <option>Private</option>
            </select>
        </label>
    </pxm-panel>
    
    <pxm-panel data-tab="billing">
        <h3>Billing Information</h3>
        <p>Current plan: <strong>Pro</strong></p>
        <p>Next billing date: <strong>Jan 15, 2024</strong></p>
        <button>Update Payment Method</button>
    </pxm-panel>
</pxm-tabs>
```

## Platform Integration

### Webflow

1. Add Custom Code to page head:
```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/tabs.js"></script>
```

2. Add HTML structure in Embed element:
```html
<pxm-tabs>
    <pxm-triggers>
        <button data-tab="services">Our Services</button>
        <button data-tab="portfolio">Portfolio</button>
        <button data-tab="contact">Contact</button>
    </pxm-triggers>
    
    <pxm-panel data-tab="services">
        <!-- Your Webflow CMS collection here -->
    </pxm-panel>
    
    <pxm-panel data-tab="portfolio">
        <!-- Your portfolio items here -->
    </pxm-panel>
    
    <pxm-panel data-tab="contact">
        <!-- Your contact form here -->
    </pxm-panel>
</pxm-tabs>
```

### Shopify

```liquid
<!-- In theme.liquid -->
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/tabs.js"></script>

<!-- In product template -->
<pxm-tabs>
    <pxm-triggers>
        {% for variant in product.variants %}
            <button data-tab="variant-{{ variant.id }}">{{ variant.title }}</button>
        {% endfor %}
    </pxm-triggers>
    
    {% for variant in product.variants %}
        <pxm-panel data-tab="variant-{{ variant.id }}">
            <h3>{{ variant.title }}</h3>
            <p>Price: {{ variant.price | money }}</p>
            {% if variant.available %}
                <button>Add to Cart</button>
            {% else %}
                <p>Out of stock</p>
            {% endif %}
        </pxm-panel>
    {% endfor %}
</pxm-tabs>
```

### React Integration

```jsx
import { useEffect, useRef } from 'react';

function ProductTabs({ product }) {
    const tabsRef = useRef(null);
    
    useEffect(() => {
        // Import tabs component
        import('@pixelmakers/elements/tabs');
    }, []);
    
    return (
        <pxm-tabs ref={tabsRef}>
            <pxm-triggers>
                <button data-tab="details">Details</button>
                <button data-tab="specs">Specs</button>
            </pxm-triggers>
            
            <pxm-panel data-tab="details">
                {product.description}
            </pxm-panel>
            
            <pxm-panel data-tab="specs">
                {product.specifications}
            </pxm-panel>
        </pxm-tabs>
    );
}
```

## Browser Support

- Chrome 90+ ✅
- Firefox 90+ ✅  
- Safari 14+ ✅
- Edge 90+ ✅

## Related Components

- [Accordion](../accordion/README.md) - For collapsible content sections
- [Toggle](../toggle/README.md) - For simple on/off states 