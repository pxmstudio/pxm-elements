# PXM Tooltip Component

A flexible, accessible tooltip component that provides rich hover and focus interactions with customizable positioning and animations.

## Features

- **Multi-position support**: Top, bottom, left, right with smart viewport-aware flipping
- **Configurable delays**: Separate delays for showing and hiding (default: 700ms open, 300ms close)
- **Keyboard accessible**: Escape key support, proper focus management
- **Portal rendering**: Optional portal mode for complex z-index scenarios
- **Event-driven architecture**: Rich event system for custom animations and behaviors
- **Responsive positioning**: ResizeObserver integration for dynamic content
- **State management**: Data attributes for CSS targeting and accessibility
- **Arrow support**: Optional arrow element with automatic positioning

## Required CSS

**Important**: This component provides behavior and positioning calculations only. You must provide ALL CSS including show/hide behavior and positioning.

The component manages state and provides positioning data via:
- **State**: `data-state="open"` when tooltip is visible, `data-state="closed"` when hidden  
- **Side**: `data-side="top|bottom|left|right"` for positioning context
- **Positioning**: CSS custom properties `--tooltip-top`, `--tooltip-left`, and `--tooltip-position-type`
- **Arrow**: CSS custom properties `--arrow-top` and `--arrow-left` for arrow positioning
- **Disabled**: `data-disabled="true"` when tooltip is disabled

**Essential CSS for show/hide and positioning:**

```css
/* Essential: Hide tooltip content by default */
pxm-tooltip-content[data-state="closed"] {
  display: none;
}

/* Essential: Show and position tooltip content when open */
pxm-tooltip-content[data-state="open"] {
  display: block;
  position: var(--tooltip-position-type, absolute);
  top: var(--tooltip-top, 0);
  left: var(--tooltip-left, 0);
}

/* Essential: Arrow positioning */
pxm-tooltip-arrow[data-side="top"],
pxm-tooltip-arrow[data-side="bottom"] {
  left: var(--arrow-left, 50%);
}

pxm-tooltip-arrow[data-side="left"],
pxm-tooltip-arrow[data-side="right"] {
  top: var(--arrow-top, 50%);
}
```

**Complete example with styling:**

```css
/* Hide tooltip content by default */
pxm-tooltip-content[data-state="closed"] {
  display: none;
}

/* Show and position tooltip content when open */
pxm-tooltip-content[data-state="open"] {
  display: block;
  position: var(--tooltip-position-type, absolute);
  top: var(--tooltip-top, 0);
  left: var(--tooltip-left, 0);
}

/* Basic tooltip styling */
pxm-tooltip-content {
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  max-width: 200px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}

/* Arrow styling */
pxm-tooltip-arrow {
  width: 8px;
  height: 8px;
  background: #333;
  transform: rotate(45deg);
  position: absolute;
}

/* Arrow positioning */
pxm-tooltip-arrow[data-side="top"] {
  bottom: -4px;
  left: var(--arrow-left, 50%);
  transform: translateX(-50%) rotate(45deg);
}

pxm-tooltip-arrow[data-side="bottom"] {
  top: -4px;
  left: var(--arrow-left, 50%);
  transform: translateX(-50%) rotate(45deg);
}

pxm-tooltip-arrow[data-side="left"] {
  right: -4px;
  top: var(--arrow-top, 50%);
  transform: translateY(-50%) rotate(45deg);
}

pxm-tooltip-arrow[data-side="right"] {
  left: -4px;
  top: var(--arrow-top, 50%);
  transform: translateY(-50%) rotate(45deg);
}

/* Smooth animations */
pxm-tooltip-content[data-state="open"] {
  opacity: 1;
  transform: scale(1);
}

pxm-tooltip-content[data-state="closed"] {
  opacity: 0;
  transform: scale(0.95);
}

/* Alternative: CSS animations */
pxm-tooltip-content[data-state="open"] {
  animation: tooltipShow 200ms ease-out;
}

@keyframes tooltipShow {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

## Basic Usage

```html
<pxm-tooltip side="top" delay-open="500">
  <pxm-tooltip-trigger>
    <button>Hover me</button>
  </pxm-tooltip-trigger>
  <pxm-tooltip-content>
    This is a helpful tooltip message
    <pxm-tooltip-arrow></pxm-tooltip-arrow>
  </pxm-tooltip-content>
</pxm-tooltip>
```

## Advanced Examples

```html
<!-- Simple tooltip without arrow -->
<pxm-tooltip>
  <pxm-tooltip-trigger>
    <span>Help icon</span>
  </pxm-tooltip-trigger>
  <pxm-tooltip-content>
    This is a helpful tooltip!
  </pxm-tooltip-content>
</pxm-tooltip>

<!-- Positioned tooltip with custom delays -->
<pxm-tooltip side="bottom" delay-open="300" delay-close="100">
  <pxm-tooltip-trigger>
    <button>Info button</button>
  </pxm-tooltip-trigger>
  <pxm-tooltip-content>
    <p>Detailed help information here.</p>
    <pxm-tooltip-arrow></pxm-tooltip-arrow>
  </pxm-tooltip-content>
</pxm-tooltip>

<!-- Portal rendering (renders in document.body for z-index control) -->
<pxm-tooltip portal="true" side="left">
  <pxm-tooltip-trigger>
    <button>Portal tooltip</button>
  </pxm-tooltip-trigger>
  <pxm-tooltip-content>
    Portal tooltip content
    <pxm-tooltip-arrow></pxm-tooltip-arrow>
  </pxm-tooltip-content>
</pxm-tooltip>

<!-- Disabled tooltip -->
<pxm-tooltip disabled="true">
  <pxm-tooltip-trigger>
    <button>Disabled trigger</button>
  </pxm-tooltip-trigger>
  <pxm-tooltip-content>
    This won't show
  </pxm-tooltip-content>
</pxm-tooltip>
```

## Component Structure

The tooltip system consists of four custom elements:

- `<pxm-tooltip>` - Main container that manages state and behavior
- `<pxm-tooltip-trigger>` - Element that triggers the tooltip on hover/focus
- `<pxm-tooltip-content>` - The actual tooltip content panel
- `<pxm-tooltip-arrow>` - Optional arrow pointing to the trigger

## Attributes

### Main Component (`<pxm-tooltip>`)

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `side` | string | `"top"` | Position of tooltip relative to trigger: `"top"`, `"bottom"`, `"left"`, `"right"` |
| `delay-open` | number | `700` | Delay in milliseconds before showing tooltip |
| `delay-close` | number | `300` | Delay in milliseconds before hiding tooltip |
| `disabled` | boolean | `false` | Disables the tooltip |
| `portal` | boolean | `false` | Renders tooltip content in document.body for z-index management |
| `open` | boolean | `false` | Controls tooltip visibility programmatically |

## JavaScript API

```javascript
const tooltip = document.querySelector('pxm-tooltip');

// Properties
tooltip.open = true;              // Show/hide tooltip
tooltip.side = 'bottom';          // Change position
tooltip.disabled = false;         // Enable/disable

// Methods
await tooltip.showTooltip();     // Programmatically show
await tooltip.hideTooltip();     // Programmatically hide
tooltip.isAnimating();           // Check animation state
tooltip.removeDefaultAnimations(); // Disable defaults for custom animations

// Events
tooltip.addEventListener('pxm:tooltip:show', (e) => {
  console.log('Tooltip shown');
});

tooltip.addEventListener('pxm:tooltip:hide', (e) => {
  console.log('Tooltip hidden');
});
```

## Styling

### Basic CSS Example

```css
/* Tooltip content styling */
pxm-tooltip-content {
  position: absolute;
  z-index: 1000;
  padding: 8px 12px;
  background: #333;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  max-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  /* Animation */
  transition: all 0.2s ease;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-4px);
}

/* Open state */
pxm-tooltip-content[data-state="open"] {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

/* Position-specific transforms */
pxm-tooltip[data-side="top"] pxm-tooltip-content {
  transform: translateY(-4px);
}

pxm-tooltip[data-side="bottom"] pxm-tooltip-content {
  transform: translateY(4px);
}

pxm-tooltip[data-side="left"] pxm-tooltip-content {
  transform: translateX(-4px);
}

pxm-tooltip[data-side="right"] pxm-tooltip-content {
  transform: translateX(4px);
}

/* Arrow styling */
pxm-tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;
}

/* Arrow positions */
pxm-tooltip[data-side="top"] pxm-tooltip-arrow {
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  border-top-color: #333;
  border-bottom: 0;
}

pxm-tooltip[data-side="bottom"] pxm-tooltip-arrow {
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: #333;
  border-top: 0;
}

pxm-tooltip[data-side="left"] pxm-tooltip-arrow {
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: #333;
  border-right: 0;
}

pxm-tooltip[data-side="right"] pxm-tooltip-arrow {
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: #333;
  border-left: 0;
}

/* Disabled state */
pxm-tooltip[data-disabled="true"] pxm-tooltip-trigger {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Tailwind CSS Example

```html
<pxm-tooltip class="group">
  <pxm-tooltip-trigger>
    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
      Hover me
    </button>
  </pxm-tooltip-trigger>
  <pxm-tooltip-content 
    class="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded shadow-lg max-w-xs
           transition-all duration-200 ease-out opacity-0 pointer-events-none
           data-[state=open]:opacity-100 data-[state=open]:pointer-events-auto
           data-[side=top]:-translate-y-1 data-[side=bottom]:translate-y-1
           data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1">
    This tooltip provides helpful information about the button
    <pxm-tooltip-arrow 
      class="absolute w-0 h-0 border-4 border-transparent
             data-[side=top]:border-t-gray-900 data-[side=top]:border-b-0 data-[side=top]:bottom-[-8px] data-[side=top]:left-1/2 data-[side=top]:-translate-x-1/2
             data-[side=bottom]:border-b-gray-900 data-[side=bottom]:border-t-0 data-[side=bottom]:top-[-8px] data-[side=bottom]:left-1/2 data-[side=bottom]:-translate-x-1/2
             data-[side=left]:border-l-gray-900 data-[side=left]:border-r-0 data-[side=left]:right-[-8px] data-[side=left]:top-1/2 data-[side=left]:-translate-y-1/2
             data-[side=right]:border-r-gray-900 data-[side=right]:border-l-0 data-[side=right]:left-[-8px] data-[side=right]:top-1/2 data-[side=right]:-translate-y-1/2">
    </pxm-tooltip-arrow>
  </pxm-tooltip-content>
</pxm-tooltip>
```

## Custom Animations

### Using GSAP

```javascript
const tooltip = document.querySelector('pxm-tooltip');

// Remove default animations
tooltip.removeDefaultAnimations();

tooltip.addEventListener('pxm:tooltip:before-show', (e) => {
  const { content, complete } = e.detail;
  e.preventDefault(); // Take over the animation
  
  gsap.fromTo(content, {
    opacity: 0,
    scale: 0.8,
    y: -10
  }, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.2,
    ease: "back.out(1.7)",
    onComplete: () => {
      complete(); // Signal animation complete
    }
  });
});

tooltip.addEventListener('pxm:tooltip:before-hide', (e) => {
  const { content, complete } = e.detail;
  e.preventDefault(); // Take over the animation
  
  gsap.to(content, {
    opacity: 0,
    scale: 0.9,
    y: -5,
    duration: 0.15,
    ease: "power2.in",
    onComplete: () => {
      complete(); // Signal animation complete
    }
  });
});
```

### Using CSS Animations

```css
/* Define keyframes */
@keyframes tooltipShow {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes tooltipHide {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.9) translateY(-5px);
  }
}

/* Apply animations */
pxm-tooltip-content[data-state="open"] {
  animation: tooltipShow 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

pxm-tooltip-content[data-state="closed"] {
  animation: tooltipHide 0.15s ease-in;
}
```

## Events

All events bubble and include relevant details:

| Event | Cancelable | Description | Detail Properties |
|-------|------------|-------------|-------------------|
| `pxm:tooltip:before-show` | ✅ | Before tooltip shows | `content`, `trigger`, `element`, `complete()` |
| `pxm:tooltip:after-show` | ❌ | After tooltip shows | `content`, `trigger`, `element`, `open` |
| `pxm:tooltip:show` | ❌ | Tooltip shown (compatibility) | `content`, `trigger`, `element`, `open` |
| `pxm:tooltip:before-hide` | ✅ | Before tooltip hides | `content`, `trigger`, `element`, `complete()` |
| `pxm:tooltip:after-hide` | ❌ | After tooltip hides | `content`, `trigger`, `element`, `open` |
| `pxm:tooltip:hide` | ❌ | Tooltip hidden (compatibility) | `content`, `trigger`, `element`, `open` |

## Advanced Usage

### Portal Rendering

For complex layouts with z-index issues, use portal rendering:

```html
<pxm-tooltip portal="true">
  <pxm-tooltip-trigger>
    <button>Button in complex layout</button>
  </pxm-tooltip-trigger>
  <pxm-tooltip-content>
    This will render in document.body
  </pxm-tooltip-content>
</pxm-tooltip>
```

### Dynamic Content

```javascript
// Update content dynamically
const content = tooltip.querySelector('pxm-tooltip-content');
content.innerHTML = 'New tooltip content';

// Change position dynamically
tooltip.side = 'bottom';

// Control programmatically
tooltip.open = true;
setTimeout(() => {
  tooltip.open = false;
}, 2000);
```

### Multiple Triggers

```html
<pxm-tooltip>
  <pxm-tooltip-trigger>
    <button>Button 1</button>
    <button>Button 2</button>
    <span>Hoverable text</span>
  </pxm-tooltip-trigger>
  <pxm-tooltip-content>
    Shared tooltip for multiple elements
  </pxm-tooltip-content>
</pxm-tooltip>
```

## Accessibility

The tooltip component implements proper accessibility patterns:

- **ARIA relationships**: Uses `aria-describedby` to link trigger and content
- **Keyboard support**: Escape key closes tooltip when focused
- **Focus management**: Tooltips show on focus and hide on blur
- **Screen reader support**: Content has `role="tooltip"`
- **Dual attributes**: Uses both ARIA attributes (for accessibility) and data attributes (for styling)

### Additional ARIA Labels

Add labels as needed for your use case:

```html
<pxm-tooltip>
  <pxm-tooltip-trigger>
    <button aria-label="Help information">?</button>
  </pxm-tooltip-trigger>
  <pxm-tooltip-content>
    Detailed help text here
  </pxm-tooltip-content>
</pxm-tooltip>
```

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- IE 11+ (with polyfills for custom elements)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Notes

- **No Shadow DOM**: Lighter performance profile, better CSS integration
- **Efficient positioning**: Uses ResizeObserver for smart repositioning
- **Memory management**: Proper cleanup of observers and timeouts
- **Portal optimization**: Only creates portal container when needed

## Common Patterns

### Form Field Help

```html
<div class="form-field">
  <label for="username">Username</label>
  <pxm-tooltip side="right">
    <pxm-tooltip-trigger>
      <input type="text" id="username" name="username">
    </pxm-tooltip-trigger>
    <pxm-tooltip-content>
      Username must be 3-20 characters, letters and numbers only
    </pxm-tooltip-content>
  </pxm-tooltip>
</div>
```

### Icon Tooltips

```html
<pxm-tooltip side="top" delay-open="300">
  <pxm-tooltip-trigger>
    <button class="icon-button" aria-label="Delete item">
      <svg><!-- delete icon --></svg>
    </button>
  </pxm-tooltip-trigger>
  <pxm-tooltip-content>
    Delete this item permanently
  </pxm-tooltip-content>
</pxm-tooltip>
```

### Rich Content Tooltips

```html
<pxm-tooltip side="bottom" delay-close="500">
  <pxm-tooltip-trigger>
    <img src="user-avatar.jpg" alt="User avatar">
  </pxm-tooltip-trigger>
  <pxm-tooltip-content>
    <div class="user-tooltip">
      <h4>John Doe</h4>
      <p>Senior Developer</p>
      <p>john@example.com</p>
    </div>
  </pxm-tooltip-content>
</pxm-tooltip>
``` 