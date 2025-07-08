# PXM Slider Component

A customizable slider component that supports single and multi-thumb ranges, form integration, and keyboard navigation. This component provides structure and behavior only - all styling is controlled by your CSS.

## Features

- ✅ **Single and multi-thumb range selection**
- ✅ **Horizontal and vertical orientation**
- ✅ **Full keyboard navigation** (Arrow keys, Home, End, Page Up/Down)
- ✅ **Form integration** with hidden inputs
- ✅ **Step values** and min/max constraints
- ✅ **Event-driven animation system** for custom animations
- ✅ **CSS-based styling** via state attributes
- ✅ **Dynamic thumb management**
- ✅ **Accessibility** with ARIA support
- ✅ **Lightweight and performant**
- ✅ **Framework agnostic**
- ✅ **No Shadow DOM** - full CSS control

## Installation

```bash
npm install @pixelmakers/elements
```

## Basic Usage

### Simple Slider

```html
<pxm-slider min="0" max="100" value="50">
  <pxm-slider-track>
    <pxm-slider-range></pxm-slider-range>
  </pxm-slider-track>
  <pxm-slider-thumb></pxm-slider-thumb>
</pxm-slider>
```

### Range Slider (Multiple Thumbs)

```html
<pxm-slider min="0" max="100" value="20,80">
  <pxm-slider-track>
    <pxm-slider-range></pxm-slider-range>
  </pxm-slider-track>
  <pxm-slider-thumb></pxm-slider-thumb>
  <pxm-slider-thumb></pxm-slider-thumb>
</pxm-slider>
```

### Vertical Slider

```html
<pxm-slider orientation="vertical" min="0" max="100" value="30">
  <pxm-slider-track>
    <pxm-slider-range></pxm-slider-range>
  </pxm-slider-track>
  <pxm-slider-thumb></pxm-slider-thumb>
</pxm-slider>
```

### Step Values

```html
<pxm-slider min="0" max="100" step="10" value="50">
  <pxm-slider-track>
    <pxm-slider-range></pxm-slider-range>
  </pxm-slider-track>
  <pxm-slider-thumb></pxm-slider-thumb>
</pxm-slider>
```

### Disabled State

```html
<pxm-slider disabled="true" min="0" max="100" value="50">
  <pxm-slider-track>
    <pxm-slider-range></pxm-slider-range>
  </pxm-slider-track>
  <pxm-slider-thumb></pxm-slider-thumb>
</pxm-slider>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `min` | number | `0` | Minimum value |
| `max` | number | `100` | Maximum value |
| `step` | number | `1` | Step increment |
| `value` | string | `'50'` | Current value(s), comma-separated for ranges |
| `orientation` | string | `'horizontal'` | Slider orientation: `horizontal` or `vertical` |
| `disabled` | boolean | `false` | Disable interaction |
| `form` | boolean | `false` | Enable form integration |
| `name` | string | `''` | Form field name (when `form="true"`) |
| `inverted` | boolean | `false` | Invert the direction |

## Events

All events are dispatched with the `pxm:slider:` prefix and include relevant data in the `detail` property.

### Primary Events

| Event | Cancelable | Description |
|-------|------------|-------------|
| `pxm:slider:before-change` | ✅ | Fired before thumb position changes |
| `pxm:slider:after-change` | ❌ | Fired after thumb position changes |
| `pxm:slider:change` | ❌ | Fired when slider value changes |
| `pxm:slider:value-commit` | ❌ | Fired when value is committed (mouseup/keyup) |

### Drag Events

| Event | Description |
|-------|-------------|
| `pxm:slider:thumb-drag-start` | Fired when thumb drag starts |
| `pxm:slider:thumb-drag-end` | Fired when thumb drag ends |

### Event Details

```typescript
// before-change event detail
{
  thumbIndex: number;
  thumbElement: HTMLElement;
  oldValue: number;
  newValue: number;
  percentage: number;
  complete: () => void; // Call to complete animation
}

// change event detail
{
  value: number | number[]; // Single value or array for ranges
  values: number[];         // Always an array
  thumbIndex: number;       // Index of changed thumb
}
```

## JavaScript API

### Properties

```javascript
const slider = document.querySelector('pxm-slider');

// Get/set value(s)
slider.value = 75;           // Single slider
slider.value = [25, 75];     // Range slider
console.log(slider.value);   // Current value(s)

// Get/set properties
slider.min = 0;
slider.max = 200;
slider.step = 5;
slider.disabled = false;
slider.orientation = 'vertical';

// Form integration
slider.form = true;
slider.name = 'volume';
```

### Methods

```javascript
// Thumb management
slider.addThumb(60);           // Add thumb at value 60
slider.removeThumb(1);         // Remove thumb at index 1

// Value management
slider.setValues([10, 50, 90]); // Set multiple values
const values = slider.getValues(); // Get all values as array

// State queries
const isDragging = slider.isDragging();

// Focus management
slider.focusThumb(0);          // Focus first thumb
```

## Styling

The component provides **no default styling** - you have complete control over appearance.

### Basic CSS Styling

```css
/* Container */
pxm-slider {
  position: relative;
  width: 200px;
  height: 20px;
  display: inline-block;
}

/* Track */
pxm-slider-track {
  position: relative;
  top: 50%;
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  transform: translateY(-50%);
}

/* Range (filled portion) */
pxm-slider-range {
  position: absolute;
  height: 100%;
  background: #3b82f6;
  border-radius: inherit;
  transition: all 0.2s ease;
}

/* Thumbs */
pxm-slider-thumb {
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border: 2px solid white;
  border-radius: 50%;
  cursor: grab;
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Thumb states */
pxm-slider-thumb:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

pxm-slider-thumb[data-dragging="true"] {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

pxm-slider-thumb[data-active="true"] {
  border-color: #1d4ed8;
}

/* Disabled state */
pxm-slider[data-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
}

pxm-slider[data-disabled="true"] pxm-slider-thumb {
  cursor: not-allowed;
}

/* Vertical orientation */
pxm-slider[data-orientation="vertical"] {
  width: 20px;
  height: 200px;
}

pxm-slider[data-orientation="vertical"] pxm-slider-track {
  top: 0;
  left: 50%;
  width: 4px;
  height: 100%;
  transform: translateX(-50%);
}

pxm-slider[data-orientation="vertical"] pxm-slider-thumb {
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### Tailwind CSS Example

```html
<pxm-slider 
  class="relative w-48 h-5 inline-block
         data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed
         data-[orientation=vertical]:w-5 data-[orientation=vertical]:h-48"
  min="0" max="100" value="50">
  
  <pxm-slider-track class="relative top-1/2 w-full h-1 bg-gray-300 rounded-full transform -translate-y-1/2
                           data-[orientation=vertical]:top-0 data-[orientation=vertical]:left-1/2 
                           data-[orientation=vertical]:w-1 data-[orientation=vertical]:h-full 
                           data-[orientation=vertical]:transform data-[orientation=vertical]:-translate-x-1/2">
    
    <pxm-slider-range class="absolute h-full bg-blue-500 rounded-full transition-all duration-200"></pxm-slider-range>
  </pxm-slider-track>
  
  <pxm-slider-thumb class="absolute top-1/2 w-5 h-5 bg-blue-500 border-2 border-white rounded-full 
                           cursor-grab transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200
                           shadow-md hover:scale-110 data-[dragging=true]:cursor-grabbing 
                           data-[dragging=true]:scale-120 data-[dragging=true]:shadow-lg
                           data-[active=true]:border-blue-700
                           data-[orientation=vertical]:left-1/2"></pxm-slider-thumb>
</pxm-slider>
```

### State Attributes for Styling

Target these data attributes for styling (not ARIA attributes):

- `data-orientation="horizontal|vertical"` - Slider orientation
- `data-disabled="true"` - Disabled state
- `data-min`, `data-max`, `data-step` - Configuration values
- `data-inverted="true"` - Inverted direction
- `data-dragging="true"` - Thumb being dragged (on thumb elements)
- `data-active="true"` - Active/focused thumb (on thumb elements)
- `data-value` - Current thumb value (on thumb elements)

## Form Integration

### Standard Form Usage

```html
<form id="settings-form">
  <!-- Single value -->
  <pxm-slider form="true" name="volume" min="0" max="100" value="75">
    <pxm-slider-track>
      <pxm-slider-range></pxm-slider-range>
    </pxm-slider-track>
    <pxm-slider-thumb></pxm-slider-thumb>
  </pxm-slider>
  
  <!-- Range values (creates volume[0] and volume[1]) -->
  <pxm-slider form="true" name="eq_range" min="20" max="20000" value="200,8000">
    <pxm-slider-track>
      <pxm-slider-range></pxm-slider-range>
    </pxm-slider-track>
    <pxm-slider-thumb></pxm-slider-thumb>
    <pxm-slider-thumb></pxm-slider-thumb>
  </pxm-slider>
  
  <button type="submit">Save Settings</button>
</form>

<script>
document.getElementById('settings-form').addEventListener('submit', (e) => {
  const formData = new FormData(e.target);
  console.log('Volume:', formData.get('volume'));
  console.log('EQ Range:', formData.getAll('eq_range[]'));
});
</script>
```

### Validation Example

```javascript
const slider = document.querySelector('pxm-slider[name="price_range"]');

slider.addEventListener('pxm:slider:value-commit', (e) => {
  const [min, max] = e.detail.values;
  
  if (max - min < 10) {
    console.warn('Price range must be at least $10');
    // Could show error state or reset values
  }
});
```

## Advanced Usage

### Custom Animation with GSAP

```javascript
const slider = document.querySelector('pxm-slider');

// Override default animations
slider.addEventListener('pxm:slider:before-change', (e) => {
  const { thumbElement, percentage, complete } = e.detail;
  e.preventDefault(); // Take over animation
  
  const isVertical = slider.getAttribute('data-orientation') === 'vertical';
  const position = percentage * 100;
  
  gsap.to(thumbElement, {
    [isVertical ? 'top' : 'left']: position + '%',
    duration: 0.3,
    ease: "power2.out",
    onComplete: complete
  });
});
```

### Dynamic Thumb Management

```javascript
const slider = document.querySelector('pxm-slider');

// Add thumb at runtime
document.getElementById('add-thumb').addEventListener('click', () => {
  const randomValue = Math.random() * 100;
  slider.addThumb(randomValue);
});

// Remove last thumb
document.getElementById('remove-thumb').addEventListener('click', () => {
  const thumbCount = slider.getValues().length;
  if (thumbCount > 1) {
    slider.removeThumb(thumbCount - 1);
  }
});

// Listen for changes
slider.addEventListener('pxm:slider:change', (e) => {
  console.log('Current values:', e.detail.values);
  updateUI(e.detail.values);
});
```

### Synchronized Sliders

```javascript
const slider1 = document.getElementById('slider1');
const slider2 = document.getElementById('slider2');

slider1.addEventListener('pxm:slider:change', (e) => {
  slider2.value = e.detail.value;
});

slider2.addEventListener('pxm:slider:change', (e) => {
  slider1.value = e.detail.value;
});
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `←` / `↓` | Decrease by step |
| `→` / `↑` | Increase by step |
| `Home` | Set to minimum |
| `End` | Set to maximum |
| `Page Down` | Decrease by 10 steps |
| `Page Up` | Increase by 10 steps |

## Accessibility

The component implements the dual-attribute pattern:

- **ARIA attributes** (aria-valuemin, aria-valuemax, aria-valuenow, aria-disabled) for screen readers
- **Data attributes** (data-orientation, data-disabled, data-dragging) for CSS styling

### ARIA Labels

Add appropriate labels for screen readers:

```html
<label id="volume-label">Volume Control</label>
<pxm-slider aria-labelledby="volume-label" min="0" max="100" value="50">
  <pxm-slider-track>
    <pxm-slider-range></pxm-slider-range>
  </pxm-slider-track>
  <pxm-slider-thumb></pxm-slider-thumb>
</pxm-slider>

<!-- Or use aria-label directly -->
<pxm-slider aria-label="Temperature setting" min="16" max="30" value="22">
  <pxm-slider-track>
    <pxm-slider-range></pxm-slider-range>
  </pxm-slider-track>
  <pxm-slider-thumb></pxm-slider-thumb>
</pxm-slider>
```

## Framework Integration

### React

```jsx
import { useEffect, useRef, useState } from 'react';

function VolumeSlider({ value, onChange }) {
  const sliderRef = useRef();
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    const slider = sliderRef.current;
    
    const handleChange = (e) => {
      setCurrentValue(e.detail.value);
      onChange?.(e.detail.value);
    };
    
    slider.addEventListener('pxm:slider:change', handleChange);
    return () => slider.removeEventListener('pxm:slider:change', handleChange);
  }, [onChange]);

  useEffect(() => {
    if (sliderRef.current && value !== currentValue) {
      sliderRef.current.value = value;
    }
  }, [value, currentValue]);

  return (
    <pxm-slider ref={sliderRef} min="0" max="100" value={value.toString()}>
      <pxm-slider-track>
        <pxm-slider-range />
      </pxm-slider-track>
      <pxm-slider-thumb />
    </pxm-slider>
  );
}
```

### Vue

```vue
<template>
  <pxm-slider 
    ref="slider"
    :min="min"
    :max="max"
    :value="value.toString()"
    @pxm:slider:change="handleChange">
    <pxm-slider-track>
      <pxm-slider-range />
    </pxm-slider-track>
    <pxm-slider-thumb />
  </pxm-slider>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['value', 'min', 'max']);
const emit = defineEmits(['update:value']);

const slider = ref();

const handleChange = (e) => {
  emit('update:value', e.detail.value);
};

watch(() => props.value, (newValue) => {
  if (slider.value && newValue !== slider.value.value) {
    slider.value.value = newValue;
  }
});
</script>
```

### Angular

```typescript
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-slider',
  template: `
    <pxm-slider #slider [attr.min]="min" [attr.max]="max" [attr.value]="value">
      <pxm-slider-track>
        <pxm-slider-range></pxm-slider-range>
      </pxm-slider-track>
      <pxm-slider-thumb></pxm-slider-thumb>
    </pxm-slider>
  `
})
export class SliderComponent {
  @Input() value: number = 50;
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Output() valueChange = new EventEmitter<number>();

  @ViewChild('slider') slider!: ElementRef;

  ngAfterViewInit() {
    this.slider.nativeElement.addEventListener('pxm:slider:change', (e: any) => {
      this.valueChange.emit(e.detail.value);
    });
  }
}
```

## Browser Support

- ✅ Chrome 63+
- ✅ Firefox 58+
- ✅ Safari 13+
- ✅ Edge 79+

## Performance

- **Lightweight**: ~8KB minified
- **No dependencies**: Pure vanilla JavaScript
- **Efficient updates**: Only affected elements are updated
- **Memory safe**: Proper cleanup on disconnect
- **Responsive**: Built-in ResizeObserver support

## License

MIT 