/**
 * Event management for the PXM Lightbox component
 */

import type { LightboxConfig, MediaType, MediaItem } from './types';
import { getFullSizeImageUrl, isInModal } from './dom-utils';
import type { ZoomManager } from './zoom-manager';
import type { ModalManager } from './modal-manager';

/**
 * Manages all event handling for the lightbox
 */
export class EventManager {
    private readonly config: LightboxConfig;
    private readonly thumbnails: NodeListOf<Element>;
    private readonly targetImage: HTMLImageElement | null;
    private readonly targetVideo: HTMLElement | null;
    private readonly zoomManager: ZoomManager;
    private readonly modalManager: ModalManager;

    // Bound event handlers for cleanup
    private boundThumbnailClickHandler: (event: Event) => void;
    private boundModalOpenHandler: (event: Event) => void;
    private boundModalCloseHandler: (event: Event) => void;
    private boundModalOverlayClickHandler: (event: Event) => void;

    constructor(
        config: LightboxConfig,
        thumbnails: NodeListOf<Element>,
        targetImage: HTMLImageElement | null,
        targetVideo: HTMLElement | null,
        zoomManager: ZoomManager,
        modalManager: ModalManager
    ) {
        this.config = config;
        this.thumbnails = thumbnails;
        this.targetImage = targetImage;
        this.targetVideo = targetVideo;
        this.zoomManager = zoomManager;
        this.modalManager = modalManager;

        // Bind event handlers
        this.boundThumbnailClickHandler = this.handleThumbnailClick.bind(this);
        this.boundModalOpenHandler = this.handleModalOpen.bind(this);
        this.boundModalCloseHandler = this.handleModalClose.bind(this);
        this.boundModalOverlayClickHandler = this.handleModalOverlayClick.bind(this);

        this.initializeEventListeners();
    }

    /**
     * Initialize all event listeners
     */
    private initializeEventListeners(): void {
        this.setupThumbnailEvents();
        this.setupTargetImageEvents();
        this.setupModalEvents();
    }

    /**
     * Set up thumbnail click events
     */
    private setupThumbnailEvents(): void {
        // Main thumbnails
        this.thumbnails.forEach((thumbnail) => {
            thumbnail.addEventListener("click", this.boundThumbnailClickHandler);
        });
    }

    /**
     * Set up target image events
     */
    private setupTargetImageEvents(): void {
        if (!this.targetImage) return;

        // Modal opening event
        if (this.config.mode === "modal") {
            this.targetImage.addEventListener("click", this.boundModalOpenHandler);
            // In modal mode, don't set up zoom handlers for main target image
            // Zoom should only work inside the modal
        } else {
            // Only set up zoom handlers if not in modal mode
            this.zoomManager.setupZoomHandlers(this.targetImage);
        }
    }

    /**
     * Set up modal events
     */
    private setupModalEvents(): void {
        if (!this.modalManager.isModalAvailable()) return;

        // Set up close handler
        this.modalManager.setupCloseHandler(this.boundModalCloseHandler);

        // Set up overlay click handler
        this.modalManager.setupOverlayClickHandler(this.boundModalOverlayClickHandler);

        // Set up zoom handlers for modal target image
        this.setupModalImageZoom();

        // Set up slide change callback for swiper mode
        if (this.modalManager.isSwiperMode()) {
            this.modalManager.setSlideChangeCallback(async () => {
                // Clean up previous slide's zoom handlers with fade out
                await this.cleanupZoomStateOnSlideChangeWithFade();
                
                // Re-setup zoom handlers for new slide with fade in
                this.setupModalImageZoomWithFade();
            });
        }

        // Always set up thumbnail events since modal thumbnails are created in both modes
        const modalThumbnails = this.modalManager.getModalThumbnails();
        modalThumbnails.forEach((thumbnail) => {
            thumbnail.addEventListener("click", this.boundThumbnailClickHandler);
        });
    }

    /**
     * Clean up zoom state when slide changes with smooth fade out
     */
    private async cleanupZoomStateOnSlideChangeWithFade(): Promise<void> {
        // Fade out the current zoom overlay smoothly
        await this.zoomManager.fadeOutZoomOverlay();
        
        // Remove zoom handlers from all swiper slide images to prevent conflicts
        if (this.modalManager.isSwiperMode()) {
            const allSlideImages = this.modalManager.getModal()?.querySelectorAll('[data-target-swiper-slide] img[data-target-img]');
            if (allSlideImages) {
                allSlideImages.forEach((img) => {
                    this.zoomManager.removeZoomHandlers(img as HTMLImageElement);
                });
            }
        }
    }

    /**
     * Setup zoom handlers for modal image with fade in effect
     */
    private setupModalImageZoomWithFade(): void {
        const modalTargetImage = this.getModalTargetImage();
        
        if (modalTargetImage) {
            // Set up zoom handlers first
            this.zoomManager.setupZoomHandlers(modalTargetImage);
            
            // Check immediately with minimal delay for quicker response
            setTimeout(() => {
                if (modalTargetImage.matches(':hover') && this.zoomManager.isZoomEnabled()) {
                    // Get current cursor position for seamless transition
                    const cursorPos = this.zoomManager.getCurrentCursorPosition();
                    
                    // Activate zoom state manually
                    const fakeEnterEvent = new MouseEvent('mouseenter', {
                        bubbles: true,
                        cancelable: true
                    });
                    modalTargetImage.dispatchEvent(fakeEnterEvent);
                    
                    // Transition to new image content smoothly
                    this.zoomManager.transitionToNewImage(modalTargetImage);
                    
                    // Use fade in with current cursor position for smooth transition
                    this.zoomManager.fadeInZoomOverlay(cursorPos.x, cursorPos.y);
                }
            }, 10);
        }
    }

    /**
     * Setup zoom handlers for modal image (handles both regular and swiper modes)
     */
    private setupModalImageZoom(): void {
        const modalTargetImage = this.getModalTargetImage();
        this.zoomManager.setupZoomHandlers(modalTargetImage);
    }

    /**
     * Get the appropriate modal target image (regular or current swiper slide)
     */
    private getModalTargetImage(): HTMLImageElement | null {
        if (this.modalManager.isSwiperMode()) {
            const swiperImage = this.modalManager.getCurrentSlideImage();
            return swiperImage;
        }
        return this.modalManager.getModalTargetImage();
    }

    /**
     * Handle thumbnail click events
     */
    private handleThumbnailClick(event: Event): void {
        const clickedElement = event.target as HTMLElement;
        const thumbnail = clickedElement.closest(this.config.thumbnailSelector);

        if (!thumbnail) return;

        const mediaType = thumbnail.getAttribute('data-type') as MediaType || 'image';
        const fullSizeUrl = getFullSizeImageUrl(thumbnail);
        if (!fullSizeUrl) return;

        // Extract thumbnail image for videos
        let thumbnailSrc: string | undefined;
        if (mediaType === 'video') {
            const thumbnailImg = thumbnail.querySelector('img') as HTMLImageElement;
            if (thumbnailImg && thumbnailImg.src) {
                thumbnailSrc = thumbnailImg.src;
            }
        }

        const mediaItem: MediaItem = {
            type: mediaType,
            src: fullSizeUrl,
            thumbnail: thumbnailSrc,
            videoType: thumbnail.getAttribute('data-video-type') as MediaItem['videoType'],
            title: thumbnail.getAttribute('data-title') || undefined,
            description: thumbnail.getAttribute('data-description') || undefined
        };

        // Check if we're in modal mode and thumbnail is outside modal
        const inModal = isInModal(thumbnail, this.config.modalSelector);
        
        if (this.config.mode === "modal" && !inModal) {
            // In modal mode, clicking thumbnails outside modal should open modal
            this.openModalWithMedia(mediaItem).catch(error => {
                console.error('Failed to open modal with media:', error);
            });
        } else {
            // Update the appropriate target (modal or main)
            this.updateTargetMedia(thumbnail, mediaItem);
        }
    }

    /**
     * Open modal and update its media
     */
    private async openModalWithMedia(mediaItem: MediaItem): Promise<void> {
        // Update the modal target
        this.modalManager.updateModalMedia(mediaItem);
        
        // Open the modal
        await this.modalManager.openModal();

        // Setup zoom for the modal image after opening (only for images)
        if (mediaItem.type === 'image') {
            const delay = this.modalManager.isSwiperMode() ? 200 : 100;
            setTimeout(() => {
                this.setupModalImageZoom();
            }, delay);
        }
    }

    /**
     * Update target media based on context (modal or main)
     */
    private updateTargetMedia(thumbnail: Element, mediaItem: MediaItem): void {
        const inModal = isInModal(thumbnail, this.config.modalSelector);
        
        if (inModal) {
            // Handle modal context - enable autoplay for videos
            if (this.modalManager.isSwiperMode()) {
                // In swiper mode, update modal media
                this.modalManager.updateModalMedia(mediaItem);
                // Setup zoom for current slide after navigation (only for images)
                if (mediaItem.type === 'image') {
                    setTimeout(() => {
                        this.setupModalImageZoom();
                    }, 150);
                }
            } else {
                // Regular modal mode
                if (mediaItem.type === 'image') {
                    const targetImg = this.modalManager.getModalTargetImage();
                    if (targetImg) {
                        targetImg.src = mediaItem.src;
                        this.setupModalImageZoom();
                    }
                } else {
                    const targetVideo = this.modalManager.getModalTargetVideo();
                    if (targetVideo) {
                        this.updateVideoElement(targetVideo, mediaItem, true); // Enable autoplay for modal videos
                    }
                }
            }
        } else {
            // Handle main context - no autoplay for main lightbox videos
            if (mediaItem.type === 'image' && this.targetImage) {
                this.targetImage.src = mediaItem.src;
                this.setupTargetImageEvents();
            } else if (mediaItem.type === 'video' && this.targetVideo) {
                this.updateVideoElement(this.targetVideo, mediaItem, false); // No autoplay for main videos
            }
        }
    }

    /**
     * Update video element with new media item
     */
    private updateVideoElement(videoElement: HTMLElement, mediaItem: MediaItem, enableAutoplay: boolean = false): void {
        videoElement.setAttribute('src', mediaItem.src);
        if (mediaItem.videoType) {
            videoElement.setAttribute('type', mediaItem.videoType);
        }
        if (mediaItem.title) {
            videoElement.setAttribute('title', mediaItem.title);
        }
        if (mediaItem.description) {
            videoElement.setAttribute('description', mediaItem.description);
        }
        
        // Enable controls for video playback
        videoElement.setAttribute('controls', 'true');
        
        // Enable autoplay if requested (typically for modal videos)
        if (enableAutoplay) {
            videoElement.setAttribute('autoplay', 'true');
        }
        
        // Use custom thumbnail if provided
        if (mediaItem.thumbnail) {
            videoElement.setAttribute('thumbnail', mediaItem.thumbnail);
        }
    }

    /**
     * Handle modal open events
     */
    private handleModalOpen(event: Event): void {
        event.preventDefault();
        // Use async openModal but don't await to avoid blocking
        this.modalManager.openModal().catch(error => {
            console.error('Failed to open modal:', error);
        });
    }

    /**
     * Handle modal close events
     */
    private handleModalClose(event: Event): void {
        event.preventDefault();

        const closeButton = event.target as HTMLElement;
        const modal = closeButton.closest(this.config.modalSelector) as HTMLElement;

        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    /**
     * Handle modal overlay click events (clicking on backdrop to close modal)
     */
    private handleModalOverlayClick(event: Event): void {
        // Only close if the click is directly on the overlay element
        // This prevents closing when clicking on modal content
        const target = event.target as HTMLElement;
        const overlay = target.closest('[data-modal-overlay]');
        
        if (overlay && target === overlay) {
            event.preventDefault();
            this.modalManager.closeModal();
        }
    }

    /**
     * Add event listeners to new elements (useful for dynamically added content)
     */
    public addThumbnailEvents(thumbnails: NodeListOf<Element>): void {
        thumbnails.forEach((thumbnail) => {
            thumbnail.addEventListener("click", this.boundThumbnailClickHandler);
        });
    }

    /**
     * Remove event listeners from elements
     */
    public removeThumbnailEvents(thumbnails: NodeListOf<Element>): void {
        thumbnails.forEach((thumbnail) => {
            thumbnail.removeEventListener("click", this.boundThumbnailClickHandler);
        });
    }

    /**
     * Setup zoom handlers for a specific image
     */
    public setupImageZoomHandlers(image: HTMLImageElement | null): void {
        this.zoomManager.setupZoomHandlers(image);
    }

    /**
     * Remove zoom handlers from a specific image
     */
    public removeImageZoomHandlers(image: HTMLImageElement | null): void {
        this.zoomManager.removeZoomHandlers(image);
    }

    /**
     * Clean up all event listeners
     */
    public destroy(): void {
        // Remove thumbnail events
        this.removeThumbnailEvents(this.thumbnails);
        
        // Always remove modal thumbnail events since they're always created
        const modalThumbnails = this.modalManager.getModalThumbnails();
        this.removeThumbnailEvents(modalThumbnails);

        // Remove target image events
        if (this.targetImage) {
            this.targetImage.removeEventListener("click", this.boundModalOpenHandler);
            this.zoomManager.removeZoomHandlers(this.targetImage);
        }

        // Remove modal target image zoom handlers
        const modalTargetImage = this.getModalTargetImage();
        this.zoomManager.removeZoomHandlers(modalTargetImage);
    }
} 