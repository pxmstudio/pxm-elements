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
| [Accordion](src/accordion/README.md) | 5.5KB | 5.8KB | Collapsible content sections with full accessibility, keyboard navigation, and event-driven animations |
| [Tabs](src/tabs/README.md) | 4.6KB | 4.2KB | Accessible tabbed interface for organizing content, with keyboard navigation and custom animation support |
| [Toggle](src/toggle/README.md) | 2.6KB | — | Boolean switch/checkbox with form integration, full keyboard support, and zero styling |
| [Switch](src/switch/README.md) | 4.5KB | 4.5KB | Accessible, logic-only switch (toggle) component. No Shadow DOM or styling; bring your own CSS. |
| [Dialog](src/dialog/README.md) | 7.9KB | 7.9KB | Flexible, accessible dialog (modal) component inspired by Radix UI. Handles keyboard navigation, focus management, and event-driven animations. No styling included. |
| [Tooltip](src/tooltip/README.md) | 10KB | 10KB | Flexible, accessible tooltip with smart positioning, keyboard support, and event-driven architecture. All styling and positioning is consumer-controlled. |
| [Dropdown](src/dropdown/README.md) | 3.4KB | 3.4KB | Logic-only dropdown menu with submenu support, keyboard navigation, and full ARIA/data attribute management. All styling and ARIA labeling is consumer-controlled. |
| [Select](src/select/README.md) | 15KB | 15KB | Flexible, accessible select component with single/multiple selection, type-ahead search, and full keyboard navigation. All styling is consumer-controlled. |
| [Number Input](src/number-input/README.md) | 4.0KB | 3.6KB | Enhanced number input with increment/decrement controls, validation, and form integration |
| [Slider](src/slider/README.md) | 14KB | 14KB | Single or multi-thumb slider with keyboard navigation, form support, and full CSS control |
| [Video](src/video/README.md) | 11KB | 16KB | Multi-platform video player supporting YouTube, Vimeo, MP4, and Mux, with auto-thumbnail and custom controls |
| [Phone Input](src/phone-input/README.md) | 3.1KB* | 1.4KB* | International phone number input with validation and formatting (requires `intl-tel-input`) |

> *Sizes marked with * use external dependencies (loaded separately for NPM)
> Toggle ESM size not found; UMD size shown.

## Usage Patterns

### CDN Usage (Recommended for Webflow, Shopify, etc.)

Each component is self-contained and can be loaded independently:

```html
<!-- Load only the components you need -->
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/accordion.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/tabs.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/slider.js"></script>

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
import '@pixelmakers/elements/slider';

// Dynamic imports for code splitting
const loadSlider = async () => {
    await import('@pixelmakers/elements/slider');
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
:root {
    --border-radius: 8px;
    --transition-speed: 200ms;
    --primary-color: #3b82f6;
}

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
<pxm-toggle class="relative inline-block w-12 h-6 bg-gray-300 rounded-full transition-colors duration-200 ease-in-out data-[state=on]:bg-blue-500">
    <span class="block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out translate-x-0.5 data-[state=on]:translate-x-6"></span>
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
    TabsConfig,
    PxmSlider,
    SliderConfig
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
- **Dependencies**: Heavy deps (intl-tel-input) are external for NPM builds

### Loading Strategy
```html
<!-- Preload critical components -->
<link rel="preload" href="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/accordion.js" as="script">

<!-- Load non-critical components lazily -->
<script>
    // Load slider only when needed
    document.addEventListener('click', async (e) => {
        if (e.target.matches('[data-slider]')) {
            await import('https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/slider.js');
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