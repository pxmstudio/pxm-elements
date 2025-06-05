/**
 * PXM Lightbox Modal Thumbnail Component
 *
 * Represents an individual thumbnail in the modal context
 */
import type { MediaType, MediaItem } from '../types';
export declare class PxmLightboxModalThumb extends HTMLElement {
    private mediaType;
    private mediaData;
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    private parseAttributes;
    private initialize;
    private handleKeydown;
    private updateDisplay;
    private addVideoIndicator;
    private removeVideoIndicator;
    private updateAriaLabel;
    private getThumbnailSrc;
    getMediaData(): MediaItem;
    setActive(active: boolean): void;
    isActive(): boolean;
    getMediaType(): MediaType;
    updateThumbnailImage(src: string): void;
}
