# Toggle Component

Create accessible toggle switches for boolean states with built-in form integration.

## Features

✅ **Accessible** - Full keyboard support and screen reader compatibility  
✅ **Form integration** - Works seamlessly with forms and frameworks  
✅ **Lightweight** - Only 2.7KB gzipped  
✅ **Unstyled** - Complete design freedom  
✅ **Keyboard support** - Enter and Space key activation

## Quick Start

### CDN Usage

```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/toggle.js"></script>

<label>
    <pxm-toggle name="notifications" value="enabled"></pxm-toggle>
    Enable notifications
</label>

<label>
    <pxm-toggle name="marketing" value="yes" checked="true"></pxm-toggle>
    Subscribe to marketing emails
</label>
```

### NPM Usage

```typescript
import '@pixelmakers/elements/toggle';

// Or with TypeScript support
import type { PxmToggle } from '@pixelmakers/elements/toggle';

const toggle = document.querySelector('pxm-toggle') as PxmToggle;
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `checked` | boolean | `false` | Whether the toggle is in the "on" state |
| `disabled` | boolean | `false` | Whether the toggle is disabled |
| `name` | string | `""` | Form field name for submission |
| `value` | string | `"on"` | Value sent when toggle is checked |

## HTML Structure

```html
<!-- Basic toggle -->
<pxm-toggle name="feature" value="enabled"></pxm-toggle>

<!-- Pre-checked toggle -->
<pxm-toggle name="feature" value="enabled" checked="true"></pxm-toggle>

<!-- Disabled toggle -->
<pxm-toggle name="feature" value="enabled" disabled="true"></pxm-toggle>

<!-- With hidden input (automatically created if not present) -->
<pxm-toggle name="feature" value="enabled">
    <input type="hidden" name="feature" value="">
</pxm-toggle>
```

## Styling Examples

### Basic Switch Design

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

pxm-toggle[data-state="checked"] {
    background: #3b82f6;
}

pxm-toggle[data-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Toggle knob */
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

pxm-toggle[data-state="checked"]::before {
    transform: translateX(24px);
}
```

### iOS-Style Toggle

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
    outline: none;
    border: none;
}

pxm-toggle:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

pxm-toggle[data-state="checked"] {
    background: #34d399;
}

pxm-toggle[data-disabled="true"] {
    opacity: 0.4;
    cursor: not-allowed;
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

pxm-toggle[data-state="checked"]::before {
    transform: translateX(20px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}
```

### Material Design Toggle

```css
pxm-toggle {
    display: inline-block;
    width: 36px;
    height: 20px;
    background: rgba(0, 0, 0, 0.38);
    border-radius: 10px;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
}

pxm-toggle:focus {
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.3);
}

pxm-toggle[data-state="checked"] {
    background: rgba(33, 150, 243, 0.5);
}

pxm-toggle[data-disabled="true"] {
    opacity: 0.6;
    cursor: not-allowed;
}

pxm-toggle::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    width: 24px;
    height: 24px;
    background: #fafafa;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14);
}

pxm-toggle[data-state="checked"]::before {
    background: #2196f3;
    transform: translateX(16px);
}
```

### Tailwind CSS

```html
<pxm-toggle class="relative inline-block w-12 h-6 bg-gray-300 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=checked]:bg-blue-500 data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed">
    <span class="sr-only">Toggle switch</span>
</pxm-toggle>

<style>
pxm-toggle::before {
    content: '';
    @apply absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out;
}

pxm-toggle[data-state="checked"]::before {
    @apply translate-x-6;
}
</style>
```

## Accessibility

The toggle automatically provides:

- **Keyboard Support**
  - `Enter` - Toggle the switch
  - `Space` - Toggle the switch

- **ARIA Attributes**
  - `role="switch"` - Indicates toggle behavior
  - `aria-checked` - Indicates current state
  - `aria-disabled` - Indicates disabled state

- **Focus Management**
  - Focusable with tab navigation
  - Clear focus indicators
  - Disabled toggles are not focusable

## Form Integration

The toggle works seamlessly with forms:

```html
<form id="settings-form">
    <fieldset>
        <legend>Notification Settings</legend>
        
        <label>
            <pxm-toggle name="email_notifications" value="enabled"></pxm-toggle>
            Email notifications
        </label>
        
        <label>
            <pxm-toggle name="push_notifications" value="enabled" checked="true"></pxm-toggle>
            Push notifications
        </label>
        
        <label>
            <pxm-toggle name="marketing_emails" value="subscribed"></pxm-toggle>
            Marketing emails
        </label>
    </fieldset>
    
    <button type="submit">Save Settings</button>
</form>

<script>
document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // FormData will contain:
    // email_notifications: "enabled" (if checked) or empty (if unchecked)
    // push_notifications: "enabled" (if checked)
    // marketing_emails: "" (if unchecked)
    
    console.log(Object.fromEntries(formData));
});
</script>
```

## Events

The toggle dispatches change events:

```javascript
const toggle = document.querySelector('pxm-toggle');

toggle.addEventListener('change', (event) => {
    console.log('Toggle changed:', {
        checked: event.detail.checked,
        name: toggle.getAttribute('name'),
        value: toggle.getAttribute('value')
    });
});
```

## JavaScript API

```typescript
// Get toggle instance
const toggle = document.querySelector('pxm-toggle') as PxmToggle;

// Read state
console.log(toggle.checked); // true/false
console.log(toggle.disabled); // true/false

// Set state
toggle.checked = true;
toggle.disabled = false;

// Toggle programmatically
toggle.click(); // or trigger change
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
        <pxm-toggle name="profile_visible" value="public" checked="true"></pxm-toggle>
    </div>
    
    <div class="setting-row">
        <div class="setting-info">
            <strong>Activity Status</strong>
            <p>Show when you're online</p>
        </div>
        <pxm-toggle name="activity_status" value="visible"></pxm-toggle>
    </div>
    
    <div class="setting-row">
        <div class="setting-info">
            <strong>Data Analytics</strong>
            <p>Help improve our service with usage data</p>
        </div>
        <pxm-toggle name="analytics" value="allowed" disabled="true"></pxm-toggle>
    </div>
</div>

<style>
.settings-panel {
    max-width: 400px;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
}

.setting-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid #f3f4f6;
}

.setting-row:last-child {
    border-bottom: none;
}

.setting-info {
    flex: 1;
}

.setting-info strong {
    display: block;
    margin-bottom: 0.25rem;
}

.setting-info p {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
}
</style>
```

### Feature Toggles

```html
<div class="feature-toggles">
    <h3>Experimental Features</h3>
    <p>Enable beta features to try new functionality</p>
    
    <div class="feature-list">
        <div class="feature-item">
            <label>
                <pxm-toggle name="beta_editor" value="enabled"></pxm-toggle>
                <div class="feature-details">
                    <strong>New Editor</strong>
                    <span class="beta-badge">Beta</span>
                    <p>Try our redesigned content editor with improved performance</p>
                </div>
            </label>
        </div>
        
        <div class="feature-item">
            <label>
                <pxm-toggle name="ai_suggestions" value="enabled"></pxm-toggle>
                <div class="feature-details">
                    <strong>AI Suggestions</strong>
                    <span class="alpha-badge">Alpha</span>
                    <p>Get AI-powered content suggestions as you type</p>
                </div>
            </label>
        </div>
        
        <div class="feature-item">
            <label>
                <pxm-toggle name="dark_mode" value="enabled" checked="true"></pxm-toggle>
                <div class="feature-details">
                    <strong>Dark Mode</strong>
                    <span class="stable-badge">Stable</span>
                    <p>Switch to dark theme for better nighttime viewing</p>
                </div>
            </label>
        </div>
    </div>
</div>
```

## Platform Integration

### Webflow

1. Add Custom Code to page head:
```html
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/toggle.js"></script>
```

2. Add HTML structure in Embed element:
```html
<form name="contact-preferences">
    <label class="toggle-label">
        <pxm-toggle name="newsletter" value="subscribed"></pxm-toggle>
        <span>Subscribe to newsletter</span>
    </label>
    
    <label class="toggle-label">
        <pxm-toggle name="marketing" value="yes"></pxm-toggle>
        <span>Receive marketing updates</span>
    </label>
</form>
```

### Shopify

```liquid
<!-- In theme.liquid -->
<script src="https://cdn.jsdelivr.net/npm/@pixelmakers/elements/dist/umd/toggle.js"></script>

<!-- In account/preferences template -->
<form action="/account/preferences" method="post">
    <div class="preference-group">
        <label>
            <pxm-toggle 
                name="email_marketing" 
                value="true"
                {% if customer.accepts_marketing %}checked="true"{% endif %}>
            </pxm-toggle>
            Receive marketing emails
        </label>
    </div>
    
    <div class="preference-group">
        <label>
            <pxm-toggle name="sms_notifications" value="true"></pxm-toggle>
            SMS order updates
        </label>
    </div>
    
    <button type="submit">Save Preferences</button>
</form>
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
        const { name, checked } = event.target;
        setSettings(prev => ({
            ...prev,
            [name]: checked
        }));
    };
    
    return (
        <div>
            <label>
                <pxm-toggle 
                    name="notifications"
                    value="enabled"
                    checked={settings.notifications}
                    onChange={handleToggleChange}
                />
                Enable notifications
            </label>
            
            <label>
                <pxm-toggle 
                    name="darkMode"
                    value="enabled"
                    checked={settings.darkMode}
                    onChange={handleToggleChange}
                />
                Dark mode
            </label>
        </div>
    );
}
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