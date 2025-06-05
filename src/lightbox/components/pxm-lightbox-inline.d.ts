/**
 * PXM Lightbox Inline Component
 *
 * Handles the inline view of the lightbox with thumbnail and viewer swipers
 */
import type { MediaItem } from '../types';
export declare class PxmLightboxInline extends HTMLElement {
    private currentIndex;
    private mediaItems;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private initialize;
    private cleanup;
    private collectMediaItems;
    private getThumbnailImageSrc;
    private setupThumbnailEvents;
    private removeThumbnailEvents;
    private handleThumbnailClick;
    private updateViewer;
    private updateThumbnailStates;
    private setupNavigationEvents;
    private removeNavigationEvents;
    private navigatePrev;
    private navigateNext;
    private navigateToIndex;
    getCurrentIndex(): number;
    getCurrentMediaItem(): MediaItem | null;
    setCurrentIndex(index: number): void;
    getMediaItems(): MediaItem[];
}
