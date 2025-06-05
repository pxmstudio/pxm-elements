/**
 * Event management for the PXM Lightbox component
 */
import type { LightboxConfig } from './types';
import type { ZoomManager } from './zoom-manager';
import type { ModalManager } from './modal-manager';
/**
 * Manages all event handling for the lightbox
 */
export declare class EventManager {
    private readonly config;
    private readonly thumbnails;
    private readonly targetImage;
    private readonly targetVideo;
    private readonly zoomManager;
    private readonly modalManager;
    private boundThumbnailClickHandler;
    private boundModalOpenHandler;
    private boundModalCloseHandler;
    private boundModalOverlayClickHandler;
    constructor(config: LightboxConfig, thumbnails: NodeListOf<Element>, targetImage: HTMLImageElement | null, targetVideo: HTMLElement | null, zoomManager: ZoomManager, modalManager: ModalManager);
    /**
     * Initialize all event listeners
     */
    private initializeEventListeners;
    /**
     * Set up thumbnail click events
     */
    private setupThumbnailEvents;
    /**
     * Set up target image events
     */
    private setupTargetImageEvents;
    /**
     * Set up modal events
     */
    private setupModalEvents;
    /**
     * Clean up zoom state when slide changes with smooth fade out
     */
    private cleanupZoomStateOnSlideChangeWithFade;
    /**
     * Setup zoom handlers for modal image with fade in effect
     */
    private setupModalImageZoomWithFade;
    /**
     * Setup zoom handlers for modal image (handles both regular and swiper modes)
     */
    private setupModalImageZoom;
    /**
     * Get the appropriate modal target image (regular or current swiper slide)
     */
    private getModalTargetImage;
    /**
     * Handle thumbnail click events
     */
    private handleThumbnailClick;
    /**
     * Open modal and update its media
     */
    private openModalWithMedia;
    /**
     * Update target media based on context (modal or main)
     */
    private updateTargetMedia;
    /**
     * Update video element with new media item
     */
    private updateVideoElement;
    /**
     * Handle modal open events
     */
    private handleModalOpen;
    /**
     * Handle modal close events
     */
    private handleModalClose;
    /**
     * Handle modal overlay click events (clicking on backdrop to close modal)
     */
    private handleModalOverlayClick;
    /**
     * Add event listeners to new elements (useful for dynamically added content)
     */
    addThumbnailEvents(thumbnails: NodeListOf<Element>): void;
    /**
     * Remove event listeners from elements
     */
    removeThumbnailEvents(thumbnails: NodeListOf<Element>): void;
    /**
     * Setup zoom handlers for a specific image
     */
    setupImageZoomHandlers(image: HTMLImageElement | null): void;
    /**
     * Remove zoom handlers from a specific image
     */
    removeImageZoomHandlers(image: HTMLImageElement | null): void;
    /**
     * Clean up all event listeners
     */
    destroy(): void;
}
