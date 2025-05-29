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
```

## CDN Usage

You can use the components directly from a CDN. For the best experience, we recommend using the main package:

```html
<!-- Import the entire package -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements@0.1.3/dist/index.js"></script>

<!-- Use the components -->
<pxm-phone-input>
  <input type="tel" name="phone">
</pxm-phone-input>

<pxm-lightbox>
  <!-- Lightbox content -->
</pxm-lightbox>
```

Or if you prefer to use individual components:

```html
<!-- Import just the phone input component -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements@0.1.3/dist/phone-input.js"></script>

<!-- Import just the lightbox component -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements@0.1.3/dist/lightbox.js"></script>

<!-- Use the components -->
<pxm-phone-input>
  <input type="tel" name="phone">
</pxm-phone-input>

<pxm-lightbox>
  <!-- Lightbox content -->
</pxm-lightbox>
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