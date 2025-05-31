/**
 * Main PXM Lightbox component class
 * 
 * This class orchestrates all the lightbox functionality by delegating
 * specific responsibilities to specialized manager classes.
 */

import type { LightboxMode, ZoomMode, MediaType, MediaItem } from './types';
import { ConfigManager } from './config';
import { ZoomManager } from './zoom-manager';
import { ModalManager } from './modal-manager';
import { EventManager } from './event-manager';
import { safeQuerySelector, safeQuerySelectorAll } from './dom-utils';

/**
 * Main lightbox component that provides image and video gallery functionality
 * with optional modal view and zoom capabilities
 */
export class PxmLightbox extends HTMLElement {
    // Core managers
    private readonly configManager: ConfigManager;
    private readonly zoomManager: ZoomManager;
    private readonly modalManager: ModalManager;
    private readonly eventManager: EventManager;

    // DOM elements
    private readonly thumbnails: NodeListOf<Element>;
    private readonly targetImage: HTMLImageElement | null;
    private readonly targetVideo: HTMLElement | null;

    // Component state
    private readonly mode: LightboxMode;
    private readonly zoomMode: ZoomMode;
    private currentMediaType: MediaType = 'image';

    constructor() {
        super();

        try {
            // Initialize configuration
            this.configManager = new ConfigManager(this);
            this.mode = this.configManager.get('mode');
            this.zoomMode = this.configManager.parseZoomMode(
                this.getAttribute("data-zoom-mode")
            );

            // Initialize DOM elements
            this.thumbnails = this.initializeThumbnails();
            this.targetImage = this.initializeTargetImage();
            this.targetVideo = this.initializeTargetVideo();

            // Determine current media type from thumbnails or targets
            this.currentMediaType = this.determineInitialMediaType();

            // Initialize component managers
            this.zoomManager = new ZoomManager(
                this.configManager.getConfig(),
                this.zoomMode
            );

            this.modalManager = new ModalManager(
                this,
                this.configManager.getConfig(),
                this.thumbnails
            );

            this.eventManager = new EventManager(
                this.configManager.getConfig(),
                this.thumbnails,
                this.targetImage,
                this.targetVideo,
                this.zoomManager,
                this.modalManager
            );

            // Setup CSS variables for styling
            this.initializeStyles();

        } catch (error) {
            console.error('Failed to initialize PxmLightbox:', error);
            throw error;
        }
    }

    /**
     * Called when element is removed from DOM
     * Performs cleanup of all managers and event listeners
     */
    disconnectedCallback(): void {
        try {
            this.eventManager?.destroy();
            this.modalManager?.destroy();
            this.zoomManager?.destroy();
        } catch (error) {
            console.error('Error during PxmLightbox cleanup:', error);
        }
    }

    /**
     * Get the current lightbox mode
     */
    public getMode(): LightboxMode {
        return this.mode;
    }

    /**
     * Get the current zoom mode
     */
    public getZoomMode(): ZoomMode {
        return this.zoomMode;
    }

    /**
     * Get the target image element
     */
    public getTargetImage(): HTMLImageElement | null {
        return this.targetImage;
    }

    /**
     * Get the target video element
     */
    public getTargetVideo(): HTMLElement | null {
        return this.targetVideo;
    }

    /**
     * Get all thumbnail elements
     */
    public getThumbnails(): NodeListOf<Element> {
        return this.thumbnails;
    }

    /**
     * Get the current media type
     */
    public getCurrentMediaType(): MediaType {
        return this.currentMediaType;
    }

    /**
     * Update target media source programmatically
     */
    public updateTargetMedia(mediaItem: MediaItem, enableAutoplay: boolean = false): void {
        this.currentMediaType = mediaItem.type;
        
        if (mediaItem.type === 'image' && this.targetImage) {
            this.targetImage.src = mediaItem.src;
            // Show image, hide video if present
            this.targetImage.style.display = 'block';
            if (this.targetVideo) {
                this.targetVideo.style.display = 'none';
            }
            this.eventManager.setupImageZoomHandlers(this.targetImage);
        } else if (mediaItem.type === 'video' && this.targetVideo) {
            // Update video source and attributes
            this.targetVideo.setAttribute('src', mediaItem.src);
            if (mediaItem.videoType) {
                this.targetVideo.setAttribute('type', mediaItem.videoType);
            }
            if (mediaItem.title) {
                this.targetVideo.setAttribute('title', mediaItem.title);
            }
            if (mediaItem.description) {
                this.targetVideo.setAttribute('description', mediaItem.description);
            }
            
            // Enable controls for video playback
            this.targetVideo.setAttribute('controls', 'true');
            
            // Enable autoplay if requested (typically for modal videos)
            if (enableAutoplay) {
                this.targetVideo.setAttribute('autoplay', 'true');
            }
            
            // Use custom thumbnail if provided
            if (mediaItem.thumbnail) {
                this.targetVideo.setAttribute('thumbnail', mediaItem.thumbnail);
            }
            
            // Show video, hide image if present
            this.targetVideo.style.display = 'block';
            if (this.targetImage) {
                this.targetImage.style.display = 'none';
            }
        }
    }

    /**
     * Open modal programmatically (if modal mode is enabled)
     */
    public async openModal(): Promise<void> {
        if (this.mode === "modal" && this.modalManager.isModalAvailable()) {
            await this.modalManager.openModal();
        }
    }

    /**
     * Close modal programmatically
     */
    public closeModal(): void {
        this.modalManager.closeModal();
    }

    /**
     * Refresh thumbnail event listeners (useful for dynamic content)
     */
    public refreshThumbnails(): void {
        const newThumbnails = safeQuerySelectorAll(
            this,
            this.configManager.get('thumbnailSelector')
        );
        this.eventManager.addThumbnailEvents(newThumbnails);
    }

    /**
     * Initialize thumbnail elements
     */
    private initializeThumbnails(): NodeListOf<Element> {
        const thumbnails = safeQuerySelectorAll(
            this,
            this.configManager.get('thumbnailSelector')
        );

        if (thumbnails.length === 0) {
            console.warn('No thumbnails found with selector:',
                this.configManager.get('thumbnailSelector'));
        }

        return thumbnails;
    }

    /**
     * Initialize target image element
     */
    private initializeTargetImage(): HTMLImageElement | null {
        // Look for image target specifically
        const imageTarget = safeQuerySelector<HTMLImageElement>(
            this,
            `${this.configManager.get('targetSelector')}[data-type="image"]`
        );

        // Fallback to generic target selector if no specific image target found
        if (!imageTarget) {
            const genericTarget = safeQuerySelector<HTMLImageElement>(
                this,
                this.configManager.get('targetSelector')
            );
            
            // Only use generic target if it's actually an image element
            if (genericTarget && genericTarget.tagName === 'IMG') {
                return genericTarget;
            }
        }

        return imageTarget;
    }

    /**
     * Initialize target video element  
     */
    private initializeTargetVideo(): HTMLElement | null {
        // Look for video target specifically
        const videoTarget = safeQuerySelector<HTMLElement>(
            this,
            `${this.configManager.get('targetSelector')}[data-type="video"]`
        );

        // Also look for pxm-video elements that might be targets
        if (!videoTarget) {
            const pxmVideoTarget = safeQuerySelector<HTMLElement>(
                this,
                `pxm-video${this.configManager.get('targetSelector')}`
            );
            if (pxmVideoTarget) {
                return pxmVideoTarget;
            }
        }

        return videoTarget;
    }

    /**
     * Determine initial media type based on available targets and thumbnails
     */
    private determineInitialMediaType(): MediaType {
        // Check if we have a visible target with data-type
        if (this.targetImage && this.targetImage.style.display !== 'none') {
            return 'image';
        }
        if (this.targetVideo && this.targetVideo.style.display !== 'none') {
            return 'video';
        }

        // Check first thumbnail's type
        if (this.thumbnails.length > 0) {
            const firstThumbType = this.thumbnails[0].getAttribute('data-type') as MediaType;
            if (firstThumbType) {
                return firstThumbType;
            }
        }

        // Default to image
        return 'image';
    }

    /**
     * Initialize CSS custom properties for styling
     */
    private initializeStyles(): void {
        const config = this.configManager.getConfig();

        // Set CSS variables for potential customization
        this.style.setProperty('--pxm-lightbox-zoom-size', `${config.zoomSize}px`);
        this.style.setProperty('--pxm-lightbox-zoom-border', '2px solid #333');
        this.style.setProperty('--pxm-lightbox-zoom-background', 'white');
        this.style.setProperty('--pxm-lightbox-zoom-shadow', '0 0 10px rgba(0,0,0,0.3)');
        this.style.setProperty('--pxm-lightbox-zoom-z-index', '999999');
        this.style.setProperty('--pxm-lightbox-zoom-border-radius', '0');
    }
} 