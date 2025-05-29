/**
 * Main PXM Lightbox component class
 * 
 * This class orchestrates all the lightbox functionality by delegating
 * specific responsibilities to specialized manager classes.
 */

import type { LightboxMode, ZoomMode } from './types';
import { ConfigManager } from './config';
import { ZoomManager } from './zoom-manager';
import { ModalManager } from './modal-manager';
import { EventManager } from './event-manager';
import { safeQuerySelector, safeQuerySelectorAll } from './dom-utils';

/**
 * Main lightbox component that provides image gallery functionality
 * with optional modal view and zoom capabilities
 */
export class PxmLightbox extends HTMLElement {
    // Core managers
    private readonly configManager: ConfigManager;
    private readonly zoomManager: ZoomManager;
    private readonly modalManager: ModalManager;
    private readonly eventManager: EventManager;

    // DOM elements
    private readonly thumbnails: NodeListOf<Element>;
    private readonly targetImage: HTMLImageElement | null;

    // Component state
    private readonly mode: LightboxMode;
    private readonly zoomMode: ZoomMode;

    constructor() {
        super();

        try {
            // Initialize configuration
            this.configManager = new ConfigManager(this);
            this.mode = this.configManager.get('mode');
            this.zoomMode = this.configManager.parseZoomMode(
                this.getAttribute("data-zoom-mode")
            );

            // Initialize DOM elements
            this.thumbnails = this.initializeThumbnails();
            this.targetImage = this.initializeTargetImage();

            // Initialize component managers
            this.zoomManager = new ZoomManager(
                this.configManager.getConfig(),
                this.zoomMode
            );

            this.modalManager = new ModalManager(
                this,
                this.configManager.getConfig(),
                this.thumbnails
            );

            this.eventManager = new EventManager(
                this.configManager.getConfig(),
                this.thumbnails,
                this.targetImage,
                this.zoomManager,
                this.modalManager
            );

            // Setup CSS variables for styling
            this.initializeStyles();

        } catch (error) {
            console.error('Failed to initialize PxmLightbox:', error);
            throw error;
        }
    }

    /**
     * Called when element is removed from DOM
     * Performs cleanup of all managers and event listeners
     */
    disconnectedCallback(): void {
        try {
            this.eventManager?.destroy();
            this.modalManager?.destroy();
            this.zoomManager?.destroy();
        } catch (error) {
            console.error('Error during PxmLightbox cleanup:', error);
        }
    }

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
     * Get the target image element
     */
    public getTargetImage(): HTMLImageElement | null {
        return this.targetImage;
    }

    /**
     * Get all thumbnail elements
     */
    public getThumbnails(): NodeListOf<Element> {
        return this.thumbnails;
    }

    /**
     * Update target image source programmatically
     */
    public updateTargetImage(imageSrc: string): void {
        if (this.targetImage) {
            this.targetImage.src = imageSrc;
            this.eventManager.setupImageZoomHandlers(this.targetImage);
        }
    }

    /**
     * Open modal programmatically (if modal mode is enabled)
     */
    public async openModal(): Promise<void> {
        if (this.mode === "modal" && this.modalManager.isModalAvailable()) {
            await this.modalManager.openModal();
        }
    }

    /**
     * Close modal programmatically
     */
    public closeModal(): void {
        this.modalManager.closeModal();
    }

    /**
     * Refresh thumbnail event listeners (useful for dynamic content)
     */
    public refreshThumbnails(): void {
        const newThumbnails = safeQuerySelectorAll(
            this,
            this.configManager.get('thumbnailSelector')
        );
        this.eventManager.addThumbnailEvents(newThumbnails);
    }

    /**
     * Initialize thumbnail elements
     */
    private initializeThumbnails(): NodeListOf<Element> {
        const thumbnails = safeQuerySelectorAll(
            this,
            this.configManager.get('thumbnailSelector')
        );

        if (thumbnails.length === 0) {
            console.warn('No thumbnails found with selector:',
                this.configManager.get('thumbnailSelector'));
        }

        return thumbnails;
    }

    /**
     * Initialize target image element
     */
    private initializeTargetImage(): HTMLImageElement | null {
        const targetImage = safeQuerySelector<HTMLImageElement>(
            this,
            this.configManager.get('targetSelector')
        );

        if (!targetImage) {
            console.warn('No target image found with selector:',
                this.configManager.get('targetSelector'));
        }

        return targetImage;
    }

    /**
     * Initialize CSS custom properties for styling
     */
    private initializeStyles(): void {
        const config = this.configManager.getConfig();

        // Set CSS variables for potential customization
        this.style.setProperty('--pxm-lightbox-zoom-size', `${config.zoomSize}px`);
        this.style.setProperty('--pxm-lightbox-zoom-border', '2px solid #333');
        this.style.setProperty('--pxm-lightbox-zoom-background', 'white');
        this.style.setProperty('--pxm-lightbox-zoom-shadow', '0 0 10px rgba(0,0,0,0.3)');
        this.style.setProperty('--pxm-lightbox-zoom-z-index', '999999');
        this.style.setProperty('--pxm-lightbox-zoom-border-radius', '0');
    }
} 