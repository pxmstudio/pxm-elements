/**
 * PXM Lightbox Thumbnails Component
 * 
 * Handles the thumbnail container with optional Swiper integration
 */

import { safeQuerySelector } from '../dom-utils';

export class PxmLightboxThumbs extends HTMLElement {
    private swiperInstance: any = null;
    private navButtons: { prev: Element | null; next: Element | null } = { prev: null, next: null };
    private SwiperClass: any = null;

    constructor() {
        super();
    }

    connectedCallback() {
        setTimeout(() => {
            this.initialize();
        }, 100);
    }

    disconnectedCallback() {
        this.cleanup();
    }

    private async initialize() {
        this.setupNavigation();
        await this.initializeSwiper();
    }

    private cleanup() {
        if (this.swiperInstance) {
            this.swiperInstance.destroy(true, true);
            this.swiperInstance = null;
        }
        this.removeNavigationEvents();
    }

    private setupNavigation() {
        this.navButtons.prev = safeQuerySelector(this, '[data-swiper-prev]');
        this.navButtons.next = safeQuerySelector(this, '[data-swiper-next]');

        if (this.navButtons.prev) {
            const prevHandler = (event: Event) => {
                event.preventDefault();
                this.navigatePrev();
            };
            this.navButtons.prev.addEventListener('click', prevHandler);
            (this.navButtons.prev as any)._clickHandler = prevHandler;
        }

        if (this.navButtons.next) {
            const nextHandler = (event: Event) => {
                event.preventDefault();
                this.navigateNext();
            };
            this.navButtons.next.addEventListener('click', nextHandler);
            (this.navButtons.next as any)._clickHandler = nextHandler;
        }
    }

    private removeNavigationEvents() {
        [this.navButtons.prev, this.navButtons.next].forEach(button => {
            if (button) {
                const handler = (button as any)._clickHandler;
                if (handler) {
                    button.removeEventListener('click', handler);
                    delete (button as any)._clickHandler;
                }
            }
        });
    }

    private async initializeSwiper() {
        // Check if parent has thumbs-swiper enabled
        const parentInline = this.closest('pxm-lightbox-inline');
        const swiperEnabled = parentInline?.getAttribute('thumbs-swiper') === 'true';
        
        if (!swiperEnabled) {
            return;
        }

        const swiperElement = safeQuerySelector(this, '[data-swiper]');

        if (!swiperElement) {
            return;
        }

        // Try to get Swiper from window first, then import if needed
        if (window.Swiper) {
            this.SwiperClass = window.Swiper;
        } else {
            try {
                // Dynamic import of Swiper
                const swiperModule = await import('swiper');
                this.SwiperClass = swiperModule.Swiper || swiperModule.default;
            } catch (error) {
                console.error('Failed to import Swiper:', error);
                console.warn('Swiper.js not found. Please ensure Swiper is installed: npm install swiper');
                return;
            }
        }

        const swiperMode = swiperElement.getAttribute('data-swiper-direction') || 'horizontal';
        const isVertical = swiperMode === 'vertical';
        
        // Get slides per view from data attribute or default to 'auto'
        const slidesPerViewAttr = swiperElement.getAttribute('data-slides-per-view');
        const slidesPerView = slidesPerViewAttr ? (isNaN(Number(slidesPerViewAttr)) ? slidesPerViewAttr : Number(slidesPerViewAttr)) : 'auto';

        const config = {
            direction: isVertical ? 'vertical' : 'horizontal',
            slidesPerView: slidesPerView,
            spaceBetween: 10,
            freeMode: true,
            watchSlidesProgress: true,
            navigation: {
                nextEl: this.navButtons.next,
                prevEl: this.navButtons.prev,
            },
        };

        try {
            this.swiperInstance = new this.SwiperClass(swiperElement, config);
        } catch (error) {
            console.error('Error initializing Swiper:', error);
        }
    }

    private navigatePrev() {
        if (this.swiperInstance) {
            this.swiperInstance.slidePrev();
        } else {
            this.dispatchEvent(new CustomEvent('navigate-prev', { bubbles: true }));
        }
    }

    private navigateNext() {
        if (this.swiperInstance) {
            this.swiperInstance.slideNext();
        } else {
            this.dispatchEvent(new CustomEvent('navigate-next', { bubbles: true }));
        }
    }

    public slideTo(index: number, speed: number = 300) {
        if (this.swiperInstance) {
            this.swiperInstance.slideTo(index, speed);
        }
    }

    public updateSwiper() {
        if (this.swiperInstance) {
            this.swiperInstance.update();
        }
    }
} 