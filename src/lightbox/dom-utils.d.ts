/**
 * DOM utility functions for the PXM Lightbox component
 */
/**
 * Safely query for an element within a container
 */
export declare function safeQuerySelector<T extends Element = Element>(container: Element | Document, selector: string): T | null;
/**
 * Safely query for multiple elements within a container
 */
export declare function safeQuerySelectorAll<T extends Element = Element>(container: Element | Document, selector: string): NodeListOf<T>;
/**
 * Create and configure the zoom overlay element
 */
export declare function createZoomOverlay(zoomSize: number): HTMLDivElement;
/**
 * Apply styles to the zoom overlay element
 */
export declare function applyZoomOverlayStyles(overlay: HTMLDivElement, zoomSize: number): void;
/**
 * Set the cursor style for an image element
 */
export declare function setImageCursor(image: HTMLImageElement | null, cursor: string): void;
/**
 * Get the full size image URL from a thumbnail element
 */
export declare function getFullSizeImageUrl(element: Element): string | null;
/**
 * Copy image attributes from source to target
 */
export declare function copyImageAttributes(source: HTMLImageElement, target: HTMLImageElement): void;
/**
 * Copy video attributes from source to target element
 */
export declare function copyVideoAttributes(source: Element, target: Element): void;
/**
 * Copy media attributes (images or videos) from source to target
 */
export declare function copyMediaAttributes(source: Element, target: Element): void;
/**
 * Toggle body scroll lock for modal
 */
export declare function toggleBodyScrollLock(lock: boolean): void;
/**
 * Remove element from DOM safely
 */
export declare function removeElement(element: HTMLElement | null): void;
/**
 * Check if element is within a modal
 */
export declare function isInModal(element: Element, modalSelector: string): boolean;
