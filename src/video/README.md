# PXM Video Component

A flexible video component that supports multiple video sources including YouTube, Vimeo, Mux, and direct MP4 links. The component automatically handles video thumbnails and provides a smooth playback experience.

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

## Usage

### Basic Usage

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

You can provide a custom thumbnail by adding a `div` with the `data-thumbnail` attribute inside the `pxm-video` element:

```html
<div data-thumbnail>
  <img src="path/to/thumbnail.jpg" alt="Custom thumbnail">
  <!-- Add your own play button or overlay here -->
</div>
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

## Browser Support

The component works in all modern browsers that support:
- Custom Elements
- HTML5 Video
- Canvas API
- Fetch API

## License

MIT 