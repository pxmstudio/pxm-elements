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
import { PxmLightbox } from './lightbox';
import { PxmLightboxInline } from './components/pxm-lightbox-inline';
import { PxmLightboxThumbs } from './components/pxm-lightbox-thumbs';
import { PxmLightboxThumb } from './components/pxm-lightbox-thumb';
import { PxmLightboxViewer } from './components/pxm-lightbox-viewer';
import { PxmLightboxModal } from './components/pxm-lightbox-modal';
import { PxmLightboxModalViewer } from './components/pxm-lightbox-modal-viewer';
import { PxmLightboxModalThumbs } from './components/pxm-lightbox-modal-thumbs';
import { PxmLightboxModalThumb } from './components/pxm-lightbox-modal-thumb';
export { PxmLightbox };
export { PxmLightboxInline, PxmLightboxThumbs, PxmLightboxThumb, PxmLightboxViewer, PxmLightboxModal, PxmLightboxModalViewer, PxmLightboxModalThumbs, PxmLightboxModalThumb };
export type { LightboxMode, ZoomMode, LightboxConfig, LightboxElements, EventHandlers, MediaType, MediaItem } from './types';
export { ConfigManager } from './config';
export { ZoomManager } from './zoom-manager';
export { ModalManager } from './modal-manager';
export { EventManager } from './event-manager';
export * from './dom-utils';
