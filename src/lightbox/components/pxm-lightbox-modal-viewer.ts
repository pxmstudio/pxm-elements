/**
 * PXM Lightbox Modal Viewer Component
 * 
 * Handles displaying media content in the modal with Swiper integration and zoom functionality
 */

import type { MediaItem, ZoomMode } from '../types';
import { ZoomManager } from '../zoom-manager';
import { safeQuerySelector } from '../dom-utils';

export class PxmLightboxModalViewer extends HTMLElement {
    private currentMedia: MediaItem | null = null;
    private swiperInstance: any = null;
    private zoomManager: ZoomManager | null = null;
    private zoomMode: ZoomMode = 'none';
    private initialized: boolean = false;

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

    private initialize() {
        if (this.initialized) return;
        
        this.parseZoomMode();
        this.initializeZoom();
        this.initializeSwiper();
        
        this.initialized = true;
    }

    private parseZoomMode() {
        // Get zoom mode from parent lightbox
        const parentLightbox = this.closest('pxm-lightbox');
        if (parentLightbox) {
            this.zoomMode = (parentLightbox.getAttribute('zoom-mode') as ZoomMode) || 'none';
        }
    }

    private initializeZoom() {
        if (this.zoomMode !== 'none') {
            // Create a basic config for zoom manager
            const config = {
                mode: 'modal' as const,
                targetSelector: 'img',
                thumbnailSelector: 'pxm-lightbox-modal-thumb',
                zoomSelector: '',
                modalSelector: '',
                zoomSize: 200,
                zoomLevel: 2,
                fadeAnimationDuration: 300
            };

            this.zoomManager = new ZoomManager(config, this.zoomMode);
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
        
        this.initialized = false;
    }

    private async initializeSwiper() {
        // Check if parent modal has viewer-swiper enabled
        const parentModal = this.closest('pxm-lightbox-modal');
        const hasSwiperEnabled = parentModal?.getAttribute('viewer-swiper') === 'true';
        
        if (!hasSwiperEnabled) {
            return;
        }

        // Ensure Swiper is available
        await this.ensureSwiperAvailable();

        const swiperElement = safeQuerySelector(this, '[data-swiper]');
        if (!swiperElement || !window.Swiper) {
            return;
        }

        const config = {
            direction: 'horizontal',
            slidesPerView: 1,
            spaceBetween: 0,
            centeredSlides: true,
            allowTouchMove: true,
            simulateTouch: true,
            threshold: 10,
            keyboard: {
                enabled: true,
            },
            navigation: {
                nextEl: '.modal [data-swiper-next]',
                prevEl: '.modal [data-swiper-prev]',
            },
            on: {
                slideChange: () => {
                    const activeIndex = this.swiperInstance?.activeIndex || 0;
                    
                    // Dispatch slide change event for modal thumbnail sync
                    this.dispatchEvent(new CustomEvent('modal-viewer-slide-change', {
                        detail: { 
                            activeIndex,
                            instance: this.swiperInstance 
                        },
                        bubbles: true
                    }));

                    // Setup zoom for the new slide if it's an image
                    setTimeout(() => {
                        this.setupZoomForCurrentSlide(activeIndex);
                    }, 100);
                }
            }
        };

        try {
            this.swiperInstance = new window.Swiper(swiperElement, config);
        } catch (error) {
            console.error('Failed to initialize modal viewer Swiper:', error);
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
            console.error('Failed to import Swiper for modal viewer:', error);
        }
    }

    public updateMedia(mediaItem: MediaItem) {
        this.currentMedia = mediaItem;
        
        // If in swiper mode, slide to the correct media item
        if (this.swiperInstance) {
            // Find the index of this media item
            const parentLightbox = this.closest('pxm-lightbox');
            const inlineComponent = parentLightbox?.querySelector('pxm-lightbox-inline');
            
            if (inlineComponent && 'getMediaItems' in inlineComponent) {
                const allMediaItems = (inlineComponent as any).getMediaItems();
                const mediaIndex = allMediaItems.findIndex((item: MediaItem) => item.src === mediaItem.src);
                
                if (mediaIndex >= 0) {
                    // Ensure we have all slides populated
                    this.populateViewerSlides(allMediaItems);
                    
                    // Slide to the correct index
                    this.swiperInstance.slideTo(mediaIndex);
                    return;
                }
            }
        }
        
        // Fallback for single slide mode
        const slide = safeQuerySelector(this, '[data-swiper-slide]');
        if (!slide) {
            console.warn('No swiper slide found in modal viewer');
            return;
        }

        if (mediaItem.type === 'image') {
            this.showImage(mediaItem, slide);
        } else if (mediaItem.type === 'video') {
            this.showVideo(mediaItem, slide);
        }

        // Update Swiper if needed
        if (this.swiperInstance) {
            this.swiperInstance.update();
        }
    }

    private populateViewerSlides(mediaItems: MediaItem[]) {
        const swiperWrapper = safeQuerySelector(this, '[data-swiper-wrapper]');
        if (!swiperWrapper) {
            console.warn('No swiper wrapper found in modal viewer');
            return;
        }

        // Clear existing slides
        swiperWrapper.innerHTML = '';
        
        // Create slides for each media item
        mediaItems.forEach((mediaItem, index) => {
            const slide = document.createElement('div');
            slide.setAttribute('data-swiper-slide', '');
            slide.className = 'swiper-slide slide-custom-class';
            
            if (mediaItem.type === 'image') {
                this.showImage(mediaItem, slide);
            } else if (mediaItem.type === 'video') {
                this.showVideo(mediaItem, slide);
            }
            
            swiperWrapper.appendChild(slide);
        });

        // Update swiper
        if (this.swiperInstance) {
            this.swiperInstance.update();
        }
    }

    private showImage(mediaItem: MediaItem, slide: Element) {
        slide.innerHTML = '';
        
        const img = document.createElement('img');
        img.src = mediaItem.src;
        img.alt = mediaItem.title || 'Modal image';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        
        // Add loading state
        img.style.opacity = '0';
        img.onload = () => {
            img.style.opacity = '1';
            
            // Setup zoom for the new image if zoom is enabled
            if (this.zoomManager && this.zoomMode !== 'none') {
                // Small delay to ensure image is fully loaded and rendered
                setTimeout(() => {
                    this.zoomManager!.setupZoomHandlers(img);
                }, 150);
            }
        };
        
        slide.appendChild(img);
    }

    private showVideo(mediaItem: MediaItem, slide: Element) {
        slide.innerHTML = '';
        
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
        
        // Remove any zoom handlers for videos
        if (this.zoomManager) {
            const currentImg = safeQuerySelector<HTMLImageElement>(this, 'img');
            if (currentImg) {
                this.zoomManager.removeZoomHandlers(currentImg);
            }
        }
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
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;
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
            iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
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
        video.autoplay = true;
        video.style.width = '100%';
        video.style.height = '100%';
        
        return video;
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

    public getSwiperInstance(): any {
        return this.swiperInstance;
    }

    public getZoomManager(): ZoomManager | null {
        return this.zoomManager;
    }

    public slideTo(index: number, speed: number = 300) {
        if (this.swiperInstance) {
            this.swiperInstance.slideTo(index, speed);
        }
    }

    public enableZoom() {
        if (this.zoomManager) {
            const img = safeQuerySelector<HTMLImageElement>(this, 'img');
            if (img) {
                this.zoomManager.setupZoomHandlers(img);
            }
        }
    }

    public disableZoom() {
        if (this.zoomManager) {
            const currentImg = safeQuerySelector<HTMLImageElement>(this, 'img');
            if (currentImg) {
                this.zoomManager.removeZoomHandlers(currentImg);
            }
        }
    }

    private setupZoomForCurrentSlide(slideIndex: number) {
        if (!this.zoomManager || !this.swiperInstance) return;

        const activeSlide = this.swiperInstance.slides[slideIndex];
        if (activeSlide) {
            const img = safeQuerySelector<HTMLImageElement>(activeSlide, 'img');
            if (img && this.zoomMode !== 'none') {
                this.zoomManager.setupZoomHandlers(img);
            }
        }
    }
} 