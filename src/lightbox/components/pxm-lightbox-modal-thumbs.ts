/**
 * PXM Lightbox Modal Thumbnails Component
 * 
 * Handles the modal thumbnail container with Swiper integration
 * Uses template-based auto-population from inline component data
 */

import type { MediaItem } from '../types';
import { safeQuerySelector, safeQuerySelectorAll } from '../dom-utils';

export class PxmLightboxModalThumbs extends HTMLElement {
    private swiperInstance: any = null;
    private currentIndex: number = 0;
    private mediaItems: MediaItem[] = [];
    private swiperMode: string = 'horizontal';
    private initialized: boolean = false;
    private templateThumb: Element | null = null;

    static get observedAttributes() {
        return ['data-swiper-direction'];
    }

    constructor() {
        super();
    }

    connectedCallback() {
        setTimeout(() => {
            this.initialize();
        }, 0);
    }

    disconnectedCallback() {
        this.cleanup();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue && PxmLightboxModalThumbs.observedAttributes.includes(name)) {
            this.parseAttributes();
            if (this.isConnected && this.initialized) {
                this.populateFromTemplate();
                this.initializeSwiper();
            }
        }
    }

    private parseAttributes() {
        this.swiperMode = this.getAttribute('data-swiper-direction') || 'horizontal';
    }

    private async initialize() {
        if (this.initialized) return;
        
        this.parseAttributes();
        this.captureTemplate();
        
        this.initialized = true;
    }

    private cleanup() {
        if (this.swiperInstance) {
            this.swiperInstance.destroy();
            this.swiperInstance = null;
        }
        this.removeThumbnailEvents();
        this.initialized = false;
    }

    private captureTemplate() {
        // Find the first thumbnail element - this will be our template
        this.templateThumb = safeQuerySelector(this, 'pxm-lightbox-modal-thumb');
        
        if (!this.templateThumb) {
            console.warn('No template thumbnail found in pxm-lightbox-modal-thumbs');
            return;
        }
        
        // Clean up the template - remove any existing swiper structure inside it
        // The swiper should be at the container level, not inside individual thumbs
        const existingSwiperInTemplate = safeQuerySelector(this.templateThumb, '[data-swiper]');
        if (existingSwiperInTemplate) {
            existingSwiperInTemplate.remove();
        }
        
        // Hide the template so it doesn't show up
        (this.templateThumb as HTMLElement).style.display = 'none';
    }

    private getMediaItemsFromInline() {
        // Get media items from the parent lightbox's inline component
        const parentLightbox = this.closest('pxm-lightbox');
        const inlineComponent = parentLightbox?.querySelector('pxm-lightbox-inline');
        
        if (inlineComponent && 'getMediaItems' in inlineComponent) {
            this.mediaItems = (inlineComponent as any).getMediaItems();
        } else {
            console.warn('Could not find inline component to get media items from');
            this.mediaItems = [];
        }
    }

    private async populateFromTemplate() {
        if (!this.templateThumb || this.mediaItems.length === 0) {
            return;
        }

        try {
            // Remove all existing content except the template
            const existingContent = Array.from(this.children).filter(child => child !== this.templateThumb);
            existingContent.forEach(child => child.remove());

            // Get the inline thumbs to extract their inner content
            const parentLightbox = this.closest('pxm-lightbox');
            const inlineThumbs = parentLightbox ? safeQuerySelectorAll(parentLightbox, 'pxm-lightbox-inline pxm-lightbox-thumb') : [];
            
            if (inlineThumbs.length === 0) {
                console.warn('No inline thumbs found for template population');
                return;
            }
            
            // Create swiper structure at container level
            const swiperDiv = document.createElement('div');
            swiperDiv.setAttribute('data-swiper', '');
            swiperDiv.className = 'swiper';
            
            const swiperWrapper = document.createElement('div');
            swiperWrapper.setAttribute('data-swiper-wrapper', '');
            swiperWrapper.className = 'swiper-wrapper';
            
            // Create a slide for each media item
            this.mediaItems.forEach((mediaItem, index) => {
                const slide = document.createElement('div');
                slide.setAttribute('data-swiper-slide', '');
                slide.className = 'swiper-slide';
                
                // Clone the template
                const thumbClone = this.templateThumb!.cloneNode(true) as Element;
                
                // Make visible and populate with data from media item
                thumbClone.removeAttribute('style');
                this.populateThumbData(thumbClone, mediaItem, index);
                
                // Extract and use inner content from corresponding inline thumb
                if (inlineThumbs[index]) {
                    this.extractAndInsertInnerContent(thumbClone, inlineThumbs[index]);
                }
                
                slide.appendChild(thumbClone);
                swiperWrapper.appendChild(slide);
            });
            
            swiperDiv.appendChild(swiperWrapper);
            this.appendChild(swiperDiv);
            
            // Remove the template now that we're done with it
            if (this.templateThumb && this.templateThumb.parentNode) {
                this.templateThumb.remove();
            }
            this.templateThumb = null;

            // Initialize swiper on the newly created structure with a small delay
            setTimeout(async () => {
                await this.initializeSwiper();
            }, 100);
            
        } catch (error) {
            console.error('Error during template population:', error);
        }
    }

    private extractAndInsertInnerContent(modalThumb: Element, inlineThumb: Element) {
        try {
            // Extract the inner content from the inline thumb (typically img elements)
            const inlineContent = Array.from(inlineThumb.children);
            
            // Clear any existing content in the modal thumb (except attributes)
            modalThumb.innerHTML = '';
            
            // Clone and insert the inline content into the modal thumb
            inlineContent.forEach(content => {
                const clonedContent = content.cloneNode(true);
                modalThumb.appendChild(clonedContent);
            });
            
        } catch (error) {
            console.error('Error extracting content from inline thumb:', error);
        }
    }

    private populateThumbData(thumbElement: Element, mediaItem: MediaItem, index: number) {
        // Set attributes based on media item data
        thumbElement.setAttribute('type', mediaItem.type);
        
        if (mediaItem.type === 'image') {
            thumbElement.setAttribute('data-full-image-src', mediaItem.src);
        } else if (mediaItem.type === 'video') {
            thumbElement.setAttribute('data-video-src', mediaItem.src);
            if (mediaItem.videoType) {
                thumbElement.setAttribute('data-video-type', mediaItem.videoType);
            }
            if (mediaItem.title) {
                thumbElement.setAttribute('data-video-title', mediaItem.title);
            }
            if (mediaItem.description) {
                thumbElement.setAttribute('data-video-description', mediaItem.description);
            }
        }

        // Update the thumbnail image source
        const img = safeQuerySelector<HTMLImageElement>(thumbElement, 'img');
        if (img && mediaItem.thumbnail) {
            img.src = mediaItem.thumbnail;
            img.alt = mediaItem.title || `${mediaItem.type} thumbnail`;
        }

        // Set active state for first item
        if (index === 0) {
            thumbElement.classList.add('active');
            thumbElement.setAttribute('aria-selected', 'true');
        } else {
            thumbElement.classList.remove('active');
            thumbElement.setAttribute('aria-selected', 'false');
        }

        // Update aria-label
        const mediaDescription = mediaItem.type === 'video' ? 
            `Video: ${mediaItem.title || 'Untitled'}` :
            'Image thumbnail';
        thumbElement.setAttribute('aria-label', `${mediaDescription}. Click to view in modal.`);
    }

    private collectMediaItems() {
        // After population, collect the actual media items from the populated thumbs
        const thumbs = safeQuerySelectorAll(this, 'pxm-lightbox-modal-thumb');
        this.mediaItems = Array.from(thumbs).map((thumb) => {
            if ('getMediaData' in thumb) {
                return (thumb as any).getMediaData();
            }
            return {
                type: thumb.getAttribute('type') || 'image',
                src: thumb.getAttribute('data-full-image-src') || thumb.getAttribute('data-video-src') || '',
                videoType: thumb.getAttribute('data-video-type') as any,
                title: thumb.getAttribute('data-video-title') || undefined,
                description: thumb.getAttribute('data-video-description') || undefined,
                thumbnail: this.getThumbnailSrc(thumb)
            };
        });
    }

    private getThumbnailSrc(thumb: Element): string {
        const img = safeQuerySelector<HTMLImageElement>(thumb, 'img');
        return img?.src || '';
    }

    private async initializeSwiper() {
        // Check if parent modal has thumbs-swiper enabled
        const parentModal = this.closest('pxm-lightbox-modal');
        const hasSwiperEnabled = parentModal?.getAttribute('thumbs-swiper') === 'true';
        
        if (!hasSwiperEnabled) {
            return;
        }

        // Ensure Swiper is available
        await this.ensureSwiperAvailable();

        if (!window.Swiper) {
            console.error('Swiper not available for modal thumbs');
            return;
        }

        const swiperElement = safeQuerySelector(this, '[data-swiper]');
        
        if (!swiperElement) {
            return;
        }

        // Destroy existing instance
        if (this.swiperInstance) {
            this.swiperInstance.destroy();
        }

        const isVertical = this.swiperMode === 'vertical';
        const slidesPerView = this.getAttribute('data-slides-per-view') || 'auto';

        const config = {
            direction: isVertical ? 'vertical' : 'horizontal',
            slidesPerView: slidesPerView === 'auto' ? 'auto' : parseInt(slidesPerView),
            spaceBetween: 8,
            freeMode: true,
            watchSlidesProgress: true,
            centeredSlides: true,
            breakpoints: {
                768: {
                    slidesPerView: isVertical ? 4 : 6,
                    spaceBetween: 10,
                },
                1024: {
                    slidesPerView: isVertical ? 5 : 8,
                    spaceBetween: 12,
                }
            },
            on: {
                slideChange: () => {
                    this.dispatchEvent(new CustomEvent('modal-thumbnail-slide-change', {
                        detail: { 
                            activeIndex: this.swiperInstance?.activeIndex,
                            instance: this.swiperInstance 
                        },
                        bubbles: true
                    }));
                }
            }
        };

        try {
            this.swiperInstance = new window.Swiper(swiperElement, config);
        } catch (error) {
            console.error('Failed to initialize modal thumbs Swiper:', error);
        }
    }

    private async ensureSwiperAvailable() {
        if (window.Swiper) {
            return;
        }

        try {
            const SwiperModule = await import('swiper');
            window.Swiper = SwiperModule.default || SwiperModule.Swiper;
        } catch (error) {
            console.error('Failed to import Swiper for modal thumbs:', error);
        }
    }

    private setupThumbnailEvents() {
        // Remove existing events first to prevent duplicates
        this.removeThumbnailEvents();
        
        const thumbs = safeQuerySelectorAll(this, 'pxm-lightbox-modal-thumb');
        
        thumbs.forEach((thumb, index) => {
            const clickHandler = (event: Event) => {
                event.preventDefault();
                this.handleThumbnailClick(index);
            };
            thumb.addEventListener('click', clickHandler);
            (thumb as any)._clickHandler = clickHandler;
        });
    }

    private removeThumbnailEvents() {
        const thumbs = safeQuerySelectorAll(this, 'pxm-lightbox-modal-thumb');
        thumbs.forEach((thumb) => {
            const handler = (thumb as any)._clickHandler;
            if (handler) {
                thumb.removeEventListener('click', handler);
                delete (thumb as any)._clickHandler;
            }
        });
    }

    private handleThumbnailClick(index: number) {
        this.setActiveIndex(index);
        
        // Dispatch event for modal navigation
        this.dispatchEvent(new CustomEvent('modal-thumbnail-click', {
            detail: {
                index,
                mediaItem: this.mediaItems[index]
            },
            bubbles: true
        }));
    }

    private updateThumbnailStates() {
        const thumbs = safeQuerySelectorAll(this, 'pxm-lightbox-modal-thumb');
        thumbs.forEach((thumb, index) => {
            if ('setActive' in thumb) {
                (thumb as any).setActive(index === this.currentIndex);
            } else {
                thumb.classList.toggle('active', index === this.currentIndex);
            }
        });
    }

    // Public API methods
    public setActiveIndex(index: number) {
        if (index >= 0 && index < this.mediaItems.length) {
            this.currentIndex = index;
            this.updateThumbnailStates();
            
            // Scroll to active thumbnail if using Swiper
            if (this.swiperInstance) {
                this.swiperInstance.slideTo(index);
            }
        }
    }

    public getCurrentIndex(): number {
        return this.currentIndex;
    }

    public getSwiperInstance(): any {
        return this.swiperInstance;
    }

    public updateMediaItems(mediaItems: MediaItem[]) {
        this.mediaItems = mediaItems;
        if (this.templateThumb) {
            // If we still have template, re-populate
            this.populateFromTemplate();
        } else {
            // Otherwise collect from existing DOM
            this.collectMediaItems();
        }
        
        if (this.swiperInstance) {
            this.swiperInstance.update();
        }
    }

    public getMediaItems(): MediaItem[] {
        return [...this.mediaItems];
    }

    public async refreshFromInline() {
        // Public method to manually refresh from inline component
        
        this.getMediaItemsFromInline();
        await this.populateFromTemplate();
        
        // Setup events AFTER population is complete
        setTimeout(() => {
            this.setupThumbnailEvents();
        }, 50);
    }
} 