# PXM Tabs Component

A flexible, accessible tabs component for organizing content into separate panels. Bring your own animation library (GSAP, Anime.js, etc.) or use CSS transitions. This component provides structure and behavior only - all styling is controlled by your CSS.

## Features

✅ **Event-driven animations** – Bring your own animation library (GSAP, Anime.js, etc.) or use CSS transitions  
✅ **Dynamic content support** – Tabs can be added/removed after initialization  
✅ **Essential ARIA management** – Manages functionally necessary ARIA attributes  
✅ **Keyboard navigation** – Arrow keys, Home/End support with focus management  
✅ **State synchronization** – Manual attribute changes automatically sync with component state  
✅ **Copy-paste friendly** – Works in vanilla JS/TS, Webflow, Shopify, Astro, etc.  
✅ **No Shadow DOM** – Full CSS control for consumers  
✅ **Lightweight** – Efficient memory management and performance  

---

## Quick Start

### CDN Usage

```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/tabs.js"></script>

<pxm-tabs initial="features">
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

### NPM/TypeScript Usage

```typescript
import '@pixelmakers/elements/tabs';
import type { PxmTabs } from '@pixelmakers/elements/tabs';

const tabs = document.querySelector('pxm-tabs') as PxmTabs;
```

---

## Keyboard Navigation

- **`Enter` or `Space`** – Activate current tab
- **`ArrowLeft` / `ArrowUp`** – Focus previous tab
- **`ArrowRight` / `ArrowDown`** – Focus next tab  
- **`Home`** – Focus first tab
- **`End`** – Focus last tab

---

## Animation System

The tabs component supports multiple animation approaches:

### Default CSS Transitions

```css
pxm-panel {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

pxm-panel[aria-hidden="false"] {
  opacity: 1;
  transform: translateY(0);
}

pxm-panel[aria-hidden="true"] {
  opacity: 0;
  transform: translateY(10px);
}
```

### Custom Animations with Events

```javascript
const tabs = document.querySelector('pxm-tabs');

// Custom show animation
tabs.addEventListener('pxm:tabs:before-show', (e) => {
  const { panel, tabName, complete } = e.detail;
  e.preventDefault(); // Take control of animation
  
  // Your animation library (GSAP example)
  gsap.fromTo(panel, 
    { opacity: 0, y: 20 }, 
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.3,
      onComplete: complete // Signal animation finished
    }
  );
});

// Custom hide animation
tabs.addEventListener('pxm:tabs:before-hide', (e) => {
  const { panel, tabName, complete } = e.detail;
  e.preventDefault();
  
  gsap.to(panel, { 
    opacity: 0, 
    y: -20, 
    duration: 0.3,
    onComplete: complete
  });
});
```

### Remove Default Animations

```javascript
// When using custom animation libraries
const tabs = document.querySelector('pxm-tabs');
tabs.removeDefaultAnimations();
```

---

## Attributes

| Attribute      | Type   | Default      | Description                                 |
|---------------|--------|--------------|---------------------------------------------|
| `initial`     | string | (first tab)  | ID of the tab to activate initially         |

### Required Data Attributes

- **`data-tab`** – Unique identifier linking triggers to panels (required on both triggers and panels)

---

## Events

| Event | Cancelable | Description |
|-------|------------|-------------|
| `pxm:tabs:before-show` | ✅ | Fired before a panel is shown |
| `pxm:tabs:after-show` | ❌ | Fired after a panel is completely shown |
| `pxm:tabs:before-hide` | ✅ | Fired before a panel is hidden |
| `pxm:tabs:after-hide` | ❌ | Fired after a panel is completely hidden |
| `pxm:tabs:change` | ❌ | Fired when the active tab changes |
| `pxm:tabs:tabs-changed` | ❌ | Fired when tabs are dynamically added/removed |
| `pxm:tabs:state-sync` | ❌ | Fired when internal state syncs with manually changed DOM attributes |

### Event Details

```typescript
// Show/Hide events
interface TabsEventDetail {
  tabName: string;
  panel: HTMLElement;
  trigger: HTMLElement;
  complete: () => void; // Call this to signal animation completion
}

// Change event
interface TabsChangeEventDetail {
  previousTab: string | null;
  activeTab: string;
  panel: HTMLElement;
  trigger: HTMLElement;
}
```

---

## Public API

```typescript
export interface PxmTabs extends HTMLElement {
  // Tab management
  activateTab(tab: string | number): Promise<void>;
  getActiveTab(): string | null;
  getTabNames(): string[];
  
  // Focus management
  focusNextTrigger(currentIndex: number): void;
  focusPreviousTrigger(currentIndex: number): void;
  focusFirstTrigger(): void;
  focusLastTrigger(): void;
  
  // Animation control
  removeDefaultAnimations(): void;
}
```

### Usage Examples

```javascript
const tabs = document.querySelector('pxm-tabs');

// Activate tabs programmatically
await tabs.activateTab('pricing');
await tabs.activateTab(2); // by index

// Get current state
const activeTab = tabs.getActiveTab();
const allTabs = tabs.getTabNames();

// Listen for changes
tabs.addEventListener('pxm:tabs:change', (e) => {
  console.log(`Switched from ${e.detail.previousTab} to ${e.detail.activeTab}`);
});
```

---

## Dynamic Content

Tabs can be added or removed dynamically and the component will automatically reinitialize:

```javascript
const tabs = document.querySelector('pxm-tabs');

// Add new tab
const newTrigger = document.createElement('button');
newTrigger.setAttribute('data-tab', 'new-tab');
newTrigger.textContent = 'New Tab';
tabs.querySelector('pxm-triggers').appendChild(newTrigger);

const newPanel = document.createElement('pxm-panel');
newPanel.setAttribute('data-tab', 'new-tab');
newPanel.innerHTML = '<p>New content</p>';
tabs.appendChild(newPanel);

// Listen for dynamic changes
tabs.addEventListener('pxm:tabs:tabs-changed', (e) => {
  console.log(`Tabs now has ${e.detail.tabCount} tabs`);
});
```

---

## Styling Examples

The component provides structure only - all styling is your responsibility:

```css
/* Basic tab styling */
pxm-tabs {
  display: block;
}

pxm-triggers {
  display: flex;
  border-bottom: 1px solid #ccc;
}

pxm-triggers button {
  padding: 12px 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.2s;
}

pxm-triggers button[aria-selected="true"] {
  background: #007cba;
  color: white;
}

pxm-panel {
  padding: 24px;
}

pxm-panel[aria-hidden="true"] {
  display: none;
}
```

---

## SSR / Hydration Support

```css
/* Prevent hydration flash */
pxm-tabs:not(:defined) pxm-panel {
  display: none;
}

pxm-panel[aria-hidden="true"] {
  display: none;
  opacity: 0;
}

pxm-panel[aria-hidden="false"] {
  display: block;
  opacity: 1;
}
```

---

## ARIA Management

### What the Component Manages

The component automatically manages these ARIA attributes for functionality:

- **`aria-selected`** on triggers (true/false)
- **`aria-hidden`** on panels (true/false)
- **`aria-labelledby`** on panels (links to corresponding trigger)
- **`role`** attributes (tablist, tab, tabpanel)
- **`tabindex`** for keyboard navigation

### What You Should Add

For comprehensive accessibility, consider adding:

```html
<pxm-tabs aria-label="Product information">
  <pxm-triggers>
    <button data-tab="overview" aria-describedby="overview-desc">
      Overview
    </button>
    <button data-tab="features" aria-describedby="features-desc">
      Features  
    </button>
  </pxm-triggers>
  
  <pxm-panel data-tab="overview">
    <div id="overview-desc" class="sr-only">Product overview information</div>
    <h3>Overview</h3>
    <p>Content...</p>
  </pxm-panel>
</pxm-tabs>
```

---

## Platform Integration

### Webflow, Shopify, Astro

Use the minimal markup structure and add your own styling:

```html
<pxm-tabs>
  <pxm-triggers class="tab-nav">
    <button data-tab="tab1" class="tab-button">Tab 1</button>
    <button data-tab="tab2" class="tab-button">Tab 2</button>
  </pxm-triggers>
  
  <pxm-panel data-tab="tab1" class="tab-content">Content 1</pxm-panel>
  <pxm-panel data-tab="tab2" class="tab-content">Content 2</pxm-panel>
</pxm-tabs>
```

### React/Vue/Svelte

Use as a custom element and manage styling in your framework:

```tsx
// React example
import { useEffect, useRef } from 'react';

function TabsExample() {
  const tabsRef = useRef<HTMLElement>();
  
  useEffect(() => {
    const tabs = tabsRef.current;
    
    const handleChange = (e: CustomEvent) => {
      console.log('Tab changed:', e.detail.activeTab);
    };
    
    tabs?.addEventListener('pxm:tabs:change', handleChange);
    return () => tabs?.removeEventListener('pxm:tabs:change', handleChange);
  }, []);
  
  return (
         <pxm-tabs ref={tabsRef} initial="features">
      <pxm-triggers>
        <button data-tab="overview">Overview</button>
        <button data-tab="features">Features</button>
      </pxm-triggers>
      <pxm-panel data-tab="overview">Overview content</pxm-panel>
      <pxm-panel data-tab="features">Features content</pxm-panel>
    </pxm-tabs>
  );
}
```

---

## TypeScript Interfaces

```typescript
export interface PxmTabs extends HTMLElement {
  activateTab(tab: string | number): Promise<void>;
  getActiveTab(): string | null;
  getTabNames(): string[];
  focusNextTrigger(currentIndex: number): void;
  focusPreviousTrigger(currentIndex: number): void;
  focusFirstTrigger(): void;
  focusLastTrigger(): void;
  removeDefaultAnimations(): void;
}

export interface PxmTriggers extends HTMLElement {}
export interface PxmPanel extends HTMLElement {}

export interface TabsEventDetail {
  tabName: string;
  panel: HTMLElement;
  trigger: HTMLElement;
  complete: () => void;
}

export interface TabsChangeEventDetail {
  previousTab: string | null;
  activeTab: string;
  panel: HTMLElement;
  trigger: HTMLElement;
}
```

---

## Browser Support

- Chrome 90+ ✅
- Firefox 90+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

---

## Related Components

- [Accordion](../accordion/README.md) – For collapsible content sections
- [Toggle](../toggle/README.md) – For simple on/off states
- [Modal](../modal/README.md) – For overlay dialogs 