/**
 * Main PXM Lightbox component class
 *
 * This class orchestrates all the lightbox functionality by coordinating
 * with the modular child components.
 */
import type { LightboxMode, ZoomMode, MediaType, MediaItem } from './types';
/**
 * Main lightbox component that coordinates between inline and modal views
 */
export declare class PxmLightbox extends HTMLElement {
    private readonly mode;
    private readonly zoomMode;
    private currentMediaType;
    private inlineComponent;
    private modalComponent;
    private initialized;
    constructor();
    connectedCallback(): void;
    /**
     * Called when element is removed from DOM
     */
    disconnectedCallback(): void;
    private initialize;
    private waitForChildComponents;
    private cleanup;
    private findChildComponents;
    private setupComponentCommunication;
    private removeComponentEventListeners;
    private handleInlineMediaChange;
    private handleModalOpened;
    private handleModalClosed;
    private handleModalNavigation;
    private handleOpenModalRequest;
    /**
     * Initialize CSS custom properties for styling
     */
    private initializeStyles;
    /**
     * Get the current lightbox mode
     */
    getMode(): LightboxMode;
    /**
     * Get the current zoom mode
     */
    getZoomMode(): ZoomMode;
    /**
     * Get the current media type
     */
    getCurrentMediaType(): MediaType;
    /**
     * Get current media item from inline component
     */
    getCurrentMediaItem(): MediaItem | null;
    /**
     * Get all media items from inline component
     */
    getMediaItems(): MediaItem[];
    /**
     * Open modal programmatically (if modal mode is enabled)
     */
    openModal(): Promise<void>;
    /**
     * Close modal programmatically
     */
    closeModal(): void;
    /**
     * Update target media source programmatically
     */
    updateTargetMedia(mediaItem: MediaItem): void;
    /**
     * Set current media index
     */
    setCurrentIndex(index: number): void;
    /**
     * Get current media index
     */
    getCurrentIndex(): number;
}
