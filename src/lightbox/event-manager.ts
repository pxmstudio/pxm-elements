/**
 * Event management for the PXM Lightbox component
 */

import type { LightboxConfig } from './types';
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
        zoomManager: ZoomManager,
        modalManager: ModalManager
    ) {
        this.config = config;
        this.thumbnails = thumbnails;
        this.targetImage = targetImage;
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

        const fullSizeImageUrl = getFullSizeImageUrl(thumbnail);
        if (!fullSizeImageUrl) return;

        // Check if we're in modal mode and thumbnail is outside modal
        const inModal = isInModal(thumbnail, this.config.modalSelector);
        
        if (this.config.mode === "modal" && !inModal) {
            // In modal mode, clicking thumbnails outside modal should open modal
            this.openModalWithImage(fullSizeImageUrl).catch(error => {
                console.error('Failed to open modal with image:', error);
            });
        } else {
            // Update the appropriate target image (modal or main)
            this.updateTargetImage(thumbnail, fullSizeImageUrl);
        }
    }

    /**
     * Open modal and update its image
     */
    private async openModalWithImage(imageSrc: string): Promise<void> {
        // Only update the modal target image, not the main target
        this.modalManager.updateModalImage(imageSrc);
        
        // Open the modal
        await this.modalManager.openModal();

        // Setup zoom for the modal image after opening
        // Use a longer delay for swiper to ensure initialization is complete
        const delay = this.modalManager.isSwiperMode() ? 200 : 100;
        setTimeout(() => {
            this.setupModalImageZoom();
        }, delay);
    }

    /**
     * Update target image based on context (modal or main)
     */
    private updateTargetImage(thumbnail: Element, imageSrc: string): void {
        const inModal = isInModal(thumbnail, this.config.modalSelector);
        
        if (inModal) {
            // Handle modal context - works for both swiper and thumbnail navigation
            if (this.modalManager.isSwiperMode()) {
                // In swiper mode, update modal image (will navigate to correct slide)
                // This handles both swiper navigation and thumbnail clicks within modal
                this.modalManager.updateModalImage(imageSrc);
                // Setup zoom for current slide after navigation
                setTimeout(() => {
                    this.setupModalImageZoom();
                }, 150); // Allow time for slide transition
            } else {
                // Regular modal mode with thumbnail navigation only
                const targetImg = this.modalManager.getModalTargetImage();
                if (targetImg) {
                    targetImg.src = imageSrc;
                    this.zoomManager.setupZoomHandlers(targetImg);
                }
            }
        } else {
            // Handle main context (non-modal mode only)
            if (this.targetImage && this.config.mode !== "modal") {
                this.targetImage.src = imageSrc;
                this.zoomManager.setupZoomHandlers(this.targetImage);
            }
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