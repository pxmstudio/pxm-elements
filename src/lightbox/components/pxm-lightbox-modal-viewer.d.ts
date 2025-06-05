/**
 * PXM Lightbox Modal Viewer Component
 *
 * Handles displaying media content in the modal with Swiper integration and zoom functionality
 */
import type { MediaItem } from '../types';
import { ZoomManager } from '../zoom-manager';
export declare class PxmLightboxModalViewer extends HTMLElement {
    private currentMedia;
    private swiperInstance;
    private zoomManager;
    private zoomMode;
    private initialized;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private initialize;
    private parseZoomMode;
    private initializeZoom;
    private cleanup;
    private initializeSwiper;
    private ensureSwiperAvailable;
    updateMedia(mediaItem: MediaItem): void;
    private populateViewerSlides;
    private showImage;
    private showVideo;
    private styleVideoForSwiper;
    private createYouTubeIframe;
    private createVimeoIframe;
    private createVideoElement;
    private extractYouTubeId;
    private extractVimeoId;
    getCurrentMedia(): MediaItem | null;
    getSwiperInstance(): any;
    getZoomManager(): ZoomManager | null;
    slideTo(index: number, speed?: number): void;
    enableZoom(): void;
    disableZoom(): void;
    private setupZoomForCurrentSlide;
}
