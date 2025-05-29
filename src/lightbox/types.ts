/**
 * Type definitions for the PXM Lightbox component
 */

export type LightboxMode = "swap-target" | "modal";
export type ZoomMode = "cursor-area" | "none";

export interface LightboxConfig {
    mode: LightboxMode;
    targetSelector: string;
    thumbnailSelector: string;
    zoomSelector: string;
    modalSelector: string;
    zoomSize: number;
    zoomLevel: number;
}

export interface ZoomStyles {
    position: string;
    width: string;
    height: string;
    border: string;
    backgroundColor: string;
    pointerEvents: string;
    display: string;
    overflow: string;
    boxShadow: string;
    zIndex: string;
    transform: string;
    borderRadius: string;
    backgroundRepeat: string;
}

export interface EventHandlers {
    handleThumbnailClick: (event: Event) => void;
    handleMouseMove: (event: MouseEvent) => void;
    handleMouseEnter: (event: MouseEvent) => void;
    handleMouseLeave: (event: MouseEvent) => void;
    handleModalOpen: (event: Event) => void;
    handleModalClose: (event: Event) => void;
}

export interface LightboxElements {
    thumbnails: NodeListOf<Element>;
    targetImage: HTMLImageElement | null;
    modal: HTMLElement | null;
    modalTargetImage: HTMLImageElement | null;
    modalThumbnails: NodeListOf<Element>;
    zoomOverlay: HTMLDivElement;
} 