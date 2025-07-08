# PixelMakers Elements Migration Guide

## Architecture Overview

PixelMakers Elements has been **completely redesigned** as a logic-only, animation-configurable web component library. This new architecture is built around the following core principles:

### Key Principles

- **Logic-Only Components:**  
  All components provide only interactivity and logic—no internal CSS, no default styles, and no opinionated markup. This ensures maximum flexibility and zero CSS conflicts.

- **Copy-Paste Friendly:**  
  Components are designed to work in any environment (vanilla JS/TS, Webflow, Shopify, Astro, etc.) and can be easily copy-pasted or imported as needed.

- **Global Animation Configuration:**  
  All animations (if present) are routed through a global animation factory, allowing you to choose between GSAP or vanilla JS and configure defaults (duration, easing, etc.) in a single place.

- **Public API for All Components:**  
  Each component exposes a minimal, well-documented public API for programmatic control, making integration with frameworks and custom logic straightforward.

- **Minimal Accessibility by Default:**  
  Only the minimum ARIA attributes required for logic are set. All other accessibility and semantics are left to the user, allowing for full customization.

### Architecture Diagram

```
+-------------------+         +-------------------+
|  Your App/HTML    | <-----> |  PXM Components   |
+-------------------+         +-------------------+
         |                              |
         |  (data attributes,           |  (public API, events)
         |   custom markup,             |
         |   your own CSS)              |
         |                              |
         v                              v
+--------------------------------------------------+
|           Global Animation Config/Factory        |
+--------------------------------------------------+
```

### Benefits of the New Architecture

- **No CSS Conflicts:**  
  Since components provide no styling, you have full control over appearance and can use any design system or framework.

- **Maximum Flexibility:**  
  Works with any HTML structure, data attributes, and custom markup. You can style and structure components however you like.

- **Consistent Animation:**  
  All animations are consistent and configurable across components, with a single source of truth for animation settings.

- **Easy Integration:**  
  Components are available in both TypeScript and JavaScript, with clear APIs and no external dependencies (except for optional animation engines).

- **Future-Proof:**  
  The logic-only approach makes it easy to adapt components to new platforms, frameworks, or design systems without rewriting core logic.

- **Performance:**  
  No runtime style recalculation or CSS bloat—just pure logic and interactivity.

---

## Component-Specific Migration Guides

### Accordion

**Before (Old Version):**
```html
<div class="pxm-accordion">
  <div class="pxm-accordion-item">
    <div class="pxm-accordion-header">Header 1</div>
    <div class="pxm-accordion-content">Content 1</div>
  </div>
</div>
```

**After (Logic-Only Version):**
```html
<pxm-accordion>
  <div data-pxm-accordion-item>
    <div data-pxm-accordion-header>Header 1</div>
    <div data-pxm-accordion-content>Content 1</div>
  </div>
</pxm-accordion>
```
- No internal classes or styles. All structure is defined by data attributes. You provide all CSS.

---

### Tabs

**Before (Old Version):**
```html
<div class="pxm-tabs">
  <div class="pxm-tabs-buttons">
    <button class="pxm-tab-button active">Tab 1</button>
    <button class="pxm-tab-button">Tab 2</button>
  </div>
  <div class="pxm-tabs-content">
    <div class="pxm-tab-panel active">Content 1</div>
    <div class="pxm-tab-panel">Content 2</div>
  </div>
</div>
```

**After (Logic-Only Version):**
```html
<pxm-tabs>
  <div>
    <button data-pxm-tab-button="tab1">Tab 1</button>
    <button data-pxm-tab-button="tab2">Tab 2</button>
  </div>
  <div>
    <div data-pxm-tab-panel="tab1">Content 1</div>
    <div data-pxm-tab-panel="tab2">Content 2</div>
  </div>
</pxm-tabs>
```
- No internal classes or styles. Tab buttons and panels are linked by data attributes. You provide all CSS and active state styling.

---

### Lightbox

**Before (Old Version):**
```html
<div class="pxm-lightbox">
  <img class="pxm-lightbox-thumb" src="thumb.jpg">
  <div class="pxm-lightbox-modal">
    <img class="pxm-lightbox-viewer" src="full.jpg">
  </div>
</div>
```

**After (Logic-Only Version):**
```html
<pxm-lightbox>
  <img data-pxm-lightbox-thumb src="thumb.jpg">
  <div data-pxm-lightbox-modal>
    <img data-pxm-lightbox-viewer src="full.jpg">
  </div>
</pxm-lightbox>
```
- All structure is defined by data attributes. No internal styles or ARIA/role management. You provide all modal and overlay styling.

---

### Number Input

**Before (Old Version):**
```html
<div class="pxm-number-input">
  <button class="pxm-minus">-</button>
  <input type="number" min="0" max="10" value="5">
  <button class="pxm-plus">+</button>
</div>
```

**After (Logic-Only Version):**
```html
<pxm-number-input>
  <button data-minus>-</button>
  <input type="number" min="0" max="10" value="5">
  <button data-plus>+</button>
</pxm-number-input>
```
- No internal classes or styles. Increment/decrement buttons are identified by data attributes. Error messages are shown in a dedicated element (`<div data-error>`), which you can style as needed.

---

### Phone Input

**Before (Old Version):**
```html
<div class="pxm-phone-input">
  <input type="tel" class="pxm-phone-field">
  <div class="pxm-phone-error"></div>
</div>
```

**After (Logic-Only Version):**
```html
<pxm-phone-input>
  <input type="tel" name="phone">
  <div data-error></div>
</pxm-phone-input>
```
- No internal classes or styles. All error and formatting logic is handled by the component, but you provide all styling. Internationalization and validation are logic-only.

---

### Video

**Before (Old Version):**
```html
<div class="pxm-video">
  <video src="video.mp4" controls></video>
</div>
```

**After (Logic-Only Version):**
```html
<pxm-video src="video.mp4" type="mp4" controls="true"></pxm-video>
```
- All configuration is via attributes. No internal styles or overlays. You provide all appearance and overlays.

---

## Troubleshooting & FAQ

### Common Issues

#### 1. Components not working
- **Checklist:**
  - Make sure you have imported the component (via `<script>` tag or ES module import).
  - Ensure the required HTML structure and data attributes are present.
  - If using the CLI, verify that your config file (`pxm.config.js` or `pxm.config.ts`) is present and correctly set up.
  - For TypeScript, ensure you are importing the correct types and using the public API as documented.

#### 2. Animations not working (GSAP)
- **Checklist:**
  - Ensure GSAP is installed and loaded before your components if you are using GSAP as your animation engine.
  - Check that your global config (`pxm.config.js/ts`) specifies `animationEngine: 'gsap'`.
  - If using vanilla, set `animationEngine: 'vanilla'` in your config.
  - If you see errors about missing animation modules, double-check your config and installation.

#### 3. Styling issues
- **Checklist:**
  - Remember: **All styling is your responsibility.** The components provide only logic and data attributes.
  - Add your own CSS for layout, colors, spacing, and responsive design.
  - Use the provided data attributes (e.g., `[data-pxm-accordion-header]`, `[data-plus]`, `[data-error]`) as CSS selectors.
  - If you see unstyled or broken layouts, check your CSS and HTML structure.

#### 4. Error messages not showing
- **Checklist:**
  - Make sure your markup includes an `<input type="number">`, `<input type="tel">`, or the relevant field for the component.
  - The error element (`<div data-error>`) is created automatically if not present, but you can add and style it yourself.
  - Check for custom error message attributes (e.g., `data-error-message-min`) if you want to override defaults.

#### 5. Custom events not firing
- **Checklist:**
  - Listen for custom events like `pxm-number-change`, `pxm-number-error`, `pxm-video-state-change`, etc., on the custom element itself (not the inner input).
  - Example:
    ```js
    document.querySelector('pxm-number-input').addEventListener('pxm-number-change', e => {
      console.log('Value changed:', e.detail.value);
    });
    ```

#### 6. Accessibility concerns
- **Checklist:**
  - The components set only the minimum ARIA attributes required for logic (e.g., `aria-invalid` for error states).
  - For full accessibility, add your own ARIA roles, labels, and keyboard navigation as needed.
  - Use semantic HTML and test with screen readers for your use case.

#### 7. Migration: Old classes/markup not working
- **Checklist:**
  - The new components do not use any internal classes or legacy markup.
  - Update your HTML to use the new data attribute structure as shown in the migration guides.
  - Remove any old CSS targeting legacy classes and update your selectors to use data attributes.

### Frequently Asked Questions (FAQ)

**Q: Do I need to import any CSS?**
> No. All styling is up to you. The components provide only logic and data attributes.

**Q: Can I use these components with React/Vue/Svelte/etc.?**
> Yes! These are standard web components and work in any framework that supports custom elements. Use the public API for programmatic control.

**Q: How do I change the animation engine or defaults?**
> Edit your `pxm.config.js` or `pxm.config.ts` and set the `animationEngine` and `defaults` fields. Example:
> ```js
> export default {
>   animationEngine: 'gsap', // or 'vanilla'
>   defaults: { duration: 0.3, easing: 'ease-in-out' }
> };
> ```

**Q: How do I customize error messages?**
> Add data attributes like `data-error-message-min`, `data-error-message-max`, or `data-error-message-invalid` to your component. See the documentation for details.

**Q: How do I add my own validation logic?**
> Assign a `validateCallback` function to the component in JavaScript/TypeScript. See the public API section for an example.

**Q: What browsers are supported?**
> All modern browsers that support Custom Elements, ES6, and (if used) the relevant animation engine (GSAP or vanilla).

**Q: Can I use these components in Webflow/Shopify/Astro?**
> Yes! The logic-only, copy-paste-friendly design works in any environment that supports custom elements and JavaScript.

**Q: How do I get support or report issues?**
> Please open an issue on the project's GitHub repository or contact the maintainers as described in the main README. 