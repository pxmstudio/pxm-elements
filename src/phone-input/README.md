# PXM Phone Input Component

A logic-only phone input component that provides international phone number validation and formatting using the `intl-tel-input` library. This component provides structure and behavior only - all styling is controlled by your CSS.

## Features

- 🌍 International phone number validation and formatting
- 🔄 Format-as-you-type functionality  
- 🎯 Country code detection and selection
- ♿ Accessible keyboard navigation
- ✅ Dynamic validation with error messaging
- 📝 Hidden input for full international number
- 🛠️ Custom validation support
- 🎨 Bring your own styling and animation

## Dependencies

This component **requires** the `intl-tel-input` library. It will be automatically injected when using the dependency injection system, or you can include it manually:

### NPM Installation
```bash
npm install intl-tel-input
```

### CDN Usage
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@25/build/css/intlTelInput.css">
<script src="https://cdn.jsdelivr.net/npm/intl-tel-input@25/build/js/intlTelInput.min.js"></script>
```

## Basic Usage

### HTML Structure
```html
<pxm-phone-input 
  initial-country="US" 
  separate-dial-code="true"
  placeholder="Enter phone number"
  required="true">
  <input type="tel" name="phone" />
</pxm-phone-input>
```

### With Label and Error Styling
```html
<div class="phone-field">
  <label for="phone">Phone Number</label>
  <pxm-phone-input 
    initial-country="US" 
    separate-dial-code="true"
    required="true">
    <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" />
  </pxm-phone-input>
</div>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `initial-country` | string | `"us"` | Initial country code (e.g., 'US', 'UK', 'CA') |
| `separate-dial-code` | boolean | `true` | Show country dial code separately from input |
| `format-on-display` | boolean | `true` | Format number as user types |
| `placeholder` | string | `""` | Placeholder text for the input |
| `required` | boolean | `false` | Whether the input is required |
| `disabled` | boolean | `false` | Whether the input is disabled |
| `auto-format` | boolean | `true` | Enable automatic formatting |
| `national-mode` | boolean | `false` | Use national format instead of international |

## JavaScript API

### Properties and Methods

```javascript
const phoneInput = document.querySelector('pxm-phone-input');

// Get formatted numbers
const international = phoneInput.getFormattedNumber(); // "+1 555 123 4567"
const national = phoneInput.getNationalNumber();       // "(555) 123-4567"

// Validation
const isValid = phoneInput.isValid();

// Error handling
phoneInput.setError('Custom error message');
phoneInput.clearError();

// Focus management
phoneInput.focus();
phoneInput.blur();

// Country management
phoneInput.setCountry('UK');
const countryData = phoneInput.getSelectedCountryData();

// Value management
phoneInput.setValue('+1 555 123 4567');
const currentValue = phoneInput.getValue();

// Custom validation
phoneInput.setCustomValidation((value) => {
  if (value.length < 10) {
    return 'Phone number too short';
  }
  return null; // No error
});
```

## Events

The component dispatches custom events for integration with your application:

### Change Event
```javascript
phoneInput.addEventListener('pxm:phone-input:change', (event) => {
  const { value, formattedNumber, isValid, country } = event.detail;
  console.log('Phone number changed:', { value, formattedNumber, isValid, country });
});
```

### Validation Event
```javascript
phoneInput.addEventListener('pxm:phone-input:validation', (event) => {
  const { isValid, error } = event.detail;
  if (!isValid) {
    console.log('Validation error:', error);
  }
});
```

### Country Change Event
```javascript
phoneInput.addEventListener('pxm:phone-input:country-change', (event) => {
  const { countryCode, countryName, dialCode } = event.detail;
  console.log('Country changed:', { countryCode, countryName, dialCode });
});
```

## Styling

The component provides no default styling - you have complete control over the appearance.

### Basic Styling
```css
/* Style the component container */
pxm-phone-input {
  display: block;
  margin-bottom: 1rem;
}

/* Style the input */
pxm-phone-input input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

pxm-phone-input input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### Validation States
```css
/* Valid state */
pxm-phone-input[aria-invalid="false"] input {
  border-color: #10b981;
}

/* Invalid state */
pxm-phone-input[aria-invalid="true"] input {
  border-color: #ef4444;
}

/* Error messages */
pxm-phone-input [data-pxm-phone-error] {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
}
```

### ITI (International Telephone Input) Styling
```css
/* Style the ITI dropdown */
pxm-phone-input .iti {
  width: 100%;
}

pxm-phone-input .iti__country-list {
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

pxm-phone-input .iti__country {
  padding: 0.75rem 1rem;
}

pxm-phone-input .iti__country:hover {
  background-color: #f8fafc;
}

/* Style the flag container */
pxm-phone-input .iti__flag-container {
  padding: 0.75rem;
}
```

### Dark Mode Support
```css
@media (prefers-color-scheme: dark) {
  pxm-phone-input input {
    background-color: #1f2937;
    border-color: #374151;
    color: white;
  }
  
  pxm-phone-input .iti__country-list {
    background-color: #1f2937;
    border-color: #374151;
  }
  
  pxm-phone-input .iti__country {
    color: white;
  }
  
  pxm-phone-input .iti__country:hover {
    background-color: #374151;
  }
}
```

## Form Integration

### Standard Form Submission
```html
<form id="contact-form">
  <pxm-phone-input required="true">
    <input type="tel" name="phone" required />
  </pxm-phone-input>
  <button type="submit">Submit</button>
</form>

<script>
document.getElementById('contact-form').addEventListener('submit', (event) => {
  const phoneInput = event.target.querySelector('pxm-phone-input');
  
  if (!phoneInput.isValid()) {
    event.preventDefault();
    phoneInput.setError('Please enter a valid phone number');
    return;
  }
  
  // The hidden input will contain the full international number
  console.log('Form data:', new FormData(event.target));
});
</script>
```

### Framework Integration

#### React
```jsx
function PhoneField({ value, onChange, error }) {
  const phoneRef = useRef();
  
  useEffect(() => {
    const phoneInput = phoneRef.current;
    
    const handleChange = (event) => {
      onChange(event.detail.formattedNumber);
    };
    
    phoneInput.addEventListener('pxm:phone-input:change', handleChange);
    return () => phoneInput.removeEventListener('pxm:phone-input:change', handleChange);
  }, [onChange]);
  
  useEffect(() => {
    if (error) {
      phoneRef.current.setError(error);
    } else {
      phoneRef.current.clearError();
    }
  }, [error]);
  
  return (
    <pxm-phone-input ref={phoneRef} initial-country="US">
      <input type="tel" value={value} readOnly />
    </pxm-phone-input>
  );
}
```

#### Vue
```vue
<template>
  <pxm-phone-input 
    ref="phoneInput"
    initial-country="US"
    @pxm:phone-input:change="handleChange">
    <input type="tel" :value="value" readonly />
  </pxm-phone-input>
</template>

<script>
export default {
  props: ['value', 'error'],
  emits: ['update:value'],
  
  watch: {
    error(newError) {
      if (newError) {
        this.$refs.phoneInput.setError(newError);
      } else {
        this.$refs.phoneInput.clearError();
      }
    }
  },
  
  methods: {
    handleChange(event) {
      this.$emit('update:value', event.detail.formattedNumber);
    }
  }
}
</script>
```

## Accessibility

The component provides essential accessibility features:

- **ARIA attributes**: `aria-invalid` is managed for validation states
- **Error announcements**: Error container has `aria-live="polite"`
- **Keyboard navigation**: Full keyboard support through ITI
- **Focus management**: Proper focus handling

### Additional Accessibility
You should add appropriate labels and descriptions:

```html
<label for="phone">Phone Number *</label>
<pxm-phone-input required="true">
  <input 
    type="tel" 
    id="phone" 
    name="phone"
    aria-describedby="phone-help phone-error"
    required />
</pxm-phone-input>
<div id="phone-help">Enter your phone number with country code</div>
```

## Common Patterns

### Validation on Submit
```javascript
form.addEventListener('submit', (event) => {
  const phoneInput = form.querySelector('pxm-phone-input');
  
  if (!phoneInput.isValid()) {
    event.preventDefault();
    phoneInput.focus();
    phoneInput.setError('Please enter a valid phone number');
  }
});
```

### Auto-format Phone Numbers
```javascript
// Format existing phone numbers on page load
document.querySelectorAll('pxm-phone-input').forEach(phoneInput => {
  const input = phoneInput.querySelector('input');
  if (input.value) {
    phoneInput.setValue(input.value);
  }
});
```

### Custom Country Detection
```javascript
// Set country based on user's location
fetch('https://ipapi.co/json/')
  .then(response => response.json())
  .then(data => {
    phoneInput.setCountry(data.country_code);
  });
```

## TypeScript Support

The component includes comprehensive TypeScript definitions:

```typescript
import type { 
  PxmPhoneInput, 
  PhoneInputEventDetail, 
  PhoneInputValidationDetail,
  PhoneInputCountryDetail 
} from 'pxm-elements/phone-input';

const phoneInput = document.querySelector('pxm-phone-input') as PxmPhoneInput;
phoneInput.getFormattedNumber(); // string
phoneInput.isValid(); // boolean
```

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills for custom elements)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Notes

- The ITI library is loaded on-demand when the component initializes
- CSS is automatically injected for CDN usage
- Component uses minimal DOM queries and efficient event handling
- Memory is properly cleaned up when component is removed 