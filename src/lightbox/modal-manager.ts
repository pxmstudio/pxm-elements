/**
 * Modal functionality manager for the PXM Lightbox component
 */

import type { LightboxConfig } from './types';
import {
    safeQuerySelector,
    safeQuerySelectorAll,
    copyImageAttributes,
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

    constructor(
        lightboxElement: HTMLElement,
        config: LightboxConfig,
        mainThumbnails: NodeListOf<Element>
    ) {
        this.config = config;
        this.mainThumbnails = mainThumbnails;
        this.isSwiperEnabled = lightboxElement.getAttribute('data-target-swiper') === 'on';

        this.modal = safeQuerySelector(lightboxElement, config.modalSelector);
        this.modalTargetImage = this.modal ?
            safeQuerySelector<HTMLImageElement>(this.modal, config.targetSelector) :
            null;
        this.modalThumbnails = document.querySelectorAll('*:not(*)'); // Empty NodeList initially

        if (this.modal) {
            this.initializeModal();
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
     * Open the modal
     */
    public async openModal(): Promise<void> {
        if (!this.modal) return;

        this.modal.style.display = 'flex';
        toggleBodyScrollLock(true);

        // Initialize swiper after modal is visible
        if (this.isSwiperEnabled && !this.swiperInstance) {
            await this.initializeSwiper();
        }
    }

    /**
     * Close the modal
     */
    public closeModal(): void {
        if (!this.modal) return;

        this.modal.style.display = 'none';
        toggleBodyScrollLock(false);
    }

    /**
     * Update modal target image source
     */
    public updateModalImage(imageSrc: string): void {
        if (this.isSwiperEnabled && this.swiperInstance) {
            // Find the slide index for this image and navigate to it
            this.navigateToSlide(imageSrc);
        } else if (this.modalTargetImage) {
            this.modalTargetImage.src = imageSrc;
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
     * Create swiper slides from thumbnail images
     */
    private createSwiperSlides(): void {
        if (!this.modal) return;

        const swiperWrapper = safeQuerySelector(this.modal, '[data-target-swiper-wrapper]');
        if (!swiperWrapper) return;

        // Get the template slide
        const templateSlide = safeQuerySelector(swiperWrapper, '[data-target-swiper-slide]');
        if (!templateSlide) return;

        // Store template slide and image for reference
        const templateImg = templateSlide.querySelector('img[data-target-img]') as HTMLImageElement;
        if (!templateImg) return;

        // Store the original template classes to ensure they're preserved
        const originalSlideClasses = templateSlide.className;
        const originalImgClasses = templateImg.className;

        // Clear existing slides except the template
        const existingSlides = swiperWrapper.querySelectorAll('[data-target-swiper-slide]');
        existingSlides.forEach(slide => {
            if (slide !== templateSlide) {
                slide.remove();
            }
        });

        // Filter out thumbnails that are inside the modal (like the template)
        const mainThumbnailsOnly = Array.from(this.mainThumbnails).filter(thumb => {
            return !thumb.closest(this.config.modalSelector);
        });

        // Exclude the last item as it's typically a template (-1)
        const thumbnailsToCreateSlides = mainThumbnailsOnly.slice(0, -1);

        // Create slides from main thumbnails using the template structure
        thumbnailsToCreateSlides.forEach((thumb, index) => {
            const img = safeQuerySelector<HTMLImageElement>(thumb, 'img');
            if (!img) return;

            const fullSrc = img.getAttribute('data-full-src') || img.src;

            // Clone the template slide completely
            const slide = templateSlide.cloneNode(true) as HTMLElement;

            // Ensure the slide maintains its original classes
            slide.className = originalSlideClasses;

            // Find the image in the cloned slide
            const slideImg = slide.querySelector('img[data-target-img]') as HTMLImageElement;
            if (slideImg) {
                // Restore original image classes
                slideImg.className = originalImgClasses;

                // Only update the image source and alt - nothing else
                slideImg.src = fullSrc;
                slideImg.alt = img.alt || '';

                // Create a defensive mechanism to preserve classes
                const preserveClasses = () => {
                    if (slideImg.className !== originalImgClasses) {
                        slideImg.className = originalImgClasses;
                    }
                };

                // Set up a mutation observer to watch for class changes
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            preserveClasses();
                        }
                    });
                });

                // Start observing the image for class changes
                observer.observe(slideImg, { 
                    attributes: true, 
                    attributeFilter: ['class'] 
                });

                // Also set up a timeout to restore classes after a delay
                setTimeout(preserveClasses, 100);
                setTimeout(preserveClasses, 500);
                setTimeout(() => {
                    // Stop observing after 2 seconds
                    observer.disconnect();
                }, 2000);
            }

            swiperWrapper.appendChild(slide);
        });

        // Remove the template slide after we're done
        templateSlide.remove();
    }

    /**
     * Navigate swiper to a specific image
     */
    private navigateToSlide(imageSrc: string): void {
        if (!this.swiperInstance) return;

        // Find the slide index that matches the image source
        const slides = this.modal?.querySelectorAll('[data-target-swiper-slide] img');
        if (!slides) return;

        let targetIndex = 0;
        slides.forEach((img, index) => {
            if ((img as HTMLImageElement).src === imageSrc) {
                targetIndex = index;
            }
        });

        this.swiperInstance.slideTo(targetIndex);

        // Update button states after navigation
        setTimeout(() => {
            this.updateNavigationButtonStates();
        }, 100);
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
        this.cloneMainThumbnails(modalThumbnailsContainer, templateItem);

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
     * Clone main thumbnails to modal (excluding the last one)
     */
    private cloneMainThumbnails(container: Element, template: Element): void {
        // Filter out thumbnails that are inside the modal (like the template)
        const mainThumbnailsOnly = Array.from(this.mainThumbnails).filter(thumb => {
            return !thumb.closest(this.config.modalSelector);
        });

        // Exclude the last item as it's typically a template (-1)
        const thumbnailsToClone = mainThumbnailsOnly.slice(0, -1);

        // Clone thumbnails from main lightbox only (excluding modal template and last template)
        thumbnailsToClone.forEach((thumb) => {
            const clone = this.createModalThumbnailClone(template, thumb);
            if (clone) {
                container.appendChild(clone);
            }
        });
    }

    /**
     * Create a modal thumbnail clone from main thumbnail
     */
    private createModalThumbnailClone(template: Element, mainThumb: Element): Element | null {
        const clone = template.cloneNode(true) as Element;
        const originalImg = safeQuerySelector<HTMLImageElement>(mainThumb, 'img');
        const cloneImg = safeQuerySelector<HTMLImageElement>(clone, 'img');

        if (originalImg && cloneImg) {
            // Preserve the template's classes
            const templateClasses = template.className;
            if (templateClasses) {
                clone.className = templateClasses;
            }

            // Copy image attributes
            copyImageAttributes(originalImg, cloneImg);
            return clone;
        }

        return null;
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
        }

        this.closeModal();
    }
} 