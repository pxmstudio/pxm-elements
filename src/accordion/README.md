# Accordion Component

Create collapsible content sections with smooth, configurable animations and full accessibility support. The component provides extensive customization options through events.

## Features

✅ **Accessible** - Keyboard navigation
✅ **Dynamic content support** - Items can be added/removed after initialization with automatic re-initialization
✅ **Event-driven animations** - Bring your own animation library (GSAP, Anime.js, etc.) or use CSS transitions
✅ **State synchronization** - Manual attribute changes automatically sync with component state
✅ **Icon rotation** - Built-in support for animated icons with configurable rotation
✅ **Multiple modes** - Single or multiple sections open simultaneously
✅ **Keyboard navigation** - Enter/Space/Arrow/Home/End keys with wrapping
✅ **Copy-paste friendly** - Works in vanilla JS/TS, Webflow, Shopify, Astro, etc.
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

- `pxm-accordion` - Container (automatically gets `role="list"`)
- `pxm-accordion-item` - Individual accordion section (automatically gets `role="listitem"`)
- `pxm-accordion-trigger` - Clickable header (automatically gets `role="button"` and ARIA attributes)
- `pxm-accordion-content` - Collapsible content area (automatically gets `role="region"` and ARIA attributes)

### Optional Elements

- `[data-accordion-icon]` - Element to rotate when expanded

## Accessibility

The component automatically manages only the `aria-expanded` attribute on the trigger element (`pxm-accordion-trigger`).

**All other ARIA attributes and roles must be set by the user in your HTML.**

- You are responsible for setting:
  - `role="list"` on `<pxm-accordion>`
  - `role="listitem"` on each `<pxm-accordion-item>`
  - `role="button"` and `id` on each `<pxm-accordion-trigger>`
  - `role="region"`, `aria-labelledby`, and `id` on each `<pxm-accordion-content>`
  - `aria-controls` on each `<pxm-accordion-trigger>` (should match the id of the corresponding content)
- The component will automatically update `aria-expanded` to `true` or `false` on the trigger as the item is expanded/collapsed.

**Keyboard Navigation:**
  - `Enter` or `Space` - Toggle current item
  - `ArrowUp` - Focus previous item (wraps to last)
  - `ArrowDown` - Focus next item (wraps to first)
  - `Home` - Focus first item
  - `End` - Focus last item

### Example with ARIA attributes

```html
<pxm-accordion role="list">
  <pxm-accordion-item role="listitem">
    <pxm-accordion-trigger
      role="button"
      id="accordion-trigger-0"
      aria-controls="accordion-content-0"
      aria-expanded="false"
    >
      <span>Section title</span>
      <span data-accordion-icon>+</span>
    </pxm-accordion-trigger>
    <pxm-accordion-content
      role="region"
      id="accordion-content-0"
      aria-labelledby="accordion-trigger-0"
    >
      <p>Section content goes here...</p>
    </pxm-accordion-content>
  </pxm-accordion-item>
</pxm-accordion>
```

## Animation System

The accordion supports multiple animation approaches:

### Default CSS Transitions

```css
pxm-accordion-content {
    transition: opacity 0.3s ease-in-out;
}

[data-accordion-icon] {
    transition: transform 0.3s ease-in-out;
}
```

### Custom Animations with Events

```javascript
const accordion = document.querySelector('pxm-accordion');

// Custom expand animation
accordion.addEventListener('pxm:accordion:before-expand', (e) => {
    const { content, complete } = e.detail;
    e.preventDefault(); // Take control of animation
    
    // Your animation library (GSAP example)
    gsap.fromTo(content, 
        { height: 0, opacity: 0 }, 
        { 
            height: 'auto', 
            opacity: 1, 
            duration: 0.3,
            onComplete: complete // Signal animation finished
        }
    );
});

// Custom collapse animation
accordion.addEventListener('pxm:accordion:before-collapse', (e) => {
    const { content, complete } = e.detail;
    e.preventDefault();
    
    gsap.to(content, { 
        height: 0, 
        opacity: 0, 
        duration: 0.3,
        onComplete: complete
    });
});

// Custom icon animation
accordion.addEventListener('pxm:accordion:icon-rotate', (e) => {
    const { icon, isExpanding } = e.detail;
    const rotation = isExpanding ? 90 : 0;
    
    gsap.to(icon, { 
        rotation, 
        duration: 0.3 
    });
});
```

## Events

| Event | Cancelable | Description |
|-------|------------|-------------|
| `pxm:accordion:before-expand` | ✅ | Fired before expansion starts |
| `pxm:accordion:after-expand` | ❌ | Fired after expansion completes |
| `pxm:accordion:before-collapse` | ✅ | Fired before collapse starts |
| `pxm:accordion:after-collapse` | ❌ | Fired after collapse completes |
| `pxm:accordion:toggle` | ❌ | Fired when an item is toggled |
| `pxm:accordion:icon-rotate` | ✅ | Fired when icon should rotate |
| `pxm:accordion:items-changed` | ❌ | Fired when items are added/removed |
| `pxm:accordion:state-sync` | ❌ | Fired when state syncs with DOM changes |

### Event Details

```typescript
// Animation events
interface AccordionEventDetail {
  index: number;
  item: HTMLElement;
  content: HTMLElement;
  trigger: HTMLElement;
  complete: () => void; // Call when animation finishes
}

// Toggle event
interface AccordionToggleEventDetail {
  index: number;
  item: HTMLElement;
  isExpanding: boolean;
}
```

## Dynamic Content Support

Items can be added or removed after initialization:

```javascript
const accordion = document.querySelector('pxm-accordion');

// Add new item dynamically
const newItem = document.createElement('pxm-accordion-item');
newItem.innerHTML = `
    <pxm-accordion-trigger>New Section</pxm-accordion-trigger>
    <pxm-accordion-content>New content here</pxm-accordion-content>
`;
accordion.appendChild(newItem); // Automatically initialized

// Listen for changes
accordion.addEventListener('pxm:accordion:items-changed', (e) => {
    console.log(`Accordion now has ${e.detail.itemCount} items`);
});
```

## State Synchronization

Manual attribute changes are automatically synced:

```javascript
// Manual DOM changes are detected and synced
const item = document.querySelector('pxm-accordion-item');
item.setAttribute('active', 'true'); // Component state updates automatically

// Listen for sync events
accordion.addEventListener('pxm:accordion:state-sync', (e) => {
    console.log(`Item ${e.detail.index} was ${e.detail.action}`);
    // Actions: 'activated-from-dom' or 'deactivated-from-dom'
});
```

## TypeScript API

```typescript
export interface PxmAccordion extends HTMLElement {
  // Basic operations
  toggleItem(index: number): Promise<void>;
  expandItem(index: number): Promise<void>;
  collapseItem(index: number): Promise<void>;
  
  // Bulk operations
  expandAll(): Promise<void>;
  collapseAll(): Promise<void>;
  
  // State queries
  getActiveItems(): number[];
  isItemActive(index: number): boolean;
}

export interface PxmAccordionItem extends HTMLElement {}
export interface PxmAccordionTrigger extends HTMLElement {}
export interface PxmAccordionContent extends HTMLElement {}
```

### Programmatic Control

```typescript
const accordion = document.querySelector('pxm-accordion') as PxmAccordion;

// Control individual items
await accordion.expandItem(0);
await accordion.collapseItem(1);
await accordion.toggleItem(2);

// Bulk operations (requires allow-multiple="true" for expandAll)
await accordion.expandAll();
await accordion.collapseAll();

// Query state
const activeItems = accordion.getActiveItems(); // [0, 2]
const isActive = accordion.isItemActive(0); // true
```

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

/* Active state styling */
pxm-accordion-item[active="true"] pxm-accordion-trigger {
    background: #f0f9ff;
    color: #1e40af;
}
```

### SSR / Hydration Support

```css
/* Prevent hydration flash */
pxm-accordion-item:not([active="true"]) pxm-accordion-content {
    display: none;
    opacity: 0;
}

pxm-accordion-item[active="true"] pxm-accordion-content {
    display: block;
    opacity: 1;
}

/* Hide content during hydration */
pxm-accordion:not(:defined) pxm-accordion-content {
    display: none;
}
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

### Settings Panel with Multiple Open

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