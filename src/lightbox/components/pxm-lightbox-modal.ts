/**
 * PXM Lightbox Modal Component
 * 
 * Handles the modal overlay functionality with viewer and thumbnail swipers
 */

import type { MediaItem } from '../types';
import { safeQuerySelector } from '../dom-utils';

export class PxmLightboxModal extends HTMLElement {
    private isOpen: boolean = false;
    private currentIndex: number = 0;
    private mediaItems: MediaItem[] = [];
    private closeButton: Element | null = null;
    private modalOverlay: Element | null = null;
    private navigationButtons: { prev: Element | null; next: Element | null } = { prev: null, next: null };

    static get observedAttributes() {
        return ['thumbs-swiper', 'viewer-swiper'];
    }

    constructor() {
        super();
        this.parseAttributes();
    }

    connectedCallback() {
        this.initialize();
    }

    disconnectedCallback() {
        this.cleanup();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue && PxmLightboxModal.observedAttributes.includes(name)) {
            this.parseAttributes();
            if (this.isConnected) {
                this.initialize();
            }
        }
    }

    private parseAttributes() {
        // These attributes are used by child components
        const thumbsSwiper = this.getAttribute('thumbs-swiper') === 'true';
        const viewerSwiper = this.getAttribute('viewer-swiper') === 'true';
        
        // Update child components if needed
        const thumbsComponent = safeQuerySelector(this, 'pxm-lightbox-modal-thumbs');
        const viewerComponent = safeQuerySelector(this, 'pxm-lightbox-modal-viewer');
        
        if (thumbsComponent) {
            thumbsComponent.setAttribute('data-swiper', thumbsSwiper.toString());
        }
        if (viewerComponent) {
            viewerComponent.setAttribute('data-swiper', viewerSwiper.toString());
        }
    }

    private initialize() {
        this.findControlElements();
        this.setupEventListeners();
        this.setupModalStructure();
        this.hide(); // Start hidden
    }

    private cleanup() {
        this.removeEventListeners();
        if (this.isOpen) {
            this.close();
        }
    }

    private findControlElements() {
        this.closeButton = safeQuerySelector(this, '[data-close]');
        this.modalOverlay = safeQuerySelector(this, '[data-modal-overlay]');
        this.navigationButtons.prev = safeQuerySelector(this, '[data-swiper-prev]');
        this.navigationButtons.next = safeQuerySelector(this, '[data-swiper-next]');
    }

    private setupEventListeners() {
        // Close button
        if (this.closeButton) {
            const closeHandler = (event: Event) => {
                event.preventDefault();
                this.close();
            };
            this.closeButton.addEventListener('click', closeHandler);
            (this.closeButton as any)._clickHandler = closeHandler;
        }

        // Modal overlay (click to close)
        if (this.modalOverlay) {
            const overlayHandler = (event: Event) => {
                event.preventDefault();
                this.close();
            };
            this.modalOverlay.addEventListener('click', overlayHandler);
            (this.modalOverlay as any)._clickHandler = overlayHandler;
        }

        // Navigation buttons are handled by ModalManager/Swiper
        // We only listen for the slide change events to update our state

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown.bind(this));

        // Listen for media changes from parent
        this.addEventListener('modal-media-changed', this.handleMediaChange.bind(this) as EventListener);

        // Listen for modal thumbnail click events
        this.addEventListener('modal-thumbnail-click', this.handleModalThumbnailClick.bind(this) as EventListener);

        // Listen for modal viewer slide changes
        this.addEventListener('modal-viewer-slide-change', this.handleModalViewerSlideChange.bind(this) as EventListener);
    }

    private removeEventListeners() {
        [this.closeButton, this.modalOverlay]
            .forEach(element => {
                if (element) {
                    const handler = (element as any)._clickHandler;
                    if (handler) {
                        element.removeEventListener('click', handler);
                        delete (element as any)._clickHandler;
                    }
                }
            });

        document.removeEventListener('keydown', this.handleKeydown);
    }

    private setupModalStructure() {
        // Set role and aria attributes for accessibility
        this.setAttribute('role', 'dialog');
        this.setAttribute('aria-modal', 'true');
        this.setAttribute('aria-labelledby', 'modal-title');
        
        // Initially hidden
        this.style.display = 'none';
    }

    private handleKeydown(event: KeyboardEvent) {
        if (!this.isOpen) return;

        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                this.close();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                // Trigger prev button click to use Swiper navigation
                if (this.navigationButtons.prev) {
                    (this.navigationButtons.prev as HTMLElement).click();
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                // Trigger next button click to use Swiper navigation
                if (this.navigationButtons.next) {
                    (this.navigationButtons.next as HTMLElement).click();
                }
                break;
        }
    }

    private handleMediaChange(event: Event) {
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.mediaItems) {
            this.mediaItems = customEvent.detail.mediaItems;
            this.currentIndex = customEvent.detail.currentIndex || 0;
            this.updateModalContent();
        }
    }

    private handleModalThumbnailClick(event: Event) {
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.index !== undefined) {
            this.currentIndex = customEvent.detail.index;
            this.updateModalContent();
            this.dispatchNavigation();
        }
    }

    private handleModalViewerSlideChange(event: Event) {
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.activeIndex !== undefined) {
            this.currentIndex = customEvent.detail.activeIndex;
            
            // Update modal thumbnails to show correct active state
            const modalThumbs = safeQuerySelector(this, 'pxm-lightbox-modal-thumbs');
            if (modalThumbs && 'setActiveIndex' in modalThumbs) {
                (modalThumbs as any).setActiveIndex(this.currentIndex);
            }
            
            this.dispatchNavigation();
        }
    }

    private updateModalContent() {
        if (this.mediaItems[this.currentIndex]) {
            const mediaItem = this.mediaItems[this.currentIndex];
            
            // Update modal viewer
            const modalViewer = safeQuerySelector(this, 'pxm-lightbox-modal-viewer');
            if (modalViewer && 'updateMedia' in modalViewer) {
                (modalViewer as any).updateMedia(mediaItem);
            }

            // Update modal thumbnails - but avoid infinite loops
            const modalThumbs = safeQuerySelector(this, 'pxm-lightbox-modal-thumbs');
            if (modalThumbs && 'setActiveIndex' in modalThumbs) {
                (modalThumbs as any).setActiveIndex(this.currentIndex);
            }
            
            // Do NOT refresh from inline during normal operation to prevent loops
        }
    }

    private dispatchNavigation() {
        this.dispatchEvent(new CustomEvent('modal-navigation', {
            detail: {
                currentIndex: this.currentIndex,
                mediaItem: this.mediaItems[this.currentIndex]
            },
            bubbles: true
        }));
    }

    private show() {
        this.style.display = 'block';
        this.isOpen = true;
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        
        // Focus management for accessibility
        this.focus();
        
        // Dispatch open event
        this.dispatchEvent(new CustomEvent('modal-opened', {
            detail: { currentIndex: this.currentIndex },
            bubbles: true
        }));
    }

    private hide() {
        this.style.display = 'none';
        this.isOpen = false;
        document.body.style.overflow = ''; // Restore background scroll
        
        // Dispatch close event
        this.dispatchEvent(new CustomEvent('modal-closed', {
            bubbles: true
        }));
    }

    // Public API methods
    public open(mediaItems?: MediaItem[], startIndex: number = 0) {
        
        if (mediaItems) {
            this.mediaItems = mediaItems;
            this.currentIndex = Math.max(0, Math.min(startIndex, mediaItems.length - 1));
        } else {
            // If no media items provided, get them from inline component
            const parentLightbox = this.closest('pxm-lightbox');
            const inlineComponent = parentLightbox?.querySelector('pxm-lightbox-inline');
            if (inlineComponent && 'getMediaItems' in inlineComponent && 'getCurrentIndex' in inlineComponent) {
                this.mediaItems = (inlineComponent as any).getMediaItems();
                this.currentIndex = (inlineComponent as any).getCurrentIndex();
            }
        }
        
        // Ensure modal thumbs are populated from template ONLY when opening
        const modalThumbs = safeQuerySelector(this, 'pxm-lightbox-modal-thumbs');
        if (modalThumbs && 'refreshFromInline' in modalThumbs) {
            (modalThumbs as any).refreshFromInline();
        }
        
        // Small delay to ensure population is complete before updating content
        setTimeout(() => {
            this.updateModalContent();
            this.show();
        }, 150);
    }

    public close() {
        this.hide();
    }

    public isModalOpen(): boolean {
        return this.isOpen;
    }

    public getCurrentIndex(): number {
        return this.currentIndex;
    }

    public getCurrentMediaItem(): MediaItem | null {
        return this.mediaItems[this.currentIndex] || null;
    }

    public setMediaItems(mediaItems: MediaItem[], currentIndex: number = 0) {
        this.mediaItems = mediaItems;
        this.currentIndex = Math.max(0, Math.min(currentIndex, mediaItems.length - 1));
        if (this.isOpen) {
            this.updateModalContent();
        }
    }
} 