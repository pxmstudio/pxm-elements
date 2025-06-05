/**
 * PXM Lightbox Modal Thumbnails Component
 *
 * Handles the modal thumbnail container with Swiper integration
 * Uses template-based auto-population from inline component data
 */
import type { MediaItem } from '../types';
export declare class PxmLightboxModalThumbs extends HTMLElement {
    private swiperInstance;
    private currentIndex;
    private mediaItems;
    private swiperMode;
    private initialized;
    private templateThumb;
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    private parseAttributes;
    private initialize;
    private cleanup;
    private captureTemplate;
    private getMediaItemsFromInline;
    private populateFromTemplate;
    private extractAndInsertInnerContent;
    private populateThumbData;
    private collectMediaItems;
    private getThumbnailSrc;
    private initializeSwiper;
    private ensureSwiperAvailable;
    private setupThumbnailEvents;
    private removeThumbnailEvents;
    private handleThumbnailClick;
    private updateThumbnailStates;
    setActiveIndex(index: number): void;
    getCurrentIndex(): number;
    getSwiperInstance(): any;
    updateMediaItems(mediaItems: MediaItem[]): void;
    getMediaItems(): MediaItem[];
    refreshFromInline(): Promise<void>;
}
