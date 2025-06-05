/**
 * PXM Lightbox Inline Component
 * 
 * Handles the inline view of the lightbox with thumbnail and viewer swipers
 */

import type { MediaItem, MediaType } from '../types';
import { safeQuerySelector, safeQuerySelectorAll } from '../dom-utils';

export class PxmLightboxInline extends HTMLElement {
    private currentIndex: number = 0;
    private mediaItems: MediaItem[] = [];

    constructor() {
        super();
    }

    connectedCallback() {
        this.initialize();
    }

    disconnectedCallback() {
        this.cleanup();
    }

    private initialize() {
        this.collectMediaItems();
        this.setupThumbnailEvents();
        this.setupNavigationEvents();
        this.updateViewer();
        this.updateThumbnailStates();
    }

    private cleanup() {
        this.removeThumbnailEvents();
        this.removeNavigationEvents();
    }

    private collectMediaItems() {
        const thumbs = safeQuerySelectorAll(this, 'pxm-lightbox-thumb');
        this.mediaItems = Array.from(thumbs).map((thumb) => {
            const type = thumb.getAttribute('type') as MediaType || 'image';
            const fullImageSrc = thumb.getAttribute('data-full-image-src') || '';
            const videoSrc = thumb.getAttribute('data-video-src') || '';
            const videoType = thumb.getAttribute('data-video-type') as any;
            const title = thumb.getAttribute('data-video-title') || '';
            const description = thumb.getAttribute('data-video-description') || '';

            return {
                type,
                src: type === 'image' ? fullImageSrc : videoSrc,
                videoType,
                title,
                description,
                thumbnail: this.getThumbnailImageSrc(thumb)
            };
        });
    }

    private getThumbnailImageSrc(thumb: Element): string {
        const img = safeQuerySelector<HTMLImageElement>(thumb, 'img');
        return img?.src || '';
    }

    private setupThumbnailEvents() {
        const thumbs = safeQuerySelectorAll(this, 'pxm-lightbox-thumb');
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
        const thumbs = safeQuerySelectorAll(this, 'pxm-lightbox-thumb');
        thumbs.forEach((thumb) => {
            const handler = (thumb as any)._clickHandler;
            if (handler) {
                thumb.removeEventListener('click', handler);
                delete (thumb as any)._clickHandler;
            }
        });
    }

    private handleThumbnailClick(index: number) {
        // Check if parent lightbox is in modal mode
        const parentLightbox = this.closest('pxm-lightbox');
        const isModalMode = parentLightbox?.getAttribute('mode') === 'modal';
        
        if (isModalMode) {
            // In modal mode, ONLY open the modal - don't update inline viewer
            this.dispatchEvent(new CustomEvent('open-modal', {
                detail: {
                    index,
                    mediaItem: this.mediaItems[index],
                    mediaItems: this.mediaItems
                },
                bubbles: true
            }));
            return; // Exit early - don't update inline
        }
        
        // Only update inline viewer if NOT in modal mode
        this.currentIndex = index;
        this.updateViewer();
        this.updateThumbnailStates();
        
        // Dispatch media-changed for other components to sync
        this.dispatchEvent(new CustomEvent('media-changed', {
            detail: {
                index,
                mediaItem: this.mediaItems[index]
            },
            bubbles: true
        }));
    }

    private updateViewer() {
        const viewer = safeQuerySelector(this, 'pxm-lightbox-viewer');
        if (viewer && this.mediaItems[this.currentIndex]) {
            const mediaItem = this.mediaItems[this.currentIndex];
            
            // Check if viewer has swiper mode enabled
            if ('getSwiperInstance' in viewer && (viewer as any).getSwiperInstance()) {
                // In swiper mode, slide to the correct index
                if ('slideTo' in viewer) {
                    (viewer as any).slideTo(this.currentIndex);
                }
            } else {
                // In regular mode, update the media directly
                if ('updateMedia' in viewer) {
                    (viewer as any).updateMedia(mediaItem);
                }
            }
        }
    }

    private updateThumbnailStates() {
        const thumbs = safeQuerySelectorAll(this, 'pxm-lightbox-thumb');
        thumbs.forEach((thumb, index) => {
            if ('setActive' in thumb) {
                (thumb as any).setActive(index === this.currentIndex);
            } else {
                thumb.classList.toggle('active', index === this.currentIndex);
            }
        });

        const thumbsComponent = safeQuerySelector(this, 'pxm-lightbox-thumbs');
        if (thumbsComponent && 'slideTo' in thumbsComponent) {
            (thumbsComponent as any).slideTo(this.currentIndex);
        }
    }

    private setupNavigationEvents() {
        // Listen for navigation events from thumbs component
        const thumbsComponent = safeQuerySelector(this, 'pxm-lightbox-thumbs');
        if (thumbsComponent) {
            const navPrevHandler = () => this.navigatePrev();
            const navNextHandler = () => this.navigateNext();
            
            thumbsComponent.addEventListener('navigate-prev', navPrevHandler);
            thumbsComponent.addEventListener('navigate-next', navNextHandler);
            
            (thumbsComponent as any)._navPrevHandler = navPrevHandler;
            (thumbsComponent as any)._navNextHandler = navNextHandler;
        }

        // Listen for modal open events from viewer component
        const viewerComponent = safeQuerySelector(this, 'pxm-lightbox-viewer');
        if (viewerComponent) {
            const modalOpenHandler = (event: CustomEvent) => {
                // Forward the event up to the main lightbox
                this.dispatchEvent(new CustomEvent('open-modal', {
                    detail: event.detail,
                    bubbles: true
                }));
            };
            
            const viewerSlideChangeHandler = (event: CustomEvent) => {
                // Sync thumbnails when viewer swiper changes
                this.currentIndex = event.detail.index;
                this.updateThumbnailStates();
                
                // Dispatch media-changed for external listeners
                this.dispatchEvent(new CustomEvent('media-changed', {
                    detail: event.detail,
                    bubbles: true
                }));
            };
            
            viewerComponent.addEventListener('open-modal', modalOpenHandler as EventListener);
            viewerComponent.addEventListener('viewer-slide-change', viewerSlideChangeHandler as EventListener);
            
            (viewerComponent as any)._modalOpenHandler = modalOpenHandler;
            (viewerComponent as any)._viewerSlideChangeHandler = viewerSlideChangeHandler;
        }
    }

    private removeNavigationEvents() {
        const thumbsComponent = safeQuerySelector(this, 'pxm-lightbox-thumbs');
        if (thumbsComponent) {
            const navPrevHandler = (thumbsComponent as any)._navPrevHandler;
            const navNextHandler = (thumbsComponent as any)._navNextHandler;
            
            if (navPrevHandler) {
                thumbsComponent.removeEventListener('navigate-prev', navPrevHandler);
                delete (thumbsComponent as any)._navPrevHandler;
            }
            if (navNextHandler) {
                thumbsComponent.removeEventListener('navigate-next', navNextHandler);
                delete (thumbsComponent as any)._navNextHandler;
            }
        }

        const viewerComponent = safeQuerySelector(this, 'pxm-lightbox-viewer');
        if (viewerComponent) {
            const modalOpenHandler = (viewerComponent as any)._modalOpenHandler;
            const viewerSlideChangeHandler = (viewerComponent as any)._viewerSlideChangeHandler;
            
            if (modalOpenHandler) {
                viewerComponent.removeEventListener('open-modal', modalOpenHandler);
                delete (viewerComponent as any)._modalOpenHandler;
            }
            if (viewerSlideChangeHandler) {
                viewerComponent.removeEventListener('viewer-slide-change', viewerSlideChangeHandler);
                delete (viewerComponent as any)._viewerSlideChangeHandler;
            }
        }
    }

    private navigatePrev() {
        const newIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.mediaItems.length - 1;
        this.navigateToIndex(newIndex);
    }

    private navigateNext() {
        const newIndex = this.currentIndex < this.mediaItems.length - 1 ? this.currentIndex + 1 : 0;
        this.navigateToIndex(newIndex);
    }

    private navigateToIndex(index: number) {
        // Navigation should always work inline, regardless of modal mode
        this.currentIndex = index;
        this.updateViewer();
        this.updateThumbnailStates();
        
        // Always dispatch media-changed for sync
        this.dispatchEvent(new CustomEvent('media-changed', {
            detail: {
                index,
                mediaItem: this.mediaItems[index]
            },
            bubbles: true
        }));
    }

    // Public API methods
    public getCurrentIndex(): number {
        return this.currentIndex;
    }

    public getCurrentMediaItem(): MediaItem | null {
        return this.mediaItems[this.currentIndex] || null;
    }

    public setCurrentIndex(index: number) {
        if (index >= 0 && index < this.mediaItems.length) {
            this.handleThumbnailClick(index);
        }
    }

    public getMediaItems(): MediaItem[] {
        return [...this.mediaItems];
    }
} 