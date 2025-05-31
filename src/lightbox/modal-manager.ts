/**
 * Modal functionality manager for the PXM Lightbox component
 */

import type { LightboxConfig, MediaType, MediaItem } from './types';
import {
    safeQuerySelector,
    safeQuerySelectorAll,
    toggleBodyScrollLock
} from './dom-utils';

// Swiper imports - will be available if Swiper is included in the project
declare global {
    interface Window {
        Swiper?: any;
    }
}

/**
 * Manages modal functionality for the lightbox
 */
export class ModalManager {
    private readonly modal: HTMLElement | null;
    private modalTargetImage: HTMLImageElement | null;
    private modalTargetVideo: HTMLElement | null;
    private modalThumbnails: NodeListOf<Element>;
    private readonly config: LightboxConfig;
    private readonly mainThumbnails: NodeListOf<Element>;
    private closeHandler?: (event: Event) => void;
    private overlayClickHandler?: (event: Event) => void;
    private swiperInstance: any = null;
    private readonly isSwiperEnabled: boolean;
    private onSlideChangeCallback?: () => void;
    private previousSlideImage: HTMLImageElement | null = null;
    private swiperPrevHandler?: (event: Event) => void;
    private swiperNextHandler?: (event: Event) => void;
    private isAnimating: boolean = false;

    constructor(
        lightboxElement: HTMLElement,
        config: LightboxConfig,
        mainThumbnails: NodeListOf<Element>
    ) {
        this.config = config;
        this.mainThumbnails = mainThumbnails;
        this.isSwiperEnabled = lightboxElement.getAttribute('data-target-swiper') === 'on';

        this.modal = safeQuerySelector(lightboxElement, config.modalSelector);

        // Initialize modal target elements
        if (this.modal) {
            // Look for image target specifically
            this.modalTargetImage = safeQuerySelector<HTMLImageElement>(
                this.modal,
                `${config.targetSelector}[data-type="image"]`
            );

            // Fallback to generic target if it's an image
            if (!this.modalTargetImage) {
                const genericTarget = safeQuerySelector<HTMLImageElement>(this.modal, config.targetSelector);
                if (genericTarget && genericTarget.tagName === 'IMG') {
                    this.modalTargetImage = genericTarget;
                }
            }

            // Look for video target specifically
            this.modalTargetVideo = safeQuerySelector<HTMLElement>(
                this.modal,
                `${config.targetSelector}[data-type="video"]`
            );

            // Also look for pxm-video elements
            if (!this.modalTargetVideo) {
                this.modalTargetVideo = safeQuerySelector<HTMLElement>(
                    this.modal,
                    `pxm-video${config.targetSelector}`
                );
            }
        } else {
            this.modalTargetImage = null;
            this.modalTargetVideo = null;
        }

        this.modalThumbnails = document.querySelectorAll('*:not(*)'); // Empty NodeList initially

        if (this.modal) {
            this.initializeModal();
            // Add transition styles to modal
            this.modal.style.transition = `opacity ${this.config.fadeAnimationDuration}ms ease-in-out`;
            this.modal.style.opacity = '0';
        }
    }

    /**
     * Get the modal element
     */
    public getModal(): HTMLElement | null {
        return this.modal;
    }

    /**
     * Get the modal target image
     */
    public getModalTargetImage(): HTMLImageElement | null {
        return this.modalTargetImage;
    }

    /**
     * Get the modal target video
     */
    public getModalTargetVideo(): HTMLElement | null {
        return this.modalTargetVideo;
    }

    /**
     * Get modal thumbnails
     */
    public getModalThumbnails(): NodeListOf<Element> {
        return this.modalThumbnails;
    }

    /**
     * Check if modal is available
     */
    public isModalAvailable(): boolean {
        return this.modal !== null;
    }

    /**
     * Check if swiper is enabled
     */
    public isSwiperMode(): boolean {
        return this.isSwiperEnabled;
    }

    /**
     * Open the modal with fade animation
     */
    public async openModal(): Promise<void> {
        if (!this.modal || this.isAnimating) return;

        this.isAnimating = true;
        this.modal.style.display = 'flex';
        toggleBodyScrollLock(true);

        // Trigger fade in animation
        requestAnimationFrame(() => {
            this.modal!.style.opacity = '1';
        });

        // Initialize swiper after modal is visible
        if (this.isSwiperEnabled && !this.swiperInstance) {
            await this.initializeSwiper();
        }

        // Reset animation flag after transition completes
        setTimeout(() => {
            this.isAnimating = false;
        }, this.config.fadeAnimationDuration);
    }

    /**
     * Close the modal with fade animation
     */
    public closeModal(): void {
        if (!this.modal || this.isAnimating) return;

        this.isAnimating = true;
        this.modal.style.opacity = '0';

        // Wait for fade out animation to complete before hiding
        setTimeout(() => {
            this.modal!.style.display = 'none';
            toggleBodyScrollLock(false);
            this.isAnimating = false;
        }, this.config.fadeAnimationDuration);
    }

    /**
     * Update modal target media
     */
    public updateModalMedia(mediaItem: MediaItem): void {
        if (this.isSwiperEnabled && this.swiperInstance) {
            // Find the slide index for this media and navigate to it
            this.navigateToSlide(mediaItem);
        } else {
            // Regular modal mode - show/hide appropriate targets
            if (mediaItem.type === 'image' && this.modalTargetImage) {
                this.modalTargetImage.src = mediaItem.src;
                // Show image target, hide video target
                this.modalTargetImage.style.display = 'block';
                if (this.modalTargetVideo) {
                    this.modalTargetVideo.style.display = 'none';
                }
            } else if (mediaItem.type === 'video' && this.modalTargetVideo) {
                this.updateVideoElement(this.modalTargetVideo, mediaItem);
                // Show video target, hide image target
                this.modalTargetVideo.style.display = 'block';
                if (this.modalTargetImage) {
                    this.modalTargetImage.style.display = 'none';
                }
            }
        }
    }

    /**
     * Update video element with new media item
     */
    private updateVideoElement(videoElement: HTMLElement, mediaItem: MediaItem, enableAutoplay: boolean = true): void {
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

        // Ensure controls are enabled
        videoElement.setAttribute('controls', 'true');

        // Enable autoplay for modal videos
        if (enableAutoplay) {
            videoElement.setAttribute('autoplay', 'true');
        }

        // If we have thumbnail data, use it
        if (mediaItem.thumbnail) {
            videoElement.setAttribute('thumbnail', mediaItem.thumbnail);
        }
    }

    /**
     * Navigate to slide containing the specified media
     */
    private navigateToSlide(mediaItem: MediaItem): void {
        if (!this.swiperInstance) return;

        const slides = this.swiperInstance.slides;
        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i];

            if (mediaItem.type === 'image') {
                // Look for image elements with data-target-img
                const slideImg = slide.querySelector('img[data-target-img]') as HTMLImageElement;
                if (slideImg && slideImg.src === mediaItem.src) {
                    this.swiperInstance.slideTo(i);
                    break;
                }
            } else if (mediaItem.type === 'video') {
                // Look for pxm-video elements with data-target-video
                const slideVideo = slide.querySelector('pxm-video[data-target-video]') as HTMLElement;
                if (slideVideo && slideVideo.getAttribute('src') === mediaItem.src) {
                    this.swiperInstance.slideTo(i);
                    break;
                }
            }
        }
    }

    /**
     * Set up close handler for the modal
     */
    public setupCloseHandler(handler: (event: Event) => void): void {
        this.closeHandler = handler;

        if (this.modal) {
            const closeButton = safeQuerySelector(this.modal, '[data-close]');
            if (closeButton) {
                closeButton.addEventListener('click', handler);
            }
        }
    }

    /**
     * Set up overlay click handler for the modal
     */
    public setupOverlayClickHandler(handler: (event: Event) => void): void {
        this.overlayClickHandler = handler;

        if (this.modal) {
            const overlay = safeQuerySelector(this.modal, '[data-modal-overlay]');
            if (overlay) {
                overlay.addEventListener('click', handler);
            }
        }
    }

    /**
     * Initialize swiper instance
     */
    private async initializeSwiper(): Promise<void> {
        // Check if Swiper is already available
        if (typeof window.Swiper === 'undefined') {
            try {
                // Dynamically import Swiper and modules
                const [
                    { default: Swiper },
                    { Navigation, Pagination }
                ] = await Promise.all([
                    import('swiper'),
                    import('swiper/modules')
                ]);

                // Import Swiper CSS (following official documentation)
                try {
                    await Promise.all([
                        // @ts-expect-error - CSS imports don't have TypeScript declarations
                        import('swiper/css'),
                        // @ts-expect-error - CSS imports don't have TypeScript declarations  
                        import('swiper/css/navigation'),
                        // @ts-expect-error - CSS imports don't have TypeScript declarations
                        import('swiper/css/pagination')
                    ]);
                } catch (cssError) {
                    console.warn('CSS imports failed, styles may need to be imported manually:', cssError);
                }

                // Make Swiper available globally
                window.Swiper = Swiper;
                window.Swiper.Navigation = Navigation;
                window.Swiper.Pagination = Pagination;
            } catch (error) {
                console.warn('Failed to load Swiper. Please install swiper: npm install swiper', error);
                return;
            }
        }

        const swiperContainer = safeQuerySelector(this.modal!, '[data-target-swiper]:not([data-target-swiper="on"])');
        if (!swiperContainer) {
            console.warn('Swiper container not found');
            return;
        }

        // Create slides from thumbnails
        this.createSwiperSlides();

        // Initialize Swiper
        this.swiperInstance = new window.Swiper(swiperContainer, {
            modules: window.Swiper.Navigation && window.Swiper.Pagination ?
                [window.Swiper.Navigation, window.Swiper.Pagination] : [],
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            loop: true,
            keyboard: {
                enabled: true,
            },
            on: {
                slideChangeTransitionEnd: () => {
                    // Small delay to ensure all DOM updates are complete
                    setTimeout(() => {
                        // Clean up previous slide if it exists
                        if (this.previousSlideImage && this.onSlideChangeCallback) {
                            // We'll pass the previous image to the callback for cleanup
                            this.cleanupPreviousSlide();
                        }

                        // Update zoom handlers for the current slide after transition is complete
                        this.updateCurrentSlideZoom();

                        // Update navigation button states
                        this.updateNavigationButtonStates();

                        // Notify EventManager to re-setup zoom handlers
                        if (this.onSlideChangeCallback) {
                            this.onSlideChangeCallback();
                        }
                    }, 50);
                },
                init: () => {
                    // Setup zoom for initial slide after swiper is fully initialized
                    this.updateCurrentSlideZoom();

                    // Update navigation button states on init
                    this.updateNavigationButtonStates();

                    if (this.onSlideChangeCallback) {
                        // Small delay to ensure DOM is ready
                        setTimeout(() => {
                            this.onSlideChangeCallback!();
                        }, 50);
                    }
                }
            }
        });

        // Setup custom navigation buttons after swiper is initialized
        this.setupSwiperNavigation();
    }

    /**
     * Set up custom swiper navigation buttons
     */
    private setupSwiperNavigation(): void {
        if (!this.modal || !this.swiperInstance) return;

        // Check for custom prev button
        const prevButton = safeQuerySelector(this.modal, '[data-swiper-prev]');
        if (prevButton) {
            this.swiperPrevHandler = (event: Event) => {
                event.preventDefault();
                this.swiperInstance.slidePrev();
            };
            prevButton.addEventListener('click', this.swiperPrevHandler);
        }

        // Check for custom next button
        const nextButton = safeQuerySelector(this.modal, '[data-swiper-next]');
        if (nextButton) {
            this.swiperNextHandler = (event: Event) => {
                event.preventDefault();
                this.swiperInstance.slideNext();
            };
            nextButton.addEventListener('click', this.swiperNextHandler);
        }

        // Update button states initially
        this.updateNavigationButtonStates();
    }

    /**
     * Update navigation button disabled states based on current slide position
     */
    private updateNavigationButtonStates(): void {
        if (!this.modal || !this.swiperInstance) return;

        const prevButton = safeQuerySelector(this.modal, '[data-swiper-prev]') as HTMLButtonElement;
        const nextButton = safeQuerySelector(this.modal, '[data-swiper-next]') as HTMLButtonElement;

        if (!prevButton && !nextButton) return;

        // Get current slide info
        const slidesLength = this.swiperInstance.slides.length;

        // If there are no slides or only one slide, disable both buttons
        if (slidesLength <= 1) {
            if (prevButton) prevButton.disabled = true;
            if (nextButton) nextButton.disabled = true;
            return;
        }

        // If loop is enabled, buttons should never be disabled (unless only one slide)
        if (this.swiperInstance.params.loop) {
            if (prevButton) prevButton.disabled = false;
            if (nextButton) nextButton.disabled = false;
            return;
        }

        // Get current slide index
        const activeIndex = this.swiperInstance.activeIndex;

        // Update prev button state
        if (prevButton) {
            prevButton.disabled = activeIndex === 0;
        }

        // Update next button state  
        if (nextButton) {
            nextButton.disabled = activeIndex === slidesLength - 1;
        }
    }

    /**
     * Create swiper slides from thumbnails
     */
    private createSwiperSlides(): void {
        const swiperContainer = safeQuerySelector(this.modal!, '[data-target-swiper]:not([data-target-swiper="on"])');
        if (!swiperContainer) return;

        const swiperWrapper = safeQuerySelector(swiperContainer, '.swiper-wrapper');
        if (!swiperWrapper) return;

        // Clear existing slides
        swiperWrapper.innerHTML = '';

        // Create slides from thumbnails
        this.mainThumbnails.forEach((thumbnail) => {
            const mediaType = thumbnail.getAttribute('data-type') as MediaType || 'image';
            const fullSizeUrl = mediaType === 'video'
                ? thumbnail.getAttribute('data-video-src')
                : thumbnail.getAttribute('data-full-img-src');
            if (!fullSizeUrl) return;

            const slide = document.createElement('div');
            slide.className = 'swiper-slide';

            if (mediaType === 'image') {
                const img = document.createElement('img');
                img.src = fullSizeUrl;
                img.alt = thumbnail.getAttribute('alt') || '';
                img.setAttribute('data-target-img', '');
                img.setAttribute('data-type', 'image');
                slide.appendChild(img);
            } else {
                const video = document.createElement('pxm-video');
                video.setAttribute('src', fullSizeUrl);
                video.setAttribute('type', thumbnail.getAttribute('data-video-type') || 'other');
                video.setAttribute('data-type', 'video');
                video.setAttribute('data-target-video', '');

                // Enable controls so the video can be played
                video.setAttribute('controls', 'true');

                // Enable autoplay for modal videos
                video.setAttribute('autoplay', 'true');

                // Use the provided thumbnail image instead of auto-generating one
                const thumbnailImg = safeQuerySelector<HTMLImageElement>(thumbnail, 'img');
                if (thumbnailImg && thumbnailImg.src) {
                    video.setAttribute('thumbnail', thumbnailImg.src);
                }

                if (thumbnail.getAttribute('data-title')) {
                    video.setAttribute('title', thumbnail.getAttribute('data-title')!);
                }
                if (thumbnail.getAttribute('data-description')) {
                    video.setAttribute('description', thumbnail.getAttribute('data-description')!);
                }
                slide.appendChild(video);
            }

            swiperWrapper.appendChild(slide);
        });
    }

    /**
     * Clean up zoom handlers from previous slide
     */
    private cleanupPreviousSlide(): void {
        // This will be handled by the callback mechanism
        // The EventManager will clean up the previous image's zoom handlers
    }

    /**
     * Update zoom handlers for current slide
     */
    private updateCurrentSlideZoom(): void {
        if (!this.swiperInstance) return;

        // Store the previous slide image for cleanup
        this.previousSlideImage = this.modalTargetImage;

        const activeSlide = this.modal?.querySelector('.swiper-slide-active img[data-target-img]') as HTMLImageElement;
        if (activeSlide) {
            // This will be called by EventManager to setup zoom
            // We just need to make sure the current slide image is accessible
            this.modalTargetImage = activeSlide;
        }

        // Handle autoplay for video slides
        this.handleVideoAutoplay();
    }

    /**
     * Handle autoplay for active video slides
     */
    private handleVideoAutoplay(): void {
        if (!this.swiperInstance) return;

        const activeSlide = this.modal?.querySelector('.swiper-slide-active');
        if (!activeSlide) return;

        const videoElement = activeSlide.querySelector('pxm-video') as HTMLElement;
        if (videoElement) {
            // Ensure the video has autoplay enabled when it becomes active
            videoElement.setAttribute('autoplay', 'true');

            // Trigger a custom event to notify the video component to start playing
            setTimeout(() => {
                const playEvent = new CustomEvent('triggerPlay');
                videoElement.dispatchEvent(playEvent);
            }, 100);
        }
    }

    /**
     * Get current active slide image (for swiper mode)
     */
    public getCurrentSlideImage(): HTMLImageElement | null {
        if (!this.isSwiperEnabled || !this.swiperInstance) {
            return this.modalTargetImage;
        }

        // First try: Use CSS selector
        let currentSlide = this.modal?.querySelector('.swiper-slide-active img[data-target-img]') as HTMLImageElement || null;

        // Fallback: Use Swiper API to get active slide
        if (!currentSlide && this.swiperInstance.slides) {
            const activeIndex = this.swiperInstance.activeIndex;
            const activeSlideElement = this.swiperInstance.slides[activeIndex];
            if (activeSlideElement) {
                currentSlide = activeSlideElement.querySelector('img[data-target-img]') as HTMLImageElement;
            }
        }

        return currentSlide;
    }

    /**
     * Get current active slide media element (image or video)
     */
    public getCurrentSlideMedia(): HTMLElement | null {
        if (!this.isSwiperEnabled || !this.swiperInstance) {
            return this.modalTargetImage || this.modalTargetVideo;
        }

        const activeIndex = this.swiperInstance.activeIndex;
        if (!this.swiperInstance.slides || activeIndex < 0) return null;

        const activeSlideElement = this.swiperInstance.slides[activeIndex];
        if (!activeSlideElement) return null;

        // Check for image first
        const slideImg = activeSlideElement.querySelector('img[data-target-img]') as HTMLImageElement;
        if (slideImg) return slideImg;

        // Then check for video
        const slideVideo = activeSlideElement.querySelector('pxm-video[data-target-video]') as HTMLElement;
        if (slideVideo) return slideVideo;

        return null;
    }

    /**
     * Get current active slide type
     */
    public getCurrentSlideType(): MediaType {
        const currentMedia = this.getCurrentSlideMedia();
        if (!currentMedia) return 'image';

        return currentMedia.getAttribute('data-type') as MediaType || 'image';
    }

    /**
     * Initialize the modal with thumbnails and event handlers
     */
    private initializeModal(): void {
        if (!this.modal) return;

        // Always setup modal thumbnails for navigation
        // In swiper mode: provides additional thumbnail navigation alongside swiper
        // In regular mode: provides the standard thumbnail navigation
        this.setupModalThumbnails();

        this.syncModalImageWithMain();
    }

    /**
     * Set up modal thumbnails by cloning main thumbnails
     */
    private setupModalThumbnails(): void {
        if (!this.modal) return;

        const modalThumbnailsContainer = safeQuerySelector(this.modal, '[data-modal-thumbnails]');
        if (!modalThumbnailsContainer) return;

        const templateItem = safeQuerySelector(modalThumbnailsContainer, this.config.thumbnailSelector);
        if (!templateItem) return;

        // Remove template and clear container
        this.clearModalThumbnails(modalThumbnailsContainer, templateItem);

        // Clone thumbnails from main lightbox (excluding the last one)
        this.cloneMainThumbnails(modalThumbnailsContainer);

        // Update modal thumbnails reference
        this.modalThumbnails = safeQuerySelectorAll(
            modalThumbnailsContainer,
            this.config.thumbnailSelector
        );
    }

    /**
     * Clear modal thumbnails container
     */
    private clearModalThumbnails(container: Element, template: Element): void {
        template.remove();
        container.innerHTML = '';
    }

    /**
     * Clone main thumbnails to modal (excluding modal template)
     */
    private cloneMainThumbnails(container: Element): void {
        // Filter out thumbnails that are inside the modal (like the template)
        const mainThumbnailsOnly = Array.from(this.mainThumbnails).filter(thumb => {
            return !thumb.closest(this.config.modalSelector);
        });

        // Filter out template thumbnails more intelligently
        // Look for thumbnails that appear to be templates (placeholder images, empty src, etc.)
        const thumbnailsToClone = mainThumbnailsOnly.filter(thumb => {
            // Check if it's a real thumbnail with actual content
            if (thumb.getAttribute('data-type') === 'image') {
                // For images, check if it has a real source
                const imgSrc = thumb.getAttribute('data-full-img-src') ||
                    (thumb instanceof HTMLImageElement ? thumb.src : null);
                const img = thumb.tagName === 'IMG' ? thumb as HTMLImageElement :
                    thumb.querySelector('img') as HTMLImageElement;

                // Skip if no valid image source or if it's a placeholder
                if (!imgSrc || imgSrc.includes('placeholder')) return false;
                if (img && (img.src.includes('placeholder') || !img.src)) return false;

                return true;
            } else if (thumb.getAttribute('data-type') === 'video') {
                // For videos, check if it has a video source
                const videoSrc = thumb.getAttribute('data-video-src');
                return !!videoSrc; // Include if it has a video source
            } else {
                // For unknown types, check if it has content
                const imgSrc = thumb.getAttribute('data-full-img-src');
                const img = thumb.querySelector('img') as HTMLImageElement;

                // Skip if it looks like a template
                if (!imgSrc && (!img || !img.src || img.src.includes('placeholder'))) {
                    return false;
                }

                return true;
            }
        });

        // Clone filtered thumbnails to modal
        thumbnailsToClone.forEach((thumb) => {
            const clone = this.createModalThumbnailClone(thumb);
            if (clone) {
                container.appendChild(clone);
            }
        });
    }

    /**
     * Create a modal thumbnail clone by deep cloning the original main thumbnail element.
     * This preserves any extra classes or attributes developers added to the main thumbnails.
     */
    private createModalThumbnailClone(mainThumb: Element): Element | null {
        const clone = mainThumb.cloneNode(true) as Element;
        // Ensure the cloned thumbnail has the data-thumb-item attribute
        clone.setAttribute('data-thumb-item', '');
        return clone;
    }

    /**
     * Sync modal target image with main target image
     */
    private syncModalImageWithMain(): void {
        if (!this.modalTargetImage) return;

        // Find the main target image from the lightbox element
        const mainLightbox = this.modal?.closest('pxm-lightbox');
        if (!mainLightbox) return;

        const mainTargetImage = safeQuerySelector<HTMLImageElement>(
            mainLightbox,
            this.config.targetSelector
        );

        if (mainTargetImage) {
            this.modalTargetImage.src = mainTargetImage.src;
        }
    }

    /**
     * Set callback for slide change events
     */
    public setSlideChangeCallback(callback: () => void): void {
        this.onSlideChangeCallback = callback;
    }

    /**
     * Update navigation button states (public method for external use)
     */
    public updateButtonStates(): void {
        this.updateNavigationButtonStates();
    }

    /**
     * Clean up modal manager resources
     */
    public destroy(): void {
        // Destroy swiper instance
        if (this.swiperInstance) {
            this.swiperInstance.destroy();
            this.swiperInstance = null;
        }

        if (this.modal) {
            // Remove close button handler
            if (this.closeHandler) {
                const closeButton = safeQuerySelector(this.modal, '[data-close]');
                if (closeButton) {
                    closeButton.removeEventListener('click', this.closeHandler);
                }
            }

            // Remove overlay click handler
            if (this.overlayClickHandler) {
                const overlay = safeQuerySelector(this.modal, '[data-modal-overlay]');
                if (overlay) {
                    overlay.removeEventListener('click', this.overlayClickHandler);
                }
            }

            // Remove custom swiper navigation handlers
            if (this.swiperPrevHandler) {
                const prevButton = safeQuerySelector(this.modal, '[data-swiper-prev]');
                if (prevButton) {
                    prevButton.removeEventListener('click', this.swiperPrevHandler);
                }
                this.swiperPrevHandler = undefined;
            }

            if (this.swiperNextHandler) {
                const nextButton = safeQuerySelector(this.modal, '[data-swiper-next]');
                if (nextButton) {
                    nextButton.removeEventListener('click', this.swiperNextHandler);
                }
                this.swiperNextHandler = undefined;
            }

            // Reset modal styles
            this.modal.style.transition = '';
            this.modal.style.opacity = '';
        }

        this.closeModal();
    }
} 