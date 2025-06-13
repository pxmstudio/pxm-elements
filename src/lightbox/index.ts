/**
 * PXM Lightbox Component
 * 
 * A modern, modular lightbox component for image galleries with
 * zoom functionality and optional modal view.
 * 
 * Features:
 * - Modular component architecture
 * - Thumbnail-based image switching with Swiper support
 * - Cursor-area zoom functionality
 * - Modal overlay support
 * - Configurable via attributes
 * - Clean separation of concerns
 * - Memory leak prevention with proper cleanup
 * 
 * Usage:
 * <pxm-lightbox mode="modal" zoom-mode="cursor-area" class="pxm-lightbox">
 *   <pxm-lightbox-inline thumbs-swiper="true" viewer-swiper="true" class="pxm-lightbox-inline">
 *     <pxm-lightbox-thumbs class="pxm-lightbox-thumbnails">
 *       <pxm-lightbox-thumb type="image" data-full-image-src="...">
 *         <img src="thumb.jpg" alt="" />
 *       </pxm-lightbox-thumb>
 *     </pxm-lightbox-thumbs>
 *     <pxm-lightbox-viewer>
 *       <img src="main.jpg" alt="" />
 *     </pxm-lightbox-viewer>
 *   </pxm-lightbox-inline>
 *   
 *   <pxm-lightbox-modal thumbs-swiper="true" viewer-swiper="true">
 *     <pxm-lightbox-modal-viewer>
 *       <div data-swiper class="swiper">
 *         <div data-swiper-wrapper class="swiper-wrapper">
 *           <div data-swiper-slide class="swiper-slide">
 *             <img src="..." alt="" />
 *           </div>
 *         </div>
 *       </div>
 *     </pxm-lightbox-modal-viewer>
 *     <pxm-lightbox-modal-thumbs>
 *       <pxm-lightbox-modal-thumb type="image" data-full-image-src="...">
 *         <img src="thumb.jpg" alt="" />
 *       </pxm-lightbox-modal-thumb>
 *     </pxm-lightbox-modal-thumbs>
 *     <button data-close>Close</button>
 *   </pxm-lightbox-modal>
 * </pxm-lightbox>
 */

// Import dependency injector
import { injectComponentDependencies } from '../dependency-injector';

// Import main lightbox component
import { PxmLightbox } from './lightbox';

// Import modular components
import { PxmLightboxInline } from './components/pxm-lightbox-inline';
import { PxmLightboxThumbs } from './components/pxm-lightbox-thumbs';
import { PxmLightboxThumb } from './components/pxm-lightbox-thumb';
import { PxmLightboxViewer } from './components/pxm-lightbox-viewer';
import { PxmLightboxModal } from './components/pxm-lightbox-modal';
import { PxmLightboxModalViewer } from './components/pxm-lightbox-modal-viewer';
import { PxmLightboxModalThumbs } from './components/pxm-lightbox-modal-thumbs';
import { PxmLightboxModalThumb } from './components/pxm-lightbox-modal-thumb';

// Export main class for potential direct usage
export { PxmLightbox };

// Export modular components
export { 
    PxmLightboxInline,
    PxmLightboxThumbs,
    PxmLightboxThumb,
    PxmLightboxViewer,
    PxmLightboxModal,
    PxmLightboxModalViewer,
    PxmLightboxModalThumbs,
    PxmLightboxModalThumb
};

// Export types for TypeScript users
export type {
    LightboxMode,
    ZoomMode,
    LightboxConfig,
    LightboxElements,
    EventHandlers,
    MediaType,
    MediaItem
} from './types';

// Export manager classes for advanced usage (backward compatibility)
export { ConfigManager } from './config';
export { ZoomManager } from './zoom-manager';

// Export utility functions
export * from './dom-utils';

// Inject dependencies if requested (for CDN usage)
injectComponentDependencies('lightbox').catch(error => {
    console.warn('Failed to inject lightbox dependencies:', error);
});

// Register all custom elements
if (!customElements.get("pxm-lightbox")) {
    customElements.define("pxm-lightbox", PxmLightbox);
}

if (!customElements.get("pxm-lightbox-inline")) {
    customElements.define("pxm-lightbox-inline", PxmLightboxInline);
}

if (!customElements.get("pxm-lightbox-thumbs")) {
    customElements.define("pxm-lightbox-thumbs", PxmLightboxThumbs);
}

if (!customElements.get("pxm-lightbox-thumb")) {
    customElements.define("pxm-lightbox-thumb", PxmLightboxThumb);
}

if (!customElements.get("pxm-lightbox-viewer")) {
    customElements.define("pxm-lightbox-viewer", PxmLightboxViewer);
}

if (!customElements.get("pxm-lightbox-modal")) {
    customElements.define("pxm-lightbox-modal", PxmLightboxModal);
}

if (!customElements.get("pxm-lightbox-modal-viewer")) {
    customElements.define("pxm-lightbox-modal-viewer", PxmLightboxModalViewer);
}

if (!customElements.get("pxm-lightbox-modal-thumbs")) {
    customElements.define("pxm-lightbox-modal-thumbs", PxmLightboxModalThumbs);
}

if (!customElements.get("pxm-lightbox-modal-thumb")) {
    customElements.define("pxm-lightbox-modal-thumb", PxmLightboxModalThumb);
}