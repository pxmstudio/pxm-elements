/**
 * Type definitions for the PXM Lightbox component
 */

export type LightboxMode = "swap-target" | "modal";
export type ZoomMode = "cursor-area" | "none";
export type MediaType = "image" | "video";

export interface LightboxConfig {
    mode: LightboxMode;
    targetSelector: string;
    thumbnailSelector: string;
    zoomSelector: string;
    modalSelector: string;
    zoomSize: number;
    zoomLevel: number;
    fadeAnimationDuration: number;
    videoConfig?: {
        autoplay: boolean;
        muted: boolean;
        controls: boolean;
    };
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
    targetVideo: HTMLElement | null;
    modal: HTMLElement | null;
    modalTargetImage: HTMLImageElement | null;
    modalTargetVideo: HTMLElement | null;
    modalThumbnails: NodeListOf<Element>;
    zoomOverlay: HTMLDivElement;
}

export interface MediaItem {
    type: MediaType;
    src: string;
    thumbnail?: string;
    videoType?: 'youtube' | 'vimeo' | 'mux' | 'mp4' | 'other';
    title?: string;
    description?: string;
} 