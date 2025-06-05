# @pixelmakers/elements

A collection of custom web components by PixelMakers. This package provides reusable, accessible, and customizable web components that can be used in any modern web application.

## Installation

You can install the entire package:

```bash
npm install @pixelmakers/elements
```

Or install individual components:

```bash
npm install @pixelmakers/elements/phone-input
npm install @pixelmakers/elements/lightbox
npm install @pixelmakers/elements/video
npm install @pixelmakers/elements/accordion
npm install @pixelmakers/elements/number-input
```

## CDN Usage

You can use the components directly from a CDN. For the best experience, we recommend using the main package:

```html
<!-- Import the entire package -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements@0.1.11/dist/index.js"></script>

<!-- Use the components -->
<pxm-phone-input>
  <input type="tel" name="phone">
</pxm-phone-input>

<pxm-lightbox>
  <!-- Lightbox content -->
</pxm-lightbox>

<pxm-video src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></pxm-video>

<pxm-accordion>
  <!-- Accordion content -->
</pxm-accordion>

<pxm-number-input>
  <button data-minus>-</button>
  <input type="number" min="0" max="100" step="1" value="0">
  <button data-plus>+</button>
</pxm-number-input>
```

Or if you prefer to use individual components:

```html
<!-- Import just the phone input component -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements@0.1.11/dist/phone-input.js"></script>

<!-- Import just the lightbox component -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements@0.1.11/dist/lightbox.js"></script>

<!-- Import just the video component -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements@0.1.11/dist/video.js"></script>

<!-- Import just the accordion component -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements@0.1.11/dist/accordion.js"></script>

<!-- Import just the number input component -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements@0.1.11/dist/number-input.js"></script>

<!-- Use the components -->
<pxm-phone-input>
  <input type="tel" name="phone">
</pxm-phone-input>

<pxm-lightbox>
  <!-- Lightbox content -->
</pxm-lightbox>

<pxm-video src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></pxm-video>

<pxm-accordion>
  <!-- Accordion content -->
</pxm-accordion>

<pxm-number-input>
  <button data-minus>-</button>
  <input type="number" min="0" max="100" step="1" value="0">
  <button data-plus>+</button>
</pxm-number-input>
```

## Components

### Phone Input

A customizable phone input component with international phone number formatting and validation.

#### Usage

```html
<!-- Import the component -->
<script type="module">
  import '@pixelmakers/elements/phone-input';
</script>

<!-- Use the component -->
<pxm-phone-input>
  <input type="tel" name="phone">
</pxm-phone-input>
```

#### Features

- International phone number formatting
- Country selection
- Validation
- Accessible
- Customizable styling
- Hidden input for full phone number with country code

#### Configuration

The phone input component accepts the following data attributes:

- `data-initial-country`: Set the initial country (default: "ae")
- `data-separate-dial-code`: Show the dial code separately (default: false)
- `data-format-on-display`: Format the number as you type (default: false)

Example:

```html
<pxm-phone-input 
  data-initial-country="us"
  data-separate-dial-code="true"
  data-format-on-display="true">
  <input type="tel" name="phone">
</pxm-phone-input>
```

### Lightbox

A customizable lightbox component for displaying images, videos, and other content in a modal overlay.

#### Usage

```html
<!-- Import the component -->
<script type="module">
  import '@pixelmakers/elements/lightbox';
</script>

<!-- Use the component -->
<pxm-lightbox>
  <div class="lightbox-content">
    <!-- Your content here -->
    <img src="path/to/image.jpg" alt="Image description">
  </div>
</pxm-lightbox>
```

#### Features

- Responsive design
- Keyboard navigation
- Touch gestures for mobile
- Accessible
- Customizable styling
- Support for various content types (images, videos, HTML)

#### Configuration

The lightbox component accepts the following data attributes:

- `data-close-on-escape`: Close the lightbox when Escape key is pressed (default: true)
- `data-close-on-overlay-click`: Close the lightbox when clicking outside the content (default: true)
- `data-show-close-button`: Display a close button (default: true)

Example:

```html
<pxm-lightbox 
  data-close-on-escape="true"
  data-close-on-overlay-click="true"
  data-show-close-button="true">
  <div class="lightbox-content">
    <img src="path/to/image.jpg" alt="Image description">
  </div>
</pxm-lightbox>
```

### Video

A customizable video component that supports multiple video sources including YouTube, Vimeo, Mux, and MP4. Provides thumbnail generation and lazy loading capabilities.

#### Usage

```html
<!-- Import the component -->
<script type="module">
  import '@pixelmakers/elements/video';
</script>

<!-- Basic usage -->
<pxm-video src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></pxm-video>

<!-- With custom thumbnail -->
<pxm-video 
  src="https://vimeo.com/123456789"
  thumbnail="path/to/thumbnail.jpg">
</pxm-video>
```

#### Features

- Multiple video source support (YouTube, Vimeo, Mux, MP4)
- Automatic thumbnail generation
- Custom thumbnail support
- Lazy loading (video only loads when played)
- Responsive design
- Keyboard navigation
- Accessible
- Customizable styling

#### Configuration

The video component accepts the following attributes:

- `src`: URL of the video source (required)
- `type`: Type of video ('youtube', 'vimeo', 'mux', 'mp4', 'other')
- `thumbnail`: URL of a custom thumbnail image
- `autoplay`: Whether to autoplay the video when loaded
- `muted`: Whether the video should be muted by default
- `controls`: Whether to show video controls
- `width`: Width of the video container
- `height`: Height of the video container
- `title`: Title of the video (for accessibility)
- `description`: Description of the video (for accessibility)

For more detailed documentation, see the [video component README](src/video/README.md).

### Accordion

A simple, accessible accordion component that allows users to expand/collapse content sections. The component provides smooth animations, keyboard navigation, and full accessibility support.

#### Usage

```html
<!-- Import the component -->
<script type="module">
  import '@pixelmakers/elements/accordion';
</script>

<!-- Basic usage -->
<pxm-accordion>
  <div data-accordion-item>
    <button data-accordion-trigger>
      Section 1
      <span data-accordion-icon aria-hidden="true">▼</span>
    </button>
    <div data-accordion-content>
      Content for section 1
    </div>
  </div>
</pxm-accordion>
```

#### Features

- Keyboard navigation support
- Full accessibility (ARIA) support
- Configurable icon rotation
- Support for multiple open sections
- Customizable animation duration
- Responsive design

#### Configuration

The accordion component accepts the following attributes:

- `allow-multiple`: Whether multiple sections can be open at once (default: false)
- `animation-duration`: Duration of expand/collapse animation in milliseconds (default: 300)
- `icon-rotation`: Degrees to rotate the icon when expanded (default: 90)

For more detailed documentation, see the [accordion component README](src/accordion/README.md).

### Number Input

A customizable number input component with increment/decrement controls. The component provides a user-friendly interface for numeric input with built-in validation and flexible styling options.

#### Usage

```html
<!-- Import the component -->
<script type="module">
  import '@pixelmakers/elements/number-input';
</script>

<!-- Basic usage -->
<pxm-number-input>
  <button data-minus>-</button>
  <input type="number" min="0" max="100" step="1" value="0">
  <button data-plus>+</button>
</pxm-number-input>

<!-- With links as controls -->
<pxm-number-input>
  <a href="#" data-minus>-</a>
  <input type="number" min="0" max="100" step="1" value="0">
  <a href="#" data-plus>+</a>
</pxm-number-input>
```

#### Features

- Increment/decrement controls (buttons or links)
- Min/max value constraints
- Custom step size
- Automatic disabled states for controls
- Flexible styling options
- Built-in validation
- Keyboard support
- Accessible design

#### Configuration

The number input component accepts the following attributes on the input element:

- `min`: Minimum allowed value
- `max`: Maximum allowed value
- `step`: Step size for increment/decrement (default: 1)
- `value`: Initial value (default: 0)
- `disabled`: Whether the input is disabled

The component requires two control elements with specific data attributes:
- `data-minus`: Element that triggers value decrement
- `data-plus`: Element that triggers value increment

For more detailed documentation, see the [number input component README](src/number-input/README.md).

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## License

MIT © PixelMakers 