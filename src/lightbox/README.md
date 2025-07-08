# PXM Lightbox (Logic-Only, Animation-Configurable, Accessibility-Agnostic)

> **IMPORTANT:**
> - This component system is **logic-only**: it injects **no styles** and sets **no ARIA/role/tabindex/aria-label** attributes. Accessibility and styling are now **100% your responsibility**.
> - All animation (fade, highlight, modal transitions) is **centrally configurable** via the global animation config/factory.
> - Components are **copy-paste-friendly** and work in any environment (vanilla JS/TS, Webflow, Shopify, Astro, etc.).

---

## Overview

The PXM Lightbox is a modular, logic-only system for building highly customizable galleries and modals. All UI, accessibility, and styling are left to the user. The system provides a robust public API and globally-configurable animation for all transitions.

## Features
- **Logic-only:** No built-in styles, ARIA, or roles. 100% user-controlled.
- **Animation-configurable:** All transitions (fade, highlight, modal) use the global animation factory and config.
- **Copy-paste-friendly:** No dependencies on frameworks or CSS. Works anywhere.
- **Public API:** All major components expose a TypeScript interface and public methods.
- **Accessibility-agnostic:** You must add ARIA/role/tabindex/aria-label as needed for your use case.

---

## Animation Configuration

All animation (fade in/out, highlight, modal transitions) is routed through the global animation factory. You can configure:
- Animation engine: `vanilla` or `gsap`
- Duration, easing, and defaults via the global config (`pxm-config`)

**Example:**
```ts
import { setConfig } from '../config/pxm-config';
setConfig({
  animationEngine: 'gsap',
  defaults: { duration: 0.3, easing: 'power2.out' }
});
```

---

## Usage Patterns

### Minimal Inline Lightbox (No ARIA/roles by default)
```html
<pxm-lightbox mode="viewer" zoom-mode="lens">
  <pxm-lightbox-inline>
    <pxm-lightbox-viewer>
      <img src="default.jpg">
    </pxm-lightbox-viewer>
    <pxm-lightbox-thumbs>
      <pxm-lightbox-thumb type="image" data-full-image-src="image1.jpg">
        <img src="thumb1.jpg">
      </pxm-lightbox-thumb>
      <pxm-lightbox-thumb type="video" data-video-src="video1.mp4" data-video-type="direct">
        <img src="video-thumb1.jpg">
      </pxm-lightbox-thumb>
    </pxm-lightbox-thumbs>
  </pxm-lightbox-inline>
</pxm-lightbox>
```
> **Note:** For accessibility, add ARIA/role/tabindex/aria-label as needed to your markup.

### Modal Mode with Template-Based Auto-Population
```html
<pxm-lightbox mode="modal" zoom-mode="cursor-area">
  <pxm-lightbox-inline>
    <pxm-lightbox-viewer>
      <img src="default.jpg">
    </pxm-lightbox-viewer>
    <pxm-lightbox-thumbs>
      <pxm-lightbox-thumb type="image" data-full-image-src="image1.jpg">
        <img src="thumb1.jpg">
      </pxm-lightbox-thumb>
      <pxm-lightbox-thumb type="image" data-full-image-src="image2.jpg">
        <img src="thumb2.jpg">
      </pxm-lightbox-thumb>
      <pxm-lightbox-thumb type="video" data-video-src="video1.mp4" data-video-type="direct">
        <img src="video-thumb1.jpg">
      </pxm-lightbox-thumb>
    </pxm-lightbox-thumbs>
  </pxm-lightbox-inline>
  <pxm-lightbox-modal thumbs-swiper="true" viewer-swiper="true">
    <pxm-lightbox-modal-viewer>
      <div data-swiper="" class="swiper">
        <div data-swiper-wrapper="" class="swiper-wrapper">
          <div data-swiper-slide="" class="swiper-slide">
            <img src="">
          </div>
        </div>
      </div>
    </pxm-lightbox-modal-viewer>
    <pxm-lightbox-modal-thumbs data-swiper-direction="horizontal">
      <pxm-lightbox-modal-thumb type="image" data-full-image-src="">
        <img loading="lazy" src="">
      </pxm-lightbox-modal-thumb>
    </pxm-lightbox-modal-thumbs>
    <a data-close=""></a>
    <a data-swiper-prev=""></a>
    <a data-swiper-next=""></a>
    <div data-modal-overlay=""></div>
  </pxm-lightbox-modal>
</pxm-lightbox>
```
> **Note:** Add ARIA/role/tabindex/aria-label as needed for accessibility.

---

## Accessibility Responsibility
- **No ARIA/role/tabindex/aria-label is set by default.**
- You must add all accessibility attributes to your markup as needed.
- Example:
  ```html
  <pxm-lightbox-thumb role="button" tabindex="0" aria-label="Image thumbnail. Click to view.">
    <img src="thumb1.jpg" alt="Thumbnail 1">
  </pxm-lightbox-thumb>
  ```

---

## TypeScript Interfaces & Public API

All major components export TypeScript interfaces and public methods for programmatic control.

**Example:**
```ts
const lightbox = document.querySelector('pxm-lightbox') as any;
lightbox.openModal();
lightbox.closeModal();
lightbox.setCurrentIndex(2);
const current = lightbox.getCurrentMediaItem();
```

---

## Component List
- `<pxm-lightbox>`: Main coordinator
- `<pxm-lightbox-inline>`: Inline gallery
- `<pxm-lightbox-viewer>`: Main viewer (with zoom)
- `<pxm-lightbox-thumbs>`: Inline thumbnails
- `<pxm-lightbox-thumb>`: Inline thumbnail
- `<pxm-lightbox-modal>`: Modal overlay
- `<pxm-lightbox-modal-viewer>`: Modal viewer
- `<pxm-lightbox-modal-thumbs>`: Modal thumbnails
- `<pxm-lightbox-modal-thumb>`: Modal thumbnail (template)

---

## Template Structure & Auto-Population
- Define your media items once in `<pxm-lightbox-inline>`
- Provide a clean `<pxm-lightbox-modal-thumb>` as a template
- Modal thumbs auto-populate from inline thumbs
- All structure, content, and attributes are copied from your markup

---

## Swiper Integration
- Add `thumbs-swiper="true"` or `viewer-swiper="true"` to enable Swiper for thumbs/viewer
- Swiper structure is created at the container level
- All Swiper configuration is user-controlled

---

## Customization & Styling
- **No styles are injected.**
- All styling is up to you (CSS, classes, etc.)
- Use the provided CSS custom properties for zoom overlay if desired

---

## Migration Notes
- All ARIA/role/tabindex/aria-label logic has been removed
- All internal styles have been removed
- All animation is routed through the global animation config/factory
- Accessibility and styling are now 100% user responsibility

---

For more advanced usage, see the full API docs and code comments.