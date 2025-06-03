/**
 * Modal functionality manager for the PXM Lightbox component
 */
import type { LightboxConfig, MediaType, MediaItem } from './types';
declare global {
    interface Window {
        Swiper?: any;
    }
}
/**
 * Manages modal functionality for the lightbox
 */
export declare class ModalManager {
    private readonly modal;
    private modalTargetImage;
    private modalTargetVideo;
    private modalThumbnails;
    private readonly config;
    private readonly mainThumbnails;
    private closeHandler?;
    private overlayClickHandler?;
    private swiperInstance;
    private readonly isSwiperEnabled;
    private onSlideChangeCallback?;
    private previousSlideImage;
    private swiperPrevHandler?;
    private swiperNextHandler?;
    private isAnimating;
    constructor(lightboxElement: HTMLElement, config: LightboxConfig, mainThumbnails: NodeListOf<Element>);
    /**
     * Get the modal element
     */
    getModal(): HTMLElement | null;
    /**
     * Get the modal target image
     */
    getModalTargetImage(): HTMLImageElement | null;
    /**
     * Get the modal target video
     */
    getModalTargetVideo(): HTMLElement | null;
    /**
     * Get modal thumbnails
     */
    getModalThumbnails(): NodeListOf<Element>;
    /**
     * Check if modal is available
     */
    isModalAvailable(): boolean;
    /**
     * Check if swiper is enabled
     */
    isSwiperMode(): boolean;
    /**
     * Open the modal with fade animation
     */
    openModal(): Promise<void>;
    /**
     * Close the modal with fade animation
     */
    closeModal(): void;
    /**
     * Update modal target media
     */
    updateModalMedia(mediaItem: MediaItem): void;
    /**
     * Update video element with new media item
     */
    private updateVideoElement;
    /**
     * Navigate to slide containing the specified media
     */
    private navigateToSlide;
    /**
     * Set up close handler for the modal
     */
    setupCloseHandler(handler: (event: Event) => void): void;
    /**
     * Set up overlay click handler for the modal
     */
    setupOverlayClickHandler(handler: (event: Event) => void): void;
    /**
     * Initialize swiper instance
     */
    private initializeSwiper;
    /**
     * Set up custom swiper navigation buttons
     */
    private setupSwiperNavigation;
    /**
     * Update navigation button disabled states based on current slide position
     */
    private updateNavigationButtonStates;
    /**
     * Create swiper slides from thumbnails
     */
    private createSwiperSlides;
    /**
     * Clean up zoom handlers from previous slide
     */
    private cleanupPreviousSlide;
    /**
     * Update zoom handlers for current slide
     */
    private updateCurrentSlideZoom;
    /**
     * Handle autoplay for active video slides
     */
    private handleVideoAutoplay;
    /**
     * Get current active slide image (for swiper mode)
     */
    getCurrentSlideImage(): HTMLImageElement | null;
    /**
     * Get current active slide media element (image or video)
     */
    getCurrentSlideMedia(): HTMLElement | null;
    /**
     * Get current active slide type
     */
    getCurrentSlideType(): MediaType;
    /**
     * Initialize the modal with thumbnails and event handlers
     */
    private initializeModal;
    /**
     * Set up modal thumbnails by cloning main thumbnails
     */
    private setupModalThumbnails;
    /**
     * Clear modal thumbnails container
     */
    private clearModalThumbnails;
    /**
     * Clone main thumbnails to modal (excluding modal template)
     */
    private cloneMainThumbnails;
    /**
     * Create a modal thumbnail clone by deep cloning the original main thumbnail element.
     * This preserves any extra classes or attributes developers added to the main thumbnails.
     */
    private createModalThumbnailClone;
    /**
     * Sync modal target image with main target image
     */
    private syncModalImageWithMain;
    /**
     * Set callback for slide change events
     */
    setSlideChangeCallback(callback: () => void): void;
    /**
     * Update navigation button states (public method for external use)
     */
    updateButtonStates(): void;
    /**
     * Clean up modal manager resources
     */
    destroy(): void;
}
