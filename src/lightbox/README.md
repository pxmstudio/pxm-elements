# PXM Lightbox Component

A modern, modular lightbox component for image galleries with zoom functionality and optional modal view. This component has been refactored from a monolithic structure into a clean, maintainable architecture following SOLID principles.

## Features

- **Thumbnail-based Image Switching**: Click thumbnails to change the main display image
- **Cursor-area Zoom**: Hover over images to see a zoomed view that follows your cursor
- **Modal Overlay Support**: Open images in a modal overlay for focused viewing
- **Swiper Integration**: Enable image slider functionality in modal with Swiper.js
- **Click-to-Close Modal**: Click on the modal backdrop to close the modal
- **Configurable via Data Attributes**: Easy customization without JavaScript
- **Memory Leak Prevention**: Proper cleanup of event listeners and DOM elements
- **TypeScript Support**: Full type definitions and IntelliSense support

## Architecture

The component has been refactored into focused, single-responsibility modules:

```
src/lightbox/
├── index.ts           # Main entry point and exports
├── lightbox.ts        # Main orchestrator class
├── types.ts           # Type definitions
├── config.ts          # Configuration management
├── dom-utils.ts       # DOM utility functions
├── zoom-manager.ts    # Zoom functionality
├── modal-manager.ts   # Modal functionality
├── event-manager.ts   # Event handling
└── README.md          # This documentation
```

### Key Components

- **`PxmLightbox`**: Main orchestrator class that coordinates all functionality
- **`ConfigManager`**: Handles configuration parsing and validation
- **`ZoomManager`**: Manages zoom overlay positioning and mouse tracking
- **`ModalManager`**: Handles modal opening, closing, and thumbnail management
- **`EventManager`**: Centralizes all event binding and cleanup

## Usage

### Basic HTML Structure

```html
<pxm-lightbox data-mode="modal" data-zoom-mode="cursor-area">
  <!-- Main target image -->
  <img data-target-img src="main-image.jpg" alt="Main image" />
  
  <!-- Thumbnail gallery -->
  <img data-thumb-item src="thumb1.jpg" data-full-img-src="full1.jpg" alt="Thumbnail 1" />
  <img data-thumb-item src="thumb2.jpg" data-full-img-src="full2.jpg" alt="Thumbnail 2" />
  
  <!-- Modal overlay (optional) -->
  <div data-modal style="display: none;">
    <!-- Modal backdrop - click to close -->
    <div data-modal-overlay>
      <div class="modal-content">
        <img data-target-img src="main-image.jpg" alt="Modal image" />
        <div data-modal-thumbnails>
          <!-- Template thumbnail - will be cloned -->
          <img data-thumb-item />
        </div>
        <button data-close>×</button>
      </div>
    </div>
  </div>
</pxm-lightbox>
```

### Configuration Options

Configure the lightbox using data attributes:

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `data-mode` | `"modal"` \| `"swap-target"` | `"modal"` | Display mode for the lightbox |
| `data-zoom-mode` | `"cursor-area"` \| `"none"` | `"cursor-area"` | Zoom functionality mode |
| `data-zoom-size` | number | `150` | Size of zoom overlay in pixels |
| `data-zoom-level` | number | `2` | Zoom magnification level |
| `data-fade-duration` | number | `200` | Modal fade animation duration in milliseconds |
| `data-target-swiper` | `"on"` \| `"off"` | `"off"` | Enable Swiper slider in modal |

### Swiper Mode

When `data-target-swiper="on"` is set on the lightbox element, the modal will use Swiper.js for image navigation instead of traditional thumbnails. This creates a slider interface for browsing images.

#### Requirements for Swiper Mode

1. **Install and Import Swiper.js**: Add Swiper to your project and import the CSS
```bash
npm install swiper
```

**Option A: Import in your CSS/SCSS file:**
```css
@import 'swiper/css';
@import 'swiper/css/navigation';
@import 'swiper/css/pagination';
```

**Option B: Import in your JavaScript:**
```javascript
import 'swiper/css';
import 'swiper/css/navigation'; 
import 'swiper/css/pagination';
```

**Option C: Use CDN (for quick prototyping):**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

**Note**: The component automatically:
- Checks if Swiper is available in `window.Swiper`
- If not found, dynamically imports Swiper from npm
- Gracefully falls back to regular mode if Swiper cannot be loaded
- **CSS must be imported separately by the user** (standard npm practice)

2. **HTML Structure for Swiper Mode**:
```html
<pxm-lightbox data-mode="modal" data-target-swiper="on">
  <!-- Main target image -->
  <img data-target-img src="main-image.jpg" alt="Main image" />
  
  <!-- Thumbnail gallery (used to populate swiper slides) -->
  <img data-thumb-item src="thumb1.jpg" data-full-img-src="full1.jpg" alt="Thumbnail 1" />
  <img data-thumb-item src="thumb2.jpg" data-full-img-src="full2.jpg" alt="Thumbnail 2" />
  
  <!-- Modal with Swiper structure -->
  <div data-modal style="display: none;">
    <div data-modal-overlay>
      <div class="modal-content">
        <!-- Swiper container -->
        <div data-target-swiper class="swiper">
          <div data-target-swiper-wrapper class="swiper-wrapper">
            <!-- Slides will be dynamically created from thumbnails -->
          </div>
          <!-- Optional: Add navigation arrows -->
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
          <!-- Optional: Add pagination -->
          <div class="swiper-pagination"></div>
        </div>
        
        <!-- Traditional thumbnails (not used in swiper mode) -->
        <div data-modal-thumbnails style="display: none;">
          <img data-thumb-item />
        </div>
        
        <button data-close>×</button>
      </div>
    </div>
  </div>
</pxm-lightbox>
```

#### Swiper Features

- **Automatic Slide Creation**: Slides are automatically generated from thumbnail images
- **Navigation**: Supports keyboard navigation and optional arrow buttons
- **Pagination**: Optional dot indicators for slide position
- **Loop Mode**: Infinite looping through images
- **Zoom Integration**: Zoom functionality works on the current active slide
- **Thumbnail Integration**: Clicking outside thumbnails opens modal to corresponding slide

### Programmatic API

```javascript
// Get lightbox instance
const lightbox = document.querySelector('pxm-lightbox');

// Update target image
lightbox.updateTargetImage('new-image.jpg');

// Open/close modal programmatically (async for swiper initialization)
await lightbox.openModal();
lightbox.closeModal();

// Get current state
console.log(lightbox.getMode()); // "modal" | "swap-target"
console.log(lightbox.getZoomMode()); // "cursor-area" | "none"

// Refresh thumbnails after dynamic content changes
lightbox.refreshThumbnails();
```

## Modal Overlay Functionality

The modal includes support for clicking on the backdrop to close the modal. This requires proper HTML structure:

- **`data-modal-overlay`**: The backdrop element that users can click to close the modal
- **Modal Content**: Should be wrapped in a child element to prevent accidental closes when clicking on content

### Recommended Modal CSS

```css
/* Modal backdrop styling */
[data-modal-overlay] {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Modal content container */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
}

/* Prevent background scroll when modal is open */
body.modal-open {
  overflow: hidden;
}
```

## CSS Customization

The component sets CSS custom properties that you can override:

```css
pxm-lightbox {
  --pxm-lightbox-zoom-size: 200px;
  --pxm-lightbox-zoom-border: 3px solid #000;
  --pxm-lightbox-zoom-background: #fff;
  --pxm-lightbox-zoom-shadow: 0 4px 20px rgba(0,0,0,0.4);
  --pxm-lightbox-zoom-z-index: 999999;
  --pxm-lightbox-zoom-border-radius: 8px;
}
```

## Improvements Made

### Before (Monolithic Structure)
- Single 348-line class handling all functionality
- Mixed concerns (DOM manipulation, events, zoom, modal)
- Hardcoded configuration values
- Potential memory leaks with event handlers
- Difficult to test individual features
- Code duplication in event handler setup

### After (Modular Architecture)
- **Separation of Concerns**: Each class has a single responsibility
- **Configuration Management**: Centralized, validated configuration
- **Memory Management**: Proper cleanup in `disconnectedCallback()`
- **Error Handling**: Robust error handling and logging
- **Type Safety**: Full TypeScript support with comprehensive types
- **Testability**: Each manager can be tested independently
- **Maintainability**: Clear structure makes changes easier
- **Extensibility**: Easy to add new features without modifying existing code

### Technical Improvements

1. **Single Responsibility Principle**: Each manager class handles one specific aspect
2. **Dependency Injection**: Managers receive dependencies through constructors
3. **Safe DOM Queries**: Utility functions with error handling
4. **Event Handler Cleanup**: Prevents memory leaks
5. **Configuration Validation**: Robust parsing with fallbacks
6. **Documentation**: Comprehensive JSDoc comments
7. **Error Boundaries**: Graceful error handling throughout

## Browser Support

- Modern browsers with ES6+ support
- Custom Elements v1 support required
- TypeScript 4.0+ for development

## Development

### Building
```bash
npm run build
```

### Testing
```bash
npm run test
```

### Linting
```bash
npm run lint
```

## Migration Guide

If upgrading from the previous version:

1. **No Breaking Changes**: The HTML structure and data attributes remain the same
2. **Enhanced API**: New programmatic methods available
3. **Better Performance**: Improved memory management and event handling
4. **Type Safety**: Full TypeScript support if using in TypeScript projects

The refactored component is a drop-in replacement with the same external interface but much better internal architecture. 