/**
 * PXM Lightbox Thumbnails Component
 *
 * Handles the thumbnail container with optional Swiper integration
 */
export declare class PxmLightboxThumbs extends HTMLElement {
    private swiperInstance;
    private navButtons;
    private SwiperClass;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private initialize;
    private cleanup;
    private setupNavigation;
    private removeNavigationEvents;
    private initializeSwiper;
    private navigatePrev;
    private navigateNext;
    slideTo(index: number, speed?: number): void;
    updateSwiper(): void;
}
