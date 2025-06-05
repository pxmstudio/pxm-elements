/**
 * PxmVideo Component
 *
 * A customizable video component that supports multiple video sources including YouTube, Vimeo, Mux, and MP4.
 * Provides thumbnail generation and lazy loading capabilities.
 *
 * For detailed documentation, see the README.md file in this directory.
 */
/**
 * Custom video element that supports multiple video sources including YouTube, Vimeo, Mux, and MP4
 * Provides thumbnail generation and lazy loading capabilities
 */
export declare class PxmVideo extends HTMLElement {
    private config;
    private state;
    private videoElement;
    private iframeElement;
    private thumbnailElement;
    /**
     * Observed attributes for the custom element
     */
    static get observedAttributes(): string[];
    constructor();
    /**
     * Called when the element is added to the DOM
     */
    connectedCallback(): void;
    /**
     * Called when an observed attribute changes
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    /**
     * Called when the element is removed from the DOM
     */
    disconnectedCallback(): void;
    /**
     * Gets the default configuration for the video component
     */
    private getDefaultConfig;
    /**
     * Updates the configuration based on attribute changes
     */
    private updateConfigFromAttribute;
    /**
     * Initializes configuration from HTML attributes
     */
    private initializeFromAttributes;
    /**
     * Initializes from existing DOM content
     */
    private initializeFromContent;
    /**
     * Sets up an existing thumbnail element with proper event listeners and accessibility
     */
    private setupThumbnailElement;
    /**
     * Initializes the video component
     */
    private init;
    /**
     * Clears existing content from the component
     */
    private clearContent;
    /**
     * Creates a thumbnail for the video
     */
    private createThumbnail;
    /**
     * Creates a custom thumbnail from the provided URL
     */
    private createCustomThumbnail;
    /**
     * Generates a thumbnail based on the video source type
     */
    private generateThumbnail;
    /**
     * Parses the video source URL to determine its type
     */
    private parseVideoSource;
    /**
     * Generates a YouTube thumbnail
     */
    private generateYouTubeThumbnail;
    /**
     * Generates a Vimeo thumbnail using their API
     */
    private generateVimeoThumbnail;
    /**
     * Generates a Mux thumbnail (currently creates default thumbnail)
     * TODO: Implement Mux thumbnail generation when API is available
     */
    private generateMuxThumbnail;
    /**
     * Generates a thumbnail from an MP4 video by capturing a frame
     */
    private generateMP4Thumbnail;
    /**
     * Creates a default thumbnail when other methods fail
     */
    private createDefaultThumbnail;
    /**
     * Creates a thumbnail container with common styles and attributes
     */
    private createThumbnailContainer;
    /**
     * Appends a thumbnail to the component and sets up event listeners
     */
    private appendThumbnail;
    /**
     * Plays the video by removing the thumbnail and creating the appropriate player
     */
    private playVideo;
    /**
     * Removes the thumbnail element
     */
    private removeThumbnail;
    /**
     * Creates a YouTube player iframe
     */
    private createYouTubePlayer;
    /**
     * Creates a Vimeo player iframe
     */
    private createVimeoPlayer;
    /**
     * Creates a Mux player (currently delegates to standard video player)
     */
    private createMuxPlayer;
    /**
     * Creates a standard HTML5 video player
     */
    private createVideoPlayer;
    /**
     * Creates an iframe element with common attributes
     */
    private createIframe;
    /**
     * Creates a wrapper for video players with responsive styling
     */
    private createPlayerWrapper;
    /**
     * Extracts YouTube video ID from various URL formats
     */
    private extractYouTubeId;
    /**
     * Extracts Vimeo video ID from URL
     */
    private extractVimeoId;
    /**
     * Handles errors by logging and optionally displaying to user
     */
    private handleError;
    /**
     * Cleans up video element resources
     */
    private cleanupVideoElement;
    /**
     * Cleans up all component resources
     */
    private cleanup;
}
