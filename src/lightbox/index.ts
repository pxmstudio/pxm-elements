/**
 * PXM Lightbox Component
 * 
 * A modern, modular lightbox component for image galleries with
 * zoom functionality and optional modal view.
 * 
 * Features:
 * - Thumbnail-based image switching
 * - Cursor-area zoom functionality
 * - Modal overlay support
 * - Configurable via data attributes
 * - Clean separation of concerns with manager classes
 * - Memory leak prevention with proper cleanup
 * 
 * Usage:
 * <pxm-lightbox data-mode="modal" data-zoom-mode="cursor-area">
 *   <img data-target-img src="main-image.jpg" />
 *   <img data-thumb-item src="thumb1.jpg" data-full-img-src="full1.jpg" />
 *   <img data-thumb-item src="thumb2.jpg" data-full-img-src="full2.jpg" />
 *   
 *   <div data-modal>
 *     <img data-target-img src="main-image.jpg" />
 *     <div data-modal-thumbnails>
 *       <img data-thumb-item />
 *     </div>
 *     <button data-close>Close</button>
 *   </div>
 * </pxm-lightbox>
 */

import { PxmLightbox } from './lightbox';

// Export main class for potential direct usage
export { PxmLightbox };

// Export types for TypeScript users
export type {
    LightboxMode,
    ZoomMode,
    LightboxConfig,
    LightboxElements,
    EventHandlers
} from './types';

// Export manager classes for advanced usage
export { ConfigManager } from './config';
export { ZoomManager } from './zoom-manager';
export { ModalManager } from './modal-manager';
export { EventManager } from './event-manager';

// Export utility functions
export * from './dom-utils';

// Register the custom element
if (!customElements.get("pxm-lightbox")) {
    customElements.define("pxm-lightbox", PxmLightbox);
}