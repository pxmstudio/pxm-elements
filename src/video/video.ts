/**
 * PxmVideo Component
 * 
 * A customizable video component that supports multiple video sources including YouTube, Vimeo, Mux, and MP4.
 * Provides thumbnail generation and lazy loading capabilities.
 * 
 * For detailed documentation, see the README.md file in this directory.
 */

import type { VideoConfig, VideoSource, VideoState } from './types';

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

/**
 * Custom video element that supports multiple video sources including YouTube, Vimeo, Mux, and MP4
 * Provides thumbnail generation and lazy loading capabilities
 */
export class PxmVideo extends HTMLElement {
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
   * Sets up an existing thumbnail element with proper event listeners and accessibility
   */
  private setupThumbnailElement(element: HTMLElement): void {
    this.thumbnailElement = element;
    this.thumbnailElement.style.cursor = 'pointer';
    this.thumbnailElement.setAttribute('role', 'button');
    this.thumbnailElement.setAttribute('aria-label', VIDEO_CONSTANTS.ARIA_LABELS.PLAY_BUTTON);
    this.thumbnailElement.setAttribute('tabindex', '0');
    
    // Add click and keyboard event listeners
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
    // Clear any existing content first
    this.clearContent();

    // Only create thumbnail if we have a source
    if (this.config.src) {
      if (!this.querySelector(`[${VIDEO_CONSTANTS.ATTRIBUTES.THUMBNAIL}]`)) {
        this.createThumbnail();
      }
    }
  }

  /**
   * Clears existing content from the component
   */
  private clearContent(): void {
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
   * Creates a thumbnail for the video
   */
  private createThumbnail(): void {
    if (this.config.thumbnail) {
      this.createCustomThumbnail();
    } else {
      this.generateThumbnail();
    }
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
    if (this.state.isPlaying) return;

    // Validate that we have a video source before proceeding
    if (!this.config.src) {
      this.handleError('No video source provided');
      return;
    }

    this.removeThumbnail();
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
    video.removeEventListener('loadeddata', () => {});
    video.removeEventListener('error', () => {});
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
}

customElements.define('pxm-video', PxmVideo); 