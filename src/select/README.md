# PXM Select Component

A flexible, accessible select component that provides dropdown functionality with single and multiple selection support. This component provides structure and behavior only - all styling is controlled by your CSS.

## Features

- 🎯 Single and multiple selection modes
- ⌨️ Full keyboard navigation (arrow keys, home/end, enter/space, escape)
- 🔍 Type-ahead search functionality  
- 🔄 Dynamic content support (items can be added/removed after initialization)
- 🎨 Event-driven animation system (bring your own animation library)
- ♿ Accessibility-first design with proper ARIA attributes
- 🔒 Scroll lock option for modal-like behavior
- 📁 Grouping and labeling support
- 🎛️ Custom value display formatting
- **Logic-only:** All styling and animation is up to the consumer
- **Dual-attribute pattern:** ARIA for accessibility, data- attributes for styling/JS

## Basic Usage

### Simple Select

```html
<pxm-select>
  <pxm-select-trigger>
    <pxm-select-value placeholder="Choose an option..."></pxm-select-value>
    <span data-select-icon>▼</span>
  </pxm-select-trigger>
  
  <pxm-select-content>
    <pxm-select-item value="apple">
      <pxm-select-item-text>Apple</pxm-select-item-text>
    </pxm-select-item>
    <pxm-select-item value="banana">
      <pxm-select-item-text>Banana</pxm-select-item-text>
    </pxm-select-item>
    <pxm-select-item value="cherry">
      <pxm-select-item-text>Cherry</pxm-select-item-text>
    </pxm-select-item>
  </pxm-select-content>
</pxm-select>
```

### Multiple Selection

```html
<pxm-select multiple="true" close-on-select="false">
  <pxm-select-trigger>
    <pxm-select-value placeholder="Select multiple..."></pxm-select-value>
  </pxm-select-trigger>
  <pxm-select-content>
    <pxm-select-item value="red">Red</pxm-select-item>
    <pxm-select-item value="green">Green</pxm-select-item>
    <pxm-select-item value="blue">Blue</pxm-select-item>
  </pxm-select-content>
</pxm-select>
```

### With Groups and Labels

```html
<pxm-select>
  <pxm-select-trigger>
    <pxm-select-value placeholder="Select a fruit..."></pxm-select-value>
  </pxm-select-trigger>
  
  <pxm-select-content>
    <pxm-select-group>
      <pxm-select-label>Citrus</pxm-select-label>
      <pxm-select-item value="orange">Orange</pxm-select-item>
      <pxm-select-item value="lemon">Lemon</pxm-select-item>
    </pxm-select-group>
    
    <pxm-select-separator></pxm-select-separator>
    
    <pxm-select-group>
      <pxm-select-label>Berries</pxm-select-label>
      <pxm-select-item value="strawberry">Strawberry</pxm-select-item>
      <pxm-select-item value="blueberry">Blueberry</pxm-select-item>
    </pxm-select-group>
  </pxm-select-content>
</pxm-select>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `multiple` | boolean | `false` | Enable multiple selection mode |
| `required` | boolean | `false` | Mark field as required for validation |
| `disabled` | boolean | `false` | Disable the entire select component |
| `close-on-select` | boolean | `true` | Close dropdown after item selection |
| `scroll-lock` | boolean | `true` | Lock page scroll when dropdown is open |
| `icon-rotation` | number | `180` | Icon rotation angle in degrees (0-360) |

## Components

### Core Components

- **`<pxm-select>`** - Root container that orchestrates all functionality
- **`<pxm-select-trigger>`** - Clickable button that opens/closes the dropdown  
- **`<pxm-select-value>`** - Displays the currently selected value(s)
- **`<pxm-select-content>`** - Dropdown container that holds all options
- **`<pxm-select-item>`** - Individual selectable option

### Organizational Components

- **`<pxm-select-group>`** - Groups related items together
- **`<pxm-select-label>`** - Label for item groups  
- **`<pxm-select-separator>`** - Visual separator between items/groups
- **`<pxm-select-item-text>`** - Text content within an item

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Open dropdown / Select focused item |
| `ArrowDown` | Open dropdown / Focus next item |  
| `ArrowUp` | Open dropdown / Focus previous item |
| `Home` | Focus first item |
| `End` | Focus last item |
| `Escape` | Close dropdown |
| `Tab` | Close dropdown and move to next element |
| `A-Z` | Type-ahead navigation (when search input not focused) |

## Type-ahead Navigation

The select component includes intelligent type-ahead functionality that works alongside the search component:

### Behavior
- **Single Key Press**: Pressing `A` focuses the first item starting with "A" (e.g., "Apple")
- **Repeated Key Press**: Pressing `A` again cycles to the next item starting with "A" (e.g., "Avocado")
- **Different Key**: Pressing `B` starts a new search for items starting with "B" (e.g., "Banana")
- **Timeout Reset**: After 1 second of inactivity, the type-ahead resets

### Smart Context Awareness
- **Search Input Focused**: Type-ahead is disabled, allowing normal typing in search
- **Trigger/Items Focused**: Type-ahead is active for quick navigation
- **Hidden Items**: Type-ahead skips filtered/hidden items
- **Disabled Items**: Type-ahead skips disabled items

### Example Workflow
```html
<!-- Items: Apple, Banana, Cherry, Chocolate -->
<pxm-select>
  <!-- When trigger or dropdown items are focused: -->
  <!-- Press 'A' → focuses Apple -->
  <!-- Press 'B' → focuses Banana -->  
  <!-- Press 'C' → focuses Cherry -->
  <!-- Press 'C' again → focuses Chocolate -->
  
  <!-- When search input is focused: -->
  <!-- Type 'ch' → filters to show only Cherry, Chocolate -->
  <!-- Use arrow keys to navigate filtered results -->
</pxm-select>
```

## JavaScript API

### Methods

```javascript
const select = document.querySelector('pxm-select');

// Value management
select.setValue('apple');                    // Set single value
select.setValues(['apple', 'banana']);       // Set multiple values (for multiple mode)
console.log(select.getValue());             // Get current value(s)
console.log(select.getValues());            // Get array of selected values
select.clearSelection();                    // Clear all selections

// State management  
await select.open();                        // Open dropdown
await select.close();                       // Close dropdown
await select.toggle();                      // Toggle open/closed state
console.log(select.isOpen());              // Check if dropdown is open
console.log(select.isMultiple());          // Check if in multiple mode

// Item management
const selectedItems = select.getSelectedItems();  // Get selected item elements
const allItems = select.getAllItems();            // Get all item elements

// Animation control
select.removeDefaultAnimations();          // Disable default animations

// Type-ahead navigation
select.handleTypeAhead('a');               // Programmatically trigger type-ahead
select.clearTypeAhead();                   // Clear type-ahead state
```

## Dynamic Content

Items can be added or removed dynamically:

```javascript
const select = document.querySelector('pxm-select');
const content = select.querySelector('pxm-select-content');

// Add new item
const newItem = document.createElement('pxm-select-item');
newItem.setAttribute('value', 'grape');
newItem.innerHTML = '<pxm-select-item-text>Grape</pxm-select-item-text>';
content.appendChild(newItem); // Automatically initialized

// Listen for changes
select.addEventListener('pxm:select:items-changed', (e) => {
  console.log(`Select now has ${e.detail.itemCount} items`);
});
```

## Events

### Selection Events
- `pxm:select:before-select` - Cancelable. Fired before item selection
- `pxm:select:after-select` - Fired after item selection  
- `pxm:select:value-change` - Fired when selected value(s) change

### State Events
- `pxm:select:before-open` - Cancelable. Fired before dropdown opens
- `pxm:select:after-open` - Fired after dropdown opens
- `pxm:select:before-close` - Cancelable. Fired before dropdown closes
- `pxm:select:after-close` - Fired after dropdown closes
- `pxm:select:state-change` - Fired when open/closed state changes

### Content Events  
- `pxm:select:items-changed` - Fired when items are dynamically added/removed

## Animation

### With Animation Library (GSAP Example)

```javascript
const select = document.querySelector('pxm-select');

select.addEventListener('pxm:select:before-open', (e) => {
  const { contentElement } = e.detail;
  e.preventDefault(); // Take over the animation
  
  gsap.fromTo(contentElement, 
    { opacity: 0, y: -10, scaleY: 0.8 }, 
    { 
      opacity: 1, 
      y: 0, 
      scaleY: 1, 
      duration: 0.2,
      transformOrigin: 'top',
      onComplete: () => {
        e.detail.complete(); // Signal animation complete
      }
    }
  );
});
```

### With CSS Transitions (Default)

```css
pxm-select-content {
  opacity: 0;
  transform: translateY(-8px) scaleY(0.9);
  transform-origin: top;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

pxm-select-content[data-open="true"] {
  opacity: 1;
  transform: translateY(0) scaleY(1);
}
```

## Styling Examples

### Basic CSS

```css
/* Component structure */
pxm-select {
  position: relative;
  display: inline-block;
  min-width: 200px;
}

pxm-select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

pxm-select-content {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 2px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

pxm-select-item {
  display: block;
  padding: 8px 12px;
  cursor: pointer;
}

/* ✅ DO: Style based on data attributes */
pxm-select[data-open="true"] pxm-select-trigger {
  border-color: #007bff;
}

pxm-select-item[data-focused="true"] {
  background: #f0f0f0;
}

pxm-select-item[data-selected="true"] {
  background: #007bff;
  color: white;
}

pxm-select-item[data-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
}

pxm-select[data-disabled="true"] {
  opacity: 0.6;
}
```

### With Tailwind CSS

```html
<pxm-select 
  class="relative inline-block min-w-48
         data-[open=true]:z-50
         data-[disabled=true]:opacity-60">
  <pxm-select-trigger 
    class="flex items-center justify-between w-full px-3 py-2
           border border-gray-300 rounded-md bg-white
           data-[open=true]:border-blue-500 data-[open=true]:ring-1 data-[open=true]:ring-blue-500
           data-[focused=true]:border-blue-500
           data-[disabled=true]:bg-gray-100 data-[disabled=true]:cursor-not-allowed
           hover:border-gray-400 focus:outline-none">
    <pxm-select-value 
      class="text-left data-[placeholder=true]:text-gray-500"></pxm-select-value>
    <span data-select-icon 
          class="ml-2 transition-transform data-[open=true]:rotate-180">▼</span>
  </pxm-select-trigger>
  
  <pxm-select-content 
    class="absolute top-full left-0 right-0 mt-1
           bg-white border border-gray-300 rounded-md shadow-lg
           data-[open=false]:hidden
           max-h-60 overflow-auto z-50">
    <pxm-select-item 
      value="apple"
      class="px-3 py-2 cursor-pointer
             data-[focused=true]:bg-blue-50
             data-[selected=true]:bg-blue-100 data-[selected=true]:font-medium
             data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed
             hover:bg-gray-50">
      <pxm-select-item-text>Apple</pxm-select-item-text>
    </pxm-select-item>
  </pxm-select-content>
</pxm-select>
```

## Data Attributes for Styling

**✅ DO: Use data attributes for CSS targeting:**

| Attribute | Element | Values | Purpose |
|-----------|---------|---------|---------|
| `data-open` | `pxm-select`, `pxm-select-content` | `"true"`, `"false"` | Open/closed state |
| `data-disabled` | `pxm-select`, `pxm-select-trigger`, `pxm-select-item` | `"true"`, `"false"` | Disabled state |
| `data-selected` | `pxm-select-item` | `"true"`, `"false"` | Selected state |
| `data-focused` | `pxm-select-trigger`, `pxm-select-item` | `"true"`, `"false"` | Focused state |
| `data-placeholder` | `pxm-select-value` | `"true"`, `"false"` | Showing placeholder |
| `data-state` | All components | `"open"`, `"closed"`, `"selected"`, etc. | General state |
| `data-multiple` | `pxm-select`, `pxm-select-content` | `"true"`, `"false"` | Multiple mode |

**❌ DON'T: Use ARIA attributes for styling** (they're for accessibility only)

## Accessibility

This component automatically manages essential ARIA attributes for screen reader compatibility:

### Managed ARIA Attributes
- `aria-expanded` - On trigger to indicate dropdown state
- `aria-selected` - On items to indicate selection state  
- `aria-disabled` - On disabled elements
- `aria-hidden` - On content when closed
- `role="combobox"` - On trigger for semantic meaning
- `role="listbox"` - On content container
- `role="option"` - On individual items

### Consumer Responsibilities
Add these ARIA attributes as needed for your specific use case:
- `aria-label` or `aria-labelledby` - Label the select purpose
- `aria-describedby` - Link to help text or error messages
- `aria-required` - Mark as required for forms
- Additional roles and relationships as needed

## SSR / Hydration Support

Prevent hydration flash with CSS:

```css
/* Hide content until component is defined */
pxm-select:not(:defined) pxm-select-content {
  display: none;
}

/* Set initial state styles */
pxm-select-content:not([data-open="true"]) {
  display: none;
}

pxm-select-content[data-open="true"] {
  display: block;
}
```

## Performance Optimizations

This component includes several performance optimizations for smooth operation even with large datasets:

### Efficient DOM Operations
- **Batched Updates**: Multiple DOM attribute changes are batched together to minimize reflows
- **Selective Focus Updates**: Only the previously focused and newly focused items are updated during navigation
- **Cached Item Queries**: Item lists are cached and only refreshed when necessary

### Memory Management
- **Event Handler Optimization**: Shared keyboard handlers reduce code duplication and memory usage
- **Selective Event Listening**: Components only listen for relevant events
- **Proper Cleanup**: All event listeners and observers are properly removed on disconnect

### Search Performance
- **Single Array Conversion**: Filter operations convert NodeList to Array only once
- **Optimized Text Extraction**: Text content is cached during search operations
- **Early Return Patterns**: Navigation methods use early returns to avoid unnecessary iterations
- **Focus Preservation**: Search input maintains focus during filtering without interference from item navigation

### Animation Efficiency
- **Configurable Delays**: Use `SELECT_CONSTANTS.PERFORMANCE` for timing adjustments
- **Batched Focus Operations**: Multiple focus-related operations are combined into single timeouts

## Browser Support

This component uses modern web standards:
- **Custom Elements** - Widely supported in modern browsers
- **ES6+ JavaScript** - Requires modern JavaScript support
- **CSS Data Attribute Selectors** - Universal support
- **ARIA Attributes** - Universal accessibility support

For older browser support, include appropriate polyfills.

## TypeScript Support

The component includes full TypeScript definitions:

```typescript
import { PxmSelect } from 'pxm-elements/select';

const select = document.querySelector('pxm-select') as PxmSelect;
const value: string | string[] = select.getValue();
``` 