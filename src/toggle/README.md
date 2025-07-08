# Toggle Component

A flexible, accessible toggle/switch component for boolean states with built-in form integration. This component provides structure and behavior only - all styling is controlled by your CSS.

## Features

✅ **Logic-Only Design** - No Shadow DOM, complete styling freedom  
✅ **Event-Driven Animations** - Bring your own animation library (GSAP, Anime.js, etc.)  
✅ **Form Integration** - Seamless form submission with hidden input  
✅ **Keyboard Support** - Full keyboard navigation (Enter, Space)  
✅ **Lightweight** - Minimal overhead, maximum performance  
✅ **TypeScript Ready** - Full type definitions included  

## Quick Start

### CDN Usage

```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/toggle.js"></script>

<label>
    <pxm-toggle form="true" name="notifications"></pxm-toggle>
    Enable notifications
</label>

<label>
    <pxm-toggle form="true" name="marketing" pressed="true"></pxm-toggle>
    Subscribe to marketing emails
</label>
```

### NPM Usage

```typescript
import '@pixelmakers/elements/toggle';

// With TypeScript support
import type { PxmToggle } from '@pixelmakers/elements/toggle';

const toggle = document.querySelector('pxm-toggle') as PxmToggle;
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `pressed` | boolean | `false` | Whether the toggle is in the "on" state |
| `disabled` | boolean | `false` | Whether the toggle is disabled |
| `form` | boolean | `false` | Enable form integration with hidden input |
| `name` | string | `""` | Form field name (only used when form="true") |

## HTML Structure

```html
<!-- Basic toggle -->
<pxm-toggle aria-label="Toggle feature"></pxm-toggle>

<!-- Pre-pressed toggle -->
<pxm-toggle pressed="true" aria-label="Toggle feature"></pxm-toggle>

<!-- Disabled toggle -->
<pxm-toggle disabled="true" aria-label="Toggle feature"></pxm-toggle>

<!-- Form integration toggle -->
<pxm-toggle 
  form="true" 
  name="feature"
  aria-label="Enable advanced features"
  aria-describedby="feature-description">
</pxm-toggle>
<p id="feature-description">This will enable beta features</p>
```

## Styling

### Key Principle: You Control ALL Styling

The toggle component provides **zero visual styling**. You have complete control over appearance using CSS. The component only manages functional states via data attributes.

### State Attributes for CSS Targeting

```css
/* Target on/off state */
pxm-toggle[data-state="on"] { /* your on styles */ }
pxm-toggle[data-state="off"] { /* your off styles */ }



/* Target disabled state */
pxm-toggle[data-disabled="true"] { /* your disabled styles */ }

/* Focus styles (consumer's responsibility) */
pxm-toggle:focus { /* your focus styles */ }
```

### Example Designs

#### Basic Switch

```css
pxm-toggle {
    display: inline-block;
    width: 48px;
    height: 24px;
    background: #cbd5e1;
    border-radius: 24px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s ease;
    outline: none;
}

pxm-toggle:focus {
    box-shadow: 0 0 0 2px #3b82f6;
}

pxm-toggle[data-state="on"] {
    background: #3b82f6;
}

pxm-toggle[data-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Toggle knob using pseudo-element */
pxm-toggle::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

pxm-toggle[data-state="on"]::before {
    transform: translateX(24px);
}
```

#### iOS-Style Toggle

```css
pxm-toggle {
    display: inline-block;
    width: 51px;
    height: 31px;
    background: #e5e7eb;
    border-radius: 31px;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
}

pxm-toggle[data-state="on"] {
    background: #34d399;
}

pxm-toggle::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 27px;
    height: 27px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
}

pxm-toggle[data-state="on"]::before {
    transform: translateX(20px);
}
```

### Tailwind CSS

```html
<pxm-toggle class="relative inline-block w-12 h-6 bg-gray-300 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=on]:bg-blue-500 data-[disabled=true]:opacity-50">
</pxm-toggle>

<style>
pxm-toggle::before {
    content: '';
    @apply absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out;
}

pxm-toggle[data-state="on"]::before {
    @apply translate-x-6;
}
</style>
```

## Events

The toggle component uses the PXM event naming convention and provides comprehensive event hooks:

### Event Types

| Event | Cancelable | Description |
|-------|------------|-------------|
| `pxm:toggle:before-change` | ✅ | Fired before toggle state changes. Perfect for custom animations. |
| `pxm:toggle:after-change` | ❌ | Fired after toggle state changes. |
| `pxm:toggle:pressed-change` | ❌ | Fired when toggle state changes. |

### Event Details

```typescript
// pxm:toggle:before-change
interface ToggleEventDetail {
  pressed: boolean;      // New state
  element: HTMLElement;  // The toggle element
  complete: () => void;  // Call when animation completes
}

// pxm:toggle:pressed-change  
interface TogglePressedChangeEventDetail {
  pressed: boolean;      // New state
  element: HTMLElement; // The toggle element
}
```

## Animation System

### Bring Your Own Animation Library (Recommended)

The component's event system allows you to integrate any animation library:

#### With GSAP

```javascript
const toggle = document.querySelector('pxm-toggle');

toggle.addEventListener('pxm:toggle:before-change', (e) => {
    const { element, pressed, complete } = e.detail;
    e.preventDefault(); // Take over the animation
    
    // Custom toggle animation
    gsap.to(element, {
        scale: pressed ? 1.1 : 1.0,
        duration: 0.2,
        ease: "back.out(1.7)",
        onComplete: () => {
            complete(); // Signal animation complete
        }
    });
});
```

#### With Anime.js

```javascript
toggle.addEventListener('pxm:toggle:before-change', (e) => {
    const { element, pressed, complete } = e.detail;
    e.preventDefault();
    
    anime({
        targets: element,
        scale: pressed ? [1, 1.1, 1] : [1, 0.9, 1],
        duration: 300,
        easing: 'easeOutElastic(1, .6)',
        complete: () => complete()
    });
});
```

### CSS Transitions

The component uses simple state changes that work perfectly with CSS transitions:

```css
pxm-toggle {
    transition: all 0.3s ease;
}

pxm-toggle[data-state="on"] {
    background-color: #3b82f6;
}
```

## Accessibility

### What the Component Manages

The toggle automatically provides essential ARIA attributes:

- `role="button"` - Indicates button behavior  
- `aria-pressed` - Current state (true/false)
- `aria-disabled` - Disabled state (when applicable)
- `tabindex` - Keyboard navigation (0 when enabled, -1 when disabled)

### What You Should Add

Additional accessibility is your responsibility:

```html
<!-- Labels and descriptions -->
<pxm-toggle 
    form="true"
    name="notifications"
    aria-label="Enable email notifications"
    aria-describedby="notification-help">
</pxm-toggle>
<div id="notification-help">
    Get notified about important updates via email
</div>

<!-- Or use a label element -->
<label>
    <pxm-toggle form="true" name="marketing"></pxm-toggle>
    Subscribe to marketing emails
</label>
```

### Keyboard Support

- **Enter** - Toggle the switch
- **Space** - Toggle the switch
- **Tab** - Navigate to/from the toggle (when enabled)

## Form Integration

The toggle works seamlessly with forms using a hidden input:

```html
<form id="settings-form">
    <fieldset>
        <legend>Notification Settings</legend>
        
        <label>
            <pxm-toggle form="true" name="email_notifications"></pxm-toggle>
            Email notifications
        </label>
        
        <label>
            <pxm-toggle form="true" name="push_notifications" pressed="true"></pxm-toggle>
            Push notifications
        </label>
    </fieldset>
    
    <button type="submit">Save Settings</button>
</form>

<script>
document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // FormData will contain:
    // email_notifications: "enabled" (if checked) or "" (if unchecked)
    // push_notifications: "enabled" (if checked)
    
    console.log(Object.fromEntries(formData));
});
</script>
```

## JavaScript API

### Properties

```typescript
const toggle = document.querySelector('pxm-toggle') as PxmToggle;

// Read/write state
console.log(toggle.pressed);    // boolean
console.log(toggle.disabled);   // boolean
console.log(toggle.form);       // boolean
console.log(toggle.name);       // string

// Set state
toggle.pressed = true;
toggle.disabled = false;
toggle.form = true;
toggle.name = "feature";
```

### Methods

```typescript
// Programmatically toggle
await toggle.performToggle();

// Check if animating
if (toggle.isAnimating()) {
    console.log('Toggle is currently animating');
}
```

### Event Listening

```javascript
// Listen for state changes
toggle.addEventListener('pxm:toggle:pressed-change', (e) => {
    console.log('Toggle changed:', {
        pressed: e.detail.pressed
    });
});

// Listen for before/after events
toggle.addEventListener('pxm:toggle:before-change', (e) => {
    console.log('About to change to:', e.detail.pressed);
});

toggle.addEventListener('pxm:toggle:after-change', (e) => {
    console.log('Changed to:', e.detail.pressed);
});
```

## Examples

### Settings Panel

```html
<div class="settings-panel">
    <h3>Privacy Settings</h3>
    
    <div class="setting-row">
        <div class="setting-info">
            <strong>Profile Visibility</strong>
            <p>Make your profile visible to other users</p>
        </div>
        <pxm-toggle form="true" name="profile_visible" pressed="true"></pxm-toggle>
    </div>
    
    <div class="setting-row">
        <div class="setting-info">
            <strong>Activity Status</strong>
            <p>Show when you're online</p>
        </div>
        <pxm-toggle form="true" name="activity_status"></pxm-toggle>
    </div>
</div>
```

### React Integration

```jsx
import { useEffect, useState } from 'react';

function ToggleExample() {
    const [settings, setSettings] = useState({
        notifications: false,
        darkMode: true
    });
    
    useEffect(() => {
        import('@pixelmakers/elements/toggle');
    }, []);
    
    const handleToggleChange = (event) => {
        const { name } = event.target;
        const { pressed } = event.detail;
        
        setSettings(prev => ({
            ...prev,
            [name]: pressed
        }));
    };
    
    return (
        <div>
            <label>
                <pxm-toggle 
                    form="true"
                    name="notifications"
                    pressed={settings.notifications}
                    onpxm:toggle:pressed-change={handleToggleChange}
                />
                Enable notifications
            </label>
        </div>
    );
}
```

### Vue Integration

```vue
<template>
  <div>
    <label>
      <pxm-toggle 
        name="feature"
        value="enabled"
        :checked="isEnabled"
        @pxm:toggle:change="handleChange"
      />
      Enable feature
    </label>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEnabled: false
    };
  },
  mounted() {
    import('@pixelmakers/elements/toggle');
  },
  methods: {
    handleChange(event) {
      this.isEnabled = event.detail.checked;
    }
  }
};
</script>
```

## SSR and Hydration

### Preventing Hydration Flash

```css
/* Hide undefined elements */
pxm-toggle:not(:defined) {
    opacity: 0;
}

/* Show when defined */
pxm-toggle {
    opacity: 1;
    transition: opacity 0.1s ease;
}

/* Set initial state styles */
pxm-toggle[data-state="checked"] {
    /* Your checked styles */
}

pxm-toggle[data-state="unchecked"] {
    /* Your unchecked styles */
}
```

### Server-Side Rendering

```html
<!-- Server-rendered with initial state -->
<pxm-toggle 
    name="feature" 
    value="enabled" 
    checked="true"
    data-state="checked">
</pxm-toggle>
```

## Platform Integration

### Webflow

```html
<!-- In page head -->
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/toggle.js"></script>

<!-- In embed element -->
<label class="toggle-wrapper">
    <pxm-toggle name="newsletter" value="subscribed"></pxm-toggle>
    <span>Subscribe to newsletter</span>
</label>
```

### Shopify

```liquid
<!-- In theme.liquid -->
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/toggle.js"></script>

<!-- In templates -->
<form action="/account/preferences" method="post">
    <label>
        <pxm-toggle 
            name="email_marketing" 
            value="true"
            {% if customer.accepts_marketing %}checked="true"{% endif %}>
        </pxm-toggle>
        Receive marketing emails
    </label>
    
    <button type="submit">Save Preferences</button>
</form>
```

## Browser Support

- Chrome 90+ ✅
- Firefox 90+ ✅  
- Safari 14+ ✅
- Edge 90+ ✅

## Related Components

- [Accordion](../accordion/README.md) - For collapsible content sections
- [Tabs](../tabs/README.md) - For switching between content panels
- [Number Input](../number-input/README.md) - For numeric input controls 