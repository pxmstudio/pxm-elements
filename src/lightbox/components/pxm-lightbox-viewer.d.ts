/**
 * PXM Lightbox Viewer Component
 *
 * Handles displaying media content with zoom functionality and optional swiper
 */
import type { MediaItem } from '../types';
import { ZoomManager } from '../zoom-manager';
export declare class PxmLightboxViewer extends HTMLElement {
    private currentMedia;
    private zoomManager;
    private targetImg;
    private targetVideo;
    private zoomMode;
    private initialized;
    private swiperInstance;
    private mediaItems;
    private currentIndex;
    private hasViewerSwiper;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private initialize;
    private getMediaItems;
    private initializeViewerSwiper;
    private ensureSwiperAvailable;
    private populateViewerSwiperStructure;
    private createSlideContent;
    private createVideoSlideContent;
    private styleVideoForSwiper;
    private createYouTubeIframe;
    private createVimeoIframe;
    private createVideoElement;
    private handleSwiperSlideChange;
    private setupZoomForCurrentSlide;
    private checkModalMode;
    private setupModalClickHandler;
    private openModal;
    private cleanup;
    private parseZoomMode;
    private findTargetElements;
    private initializeZoom;
    private setupEventListeners;
    private handleMediaChange;
    private updateFromAttribute;
    updateMedia(mediaItem: MediaItem): void;
    private showImage;
    private showVideo;
    private setupYouTubeVideo;
    private setupVimeoVideo;
    private setupDirectVideo;
    private extractYouTubeId;
    private extractVimeoId;
    getCurrentMedia(): MediaItem | null;
    getZoomManager(): ZoomManager | null;
    getSwiperInstance(): any;
    slideTo(index: number): void;
    enableZoom(): void;
    disableZoom(): void;
}
