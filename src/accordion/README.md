# PXM Accordion Component

A simple, accessible accordion component that allows users to expand/collapse content sections. The component provides smooth animations, keyboard navigation, and full accessibility support.

## Features

- Keyboard navigation support
- Full accessibility (ARIA) support
- Configurable icon rotation
- Support for multiple open sections
- Customizable animation duration
- Responsive design

## Usage

### Basic Usage

```html
<pxm-accordion>
  <pxm-accordion-item>
    <pxm-accordion-trigger>
      <button type="button">
        Section 1
        <span data-accordion-icon aria-hidden="true">▼</span>
      </button>
    </pxm-accordion-trigger>
    <pxm-accordion-content>
      Content for section 1
    </pxm-accordion-content>
  </pxm-accordion-item>
  
  <pxm-accordion-item>
    <pxm-accordion-trigger>
      <button type="button">
        Section 2
        <span data-accordion-icon aria-hidden="true">▼</span>
      </button>
    </pxm-accordion-trigger>
    <pxm-accordion-content>
      Content for section 2
    </pxm-accordion-content>
  </pxm-accordion-item>
</pxm-accordion>
```

### With Custom Configuration

```html
<pxm-accordion 
  allow-multiple="true"
  animation-duration="400"
  icon-rotation="180"
>
  <pxm-accordion-item active="false">
    <pxm-accordion-trigger>
      <button type="button">
        Section 1
        <span data-accordion-icon aria-hidden="true">▼</span>
      </button>
    </pxm-accordion-trigger>
    <pxm-accordion-content>
      Content for section 1
    </pxm-accordion-content>
  </pxm-accordion-item>
</pxm-accordion>
```

## Attributes

### PXM Accordion Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| allow-multiple | boolean | false | Whether multiple sections can be open at once |
| animation-duration | number | 300 | Duration of expand/collapse animation in milliseconds |
| icon-rotation | number | 90 | Degrees to rotate the icon when expanded |

### PXM Accordion Item Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| active | boolean | false | Whether the accordion item is expanded |

## Structure

Each accordion item requires the following structure:

```html
<pxm-accordion-item>
  <pxm-accordion-trigger>
    <button type="button">
      <!-- Trigger content -->
      <span data-accordion-icon aria-hidden="true">▼</span>
    </button>
  </pxm-accordion-trigger>
  <pxm-accordion-content>
    <!-- Content -->
  </pxm-accordion-content>
</pxm-accordion-item>
```

### Required Elements

- `<pxm-accordion-item>`: Container for each accordion section
- `<pxm-accordion-trigger>`: Container for the trigger button
- `<pxm-accordion-content>`: Container for the content that is shown/hidden
- `data-accordion-icon` (optional): Icon that rotates on toggle

## Accessibility

The component follows WAI-ARIA Authoring Practices for accordions and includes:

- Proper ARIA roles and attributes
- Keyboard navigation:
  - Enter/Space: Toggle section
  - Arrow Up/Down: Navigate between sections
  - Home/End: Jump to first/last section
- Screen reader support
- Focus management

## Keyboard Navigation

- **Enter/Space**: Toggle the current section
- **Arrow Up**: Focus previous section
- **Arrow Down**: Focus next section
- **Home**: Focus first section
- **End**: Focus last section

## Browser Support

The component works in all modern browsers that support:
- Custom Elements
- CSS Transitions
- ARIA attributes

## License

MIT 