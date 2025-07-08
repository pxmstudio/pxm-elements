# PXM Video Component

A flexible, logic-only video component that supports multiple video sources including YouTube, Vimeo, Mux, and direct MP4 links. The component automatically handles video thumbnails and provides a smooth playback experience.

## Features

- Support for multiple video sources:
  - YouTube
  - Vimeo
  - Mux
  - Direct MP4 links
- Automatic thumbnail generation
- Custom thumbnail support
- Autoplay on click
- Responsive design
- Customizable controls and appearance
- **Logic-only:** All styling and animation is up to the consumer
- **Event-driven animation system:** Use events to override or enhance default behavior
- **Dual-attribute pattern:** ARIA for accessibility, data- attributes for styling/JS
- **Fine-grained thumbnail replacement:** Use `data-thumbnail-mode="auto"` for per-thumbnail control

## Usage

### Basic Usage (Auto Thumbnail)

```html
<pxm-video 
  src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  type="youtube"
  autoplay="true"
  muted="true"
  controls="true"
  width="100%"
  height="315"
  title="Video Title"
></pxm-video>
```

### With Custom Thumbnail

```html
<pxm-video 
  src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  type="youtube"
>
  <div data-thumbnail>
    <img src="path/to/thumbnail.jpg" alt="Custom thumbnail">
    <!-- Add your own play button or overlay here -->
  </div>
</pxm-video>
```

### Placeholder Image Replaced by Video Thumbnail

You can use a placeholder image and have it replaced by the video thumbnail by adding `data-thumbnail-mode="auto"` to your custom thumbnail container:

```html
<pxm-video src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" type="youtube">
  <div data-thumbnail data-thumbnail-mode="auto">
    <img src="placeholder.svg" alt="Loading..." />
  </div>
</pxm-video>
```

**How Auto Mode Works:**
- The component will replace the `<img>`'s `src` with the auto-generated video thumbnail (e.g., YouTube thumbnail) and update the `alt` text.
- **Important:** Any existing `srcset` and `sizes` attributes will be removed to ensure the new thumbnail displays correctly.
- Only one `<div data-thumbnail>` will be present in the DOM at a time (deduplication is automatic).
- This gives you fine-grained control: you can design your own placeholder, and the component will swap it for the real thumbnail when ready.

**Supported Auto Thumbnail Sources:**
- **YouTube**: High-quality thumbnails from YouTube's thumbnail API
- **Vimeo**: Thumbnails fetched from Vimeo's API  
- **MP4**: Generated from the first frame of the video
- **Mux**: Currently keeps placeholder (thumbnail generation not implemented)
- **Other**: Currently keeps placeholder

> **Note:** Thumbnail source control is now only via `data-thumbnail-mode` on the thumbnail container. There is no `thumbnail-mode` attribute on `<pxm-video>`.

## Animation System

### Default Animation (CSS Transitions)

By default, the component uses direct DOM style changes and CSS transitions for fade-in/fade-out effects when showing or hiding the video and thumbnail. You can customize the smoothness and duration with your own CSS:

```css
pxm-video [data-thumbnail],
pxm-video video,
pxm-video iframe {
  transition: opacity 0.3s ease;
}
```

### Custom Animation with Events

You can override the default animation by listening to `pxm:video:*` events and using your own animation library (e.g., GSAP, Anime.js):

```js
const video = document.querySelector('pxm-video');

video.addEventListener('pxm:video:before-play', (e) => {
  // e.preventDefault(); // If you want to take over the animation
  // Use your animation library here
});
```

#### Example: GSAP Fade-in

```js
video.addEventListener('pxm:video:before-play', (e) => {
  const thumbnail = video.querySelector('[data-thumbnail]');
  if (thumbnail) {
    e.preventDefault();
    gsap.to(thumbnail, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        thumbnail.remove();
        // Continue with video playback
        video.play();
      }
    });
  }
});
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| src | string | required | The URL of the video |
| type | 'youtube' \| 'vimeo' \| 'mux' \| 'mp4' \| 'other' | required | The type of video source |
| thumbnail | string | undefined | Optional custom thumbnail URL |
| autoplay | boolean | true | Whether to autoplay the video when clicked |
| muted | boolean | true | Whether the video should be muted by default |
| controls | boolean | true | Whether to show video controls |
| width | string \| number | '100%' | Width of the video player |
| height | string \| number | 'auto' | Height of the video player |
| title | string | undefined | Optional title for the video |
| description | string | undefined | Optional description for the video |

## Custom Thumbnail Structure

You can provide a custom thumbnail by adding a `div` with the `data-thumbnail` attribute inside the `pxm-video` element. To have the component replace your placeholder image with the video thumbnail, add `data-thumbnail-mode="auto"`:

```html
<pxm-video src="..." type="youtube">
  <div data-thumbnail data-thumbnail-mode="auto">
    <img src="placeholder.svg" alt="Loading...">
  </div>
</pxm-video>
```

The `data-thumbnail` div should contain:
- An `img` element for the thumbnail image
- Any additional elements you want to add (play button, overlay, etc.)

## Thumbnail Generation

If no custom thumbnail is provided, the component automatically generates thumbnails for different video sources:

- YouTube: Uses the highest quality thumbnail available from YouTube
- Vimeo: Fetches the thumbnail from Vimeo's API
- MP4: Generates a thumbnail from the first frame of the video
- Other: Shows a default black background

## Accessibility

- The component manages essential ARIA attributes (e.g., `aria-pressed`, `aria-expanded`, `aria-label`) and data- attributes (e.g., `data-state`, `data-muted`) for all stateful properties.
- Consumers are responsible for additional ARIA roles, labels, and descriptions as needed.

## Events

| Event | Cancelable | Description |
|-------|------------|-------------|
| `pxm:video:before-play` | ✅ | Fired before playback starts (can override animation) |
| `pxm:video:play` | ❌ | Fired after playback starts |
| `pxm:video:pause` | ❌ | Fired after pause |
| `pxm:video:mute` | ❌ | Fired after mute |
| `pxm:video:unmute` | ❌ | Fired after unmute |
| `pxm:video:seek` | ❌ | Fired after seek |
| `pxm:video:fullscreen` | ❌ | Fired after entering fullscreen |
| `pxm:video:error` | ❌ | Fired on error |

## Browser Support

The component works in all modern browsers that support:
- Custom Elements
- HTML5 Video
- Canvas API
- Fetch API

## License

MIT 