/**
 * Zoom functionality manager for the PXM Lightbox component
 */
import type { ZoomMode, LightboxConfig } from './types';
/**
 * Manages zoom functionality for the lightbox
 */
export declare class ZoomManager {
    private readonly zoomOverlay;
    private readonly config;
    private readonly zoomMode;
    private isZoomActive;
    private lastCursorX;
    private lastCursorY;
    constructor(config: LightboxConfig, zoomMode: ZoomMode);
    /**
     * Set up global mouse tracking to maintain cursor position
     */
    private setupGlobalMouseTracking;
    /**
     * Get the current cursor position
     */
    getCurrentCursorPosition(): {
        x: number;
        y: number;
    };
    /**
     * Get the zoom overlay element
     */
    getOverlay(): HTMLDivElement;
    /**
     * Check if zoom is enabled
     */
    isZoomEnabled(): boolean;
    /**
     * Handle mouse movement over an image for zoom functionality
     */
    handleMouseMove(event: MouseEvent): void;
    /**
     * Handle mouse enter on an image
     */
    handleMouseEnter(event: MouseEvent): void;
    /**
     * Handle mouse leave from an image
     */
    handleMouseLeave(event: MouseEvent): void;
    /**
     * Set up zoom handlers for an image element
     */
    setupZoomHandlers(image: HTMLImageElement | null): void;
    /**
     * Check if mouse is over the image and activate zoom state
     */
    private checkAndActivateZoomIfMouseOver;
    /**
     * Remove zoom handlers from an image element
     */
    removeZoomHandlers(image: HTMLImageElement | null): void;
    /**
     * Reset zoom state (useful when changing slides)
     */
    resetZoomState(): void;
    /**
     * Fade out zoom overlay smoothly while maintaining position
     */
    fadeOutZoomOverlay(): Promise<void>;
    /**
     * Fade in zoom overlay smoothly with optional cursor position
     */
    fadeInZoomOverlay(cursorX?: number, cursorY?: number): void;
    /**
     * Smoothly transition zoom overlay to new image while maintaining cursor position
     */
    transitionToNewImage(newImage: HTMLImageElement): void;
    /**
     * Hide the zoom overlay
     */
    private hideZoomOverlay;
    /**
     * Update zoom overlay position and background
     */
    private updateZoomOverlay;
    /**
     * Position the zoom overlay at the cursor location
     */
    private positionOverlay;
    /**
     * Update the background image and zoom level of the overlay
     */
    private updateZoomBackground;
    /**
     * Clean up zoom manager resources
     */
    destroy(): void;
}
