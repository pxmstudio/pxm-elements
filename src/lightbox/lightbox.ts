/**
 * Main PXM Lightbox component class
 * 
 * This class orchestrates all the lightbox functionality by coordinating
 * with the modular child components.
 */

import type { LightboxMode, ZoomMode, MediaType, MediaItem } from './types';
import { safeQuerySelector } from './dom-utils';

/**
 * Main lightbox component that coordinates between inline and modal views
 */
export class PxmLightbox extends HTMLElement {
    // Component state
    private readonly mode: LightboxMode;
    private readonly zoomMode: ZoomMode;
    private currentMediaType: MediaType = 'image';
    private inlineComponent: any = null;
    private modalComponent: any = null;
    private initialized: boolean = false;

    constructor() {
        super();

        try {
            // Parse configuration from attributes
            this.mode = (this.getAttribute('mode') as LightboxMode) || 'viewer';
            this.zoomMode = (this.getAttribute('zoom-mode') as ZoomMode) || 'none';

        } catch (error) {
            console.error('Failed to initialize PxmLightbox:', error);
            throw error;
        }
    }

    connectedCallback() {
        // Use a longer delay to ensure all child components are fully ready
        setTimeout(() => {
            this.initialize();
        }, 100);
    }

    /**
     * Called when element is removed from DOM
     */
    disconnectedCallback(): void {
        this.cleanup();
    }

    private async initialize() {
        if (this.initialized) return;

        // Wait for child components to be available
        await this.waitForChildComponents();
        
        this.findChildComponents();
        this.setupComponentCommunication();
        this.initializeStyles();
        
        this.initialized = true;
    }

    private async waitForChildComponents(): Promise<void> {
        const maxAttempts = 200; // 10 seconds
        let attempts = 0;

        while (attempts < maxAttempts) {
            const inline = safeQuerySelector(this, 'pxm-lightbox-inline');
            const modal = safeQuerySelector(this, 'pxm-lightbox-modal');
            
            if (inline && (this.mode !== 'modal' || modal)) {
                // Check if components are custom elements (not just HTMLElement)
                const inlineReady = inline.constructor !== HTMLElement;
                const modalReady = this.mode !== 'modal' || (modal && modal.constructor !== HTMLElement);
                
                if (inlineReady && modalReady) {
                    return;
                }
            }

            await new Promise(resolve => setTimeout(resolve, 50));
            attempts++;
        }

        console.warn('Timeout waiting for child components to initialize');
    }

    private cleanup() {
        // Child components will handle their own cleanup
        this.removeComponentEventListeners();
        this.initialized = false;
    }

    private findChildComponents() {
        this.inlineComponent = safeQuerySelector(this, 'pxm-lightbox-inline');
        this.modalComponent = safeQuerySelector(this, 'pxm-lightbox-modal');
    }

    private setupComponentCommunication() {
        // Listen for media changes from inline component
        if (this.inlineComponent) {
            this.inlineComponent.addEventListener('media-changed', this.handleInlineMediaChange.bind(this));
            this.inlineComponent.addEventListener('open-modal', this.handleOpenModalRequest.bind(this));
        }

        // Listen for modal events
        if (this.modalComponent) {
            this.modalComponent.addEventListener('modal-opened', this.handleModalOpened.bind(this));
            this.modalComponent.addEventListener('modal-closed', this.handleModalClosed.bind(this));
            this.modalComponent.addEventListener('modal-navigation', this.handleModalNavigation.bind(this));
        }
    }

    private removeComponentEventListeners() {
        if (this.inlineComponent) {
            this.inlineComponent.removeEventListener('media-changed', this.handleInlineMediaChange);
            this.inlineComponent.removeEventListener('open-modal', this.handleOpenModalRequest);
        }

        if (this.modalComponent) {
            this.modalComponent.removeEventListener('modal-opened', this.handleModalOpened);
            this.modalComponent.removeEventListener('modal-closed', this.handleModalClosed);
            this.modalComponent.removeEventListener('modal-navigation', this.handleModalNavigation);
        }
    }

    private handleInlineMediaChange(event: CustomEvent) {
        this.currentMediaType = event.detail?.mediaItem?.type || 'image';
        
        // Sync with modal if needed
        if (this.modalComponent && 'setMediaItems' in this.modalComponent && 'getMediaItems' in this.inlineComponent) {
            const mediaItems = this.inlineComponent.getMediaItems?.() || [];
            const currentIndex = this.inlineComponent.getCurrentIndex?.() || 0;
            this.modalComponent.setMediaItems(mediaItems, currentIndex);
        }

        // Dispatch event for external listeners
        this.dispatchEvent(new CustomEvent('lightbox-media-changed', {
            detail: event.detail,
            bubbles: true
        }));
    }

    private handleModalOpened(event: CustomEvent) {
        this.dispatchEvent(new CustomEvent('lightbox-modal-opened', {
            detail: event.detail,
            bubbles: true
        }));
    }

    private handleModalClosed(event: CustomEvent) {
        this.dispatchEvent(new CustomEvent('lightbox-modal-closed', {
            detail: event.detail,
            bubbles: true
        }));
    }

    private handleModalNavigation(event: CustomEvent) {
        // In modal mode, modal navigation should NOT sync back to inline
        // This prevents infinite loops and unwanted inline updates
        
        // Only dispatch external event for listeners outside the lightbox
        this.dispatchEvent(new CustomEvent('lightbox-modal-navigation', {
            detail: event.detail,
            bubbles: true
        }));
        
        // DO NOT sync to inline component to prevent infinite loops
    }

    private handleOpenModalRequest(event: CustomEvent) {
        if (this.mode === "modal" && this.modalComponent && 'open' in this.modalComponent) {
            const { mediaItems, index } = event.detail;
            this.modalComponent.open(mediaItems, index);
        }
    }

    /**
     * Initialize CSS custom properties for styling
     */
    private initializeStyles(): void {
        // Set CSS variables for potential customization
        this.style.setProperty('--pxm-lightbox-zoom-size', '200px');
        this.style.setProperty('--pxm-lightbox-zoom-border', '2px solid #333');
        this.style.setProperty('--pxm-lightbox-zoom-background', 'white');
        this.style.setProperty('--pxm-lightbox-zoom-shadow', '0 0 10px rgba(0,0,0,0.3)');
        this.style.setProperty('--pxm-lightbox-zoom-z-index', '999999');
        this.style.setProperty('--pxm-lightbox-zoom-border-radius', '0');
    }

    // Public API methods
    /**
     * Get the current lightbox mode
     */
    public getMode(): LightboxMode {
        return this.mode;
    }

    /**
     * Get the current zoom mode
     */
    public getZoomMode(): ZoomMode {
        return this.zoomMode;
    }

    /**
     * Get the current media type
     */
    public getCurrentMediaType(): MediaType {
        return this.currentMediaType;
    }

    /**
     * Get current media item from inline component
     */
    public getCurrentMediaItem(): MediaItem | null {
        if (this.inlineComponent && 'getCurrentMediaItem' in this.inlineComponent) {
            return this.inlineComponent.getCurrentMediaItem();
        }
        return null;
    }

    /**
     * Get all media items from inline component
     */
    public getMediaItems(): MediaItem[] {
        if (this.inlineComponent && 'getMediaItems' in this.inlineComponent) {
            return this.inlineComponent.getMediaItems();
        }
        return [];
    }

    /**
     * Open modal programmatically (if modal mode is enabled)
     */
    public async openModal(): Promise<void> {
        if (this.mode === "modal" && this.modalComponent && 'open' in this.modalComponent) {
            const mediaItems = this.getMediaItems();
            const currentIndex = this.inlineComponent?.getCurrentIndex?.() || 0;
            this.modalComponent.open(mediaItems, currentIndex);
        }
    }

    /**
     * Close modal programmatically
     */
    public closeModal(): void {
        if (this.modalComponent && 'close' in this.modalComponent) {
            this.modalComponent.close();
        }
    }

    /**
     * Update target media source programmatically
     */
    public updateTargetMedia(mediaItem: MediaItem): void {
        if (this.inlineComponent) {
            const viewer = safeQuerySelector(this.inlineComponent, 'pxm-lightbox-viewer');
            if (viewer && 'updateMedia' in viewer) {
                (viewer as any).updateMedia(mediaItem);
            }
        }
    }

    /**
     * Set current media index
     */
    public setCurrentIndex(index: number): void {
        if (this.inlineComponent && 'setCurrentIndex' in this.inlineComponent) {
            this.inlineComponent.setCurrentIndex(index);
        }
    }

    /**
     * Get current media index
     */
    public getCurrentIndex(): number {
        if (this.inlineComponent && 'getCurrentIndex' in this.inlineComponent) {
            return this.inlineComponent.getCurrentIndex();
        }
        return 0;
    }
} 