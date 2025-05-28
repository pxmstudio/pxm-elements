# @pxm/elements

A collection of custom web components by PixelMakers. This package provides reusable, accessible, and customizable web components that can be used in any modern web application.

## Installation

You can install the entire package:

```bash
npm install @pxm/elements
```

Or install individual components:

```bash
npm install @pxm/elements/phone-input
```

## Components

### Phone Input

A customizable phone input component with international phone number formatting and validation.

#### Usage

```html
<!-- Import the component -->
<script type="module">
  import '@pxm/elements/phone-input';
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