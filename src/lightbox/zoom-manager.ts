/**
 * Zoom functionality manager for the PXM Lightbox component
 */

import type { ZoomMode, LightboxConfig } from './types';
import { createZoomOverlay, setImageCursor, removeElement } from './dom-utils';

/**
 * Manages zoom functionality for the lightbox
 */
export class ZoomManager {
    private readonly zoomOverlay: HTMLDivElement;
    private readonly config: LightboxConfig;
    private readonly zoomMode: ZoomMode;
    private isZoomActive: boolean = false;
    private lastCursorX: number = 0;
    private lastCursorY: number = 0;

    constructor(config: LightboxConfig, zoomMode: ZoomMode) {
        this.config = config;
        this.zoomMode = zoomMode;
        this.zoomOverlay = createZoomOverlay(config.zoomSize);
        
        // Set up global mouse tracking for smooth transitions
        this.setupGlobalMouseTracking();
    }

    /**
     * Set up global mouse tracking to maintain cursor position
     */
    private setupGlobalMouseTracking(): void {
        document.addEventListener('mousemove', (event: MouseEvent) => {
            this.lastCursorX = event.clientX;
            this.lastCursorY = event.clientY;
        }, { passive: true });
    }

    /**
     * Get the current cursor position
     */
    public getCurrentCursorPosition(): { x: number; y: number } {
        return {
            x: this.lastCursorX,
            y: this.lastCursorY
        };
    }

    /**
     * Get the zoom overlay element
     */
    public getOverlay(): HTMLDivElement {
        return this.zoomOverlay;
    }

    /**
     * Check if zoom is enabled
     */
    public isZoomEnabled(): boolean {
        return this.zoomMode === "cursor-area";
    }

    /**
     * Handle mouse movement over an image for zoom functionality
     */
    public handleMouseMove(event: MouseEvent): void {
        if (!this.isZoomEnabled() || !this.isZoomActive) return;

        const targetImg = event.target as HTMLImageElement;
        if (!targetImg) return;

        // Track cursor position for smooth transitions
        this.lastCursorX = event.clientX;
        this.lastCursorY = event.clientY;

        this.updateZoomOverlay(event, targetImg);
    }

    /**
     * Handle mouse enter on an image
     */
    public handleMouseEnter(event: MouseEvent): void {
        if (!this.isZoomEnabled()) return;

        const targetImg = event.target as HTMLImageElement;
        if (!targetImg) return;

        setImageCursor(targetImg, "none");
        this.isZoomActive = true;
        
        // Use fade in animation for smooth appearance
        this.fadeInZoomOverlay();
    }

    /**
     * Handle mouse leave from an image
     */
    public handleMouseLeave(event: MouseEvent): void {
        if (!this.isZoomEnabled()) return;

        const targetImg = event.target as HTMLImageElement;
        setImageCursor(targetImg, "default");
        this.isZoomActive = false;
        
        // Use fade out animation for smooth disappearance
        this.fadeOutZoomOverlay();
    }

    /**
     * Set up zoom handlers for an image element
     */
    public setupZoomHandlers(image: HTMLImageElement | null): void {
        if (!image || !this.isZoomEnabled()) return;

        // Remove existing handlers to prevent duplicates
        this.removeZoomHandlers(image);

        // Create bound handlers
        const boundMouseMove = this.handleMouseMove.bind(this);
        const boundMouseEnter = this.handleMouseEnter.bind(this);
        const boundMouseLeave = this.handleMouseLeave.bind(this);

        // Add event listeners
        image.addEventListener("mousemove", boundMouseMove);
        image.addEventListener("mouseenter", boundMouseEnter);
        image.addEventListener("mouseleave", boundMouseLeave);

        // Store handlers for cleanup
        (image as any)._zoomHandlers = {
            mouseMove: boundMouseMove,
            mouseEnter: boundMouseEnter,
            mouseLeave: boundMouseLeave
        };

        // Set initial cursor to default (don't hide it until mouse enters)
        setImageCursor(image, "default");

        // Check if mouse is already over the image and activate zoom if so
        this.checkAndActivateZoomIfMouseOver(image);
    }

    /**
     * Check if mouse is over the image and activate zoom state
     */
    private checkAndActivateZoomIfMouseOver(image: HTMLImageElement): void {
        // Use a small delay to ensure the image is fully rendered and CSS is applied
        setTimeout(() => {
            // Check if the image is currently being hovered using CSS :hover state
            if (image.matches(':hover')) {
                // Mouse is over the image, trigger mouseenter event to activate zoom properly
                const syntheticEnterEvent = new MouseEvent('mouseenter', {
                    bubbles: true,
                    cancelable: true
                });
                
                // Dispatch the mouseenter event to trigger normal zoom activation
                image.dispatchEvent(syntheticEnterEvent);
                
                // Use current cursor position instead of center for smooth activation
                const syntheticMoveEvent = new MouseEvent('mousemove', {
                    clientX: this.lastCursorX,
                    clientY: this.lastCursorY,
                    bubbles: true,
                    cancelable: true
                });
                
                // Dispatch the mousemove event to position the overlay
                setTimeout(() => {
                    image.dispatchEvent(syntheticMoveEvent);
                }, 10);
            }
        }, 100); // Longer delay to ensure everything is stable
    }

    /**
     * Remove zoom handlers from an image element
     */
    public removeZoomHandlers(image: HTMLImageElement | null): void {
        if (!image) return;

        const handlers = (image as any)._zoomHandlers;
        if (handlers) {
            image.removeEventListener("mousemove", handlers.mouseMove);
            image.removeEventListener("mouseenter", handlers.mouseEnter);
            image.removeEventListener("mouseleave", handlers.mouseLeave);
            delete (image as any)._zoomHandlers;
        }

        // Reset cursor to default when removing handlers
        setImageCursor(image, "default");
    }

    /**
     * Reset zoom state (useful when changing slides)
     */
    public resetZoomState(): void {
        this.hideZoomOverlay();
        this.isZoomActive = false;
    }

    /**
     * Fade out zoom overlay smoothly while maintaining position
     */
    public fadeOutZoomOverlay(): Promise<void> {
        return new Promise((resolve) => {
            if (!this.zoomOverlay || this.zoomOverlay.style.display === 'none') {
                resolve();
                return;
            }

            // Keep the overlay positioned at the current cursor location during fade
            this.positionOverlay(this.lastCursorX, this.lastCursorY);

            // Set initial opacity and add transition
            this.zoomOverlay.style.transition = 'opacity 150ms ease-out';
            this.zoomOverlay.style.opacity = '0';

            // Wait for transition to complete
            setTimeout(() => {
                this.hideZoomOverlay();
                this.isZoomActive = false;
                // Remove transition to prevent interference with normal operations
                this.zoomOverlay.style.transition = '';
                resolve();
            }, 150);
        });
    }

    /**
     * Fade in zoom overlay smoothly with optional cursor position
     */
    public fadeInZoomOverlay(cursorX?: number, cursorY?: number): void {
        if (!this.zoomOverlay || !this.isZoomActive) return;

        // Use provided cursor position or last known position
        const overlayX = cursorX ?? this.lastCursorX;
        const overlayY = cursorY ?? this.lastCursorY;

        // Position overlay at cursor location before showing
        if (overlayX && overlayY) {
            this.positionOverlay(overlayX, overlayY);
        }

        // Ensure overlay is visible but transparent
        this.zoomOverlay.style.opacity = '0';
        this.zoomOverlay.style.display = 'block';
        this.zoomOverlay.style.transition = 'opacity 150ms ease-out';

        // Trigger fade in on next frame
        requestAnimationFrame(() => {
            this.zoomOverlay.style.opacity = '1';
            
            // Remove transition after animation completes
            setTimeout(() => {
                this.zoomOverlay.style.transition = '';
            }, 150);
        });
    }

    /**
     * Smoothly transition zoom overlay to new image while maintaining cursor position
     */
    public transitionToNewImage(newImage: HTMLImageElement): void {
        if (!this.isZoomActive || !this.zoomOverlay) return;
        
        const rect = newImage.getBoundingClientRect();
        const x = this.lastCursorX - rect.left;
        const y = this.lastCursorY - rect.top;
        
        // Update the zoom background with new image immediately
        this.updateZoomBackground(newImage, x, y, rect);
    }

    /**
     * Hide the zoom overlay
     */
    private hideZoomOverlay(): void {
        this.zoomOverlay.style.display = "none";
        this.zoomOverlay.style.opacity = "1";
    }

    /**
     * Update zoom overlay position and background
     */
    private updateZoomOverlay(event: MouseEvent, targetImg: HTMLImageElement): void {
        const rect = targetImg.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Position overlay at cursor
        this.positionOverlay(event.clientX, event.clientY);

        // Update background image and zoom
        this.updateZoomBackground(targetImg, x, y, rect);
    }

    /**
     * Position the zoom overlay at the cursor location
     */
    private positionOverlay(clientX: number, clientY: number): void {
        this.zoomOverlay.style.left = `${clientX}px`;
        this.zoomOverlay.style.top = `${clientY}px`;
    }

    /**
     * Update the background image and zoom level of the overlay
     */
    private updateZoomBackground(
        targetImg: HTMLImageElement, 
        x: number, 
        y: number, 
        rect: DOMRect
    ): void {
        // Calculate zoomed dimensions
        const zoomedWidth = rect.width * this.config.zoomLevel;
        const zoomedHeight = rect.height * this.config.zoomLevel;

        // Set background image and size
        this.zoomOverlay.style.backgroundImage = `url(${targetImg.src})`;
        this.zoomOverlay.style.backgroundSize = `${zoomedWidth}px ${zoomedHeight}px`;

        // Calculate background position to center on cursor
        const bgPosX = -x * this.config.zoomLevel + this.config.zoomSize / 2;
        const bgPosY = -y * this.config.zoomLevel + this.config.zoomSize / 2;
        this.zoomOverlay.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;

        // Ensure proper background color
        this.zoomOverlay.style.backgroundColor = 'white';
    }

    /**
     * Clean up zoom manager resources
     */
    public destroy(): void {
        this.hideZoomOverlay();
        removeElement(this.zoomOverlay);
        this.isZoomActive = false;
    }
} 