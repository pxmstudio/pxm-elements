# PXM Number Input Component

A customizable number input component with increment/decrement controls. The component provides a user-friendly interface for numeric input with built-in validation and flexible styling options.

## Features

- Increment/decrement controls (buttons or links)
- Min/max value constraints
- Custom step size
- Automatic disabled states for controls
- Flexible styling options
- Built-in validation
- Keyboard support
- Accessible design

## Usage

### Basic Usage

```html
<pxm-number-input>
  <button data-minus>-</button>
  <input type="number" min="0" max="100" step="1" value="0">
  <button data-plus>+</button>
</pxm-number-input>
```

### With Links as Controls

```html
<pxm-number-input>
  <a href="#" data-minus>-</a>
  <input type="number" min="0" max="100" step="1" value="0">
  <a href="#" data-plus>+</a>
</pxm-number-input>
```

### With Custom Styling

```html
<pxm-number-input>
  <button data-minus class="custom-button">Decrease</button>
  <input type="number" min="0" max="100" step="1" value="0" class="custom-input">
  <button data-plus class="custom-button">Increase</button>
</pxm-number-input>
```

## Attributes

### Input Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| min | number | undefined | Minimum allowed value |
| max | number | undefined | Maximum allowed value |
| step | number | 1 | Step size for increment/decrement |
| value | number | 0 | Initial value |
| disabled | boolean | false | Whether the input is disabled |

### Control Elements

The component requires two control elements with specific data attributes:

- `data-minus`: Element that triggers value decrement
- `data-plus`: Element that triggers value increment

These can be any HTML element (buttons, links, etc.) as long as they have the appropriate data attributes.

## Styling

### Basic Styling Example

```css
pxm-number-input {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

pxm-number-input input[type="number"] {
  width: 4rem;
  text-align: center;
}

/* Style for disabled controls */
[data-minus][disabled],
[data-plus][disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Custom Styling

You can style any element within the component:
- The input element
- The minus control (`[data-minus]`)
- The plus control (`[data-plus]`)
- The disabled state of controls

## Behavior

- The minus control is automatically disabled when the value reaches the minimum
- The plus control is automatically disabled when the value reaches the maximum
- Values are automatically constrained to the min/max range
- Step size is respected for both increment and decrement operations
- Manual input is validated against min/max constraints

## Browser Support

The component works in all modern browsers that support:
- Custom Elements
- HTML5 Input Types
- Data Attributes

## License

MIT 