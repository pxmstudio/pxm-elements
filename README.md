# Pixelmakers Elements

[![npm version](https://badge.fury.io/js/@pixelmakers%2Felements.svg)](https://badge.fury.io/js/@pixelmakers%2Felements)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Modern, accessible web components built with TypeScript. Ready for both CDN usage and npm installs.

## Quick Start

### CDN Usage (UMD)
Perfect for prototypes, simple sites, or any project without a build system.

```html
<!DOCTYPE html>
<html>
<body>
    <!-- Include any component you need -->
    <script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/accordion.js"></script>
    
    <!-- Use immediately -->
    <pxm-accordion allow-multiple="false">
        <pxm-accordion-item>
            <pxm-accordion-trigger>Click me!</pxm-accordion-trigger>
            <pxm-accordion-content>Content here</pxm-accordion-content>
        </pxm-accordion-item>
    </pxm-accordion>
</body>
</html>
```

### NPM Installation (ESM)
Perfect for modern applications with bundlers (Vite, Webpack, etc.).

```bash
npm install @pixelmakers/elements
```

```typescript
// Import individual components for optimal tree-shaking
import '@pixelmakers/elements/accordion';
import '@pixelmakers/elements/lightbox';

// Or with type information
import { PxmAccordion } from '@pixelmakers/elements';
```

## Installation

### Option 1: CDN (Recommended for simple projects)

Include components directly from CDN - no build tools required:

```html
<!-- Core Components (lightweight) -->
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/accordion.js"></script>     <!-- 4.4KB -->
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/tabs.js"></script>         <!-- 2.3KB -->
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/video.js"></script>        <!-- 11KB -->
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/number-input.js"></script> <!-- 2.6KB -->

<!-- Feature-rich Components (with bundled dependencies) -->
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/lightbox.js"></script>     <!-- 219KB (includes Swiper) -->
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/phone-input.js"></script>  <!-- 295KB (includes intl-tel-input) -->
```

**Benefits:**
- ✅ Zero configuration
- ✅ Self-contained (all dependencies included)
- ✅ Works everywhere
- ✅ No build tools required

### Option 2: NPM (Recommended for applications)

Install via npm for optimal bundle sizes and TypeScript support:

```bash
npm install @pixelmakers/elements
```

```typescript
// Tree-shakable imports (recommended)
import '@pixelmakers/elements/accordion';
import '@pixelmakers/elements/tabs';

// Or import with types
import { PxmAccordion, PxmTabs } from '@pixelmakers/elements';
```

**Benefits:**
- ✅ Tree-shaking (only bundle what you use)
- ✅ TypeScript support
- ✅ Optimal bundle sizes
- ✅ Code splitting support

## Usage Examples

### CDN Usage

```html
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <!-- Include components -->
    <script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/accordion.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/tabs.js"></script>
    
    <!-- Use components -->
    <pxm-accordion allow-multiple="false">
        <pxm-accordion-item>
            <pxm-accordion-trigger>Section 1</pxm-accordion-trigger>
            <pxm-accordion-content>Content 1</pxm-accordion-content>
        </pxm-accordion-item>
    </pxm-accordion>
    
    <pxm-tabs>
        <div role="tablist">
            <button role="tab" data-tab="tab1">Tab 1</button>
            <button role="tab" data-tab="tab2">Tab 2</button>
        </div>
        <div role="tabpanel" data-panel="tab1">Panel 1</div>
        <div role="tabpanel" data-panel="tab2">Panel 2</div>
    </pxm-tabs>
</body>
</html>
```

### NPM Usage

```typescript
// Individual imports (recommended)
import '@pixelmakers/elements/accordion';
import '@pixelmakers/elements/tabs';

// Dynamic imports for code splitting
async function loadLightbox() {
    const { PxmLightbox } = await import('@pixelmakers/elements/lightbox');
    // Use component...
}

// TypeScript usage
import { PxmAccordion } from '@pixelmakers/elements';

const accordion = document.createElement('pxm-accordion') as PxmAccordion;
accordion.setAttribute('allow-multiple', 'true');
```

## Components

### 🪗 Accordion

Collapsible content sections with smooth animations and full accessibility support.

```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/accordion.js"></script>

<pxm-accordion allow-multiple="false" animation-duration="300">
    <pxm-accordion-item>
        <pxm-accordion-trigger>
            <span>Section Title</span>
            <span data-accordion-icon>+</span>
        </pxm-accordion-trigger>
        <pxm-accordion-content>
            <p>Section content goes here...</p>
        </pxm-accordion-content>
    </pxm-accordion-item>
</pxm-accordion>
```

**Attributes:**
- `allow-multiple`: Allow multiple sections open (default: `false`)
- `animation-duration`: Animation duration in ms (default: `300`)
- `icon-rotation`: Icon rotation degrees (default: `90`)

**Features:**
- ✅ Keyboard navigation (Arrow keys, Enter, Space, Home, End)
- ✅ ARIA accessibility
- ✅ Smooth animations
- ✅ Icon rotation

### 📱 Phone Input

International phone number input with country selection and validation.

```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/phone-input.js"></script>

<pxm-phone-input 
    data-initial-country="us"
    data-separate-dial-code="true">
    <input type="tel" name="phone" placeholder="Enter phone number">
</pxm-phone-input>
```

**Attributes:**
- `data-initial-country`: Initial country code (default: `"ae"`)
- `data-separate-dial-code`: Show dial code separately (default: `false`)
- `data-format-on-display`: Format while typing (default: `false`)

**Features:**
- ✅ 200+ countries
- ✅ Auto-formatting
- ✅ Validation
- ✅ Accessible

### 🖼️ Lightbox

Modern image and media lightbox with touch gestures and keyboard navigation.

```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/lightbox.js"></script>

<pxm-lightbox mode="modal" zoom-mode="cursor-area">
    <pxm-lightbox-inline>
        <pxm-lightbox-thumbs>
            <pxm-lightbox-thumb data-full-image-src="image1-large.jpg">
                <img src="image1-thumb.jpg" alt="Image 1">
            </pxm-lightbox-thumb>
        </pxm-lightbox-thumbs>
        
        <pxm-lightbox-viewer>
            <img src="image1-large.jpg" alt="Main view">
        </pxm-lightbox-viewer>
    </pxm-lightbox-inline>
</pxm-lightbox>
```

**Attributes:**
- `mode`: `"viewer"` or `"modal"` (default: `"viewer"`)
- `zoom-mode`: `"cursor-area"` or `"none"` (default: `"none"`)

**Features:**
- ✅ Touch gestures
- ✅ Keyboard navigation
- ✅ Zoom functionality
- ✅ Swiper integration

### 🗂️ Tabs

Accessible tab component with keyboard navigation.

```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/tabs.js"></script>

<pxm-tabs>
    <div role="tablist">
        <button role="tab" aria-selected="true" data-tab="tab1">Tab 1</button>
        <button role="tab" data-tab="tab2">Tab 2</button>
        <button role="tab" data-tab="tab3">Tab 3</button>
    </div>
    
    <div role="tabpanel" data-panel="tab1">Content for tab 1</div>
    <div role="tabpanel" data-panel="tab2" aria-hidden="true">Content for tab 2</div>
    <div role="tabpanel" data-panel="tab3" aria-hidden="true">Content for tab 3</div>
</pxm-tabs>
```

**Features:**
- ✅ ARIA accessibility
- ✅ Keyboard navigation (Arrow keys, Home, End)
- ✅ Automatic panel management
- ✅ Flexible styling

### 🎬 Video

Multi-platform video component supporting YouTube, Vimeo, Mux, and MP4.

```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/video.js"></script>

<!-- YouTube -->
<pxm-video src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></pxm-video>

<!-- With custom thumbnail -->
<pxm-video 
    src="https://vimeo.com/123456789"
    thumbnail="custom-thumbnail.jpg"
    title="Video Title">
</pxm-video>
```

**Attributes:**
- `src`: Video URL (required)
- `type`: `"youtube"`, `"vimeo"`, `"mux"`, `"mp4"`, or `"other"`
- `thumbnail`: Custom thumbnail URL
- `autoplay`: Auto-play video (default: `false`)
- `muted`: Mute by default (default: `false`)

**Features:**
- ✅ Multiple platforms
- ✅ Lazy loading
- ✅ Custom thumbnails
- ✅ Responsive design

### 🔢 Number Input

Enhanced number input with increment/decrement controls.

```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/number-input.js"></script>

<pxm-number-input>
    <button data-minus>-</button>
    <input type="number" min="0" max="100" step="1" value="5">
    <button data-plus>+</button>
</pxm-number-input>
```

**Features:**
- ✅ Min/max constraints
- ✅ Custom step size
- ✅ Auto-disable controls
- ✅ Keyboard support

## File Sizes

| Component | CDN (UMD) | NPM (ESM) | Dependencies |
|-----------|-----------|-----------|--------------|
| Accordion | 4.4KB | 6.6KB | None |
| Tabs | 2.3KB | 2.8KB | None |
| Video | 11KB | 16KB | Medium Zoom |
| Number Input | 2.6KB | 3.0KB | None |
| **Lightbox** | **219KB** | **90KB** | Swiper (bundled/external) |
| **Phone Input** | **295KB** | **1.2KB** | intl-tel-input (bundled/external) |

> **CDN builds** include all dependencies for standalone usage  
> **NPM builds** keep dependencies external for optimal bundling

## Browser Support

- Chrome 90+ ✅
- Firefox 90+ ✅  
- Safari 14+ ✅
- Edge 90+ ✅

All components use modern Web Components APIs (Custom Elements, Shadow DOM when beneficial).

## TypeScript

Full TypeScript support with exported types:

```typescript
import { PxmAccordion, AccordionConfig } from '@pixelmakers/elements/accordion';

const accordion = document.createElement('pxm-accordion') as PxmAccordion;
const config: AccordionConfig = {
    allowMultiple: true,
    animationDuration: 500,
    iconRotation: 180
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build

# Build ESM only
npm run build:esm

# Build UMD only  
npm run build:umd
```

## Examples

- **CDN Usage**: [examples/cdn-usage.html](examples/cdn-usage.html)
- **NPM Usage**: [examples/npm-usage.ts](examples/npm-usage.ts)

## License

MIT © [PixelMakers](https://pixelmakers.io)

---

Made with ❤️ by the PixelMakers team 