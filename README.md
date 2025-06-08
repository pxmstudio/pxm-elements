# PXM Elements

[![npm version](https://badge.fury.io/js/@pixelmakers%2Felements.svg)](https://badge.fury.io/js/@pixelmakers%2Felements)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Modern, accessible web components for everyone.** From no-code builders to seasoned developers.

## Philosophy

PXM Elements is built on three core principles:

🎯 **Universal Compatibility** - Works everywhere: Webflow, Shopify, Astro, vanilla HTML, or any framework  
🪶 **Lightweight & Simple** - Each component does one thing exceptionally well  
🎨 **Unstyled by Design** - You control the look, we handle the behavior and accessibility

## Quick Start

### For No-Code/Low-Code Users (CDN)

Drop this into your HTML and start using components immediately:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Project</title>
</head>
<body>
    <!-- 1. Add component -->
    <pxm-accordion>
        <pxm-accordion-item>
            <pxm-accordion-trigger>Click me!</pxm-accordion-trigger>
            <pxm-accordion-content>This content toggles!</pxm-accordion-content>
        </pxm-accordion-item>
    </pxm-accordion>

    <!-- 2. Include script (loads automatically) -->
    <script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/accordion.js"></script>
</body>
</html>
```

### For Developers (NPM)

Install and import only what you need:

```bash
npm install @pixelmakers/elements
```

```typescript
// Import individual components for optimal tree-shaking
import '@pixelmakers/elements/accordion';
import '@pixelmakers/elements/tabs';

// Or with TypeScript support
import { PxmAccordion } from '@pixelmakers/elements/accordion';
```

## Why PXM Elements?

### 🚀 **Zero Configuration**
- **CDN**: Works immediately, no build tools required
- **NPM**: Tree-shakable imports, TypeScript support included

### 📱 **Accessibility First**
- Full keyboard navigation
- Screen reader support
- ARIA attributes handled automatically
- Follows WCAG guidelines

### 🎨 **Your Design, Our Behavior**
- No imposed styling - use your CSS framework
- Semantic HTML structure
- CSS custom properties for easy theming
- Works with Tailwind, Bootstrap, or custom CSS

### 🌍 **Universal Platform Support**
- **Webflow**: Drop in custom code blocks
- **Shopify**: Works in Liquid templates
- **Astro**: Server-side rendering compatible
- **React/Vue**: Framework adapters available
- **WordPress**: Plugin-friendly

## Components

| Component | Size (UMD) | Size (ESM) | Description |
|-----------|------------|------------|-------------|
| [Accordion](src/accordion/README.md) | 5.6KB | 5.9KB | Collapsible content sections |
| [Tabs](src/tabs/README.md) | 4.7KB | 4.3KB | Tabbed interface navigation |
| [Toggle](src/toggle/README.md) | 2.7KB | 2.8KB | Boolean switch/checkbox |
| [Number Input](src/number-input/README.md) | 4.1KB | 3.7KB | Enhanced number input with controls |
| [Video](src/video/README.md) | 11.5KB | 16.3KB | Multi-platform video player |
| [Phone Input](src/phone-input/README.md) | 3.2KB* | 1.4KB* | International phone number input |
| [Lightbox](src/lightbox/README.md) | 67.5KB* | 91.8KB* | Image/media gallery with zoom |

> *Sizes marked with * use external dependencies (loaded separately for NPM)

## Usage Patterns

### CDN Usage (Recommended for Webflow, Shopify, etc.)

Each component is self-contained and can be loaded independently:

```html
<!-- Load only the components you need -->
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/accordion.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/tabs.js"></script>

<!-- Use immediately -->
<pxm-accordion allow-multiple="true">
    <pxm-accordion-item>
        <pxm-accordion-trigger>Section 1</pxm-accordion-trigger>
        <pxm-accordion-content>Content 1</pxm-accordion-content>
    </pxm-accordion-item>
</pxm-accordion>
```

### NPM Usage (Recommended for Applications)

Tree-shakable imports ensure optimal bundle sizes:

```typescript
// Individual imports (recommended)
import '@pixelmakers/elements/accordion';
import '@pixelmakers/elements/tabs';

// Dynamic imports for code splitting
const loadLightbox = async () => {
    await import('@pixelmakers/elements/lightbox');
    // Component is now available
};

// TypeScript usage
import type { PxmAccordion } from '@pixelmakers/elements/accordion';

const accordion = document.querySelector('pxm-accordion') as PxmAccordion;
accordion.setAttribute('allow-multiple', 'true');
```

## Styling Guide

PXM Elements provides zero styling - you're in complete control. Here are common patterns:

### CSS Custom Properties

```css
/* Define your design tokens */
:root {
    --border-radius: 8px;
    --transition-speed: 200ms;
    --primary-color: #3b82f6;
}

/* Style components using data attributes and CSS selectors */
pxm-accordion-trigger {
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: var(--border-radius);
    background: white;
    transition: all var(--transition-speed);
}

pxm-accordion-trigger:hover {
    background: #f9fafb;
}

pxm-accordion-item[active="true"] pxm-accordion-trigger {
    background: var(--primary-color);
    color: white;
}
```

### Tailwind CSS

```html
<pxm-toggle class="relative inline-block w-12 h-6 bg-gray-300 rounded-full transition-colors duration-200 ease-in-out data-[state=checked]:bg-blue-500">
    <span class="block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out translate-x-0.5 data-[state=checked]:translate-x-6"></span>
</pxm-toggle>
```

### CSS-in-JS / Styled Components

```javascript
const StyledAccordion = styled(PxmAccordion)`
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.radii.md};
    
    pxm-accordion-trigger {
        padding: ${props => props.theme.space[4]};
        background: ${props => props.theme.colors.surface};
        
        &:hover {
            background: ${props => props.theme.colors.surfaceHover};
        }
    }
`;
```

## Platform Integration

### Webflow

1. Add a Custom Code block to your page
2. Include the component script
3. Add HTML structure in an Embed block

```html
<!-- In Custom Code (Head) -->
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/accordion.js"></script>

<!-- In Embed block -->
<pxm-accordion>
    <pxm-accordion-item>
        <pxm-accordion-trigger>FAQ Question</pxm-accordion-trigger>
        <pxm-accordion-content>Answer content here</pxm-accordion-content>
    </pxm-accordion-item>
</pxm-accordion>
```

### Shopify Liquid

```liquid
<!-- In theme.liquid -->
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/tabs.js"></script>

<!-- In template -->
<pxm-tabs>
    <pxm-triggers>
        {% for variant in product.variants %}
            <button data-tab="variant-{{ variant.id }}">{{ variant.title }}</button>
        {% endfor %}
    </pxm-triggers>
    
    {% for variant in product.variants %}
        <pxm-panel data-tab="variant-{{ variant.id }}">
            {{ variant.price | money }}
        </pxm-panel>
    {% endfor %}
</pxm-tabs>
```

### Astro

```astro
---
// Component works server-side
---

<script>
    import '@pixelmakers/elements/accordion';
</script>

<pxm-accordion>
    <pxm-accordion-item>
        <pxm-accordion-trigger>Server-rendered content</pxm-accordion-trigger>
        <pxm-accordion-content>
            This works with SSR!
        </pxm-accordion-content>
    </pxm-accordion-item>
</pxm-accordion>
```

## Browser Support

- Chrome 90+ ✅
- Firefox 90+ ✅  
- Safari 14+ ✅
- Edge 90+ ✅

All components use modern Web Components APIs with graceful degradation.

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type { 
    PxmAccordion, 
    AccordionConfig,
    PxmTabs,
    TabsConfig 
} from '@pixelmakers/elements';

// Type-safe component usage
const accordion = document.querySelector('pxm-accordion') as PxmAccordion;
const config: AccordionConfig = {
    allowMultiple: true,
    animationDuration: 300
};
```

## Performance

### Bundle Sizes
- **CDN**: Self-contained, cacheable across sites
- **NPM**: Tree-shakable, only bundle what you use
- **Dependencies**: Heavy deps (Swiper, intl-tel-input) are external for NPM builds

### Loading Strategy
```html
<!-- Preload critical components -->
<link rel="preload" href="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/accordion.js" as="script">

<!-- Load non-critical components lazily -->
<script>
    // Load lightbox only when needed
    document.addEventListener('click', async (e) => {
        if (e.target.matches('[data-lightbox]')) {
            await import('https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/lightbox.js');
        }
    }, { once: true });
</script>
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build library
npm run build
```

## Examples

- **Live Examples**: [CodePen Collection](https://codepen.io/collection/pxm-elements)
- **CDN Usage**: [examples/cdn-usage.html](examples/cdn-usage.html)
- **NPM Usage**: [examples/npm-usage.ts](examples/npm-usage.ts)
- **Webflow Project**: [Template Link](https://webflow.com/made-in-webflow/pxm-elements)

## License

MIT © [PixelMakers](https://pixelmakers.io)

---

**Built with ❤️ for the web community**

[Report Issues](https://github.com/pixelmakers/elements/issues) • [Discussions](https://github.com/pixelmakers/elements/discussions) • [Twitter](https://twitter.com/pixelmakers) 