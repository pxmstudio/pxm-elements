/**
 * Main PXM Lightbox component class
 *
 * This class orchestrates all the lightbox functionality by delegating
 * specific responsibilities to specialized manager classes.
 */
import type { LightboxMode, ZoomMode, MediaType, MediaItem } from './types';
/**
 * Main lightbox component that provides image and video gallery functionality
 * with optional modal view and zoom capabilities
 */
export declare class PxmLightbox extends HTMLElement {
    private readonly configManager;
    private readonly zoomManager;
    private readonly modalManager;
    private readonly eventManager;
    private readonly thumbnails;
    private readonly targetImage;
    private readonly targetVideo;
    private readonly mode;
    private readonly zoomMode;
    private currentMediaType;
    constructor();
    /**
     * Called when element is removed from DOM
     * Performs cleanup of all managers and event listeners
     */
    disconnectedCallback(): void;
    /**
     * Get the current lightbox mode
     */
    getMode(): LightboxMode;
    /**
     * Get the current zoom mode
     */
    getZoomMode(): ZoomMode;
    /**
     * Get the target image element
     */
    getTargetImage(): HTMLImageElement | null;
    /**
     * Get the target video element
     */
    getTargetVideo(): HTMLElement | null;
    /**
     * Get all thumbnail elements
     */
    getThumbnails(): NodeListOf<Element>;
    /**
     * Get the current media type
     */
    getCurrentMediaType(): MediaType;
    /**
     * Update target media source programmatically
     */
    updateTargetMedia(mediaItem: MediaItem, enableAutoplay?: boolean): void;
    /**
     * Open modal programmatically (if modal mode is enabled)
     */
    openModal(): Promise<void>;
    /**
     * Close modal programmatically
     */
    closeModal(): void;
    /**
     * Refresh thumbnail event listeners (useful for dynamic content)
     */
    refreshThumbnails(): void;
    /**
     * Initialize thumbnail elements
     */
    private initializeThumbnails;
    /**
     * Initialize target image element
     */
    private initializeTargetImage;
    /**
     * Initialize target video element
     */
    private initializeTargetVideo;
    /**
     * Determine initial media type based on available targets and thumbnails
     */
    private determineInitialMediaType;
    /**
     * Initialize CSS custom properties for styling
     */
    private initializeStyles;
}
