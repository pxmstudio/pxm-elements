# PXM Lightbox - New Modular Structure

This document outlines the new modular architecture for the PXM Lightbox component system.

## Overview

The lightbox has been restructured from a monolithic component into a modular system with 9 distinct custom elements, each responsible for specific functionality.

## Components

### Core Components

1. **`<pxm-lightbox>`** - Main coordinator component
2. **`<pxm-lightbox-inline>`** - Inline view container
3. **`<pxm-lightbox-viewer>`** - Main image/video viewer with zoom
4. **`<pxm-lightbox-thumbs>`** - Thumbnail container with Swiper support
5. **`<pxm-lightbox-thumb>`** - Individual thumbnail component

### Modal Components

6. **`<pxm-lightbox-modal>`** - Modal container
7. **`<pxm-lightbox-modal-viewer>`** - Modal viewer with Swiper
8. **`<pxm-lightbox-modal-thumbs>`** - Modal thumbnail container
9. **`<pxm-lightbox-modal-thumb>`** - Individual modal thumbnail (used as template)

## Usage Patterns

### Basic Inline Lightbox
```html
<pxm-lightbox mode="viewer" zoom-mode="lens">
  <pxm-lightbox-inline>
    <pxm-lightbox-viewer>
      <img src="default.jpg" alt="Main image">
    </pxm-lightbox-viewer>
    
    <pxm-lightbox-thumbs thumbs-swiper="true" data-swiper-direction="horizontal">
      <pxm-lightbox-thumb type="image" data-full-image-src="image1.jpg">
        <img src="thumb1.jpg" alt="Thumbnail 1">
      </pxm-lightbox-thumb>
      <pxm-lightbox-thumb type="video" data-video-src="video1.mp4" data-video-type="direct">
        <img src="video-thumb1.jpg" alt="Video Thumbnail">
      </pxm-lightbox-thumb>
    </pxm-lightbox-thumbs>
  </pxm-lightbox-inline>
</pxm-lightbox>
```

### Modal Mode with Template-Based Auto-Population

**Key Feature**: Define thumbnails once in the inline component, modal automatically populates from template!

```html
<pxm-lightbox mode="modal" zoom-mode="cursor-area">
  <!-- Inline Component: Define your media items here (data source) -->
  <!-- Note: zoom-mode="cursor-area" will ONLY apply to modal images, not inline -->
  <pxm-lightbox-inline>
    <pxm-lightbox-viewer>
      <img src="default.jpg" alt="Main image">
    </pxm-lightbox-viewer>
    
    <pxm-lightbox-thumbs thumbs-swiper="true" data-swiper-direction="horizontal">
      <pxm-lightbox-thumb type="image" data-full-image-src="image1.jpg">
        <img src="thumb1.jpg" alt="Thumbnail 1">
      </pxm-lightbox-thumb>
      <pxm-lightbox-thumb type="image" data-full-image-src="image2.jpg">
        <img src="thumb2.jpg" alt="Thumbnail 2">
      </pxm-lightbox-thumb>
      <pxm-lightbox-thumb type="video" data-video-src="video1.mp4" data-video-type="direct">
        <img src="video-thumb1.jpg" alt="Video Thumbnail">
      </pxm-lightbox-thumb>
    </pxm-lightbox-thumbs>
  </pxm-lightbox-inline>

  <!-- Modal Component: Zoom effects will be applied here -->
  <pxm-lightbox-modal thumbs-swiper="true" viewer-swiper="true">
    <pxm-lightbox-modal-viewer>
      <!-- Images in this viewer will have zoom-mode="cursor-area" applied -->
      <div data-swiper="" class="swiper">
        <div data-swiper-wrapper="" class="swiper-wrapper">
          <div data-swiper-slide="" class="swiper-slide">
            <img src="" alt="Modal image" style="width: 100%; height: 100%; object-fit: contain;">
          </div>
        </div>
      </div>
    </pxm-lightbox-modal-viewer>

    <!-- Template-based Modal Thumbs: Clean template without swiper structure -->
    <pxm-lightbox-modal-thumbs data-swiper-direction="horizontal" class="modal_thumbnails">
      <!-- This single thumbnail serves as a TEMPLATE for all modal thumbs -->
      <!-- Note: No swiper structure here - it's created automatically at container level -->
      <pxm-lightbox-modal-thumb 
        type="image" 
        data-full-image-src="" 
        class="modal-thumb-image" 
        aria-label="Image thumbnail. Click to view in modal." 
        role="button" 
        tabindex="0">
        <!-- Inner content will be automatically populated from inline thumbs -->
        <img loading="lazy" src="" alt="" class="lightbox_thumb-img">
      </pxm-lightbox-modal-thumb>
    </pxm-lightbox-modal-thumbs>

    <a data-close="" href="#" class="button is-alternate is-modal-top w-button">×</a>
    <a data-swiper-prev="" href="#" class="button is-alternate is-modal-left w-button">‹</a>
    <a data-swiper-next="" href="#" class="button is-alternate is-modal-right w-button">›</a>
    <div data-modal-overlay="" class="div-block-7"></div>
  </pxm-lightbox-modal>
</pxm-lightbox>
```

### How Template Auto-Population Works

1. **Define Once**: You only define your media items in the `<pxm-lightbox-inline>` component
2. **Clean Template**: Provide one `<pxm-lightbox-modal-thumb>` as a clean template (no swiper structure inside)
3. **Auto-Population**: The modal automatically:
   - Extracts inner content from each inline thumb (img elements, etc.)
   - Clones your clean template for each media item
   - Inserts the extracted content into each template clone
   - Populates attributes (type, data-* attributes) from inline data
   - Creates proper swiper structure at container level
   - Manages active states and navigation

### Template Structure Rules

- ✅ **Clean Template**: No swiper structure inside template thumb
- ✅ **Container Swiper**: Swiper structure created at `<pxm-lightbox-modal-thumbs>` level
- ✅ **Content Extraction**: Inner content (img, etc.) copied from inline thumbs
- ✅ **Attribute Population**: Template populated with data from inline thumbs
- ✅ **Automatic Management**: Active states, navigation, and events handled automatically

### Benefits of Template Approach

- ✅ **DRY Principle** - Define thumbnails once, use everywhere
- ✅ **Design Flexibility** - Customize modal thumb appearance via template
- ✅ **Automatic Sync** - Modal always matches inline content
- ✅ **Less Maintenance** - No need to manually keep modal and inline in sync
- ✅ **Cleaner HTML** - Significantly less repetitive markup
- ✅ **Content Extraction** - Automatically copies styling and structure from inline thumbs

### Inline Lightbox with Viewer Swiper

```html
<pxm-lightbox mode="viewer" zoom-mode="lens">
  <pxm-lightbox-inline>
    <!-- Viewer with swiper structure for swiping through images -->
    <pxm-lightbox-viewer>
      <div data-swiper="" class="swiper">
        <div data-swiper-wrapper="" class="swiper-wrapper">
          <!-- Slides will be auto-populated from media items -->
          <div data-swiper-slide="" class="swiper-slide">
            <img src="default.jpg" alt="Main image">
          </div>
        </div>
      </div>
    </pxm-lightbox-viewer>
    
    <pxm-lightbox-thumbs data-swiper-direction="horizontal">
      <pxm-lightbox-thumb type="image" data-full-image-src="image1.jpg">
        <img src="thumb1.jpg" alt="Thumbnail 1">
      </pxm-lightbox-thumb>
      <pxm-lightbox-thumb type="image" data-full-image-src="image2.jpg">
        <img src="thumb2.jpg" alt="Thumbnail 2">
      </pxm-lightbox-thumb>
      <pxm-lightbox-thumb type="video" data-video-src="video1.mp4" data-video-type="direct">
        <img src="video-thumb1.jpg" alt="Video Thumbnail">
      </pxm-lightbox-thumb>
    </pxm-lightbox-thumbs>
  </pxm-lightbox-inline>
</pxm-lightbox>
```

### Viewer Structure Options

**Single Image Mode (no swiper):**
```html
<pxm-lightbox-viewer>
  <img src="default.jpg" alt="Main image">
</pxm-lightbox-viewer>
```

**Swiper Mode (with swiper structure):**
```html
<pxm-lightbox-viewer>
  <div data-swiper="" class="swiper">
    <div data-swiper-wrapper="" class="swiper-wrapper">
      <!-- Slides auto-populated from media items -->
      <div data-swiper-slide="" class="swiper-slide">
        <img src="default.jpg" alt="Main image">
      </div>
    </div>
  </div>
</pxm-lightbox-viewer>
```

## Component Attributes

### Main Lightbox
- `mode`: `"viewer"` (default) | `"modal"`
- `zoom-mode`: `"none"` | `"lens"` | `"zoom-in"` | `"cursor-area"`

**Zoom Behavior:**
- `mode="viewer"`: Zoom applies to inline viewer images
- `mode="modal"`: Zoom applies ONLY to modal viewer images (inline viewer zoom disabled)

### Swiper Integration
- `thumbs-swiper="true"` - Enable Swiper for thumbnails
- `viewer-swiper="true"`