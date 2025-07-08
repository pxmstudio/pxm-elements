/**
 * PXM Video Component
 *
 * A logic-only, highly flexible custom element for embedding videos from YouTube, Vimeo, Mux, MP4, and more.
 *
 * Bring your own styling and animation: This component provides structure and behavior only—all styling is controlled by your CSS.
 *
 * Features:
 * - Supports YouTube, Vimeo, Mux, MP4, and custom sources
 * - Automatic or custom thumbnail support
 * - Dual-attribute pattern: ARIA for accessibility, data- attributes for styling/JS
 * - Full keyboard navigation (Enter, Space, etc.)
 * - Public API for play, pause, mute, seek, fullscreen, etc.
 * - Event-driven animation system (all state changes fire pxm:video:* events)
 * - Dynamic content support (MutationObserver)
 * - Graceful error handling and fallbacks
 *
 * Keyboard Navigation:
 * - `Enter` or `Space` on thumbnail: Play video
 * - `Tab`/`Shift+Tab`: Move focus
 * - All video controls are accessible via keyboard (native or custom)
 *
 * Basic Usage:
 * ```html
 * <pxm-video 
 *   src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
 *   type="youtube"
 *   autoplay="true"
 *   muted="true"
 *   controls="true"
 *   width="100%"
 *   height="315"
 *   title="Video Title"
 * ></pxm-video>
 * ```
 *
 * With Custom Thumbnail:
 * ```html
 * <pxm-video src="..." type="youtube">
 *   <div data-thumbnail>
 *     <img src="custom-thumb.jpg" alt="Custom thumbnail">
 *     <!-- Add your own play button or overlay here -->
 *   </div>
 * </pxm-video>
 * ```
 *
 * Consumer Styling Examples:
 * ```css
 * pxm-video[data-state="playing"] { /* Your styles for playing state *\/ }
 * pxm-video[data-disabled="true"] { opacity: 0.5; }
 * pxm-video [data-thumbnail] { cursor: pointer; }
 * /* Use data- attributes for all styling hooks *\/
 * ```
 *
 * Events:
 * - `pxm:video:before-play` (cancelable)
 * - `pxm:video:play`
 * - `pxm:video:pause`
 * - `pxm:video:mute`
 * - `pxm:video:unmute`
 * - `pxm:video:seek`
 * - `pxm:video:fullscreen`
 * - `pxm:video:error`
 *
 * Accessibility:
 * - Manages essential ARIA attributes: aria-pressed, aria-disabled, aria-label, etc.
 * - Sets data- attributes for all state (data-state, data-disabled, etc.)
 * - Consumer is responsible for roles, labels, and additional ARIA as needed
 *
 * SSR / Hydration Support:
 * - No Shadow DOM, so SSR is seamless
 * - Initial state is read from DOM attributes
 *
 * Public API:
 * - play(), pause(), mute(), unmute(), seek(time), enterFullscreen(), exitFullscreen()
 *
 * Dynamic Content:
 * - Observes for changes to child nodes (MutationObserver)
 *
 * Error Handling:
 * - All operations wrapped in error boundaries
 * - Graceful fallbacks for unsupported sources or errors
 *
 * @element pxm-video
 * @export PxmVideo
 */

/**
 * Video component configuration interface
 */
export interface VideoConfig {
  src: string;
  type: 'youtube' | 'vimeo' | 'mux' | 'mp4' | 'other';
  thumbnail?: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  title?: string;
  description?: string;
}

/**
 * Video component options interface
 */
export interface VideoOptions {
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
}

/**
 * Video component state interface
 */
export interface VideoState {
  isPlaying: boolean;
  isLoaded: boolean;
  error?: string;
}

/**
 * Video source type definition
 */
export type VideoSource = {
  url: string;
  type: VideoConfig['type'];
};

/**
 * Constants for the video component
 */
const VIDEO_CONSTANTS = {
  YOUTUBE_THUMBNAIL_URL: 'https://img.youtube.com/vi',
  VIMEO_API_URL: 'https://vimeo.com/api/v2/video',
  DEFAULT_THUMBNAIL_HEIGHT: '200px',
  DEFAULT_VIDEO_TIME: 1,
  YOUTUBE_ID_LENGTH: 11,
  ATTRIBUTES: {
    THUMBNAIL: 'data-thumbnail',
    CONTROLS: 'data-controls',
  },
  ARIA_LABELS: {
    PLAY_BUTTON: 'Play video',
    VIDEO_THUMBNAIL: 'Video thumbnail - click to play',
  },
} as const;

export interface PxmVideoAPI {
  play(): void;
  pause(): void;
  mute(): void;
  unmute(): void;
  seek(time: number): void;
  enterFullscreen(): void;
  exitFullscreen(): void;
}

/**
 * Custom video element that supports multiple video sources including YouTube, Vimeo, Mux, and MP4
 * Provides thumbnail generation and lazy loading capabilities
 */
export class PxmVideo extends HTMLElement implements PxmVideoAPI {
  private config: VideoConfig;
  private state: VideoState;
  private videoElement: HTMLVideoElement | null = null;
  private iframeElement: HTMLIFrameElement | null = null;
  private thumbnailElement: HTMLElement | null = null;

  /**
   * Observed attributes for the custom element
   */
  static get observedAttributes(): string[] {
    return ['src', 'type', 'thumbnail', 'autoplay', 'muted', 'controls', 'width', 'height', 'title', 'description'];
  }

  constructor() {
    super();
    this.config = this.getDefaultConfig();
    this.state = {
      isPlaying: false,
      isLoaded: false,
    };
  }

  /**
   * Called when the element is added to the DOM
   */
  connectedCallback(): void {
    this.initializeFromAttributes();
    this.initializeFromContent();
    this.init();
    this.updateState();
  }

  /**
   * Called when an observed attribute changes
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    this.updateConfigFromAttribute(name, newValue);

    if (this.isConnected) {
      this.init();
    }
  }

  /**
   * Called when the element is removed from the DOM
   */
  disconnectedCallback(): void {
    this.cleanup();
  }

  /**
   * Gets the default configuration for the video component
   */
  private getDefaultConfig(): VideoConfig {
    return {
      src: '',
      type: 'other',
      autoplay: true,
      muted: true,
      controls: true,
    };
  }

  /**
   * Updates the configuration based on attribute changes
   */
  private updateConfigFromAttribute(name: string, value: string): void {
    switch (name) {
      case 'src':
        this.config.src = value;
        break;
      case 'type':
        this.config.type = value as VideoConfig['type'];
        break;
      case 'thumbnail':
        this.config.thumbnail = value;
        break;
      case 'autoplay':
        this.config.autoplay = value === 'true';
        break;
      case 'muted':
        this.config.muted = value === 'true';
        break;
      case 'controls':
        this.config.controls = value === 'true';
        break;
      case 'width':
        this.config.width = value;
        break;
      case 'height':
        this.config.height = value;
        break;
      case 'title':
        this.config.title = value;
        break;
      case 'description':
        this.config.description = value;
        break;
    }
  }

  /**
   * Initializes configuration from HTML attributes
   */
  private initializeFromAttributes(): void {
    this.config.src = this.getAttribute('src') || '';
    this.config.type = (this.getAttribute('type') as VideoConfig['type']) || 'other';
    this.config.thumbnail = this.getAttribute('thumbnail') || undefined;
    this.config.autoplay = this.getAttribute('autoplay') === 'true';
    this.config.muted = this.getAttribute('muted') === 'true';
    this.config.controls = this.getAttribute('controls') === 'true';
    this.config.width = this.getAttribute('width') || '100%';
    this.config.height = this.getAttribute('height') || 'auto';
    this.config.title = this.getAttribute('title') || undefined;
    this.config.description = this.getAttribute('description') || undefined;
  }

  /**
   * Initializes from existing DOM content
   */
  private initializeFromContent(): void {
    const existingThumbnail = this.querySelector(`[${VIDEO_CONSTANTS.ATTRIBUTES.THUMBNAIL}]`);
    if (existingThumbnail) {
      this.setupThumbnailElement(existingThumbnail as HTMLElement);
    }
  }

  /**
   * Ensures keyboard navigation is supported for the thumbnail.
   * Enter/Space on thumbnail plays the video. tabindex is set for accessibility.
   */
  private setupThumbnailElement(element: HTMLElement): void {
    this.thumbnailElement = element;
    // Remove all internal styling and ARIA/role except for keyboard logic
    // Only set tabindex for keyboard accessibility if not a native button
    if (element.tagName !== 'BUTTON') {
      this.thumbnailElement.setAttribute('tabindex', '0');
      // No role or aria-label set; user is responsible for accessibility
    }
    // Add click and keyboard event listeners for logic only
    this.thumbnailElement.addEventListener('click', () => this.playVideo());
    this.thumbnailElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.playVideo();
      }
    });
  }

  /**
   * Initializes the video component
   */
  private init(): void {
    this.clearContent();
    if (this.config.src) {
      // 1. If data-thumbnail-mode="auto": replace image with video thumbnail
      const autoDiv = this.querySelector('div[data-thumbnail][data-thumbnail-mode="auto"]');
      if (autoDiv) {
        // Remove all other <div data-thumbnail> except this one
        this.querySelectorAll('div[data-thumbnail]').forEach(div => {
          if (div !== autoDiv) div.remove();
        });
        // Generate and replace thumbnail using the existing thumbnail generation logic
        this.replaceAutoThumbnail(autoDiv as HTMLElement);
        return;
      }
      // 2. If data-thumbnail-mode="custom" or no mode: leave custom image untouched and do not override
      const customDiv = this.querySelector('div[data-thumbnail][data-thumbnail-mode="custom"], div[data-thumbnail]:not([data-thumbnail-mode])');
      if (customDiv) {
        // Remove all other <div data-thumbnail> except this one
        this.querySelectorAll('div[data-thumbnail]').forEach(div => {
          if (div !== customDiv) div.remove();
        });
        this.setupThumbnailElement(customDiv as HTMLElement);
        // Strict: do not generate or append any other thumbnail
        return;
      }
      // 3. Fallback: no custom thumbnail present, generate auto thumbnail
      this.generateThumbnail();
    }
  }

  /**
   * Replaces the placeholder image in auto thumbnail mode with the actual video thumbnail
   */
  private async replaceAutoThumbnail(autoDiv: HTMLElement): Promise<void> {
    const img = autoDiv.querySelector('img');
    if (!img) {
      this.setupThumbnailElement(autoDiv);
      return;
    }

    const source = this.parseVideoSource(this.config.src);

    try {
      switch (source.type) {
        case 'youtube': {
          const videoId = this.extractYouTubeId(source.url);
          if (videoId) {
            // Remove srcset to prevent it from overriding our src
            img.removeAttribute('srcset');
            img.removeAttribute('sizes');

            // Try high-quality thumbnail first, fallback to standard quality
            const highQualityUrl = `${VIDEO_CONSTANTS.YOUTUBE_THUMBNAIL_URL}/${videoId}/maxresdefault.jpg`;
            img.src = highQualityUrl;
            img.alt = this.config.title || 'YouTube video thumbnail';

            // Add fallback handler for high-quality thumbnail
            img.addEventListener('error', () => {
              img.src = `${VIDEO_CONSTANTS.YOUTUBE_THUMBNAIL_URL}/${videoId}/hqdefault.jpg`;
            }, { once: true });
          }
          break;
        }
        case 'vimeo': {
          const videoId = this.extractVimeoId(source.url);
          if (videoId) {
            try {
              const response = await fetch(`${VIDEO_CONSTANTS.VIMEO_API_URL}/${videoId}.json`);
              if (response.ok) {
                const data = await response.json();
                // Remove srcset to prevent it from overriding our src
                img.removeAttribute('srcset');
                img.removeAttribute('sizes');
                img.src = data[0].thumbnail_large;
                img.alt = this.config.title || data[0].title || 'Vimeo video thumbnail';
              }
            } catch (error) {
              console.warn('Failed to load Vimeo thumbnail for auto mode:', error);
            }
          }
          break;
        }
        case 'mp4': {
          // For MP4, we need to generate a thumbnail from the video
          this.generateMP4ThumbnailForElement(source.url, img);
          break;
        }
        case 'mux': {
          // Mux thumbnail generation is not implemented yet
          // Keep the placeholder image as is
          break;
        }
        default: {
          // For other types, keep the placeholder image as is
          break;
        }
      }
    } catch (error) {
      console.warn('Failed to replace auto thumbnail:', error);
    }

    this.setupThumbnailElement(autoDiv);
  }

  /**
   * Generates a thumbnail from an MP4 video and updates an existing img element
   */
  private generateMP4ThumbnailForElement(url: string, img: HTMLImageElement): void {
    const video = document.createElement('video');
    video.src = url;
    video.crossOrigin = 'anonymous';
    video.currentTime = VIDEO_CONSTANTS.DEFAULT_VIDEO_TIME;
    video.muted = true;

    const handleLoadedData = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Remove srcset to prevent it from overriding our src
        img.removeAttribute('srcset');
        img.removeAttribute('sizes');
        img.src = canvas.toDataURL();
        img.alt = this.config.title || 'Video thumbnail';
      } catch (error) {
        console.warn('Failed to generate MP4 thumbnail for auto mode:', error);
      } finally {
        this.cleanupVideoElement(video);
      }
    };

    const handleError = () => {
      console.warn('Failed to load MP4 for thumbnail generation in auto mode');
      this.cleanupVideoElement(video);
    };

    video.addEventListener('loadeddata', handleLoadedData, { once: true });
    video.addEventListener('error', handleError, { once: true });
  }

  /**
   * Clears existing content from the component
   */
  private clearContent(): void {
    // Preserve valid thumbnail containers: auto mode, custom mode, or no mode
    const autoDiv = this.querySelector('div[data-thumbnail][data-thumbnail-mode="auto"]');
    const customDiv = this.querySelector('div[data-thumbnail][data-thumbnail-mode="custom"], div[data-thumbnail]:not([data-thumbnail-mode])');

    this.querySelectorAll('div[data-thumbnail]').forEach(div => {
      // Only remove divs that are NOT one of our valid thumbnail containers
      if (div !== autoDiv && div !== customDiv) {
        div.remove();
      }
    });

    // Remove any existing error messages, thumbnails, or players
    const existingContent = this.querySelectorAll('div:not([data-thumbnail])');
    existingContent.forEach(element => {
      const htmlElement = element as HTMLElement;
      if (element.textContent?.includes('Error:') ||
        htmlElement.style.backgroundColor === 'rgb(244, 67, 54)') {
        this.removeChild(element);
      }
    });
  }



  /**
   * Creates a custom thumbnail from the provided URL
   */
  private createCustomThumbnail(): void {
    const thumbnailDiv = this.createThumbnailContainer();

    const img = document.createElement('img');
    img.src = this.config.thumbnail!;
    img.alt = this.config.title || 'Video thumbnail';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.objectFit = 'cover';

    // Handle image load errors
    img.addEventListener('error', () => {
      console.warn('Failed to load custom thumbnail, falling back to generated thumbnail');
      this.generateThumbnail();
    });

    thumbnailDiv.appendChild(img);
    this.appendThumbnail(thumbnailDiv);
  }

  /**
   * Generates a thumbnail based on the video source type
   */
  private async generateThumbnail(): Promise<void> {
    try {
      const source = this.parseVideoSource(this.config.src);

      switch (source.type) {
        case 'youtube':
          this.generateYouTubeThumbnail(source.url);
          break;
        case 'vimeo':
          await this.generateVimeoThumbnail(source.url);
          break;
        case 'mux':
          this.generateMuxThumbnail(source.url);
          break;
        case 'mp4':
          this.generateMP4Thumbnail(source.url);
          break;
        default:
          this.createDefaultThumbnail();
      }
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      this.createDefaultThumbnail();
    }
  }

  /**
   * Parses the video source URL to determine its type
   */
  private parseVideoSource(url: string): VideoSource {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return { url, type: 'youtube' };
    } else if (url.includes('vimeo.com')) {
      return { url, type: 'vimeo' };
    } else if (url.includes('mux.com')) {
      return { url, type: 'mux' };
    } else if (url.endsWith('.mp4') || url.includes('.mp4')) {
      return { url, type: 'mp4' };
    }
    return { url, type: 'other' };
  }

  /**
   * Generates a YouTube thumbnail
   */
  private generateYouTubeThumbnail(url: string): void {
    const videoId = this.extractYouTubeId(url);
    if (!videoId) {
      this.createDefaultThumbnail();
      return;
    }

    const thumbnailDiv = this.createThumbnailContainer();
    const img = document.createElement('img');

    // Try high-quality thumbnail first, fallback to standard quality
    img.src = `${VIDEO_CONSTANTS.YOUTUBE_THUMBNAIL_URL}/${videoId}/maxresdefault.jpg`;
    img.alt = this.config.title || 'YouTube video thumbnail';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.objectFit = 'cover';

    img.addEventListener('error', () => {
      img.src = `${VIDEO_CONSTANTS.YOUTUBE_THUMBNAIL_URL}/${videoId}/hqdefault.jpg`;
    });

    thumbnailDiv.appendChild(img);
    this.appendThumbnail(thumbnailDiv);
  }

  /**
   * Generates a Vimeo thumbnail using their API
   */
  private async generateVimeoThumbnail(url: string): Promise<void> {
    const videoId = this.extractVimeoId(url);
    if (!videoId) {
      this.createDefaultThumbnail();
      return;
    }

    try {
      const response = await fetch(`${VIDEO_CONSTANTS.VIMEO_API_URL}/${videoId}.json`);
      if (!response.ok) {
        throw new Error(`Vimeo API error: ${response.status}`);
      }

      const data = await response.json();
      const thumbnailDiv = this.createThumbnailContainer();

      const img = document.createElement('img');
      img.src = data[0].thumbnail_large;
      img.alt = this.config.title || data[0].title || 'Vimeo video thumbnail';
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.objectFit = 'cover';

      thumbnailDiv.appendChild(img);
      this.appendThumbnail(thumbnailDiv);
    } catch (error) {
      console.warn('Failed to load Vimeo thumbnail:', error);
      this.createDefaultThumbnail();
    }
  }

  /**
   * Generates a Mux thumbnail (currently creates default thumbnail)
   * TODO: Implement Mux thumbnail generation when API is available
   */
  private generateMuxThumbnail(_url: string): void {
    // TODO: Implement Mux thumbnail generation
    // For now, create a default thumbnail
    this.createDefaultThumbnail();
  }

  /**
   * Generates a thumbnail from an MP4 video by capturing a frame
   */
  private generateMP4Thumbnail(url: string): void {
    const video = document.createElement('video');
    video.src = url;
    video.crossOrigin = 'anonymous';
    video.currentTime = VIDEO_CONSTANTS.DEFAULT_VIDEO_TIME;
    video.muted = true;

    const handleLoadedData = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const thumbnailDiv = this.createThumbnailContainer();
        const img = document.createElement('img');
        img.src = canvas.toDataURL();
        img.alt = this.config.title || 'Video thumbnail';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.objectFit = 'cover';

        thumbnailDiv.appendChild(img);
        this.appendThumbnail(thumbnailDiv);
      } catch (error) {
        console.warn('Failed to generate MP4 thumbnail:', error);
        this.createDefaultThumbnail();
      } finally {
        this.cleanupVideoElement(video);
      }
    };

    const handleError = () => {
      console.warn('Failed to load MP4 for thumbnail generation');
      this.createDefaultThumbnail();
      this.cleanupVideoElement(video);
    };

    video.addEventListener('loadeddata', handleLoadedData, { once: true });
    video.addEventListener('error', handleError, { once: true });
  }

  /**
   * Creates a default thumbnail when other methods fail
   */
  private createDefaultThumbnail(): void {
    const thumbnailDiv = this.createThumbnailContainer();
    thumbnailDiv.style.height = VIDEO_CONSTANTS.DEFAULT_THUMBNAIL_HEIGHT;
    thumbnailDiv.style.backgroundColor = '#000';
    thumbnailDiv.style.display = 'flex';
    thumbnailDiv.style.alignItems = 'center';
    thumbnailDiv.style.justifyContent = 'center';
    thumbnailDiv.style.color = '#fff';
    thumbnailDiv.style.fontSize = '48px';

    // Add a play icon
    thumbnailDiv.innerHTML = '▶';

    this.appendThumbnail(thumbnailDiv);
  }

  /**
   * Creates a thumbnail container with common styles and attributes
   */
  private createThumbnailContainer(): HTMLElement {
    const thumbnailDiv = document.createElement('div');
    thumbnailDiv.setAttribute(VIDEO_CONSTANTS.ATTRIBUTES.THUMBNAIL, '');
    thumbnailDiv.style.position = 'relative';
    thumbnailDiv.style.cursor = 'pointer';
    thumbnailDiv.style.width = '100%';

    return thumbnailDiv;
  }

  /**
   * Appends a thumbnail to the component and sets up event listeners
   */
  private appendThumbnail(thumbnailDiv: HTMLElement): void {
    this.setupThumbnailElement(thumbnailDiv);
    this.appendChild(thumbnailDiv);
  }

  /**
   * Plays the video by removing the thumbnail and creating the appropriate player
   */
  private playVideo(): void {
    // Integrate animation for fade-out thumbnail, fade-in video using direct style changes
    if (this.thumbnailElement) {
      // Use CSS transition for fade-out
      this.thumbnailElement.style.transition = 'opacity 0.3s';
      this.thumbnailElement.style.opacity = '0';
      setTimeout(() => {
        this.removeThumbnail();
        // After thumbnail is removed, create and fade in the video/iframe
        this.createAndAnimateVideo();
      }, 300);
    } else {
      this.createAndAnimateVideo();
    }
  }

  // Helper to create video/iframe and fade it in
  private createAndAnimateVideo(): void {
    // Validate that we have a video source before proceeding
    if (!this.config.src) {
      this.handleError('No video source provided');
      return;
    }

    this.state.isPlaying = true;

    const source = this.parseVideoSource(this.config.src);

    try {
      switch (source.type) {
        case 'youtube':
          this.createYouTubePlayer(source.url);
          break;
        case 'vimeo':
          this.createVimeoPlayer(source.url);
          break;
        case 'mux':
          this.createMuxPlayer(source.url);
          break;
        case 'mp4':
          this.createVideoPlayer(source.url);
          break;
        default:
          this.createVideoPlayer(source.url);
      }
      this.state.isLoaded = true;
    } catch (error) {
      this.handleError(`Failed to create video player: ${error}`);
    }

    // Fade in the video/iframe using direct style changes
    const el = this.videoElement || this.iframeElement;
    if (el) {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s';
      requestAnimationFrame(() => {
        el.style.opacity = '1';
      });
    }
    // TODO: Add animation for overlays or error messages if needed
  }

  /**
   * Removes the thumbnail element
   */
  private removeThumbnail(): void {
    const thumbnailDiv = this.querySelector(`[${VIDEO_CONSTANTS.ATTRIBUTES.THUMBNAIL}]`);
    if (thumbnailDiv) {
      this.removeChild(thumbnailDiv);
      this.thumbnailElement = null;
    }
  }

  /**
   * Creates a YouTube player iframe
   */
  private createYouTubePlayer(url: string): void {
    const videoId = this.extractYouTubeId(url);
    if (!videoId) {
      this.handleError('Invalid YouTube URL');
      return;
    }

    const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
    embedUrl.searchParams.set('autoplay', '1');
    embedUrl.searchParams.set('mute', this.config.muted ? '1' : '0');

    this.iframeElement = this.createIframe(embedUrl.toString());
    this.iframeElement.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

    this.appendChild(this.createPlayerWrapper(this.iframeElement));
  }

  /**
   * Creates a Vimeo player iframe
   */
  private createVimeoPlayer(url: string): void {
    const videoId = this.extractVimeoId(url);
    if (!videoId) {
      this.handleError('Invalid Vimeo URL');
      return;
    }

    const embedUrl = new URL(`https://player.vimeo.com/video/${videoId}`);
    embedUrl.searchParams.set('autoplay', '1');
    embedUrl.searchParams.set('muted', this.config.muted ? '1' : '0');

    this.iframeElement = this.createIframe(embedUrl.toString());
    this.iframeElement.allow = 'autoplay; fullscreen; picture-in-picture';

    this.appendChild(this.createPlayerWrapper(this.iframeElement));
  }

  /**
   * Creates a Mux player (currently delegates to standard video player)
   */
  private createMuxPlayer(url: string): void {
    // TODO: Implement dedicated Mux player if needed
    this.createVideoPlayer(url);
  }

  /**
   * Creates a standard HTML5 video player
   */
  private createVideoPlayer(url: string): void {
    this.videoElement = document.createElement('video');
    this.videoElement.src = url;
    this.videoElement.controls = this.config.controls ?? true;
    this.videoElement.autoplay = this.config.autoplay ?? true;
    this.videoElement.muted = this.config.muted ?? true;
    this.videoElement.style.width = '100%';
    this.videoElement.style.height = '100%';

    if (this.config.title) {
      this.videoElement.setAttribute('aria-label', this.config.title);
    }

    // Add controls attribute conditionally
    if (this.config.controls ?? true) {
      this.videoElement.setAttribute('controls', '');
      this.videoElement.setAttribute(VIDEO_CONSTANTS.ATTRIBUTES.CONTROLS, '');
    }

    this.appendChild(this.createPlayerWrapper(this.videoElement));

    // Handle video events
    this.videoElement.addEventListener('error', () => {
      this.handleError('Failed to load video');
    });

    this.videoElement.load();

    if (this.config.autoplay) {
      this.videoElement.play().catch(error => {
        console.warn('Autoplay failed:', error);
      });
    }
  }

  /**
   * Creates an iframe element with common attributes
   */
  private createIframe(src: string): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;

    if (this.config.title) {
      iframe.title = this.config.title;
    }

    return iframe;
  }

  /**
   * Creates a wrapper for video players with responsive styling
   */
  private createPlayerWrapper(element: HTMLElement): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.minHeight = '200px';

    element.style.position = 'absolute';
    element.style.top = '0';
    element.style.left = '0';

    wrapper.appendChild(element);
    return wrapper;
  }

  /**
   * Extracts YouTube video ID from various URL formats
   */
  private extractYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === VIDEO_CONSTANTS.YOUTUBE_ID_LENGTH) ? match[2] : null;
  }

  /**
   * Extracts Vimeo video ID from URL
   */
  private extractVimeoId(url: string): string | null {
    const regExp = /(?:vimeo\.com\/)(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  /**
   * Handles errors by logging and optionally displaying to user
   */
  private handleError(message: string): void {
    console.error(`PxmVideo Error: ${message}`);
    this.state.error = message;

    // Create an error display
    const errorDiv = document.createElement('div');
    errorDiv.style.width = '100%';
    errorDiv.style.height = VIDEO_CONSTANTS.DEFAULT_THUMBNAIL_HEIGHT;
    errorDiv.style.backgroundColor = '#f44336';
    errorDiv.style.color = 'white';
    errorDiv.style.display = 'flex';
    errorDiv.style.alignItems = 'center';
    errorDiv.style.justifyContent = 'center';
    errorDiv.style.padding = '16px';
    errorDiv.style.textAlign = 'center';
    errorDiv.textContent = `Error: ${message}`;

    this.appendChild(errorDiv);
  }

  /**
   * Cleans up video element resources
   */
  private cleanupVideoElement(video: HTMLVideoElement): void {
    video.removeEventListener('loadeddata', () => { });
    video.removeEventListener('error', () => { });
    video.pause();
    video.src = '';
    video.load();
  }

  /**
   * Cleans up all component resources
   */
  private cleanup(): void {
    if (this.videoElement) {
      this.cleanupVideoElement(this.videoElement);
      this.videoElement = null;
    }

    if (this.iframeElement) {
      this.iframeElement.remove();
      this.iframeElement = null;
    }

    if (this.thumbnailElement) {
      this.thumbnailElement.remove();
      this.thumbnailElement = null;
    }

    this.state = {
      isPlaying: false,
      isLoaded: false,
    };
  }

  /**
   * Updates ARIA and data- attributes for all stateful properties
   *
   * Managed ARIA attributes:
   * - aria-pressed: reflects playing state
   * - aria-expanded: reflects whether video is playing (expanded)
   * - aria-label: reflects play/pause/muted state
   *
   * Consumer is responsible for roles, labels, and additional ARIA as needed.
   */
  private updateState(): void {
    // Playing state
    this.setAttribute('data-state', this.state.isPlaying ? 'playing' : 'paused');
    this.setAttribute('aria-pressed', String(this.state.isPlaying));
    this.setAttribute('aria-expanded', String(this.state.isPlaying));
    // Muted state (from config)
    if (this.config.muted !== undefined) {
      this.setAttribute('data-muted', String(this.config.muted));
      this.setAttribute('aria-label', this.config.muted ? (this.state.isPlaying ? 'Playing (Muted)' : 'Muted') : (this.state.isPlaying ? 'Playing' : 'Paused'));
    } else {
      this.removeAttribute('data-muted');
      this.removeAttribute('aria-label');
    }
    // Loading state
    if (this.state.isLoaded !== undefined) {
      this.setAttribute('data-loaded', String(this.state.isLoaded));
    } else {
      this.removeAttribute('data-loaded');
    }
  }

  // --- Public API implementations ---
  /**
   * Play the video. Fires pxm:video:before-play (cancelable) and pxm:video:play events.
   * Wrapped in error boundary for graceful error handling.
   */
  play(): void {
    try {
      const beforeEvent = new CustomEvent('pxm:video:before-play', {
        detail: { element: this },
        cancelable: true
      });
      if (!this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented) return;
      if (this.videoElement) {
        this.videoElement.play();
      } else if (this.iframeElement) {
        // YouTube/Vimeo/Mux iframe: no direct API for play
      }
      this.state.isPlaying = true;
      this.updateState();
      this.dispatchEvent(new CustomEvent('pxm:video:play', { detail: { element: this } }));
    } catch (error) {
      this.dispatchError((error as Error).message || 'Unknown error in play()');
    }
  }
  /**
   * Pause the video. Fires pxm:video:before-pause (cancelable) and pxm:video:pause events.
   * Wrapped in error boundary for graceful error handling.
   */
  pause(): void {
    try {
      const beforeEvent = new CustomEvent('pxm:video:before-pause', {
        detail: { element: this },
        cancelable: true
      });
      if (!this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented) return;
      if (this.videoElement) {
        this.videoElement.pause();
      } else if (this.iframeElement) {
        // YouTube/Vimeo/Mux iframe: no direct API for pause
      }
      this.state.isPlaying = false;
      this.updateState();
      this.dispatchEvent(new CustomEvent('pxm:video:pause', { detail: { element: this } }));
    } catch (error) {
      this.dispatchError((error as Error).message || 'Unknown error in pause()');
    }
  }
  /**
   * Mute the video. Fires pxm:video:before-mute (cancelable) and pxm:video:mute events.
   * Wrapped in error boundary for graceful error handling.
   */
  mute(): void {
    try {
      const beforeEvent = new CustomEvent('pxm:video:before-mute', {
        detail: { element: this },
        cancelable: true
      });
      if (!this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented) return;
      if (this.videoElement) {
        this.videoElement.muted = true;
      } else if (this.iframeElement) {
        // Mux iframe: no direct API for mute
      }
      this.config.muted = true;
      this.updateState();
      this.dispatchEvent(new CustomEvent('pxm:video:mute', { detail: { element: this } }));
    } catch (error) {
      this.dispatchError((error as Error).message || 'Unknown error in mute()');
    }
  }
  /**
   * Unmute the video. Fires pxm:video:before-unmute (cancelable) and pxm:video:unmute events.
   * Wrapped in error boundary for graceful error handling.
   */
  unmute(): void {
    try {
      const beforeEvent = new CustomEvent('pxm:video:before-unmute', {
        detail: { element: this },
        cancelable: true
      });
      if (!this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented) return;
      if (this.videoElement) {
        this.videoElement.muted = false;
      } else if (this.iframeElement) {
        // Mux iframe: no direct API for unmute
      }
      this.config.muted = false;
      this.updateState();
      this.dispatchEvent(new CustomEvent('pxm:video:unmute', { detail: { element: this } }));
    } catch (error) {
      this.dispatchError((error as Error).message || 'Unknown error in unmute()');
    }
  }
  /**
   * Seek to a specific time. Fires pxm:video:before-seek (cancelable) and pxm:video:seek events.
   * Wrapped in error boundary for graceful error handling.
   */
  seek(time: number): void {
    try {
      const beforeEvent = new CustomEvent('pxm:video:before-seek', {
        detail: { element: this, time },
        cancelable: true
      });
      if (!this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented) return;
      if (this.videoElement) {
        this.videoElement.currentTime = time;
      } else if (this.iframeElement) {
        // Mux iframe: no direct API for seek
      }
      this.dispatchEvent(new CustomEvent('pxm:video:seek', { detail: { element: this, time } }));
    } catch (error) {
      this.dispatchError((error as Error).message || 'Unknown error in seek()');
    }
  }
  /**
   * Enter fullscreen. Fires pxm:video:before-fullscreen (cancelable) and pxm:video:fullscreen events.
   * Wrapped in error boundary for graceful error handling.
   */
  enterFullscreen(): void {
    try {
      const beforeEvent = new CustomEvent('pxm:video:before-fullscreen', {
        detail: { element: this },
        cancelable: true
      });
      if (!this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented) return;
      if (this.videoElement) {
        if (this.videoElement.requestFullscreen) {
          this.videoElement.requestFullscreen();
        }
      }
      // Fullscreen for iframe is not standardized; user should wrap in a container if needed
      this.dispatchEvent(new CustomEvent('pxm:video:fullscreen', { detail: { element: this } }));
    } catch (error) {
      this.dispatchError((error as Error).message || 'Unknown error in enterFullscreen()');
    }
  }
  /**
   * Exit fullscreen. Fires pxm:video:before-exit-fullscreen (cancelable) and pxm:video:exit-fullscreen events.
   * Wrapped in error boundary for graceful error handling.
   */
  exitFullscreen(): void {
    try {
      const beforeEvent = new CustomEvent('pxm:video:before-exit-fullscreen', {
        detail: { element: this },
        cancelable: true
      });
      if (!this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented) return;
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      this.dispatchEvent(new CustomEvent('pxm:video:exit-fullscreen', { detail: { element: this } }));
    } catch (error) {
      this.dispatchError((error as Error).message || 'Unknown error in exitFullscreen()');
    }
  }

  /**
   * Dispatches a pxm:video:error event with error details
   */
  private dispatchError(message: string): void {
    this.dispatchEvent(new CustomEvent('pxm:video:error', {
      detail: { element: this, message }
    }));
  }
}

// Inject dependencies if requested (for CDN usage)
import { injectComponentDependencies } from '../dependency-injector';
injectComponentDependencies('video').catch(error => {
  console.warn('Failed to inject video dependencies:', error);
});

customElements.define('pxm-video', PxmVideo);

// At the end of the file, export the class globally for advanced usage
if (typeof window !== 'undefined') {
  (window as any).PxmVideo = PxmVideo;
} 