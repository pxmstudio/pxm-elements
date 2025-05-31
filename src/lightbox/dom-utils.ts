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
 * Get the full size image URL from a thumbnail element
 */
export function getFullSizeImageUrl(element: Element): string | null {
    // For images, use data-full-img-src
    if (element.getAttribute('data-type') === 'image') {
        return element.getAttribute('data-full-img-src') || 
               (element instanceof HTMLImageElement ? element.src : null);
    }
    
    // For videos, use data-video-src
    if (element.getAttribute('data-type') === 'video') {
        return element.getAttribute('data-video-src') || null;
    }

    // Fallback for backward compatibility
    return element.getAttribute('data-full-img-src') || 
           (element instanceof HTMLImageElement ? element.src : null);
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
 * Copy video attributes from source to target element
 */
export function copyVideoAttributes(source: Element, target: Element): void {
    const videoSrc = source.getAttribute('data-video-src');
    if (videoSrc) {
        target.setAttribute('data-video-src', videoSrc);
    }
    
    const videoType = source.getAttribute('data-video-type');
    if (videoType) {
        target.setAttribute('data-video-type', videoType);
    }
    
    const title = source.getAttribute('data-title');
    if (title) {
        target.setAttribute('data-title', title);
    }
    
    const description = source.getAttribute('data-description');
    if (description) {
        target.setAttribute('data-description', description);
    }
    
    // Copy data-type attribute
    target.setAttribute('data-type', 'video');
}

/**
 * Copy media attributes (images or videos) from source to target
 */
export function copyMediaAttributes(source: Element, target: Element): void {
    const mediaType = source.getAttribute('data-type');
    
    if (mediaType === 'video') {
        copyVideoAttributes(source, target);
    } else {
        // Default to image handling
        const sourceImg = source.tagName === 'IMG' ? source as HTMLImageElement : 
                         source.querySelector('img') as HTMLImageElement;
        const targetImg = target.tagName === 'IMG' ? target as HTMLImageElement : 
                         target.querySelector('img') as HTMLImageElement;
        
        if (sourceImg && targetImg) {
            copyImageAttributes(sourceImg, targetImg);
        }
        target.setAttribute('data-type', 'image');
    }
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