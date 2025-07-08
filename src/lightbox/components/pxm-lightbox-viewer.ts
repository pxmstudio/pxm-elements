/**
 * PXM Lightbox Viewer Component
 * 
 * Handles displaying media content with zoom functionality and optional swiper
 */

import type { MediaItem, ZoomMode } from '../types';
import { ZoomManager } from '../zoom-manager';
import { safeQuerySelector } from '../dom-utils';
import { animate } from '../../animation';
import { getConfig } from '../../config/pxm-config';

export class PxmLightboxViewer extends HTMLElement {
    private currentMedia: MediaItem | null = null;
    private zoomManager: ZoomManager | null = null;
    private targetImg: HTMLImageElement | null = null;
    private targetVideo: HTMLElement | null = null;
    private zoomMode: ZoomMode = 'none';
    private initialized: boolean = false;
    private swiperInstance: any = null;
    private mediaItems: MediaItem[] = [];
    private currentIndex: number = 0;
    private hasViewerSwiper: boolean = false;

    constructor() {
        super();
    }

    connectedCallback() {
        if (typeof window !== 'undefined' && (window as any).__debugLog) {
            (window as any).__debugLog('PxmLightboxViewer connectedCallback');
        } else {
            console.log('PxmLightboxViewer connectedCallback');
        }
        setTimeout(() => {
            this.initialize();
        }, 0);
    }

    disconnectedCallback() {
        this.cleanup();
    }

    private initialize() {
        if (this.initialized) return;
        
        this.parseZoomMode();
        this.getMediaItems();
        
        // Check if swiper structure exists in HTML to determine mode
        const swiperElement = safeQuerySelector(this, '[data-swiper]');
        this.hasViewerSwiper = !!swiperElement;
        
        if (this.hasViewerSwiper) {
            this.initializeViewerSwiper();
        } else {
            this.findTargetElements();
        }
        
        this.checkModalMode();
        this.initializeZoom();
        this.setupEventListeners();
        
        this.initialized = true;
    }

    private getMediaItems() {
        const parentInline = this.closest('pxm-lightbox-inline');
        if (parentInline && 'getMediaItems' in parentInline) {
            this.mediaItems = (parentInline as any).getMediaItems();
            this.currentIndex = (parentInline as any).getCurrentIndex() || 0;
        }
    }

    private async initializeViewerSwiper() {
        // Check if swiper structure exists in HTML
        const swiperElement = safeQuerySelector(this, '[data-swiper]');
        if (!swiperElement) {
            this.hasViewerSwiper = false;
            this.findTargetElements();
            return;
        }

        if (this.mediaItems.length === 0) {
            return;
        }

        // Ensure Swiper is available
        await this.ensureSwiperAvailable();

        if (!window.Swiper) {
            console.error('Swiper not available for viewer');
            return;
        }

        // Populate the existing swiper structure with media items
        this.populateViewerSwiperStructure();

        const config = {
            direction: 'horizontal',
            slidesPerView: 1,
            spaceBetween: 0,
            centeredSlides: true,
            initialSlide: this.currentIndex,
            allowTouchMove: true,
            simulateTouch: true,
            threshold: 10,
            keyboard: {
                enabled: true,
            },
            // Add navigation if present
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                slideChange: () => {
                    const newIndex = this.swiperInstance?.activeIndex || 0;
                    this.handleSwiperSlideChange(newIndex);
                }
            }
        };

        try {
            this.swiperInstance = new window.Swiper(swiperElement, config);
        } catch (error) {
            console.error('Failed to initialize viewer Swiper:', error);
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
            console.error('Failed to import Swiper for viewer:', error);
        }
    }

    private populateViewerSwiperStructure() {
        const swiperWrapper = safeQuerySelector(this, '[data-swiper-wrapper]');
        if (!swiperWrapper) {
            console.warn('Swiper wrapper not found in viewer structure');
            return;
        }

        // Clear existing slides
        swiperWrapper.innerHTML = '';
        
        // Create slides for each media item
        this.mediaItems.forEach((mediaItem) => {
            const slide = document.createElement('div');
            slide.setAttribute('data-swiper-slide', '');
            slide.className = 'swiper-slide';
            
            this.createSlideContent(slide, mediaItem);
            swiperWrapper.appendChild(slide);
        });
    }

    private createSlideContent(slide: Element, mediaItem: MediaItem) {
        if (mediaItem.type === 'image') {
            const img = document.createElement('img');
            img.src = mediaItem.src;
            img.alt = mediaItem.title || 'Viewer image';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.style.opacity = '0';
            img.onload = async () => {
                // Animate fade-in using global config
                const { duration, easing } = getConfig().defaults;
                await animate(img, { opacity: 1 }, { duration, easing });
                img.style.opacity = '1'; // Ensure final state for tests
            };
            slide.appendChild(img);
        } else if (mediaItem.type === 'video') {
            this.createVideoSlideContent(slide, mediaItem);
        }
    }

    private createVideoSlideContent(slide: Element, mediaItem: MediaItem) {
        // Create a wrapper for the video to allow swiper navigation
        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'video-wrapper';
        videoWrapper.style.width = '100%';
        videoWrapper.style.height = '100%';
        videoWrapper.style.display = 'flex';
        videoWrapper.style.alignItems = 'center';
        videoWrapper.style.justifyContent = 'center';
        videoWrapper.style.position = 'relative';
        
        let videoElement: HTMLElement;
        
        if (mediaItem.videoType === 'youtube') {
            videoElement = this.createYouTubeIframe(mediaItem.src);
        } else if (mediaItem.videoType === 'vimeo') {
            videoElement = this.createVimeoIframe(mediaItem.src);
        } else {
            videoElement = this.createVideoElement(mediaItem.src);
        }
        
        // Style the video element to allow swiper navigation
        this.styleVideoForSwiper(videoElement);
        
        videoWrapper.appendChild(videoElement);
        slide.appendChild(videoWrapper);
    }

    private styleVideoForSwiper(videoElement: HTMLElement) {
        // Add styles that allow swiper navigation around videos
        videoElement.style.maxWidth = '90%';
        videoElement.style.maxHeight = '90%';
        videoElement.style.pointerEvents = 'auto';
        
        // For iframes, add a slight margin to allow touch events on edges
        if (videoElement.tagName === 'IFRAME') {
            videoElement.style.border = 'none';
            videoElement.style.borderRadius = '8px';
        }
        
        // Ensure video doesn't interfere with swiper touch events
        videoElement.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        }, { passive: true });
        
        videoElement.addEventListener('touchmove', (e) => {
            // Allow horizontal swipes to pass through to swiper
            const touch = e.touches[0];
            const startX = (videoElement as any)._startX || touch.clientX;
            const deltaX = Math.abs(touch.clientX - startX);
            const deltaY = Math.abs(touch.clientY - ((videoElement as any)._startY || touch.clientY));
            
            // If horizontal swipe is dominant, let swiper handle it
            if (deltaX > deltaY && deltaX > 20) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, { passive: false });
        
        videoElement.addEventListener('touchstart', (e) => {
            (videoElement as any)._startX = e.touches[0].clientX;
            (videoElement as any)._startY = e.touches[0].clientY;
        }, { passive: true });
    }

    private createYouTubeIframe(url: string): HTMLIFrameElement {
        const videoId = this.extractYouTubeId(url);
        const iframe = document.createElement('iframe');
        
        if (videoId) {
            iframe.src = `https://www.youtube.com/embed/${videoId}?controls=1`;
        }
        
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        
        return iframe;
    }

    private createVimeoIframe(url: string): HTMLIFrameElement {
        const videoId = this.extractVimeoId(url);
        const iframe = document.createElement('iframe');
        
        if (videoId) {
            iframe.src = `https://player.vimeo.com/video/${videoId}`;
        }
        
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        
        return iframe;
    }

    private createVideoElement(url: string): HTMLVideoElement {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.style.width = '100%';
        video.style.height = '100%';
        
        return video;
    }

    private handleSwiperSlideChange(newIndex: number) {
        this.currentIndex = newIndex;
        this.currentMedia = this.mediaItems[newIndex];
        
        // Dispatch event to sync with thumbnails
        this.dispatchEvent(new CustomEvent('viewer-slide-change', {
            detail: {
                index: newIndex,
                mediaItem: this.currentMedia
            },
            bubbles: true
        }));

        // Setup zoom for the new slide if it's an image
        if (this.currentMedia?.type === 'image') {
            setTimeout(() => {
                this.setupZoomForCurrentSlide();
            }, 100);
        }
    }

    private setupZoomForCurrentSlide() {
        if (!this.zoomManager || !this.swiperInstance) return;

        const activeSlide = this.swiperInstance.slides[this.currentIndex];
        if (activeSlide) {
            const img = safeQuerySelector<HTMLImageElement>(activeSlide, 'img');
            if (img) {
                this.zoomManager.setupZoomHandlers(img);
            }
        }
    }

    private checkModalMode() {
        // Check if parent lightbox is in modal mode
        const parentLightbox = this.closest('pxm-lightbox');
        const isModalMode = parentLightbox?.getAttribute('mode') === 'modal';
        
        if (isModalMode) {
            // In modal mode, disable zoom and add modal click handler
            this.zoomMode = 'none';
            this.setupModalClickHandler();
        }
    }

    private setupModalClickHandler() {
        const clickHandler = (event: Event) => {
            event.preventDefault();
            this.openModal();
        };
        
        this.addEventListener('click', clickHandler);
        (this as any)._modalClickHandler = clickHandler;
        
        // Add visual indicator that it's clickable
        this.style.cursor = 'pointer';
    }

    private openModal() {
        // Get current media info from parent inline component
        const parentInline = this.closest('pxm-lightbox-inline');
        if (parentInline && 'getCurrentMediaItem' in parentInline && 'getMediaItems' in parentInline && 'getCurrentIndex' in parentInline) {
            const mediaItems = (parentInline as any).getMediaItems();
            const currentIndex = this.hasViewerSwiper ? this.currentIndex : (parentInline as any).getCurrentIndex();
            const currentMediaItem = this.mediaItems[currentIndex] || (parentInline as any).getCurrentMediaItem();
            
            this.dispatchEvent(new CustomEvent('open-modal', {
                detail: {
                    index: currentIndex,
                    mediaItem: currentMediaItem,
                    mediaItems: mediaItems
                },
                bubbles: true
            }));
        }
    }

    private cleanup() {
        if (this.swiperInstance) {
            this.swiperInstance.destroy();
            this.swiperInstance = null;
        }
        
        if (this.zoomManager) {
            this.zoomManager.destroy();
            this.zoomManager = null;
        }
        
        // Remove modal click handler if exists
        const handler = (this as any)._modalClickHandler;
        if (handler) {
            this.removeEventListener('click', handler);
            delete (this as any)._modalClickHandler;
        }
        
        this.initialized = false;
    }

    private parseZoomMode() {
        // Get zoom mode from parent lightbox or attribute
        const parentLightbox = this.closest('pxm-lightbox');
        if (parentLightbox) {
            this.zoomMode = (parentLightbox.getAttribute('zoom-mode') as ZoomMode) || 'none';
        }
    }

    private findTargetElements() {
        // Only used when not in swiper mode
        if (!this.hasViewerSwiper) {
            this.targetImg = safeQuerySelector<HTMLImageElement>(this, 'img');
            this.targetVideo = safeQuerySelector<HTMLElement>(this, 'pxm-video, video');
        }
    }

    private initializeZoom() {
        if (this.zoomMode !== 'none') {
            // Create a basic config for zoom manager
            const config = {
                mode: 'viewer' as const,
                targetSelector: 'img',
                thumbnailSelector: 'pxm-lightbox-thumb',
                zoomSelector: '',
                modalSelector: '',
                zoomSize: 200,
                zoomLevel: 2,
                fadeAnimationDuration: 300
            };

            this.zoomManager = new ZoomManager(config, this.zoomMode);
        }
    }

    private setupEventListeners() {
        // Listen for media change events from parent (for non-swiper mode)
        if (!this.hasViewerSwiper) {
            this.addEventListener('media-changed', this.handleMediaChange.bind(this) as EventListener);
        }
        
        // Listen for attribute changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-current-media') {
                    this.updateFromAttribute();
                }
            });
        });
        
        observer.observe(this, { attributes: true });
    }

    private handleMediaChange(event: Event) {
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.mediaItem) {
            this.updateMedia(customEvent.detail.mediaItem);
        }
    }

    private updateFromAttribute() {
        const mediaData = this.getAttribute('data-current-media');
        if (mediaData) {
            try {
                const mediaItem: MediaItem = JSON.parse(mediaData);
                this.updateMedia(mediaItem);
            } catch (error) {
                console.error('Failed to parse media data:', error);
            }
        }
    }

    public updateMedia(mediaItem: MediaItem) {
        if (typeof window !== 'undefined' && (window as any).__debugLog) {
            (window as any).__debugLog('PxmLightboxViewer updateMedia', mediaItem);
        } else {
            console.log('PxmLightboxViewer updateMedia', mediaItem);
        }
        this.currentMedia = mediaItem;

        // In swiper mode, slide to the correct index
        if (this.hasViewerSwiper && this.swiperInstance) {
            const mediaIndex = this.mediaItems.findIndex(item => item.src === mediaItem.src);
            if (mediaIndex >= 0) {
                this.swiperInstance.slideTo(mediaIndex);
                return;
            }
        }

        // Non-swiper mode
        if (mediaItem.type === 'image') {
            this.showImage(mediaItem);
        } else if (mediaItem.type === 'video') {
            this.showVideo(mediaItem);
        }

        // Dispatch event for other components
        this.dispatchEvent(new CustomEvent('viewer-updated', {
            detail: { mediaItem },
            bubbles: true
        }));
    }

    private showImage(mediaItem: MediaItem) {
        if (typeof window !== 'undefined' && (window as any).__debugLog) {
            (window as any).__debugLog('PxmLightboxViewer showImage', mediaItem);
        } else {
            console.log('PxmLightboxViewer showImage', mediaItem);
        }
        // If targetImg does not exist, create and append it
        if (!this.targetImg) {
            this.targetImg = document.createElement('img');
            this.targetImg.style.width = '100%';
            this.targetImg.style.height = '100%';
            this.targetImg.style.objectFit = 'contain';
            this.appendChild(this.targetImg);
        }
        this.targetImg.src = mediaItem.src;
        this.targetImg.style.display = 'block';
        this.targetImg.alt = mediaItem.title || 'Lightbox image';
        this.targetImg.style.opacity = '0';
        this.targetImg.onload = async () => {
            // Animate fade-in using global config
            const { duration, easing } = getConfig().defaults;
            await animate(this.targetImg!, { opacity: 1 }, { duration, easing });
            this.targetImg!.style.opacity = '1'; // Ensure final state for tests
        };
        if (this.targetVideo) {
            this.targetVideo.style.display = 'none';
        }
        // Setup zoom for new image
        if (this.zoomManager && this.targetImg) {
            setTimeout(() => {
                this.zoomManager!.setupZoomHandlers(this.targetImg!);
            }, 100);
        }
    }

    private showVideo(mediaItem: MediaItem) {
        if (this.targetVideo) {
            // Handle different video types
            if (mediaItem.videoType === 'youtube') {
                this.setupYouTubeVideo(mediaItem);
            } else if (mediaItem.videoType === 'vimeo') {
                this.setupVimeoVideo(mediaItem);
            } else {
                this.setupDirectVideo(mediaItem);
            }

            this.targetVideo.style.display = 'block';
        }

        if (this.targetImg) {
            this.targetImg.style.display = 'none';
        }
    }

    private setupYouTubeVideo(mediaItem: MediaItem) {
        if (!this.targetVideo) return;

        const videoId = this.extractYouTubeId(mediaItem.src);
        if (videoId) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            
            this.targetVideo.innerHTML = '';
            this.targetVideo.appendChild(iframe);
        }
    }

    private setupVimeoVideo(mediaItem: MediaItem) {
        if (!this.targetVideo) return;

        const videoId = this.extractVimeoId(mediaItem.src);
        if (videoId) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            
            this.targetVideo.innerHTML = '';
            this.targetVideo.appendChild(iframe);
        }
    }

    private setupDirectVideo(mediaItem: MediaItem) {
        if (!this.targetVideo) return;

        if (this.targetVideo.tagName === 'VIDEO') {
            (this.targetVideo as HTMLVideoElement).src = mediaItem.src;
            (this.targetVideo as HTMLVideoElement).controls = true;
            (this.targetVideo as HTMLVideoElement).autoplay = true;
        } else {
            const video = document.createElement('video');
            video.src = mediaItem.src;
            video.controls = true;
            video.autoplay = true;
            video.style.width = '100%';
            video.style.height = '100%';
            
            this.targetVideo.innerHTML = '';
            this.targetVideo.appendChild(video);
        }
    }

    private extractYouTubeId(url: string): string | null {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    private extractVimeoId(url: string): string | null {
        const regex = /(?:vimeo\.com\/)([0-9]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    // Public API methods
    public getCurrentMedia(): MediaItem | null {
        return this.currentMedia;
    }

    public getZoomManager(): ZoomManager | null {
        return this.zoomManager;
    }

    public getSwiperInstance(): any {
        return this.swiperInstance;
    }

    public slideTo(index: number) {
        if (this.swiperInstance) {
            this.swiperInstance.slideTo(index);
        }
    }

    public enableZoom() {
        if (this.zoomManager) {
            if (this.hasViewerSwiper) {
                this.setupZoomForCurrentSlide();
            } else if (this.targetImg) {
                this.zoomManager.setupZoomHandlers(this.targetImg);
            }
        }
    }

    public disableZoom() {
        if (this.zoomManager) {
            if (this.hasViewerSwiper) {
                // Remove zoom from all slides
                this.swiperInstance?.slides.forEach((slide: any) => {
                    const img = safeQuerySelector<HTMLImageElement>(slide, 'img');
                    if (img) {
                        this.zoomManager!.removeZoomHandlers(img);
                    }
                });
            } else if (this.targetImg) {
                this.zoomManager.removeZoomHandlers(this.targetImg);
            }
        }
    }
} 