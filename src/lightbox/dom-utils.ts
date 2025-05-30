/**
 * DOM utility functions for the PXM Lightbox component
 */

import type { ZoomStyles } from './types';

/**
 * Safely query for an element within a container
 */
export function safeQuerySelector<T extends Element = Element>(
    container: Element | Document, 
    selector: string
): T | null {
    try {
        return container.querySelector<T>(selector);
    } catch (error) {
        console.warn(`Invalid selector: ${selector}`, error);
        return null;
    }
}

/**
 * Safely query for multiple elements within a container
 */
export function safeQuerySelectorAll<T extends Element = Element>(
    container: Element | Document, 
    selector: string
): NodeListOf<T> {
    try {
        return container.querySelectorAll<T>(selector);
    } catch (error) {
        console.warn(`Invalid selector: ${selector}`, error);
        return document.querySelectorAll<T>('*:not(*)'); // Empty NodeList
    }
}

/**
 * Create and configure the zoom overlay element
 */
export function createZoomOverlay(zoomSize: number): HTMLDivElement {
    const overlay = document.createElement("div");
    overlay.setAttribute("data-zoom-overlay", "");
    
    // Apply zoom overlay styles
    applyZoomOverlayStyles(overlay, zoomSize);
    
    // Append to document body for global positioning
    document.body.appendChild(overlay);
    
    return overlay;
}

/**
 * Apply styles to the zoom overlay element
 */
export function applyZoomOverlayStyles(overlay: HTMLDivElement, zoomSize: number): void {
    const styles: ZoomStyles = {
        position: 'fixed',
        width: `${zoomSize}px`,
        height: `${zoomSize}px`,
        border: '2px solid #333',
        backgroundColor: 'white',
        pointerEvents: 'none',
        display: 'none',
        overflow: 'hidden',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        zIndex: '999999',
        transform: 'translate(-50%, -50%)',
        borderRadius: '0',
        backgroundRepeat: 'no-repeat'
    };

    Object.assign(overlay.style, styles);
}

/**
 * Set the cursor style for an image element
 */
export function setImageCursor(image: HTMLImageElement | null, cursor: string): void {
    if (image) {
        image.style.cursor = cursor;
    }
}

/**
 * Get the full-size image URL from a thumbnail
 */
export function getFullSizeImageUrl(thumbnail: Element): string | null {
    // Check if the thumbnail element itself is an image
    if (thumbnail.tagName === 'IMG') {
        return (thumbnail as HTMLImageElement).getAttribute('data-full-img-src') || null;
    }
    
    // Otherwise, look for an img child element (backwards compatibility)
    const img = thumbnail.querySelector('img');
    return img?.getAttribute('data-full-img-src') || null;
}

/**
 * Copy image attributes from source to target
 */
export function copyImageAttributes(source: HTMLImageElement, target: HTMLImageElement): void {
    target.src = source.src;
    target.setAttribute('data-full-img-src', source.getAttribute('data-full-img-src') || '');
    target.alt = source.alt;
}

/**
 * Toggle body scroll lock for modal
 */
export function toggleBodyScrollLock(lock: boolean): void {
    document.body.style.overflow = lock ? 'hidden' : '';
}

/**
 * Remove element from DOM safely
 */
export function removeElement(element: HTMLElement | null): void {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

/**
 * Check if element is within a modal
 */
export function isInModal(element: Element, modalSelector: string): boolean {
    return element.closest(modalSelector) !== null;
} 