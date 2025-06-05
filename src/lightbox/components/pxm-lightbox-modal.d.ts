/**
 * PXM Lightbox Modal Component
 *
 * Handles the modal overlay functionality with viewer and thumbnail swipers
 */
import type { MediaItem } from '../types';
export declare class PxmLightboxModal extends HTMLElement {
    private isOpen;
    private currentIndex;
    private mediaItems;
    private closeButton;
    private modalOverlay;
    private navigationButtons;
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    private parseAttributes;
    private initialize;
    private cleanup;
    private findControlElements;
    private setupEventListeners;
    private removeEventListeners;
    private setupModalStructure;
    private handleKeydown;
    private handleMediaChange;
    private navigatePrev;
    private navigateNext;
    private handleModalThumbnailClick;
    private handleModalViewerSlideChange;
    private updateModalContent;
    private dispatchNavigation;
    private show;
    private hide;
    open(mediaItems?: MediaItem[], startIndex?: number): void;
    close(): void;
    isModalOpen(): boolean;
    getCurrentIndex(): number;
    getCurrentMediaItem(): MediaItem | null;
    setMediaItems(mediaItems: MediaItem[], currentIndex?: number): void;
}
