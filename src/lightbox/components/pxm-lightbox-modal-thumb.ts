/**
 * PXM Lightbox Modal Thumbnail Component
 * 
 * Represents an individual thumbnail in the modal context
 */

import type { MediaType, MediaItem } from '../types';
import { safeQuerySelector } from '../dom-utils';

export class PxmLightboxModalThumb extends HTMLElement {
    private mediaType: MediaType = 'image';
    private mediaData: Partial<MediaItem> = {};

    static get observedAttributes() {
        return [
            'type',
            'data-full-image-src',
            'data-video-src',
            'data-video-type',
            'data-video-title',
            'data-video-description'
        ];
    }

    constructor() {
        super();
        this.parseAttributes();
    }

    connectedCallback() {
        this.initialize();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue && PxmLightboxModalThumb.observedAttributes.includes(name)) {
            this.parseAttributes();
            this.updateDisplay();
        }
    }

    private parseAttributes() {
        this.mediaType = (this.getAttribute('type') as MediaType) || 'image';
        
        this.mediaData = {
            type: this.mediaType,
            src: this.getAttribute('data-full-image-src') || this.getAttribute('data-video-src') || '',
            videoType: this.getAttribute('data-video-type') as any,
            title: this.getAttribute('data-video-title') || undefined,
            description: this.getAttribute('data-video-description') || undefined,
            thumbnail: this.getThumbnailSrc()
        };
    }

    private initialize() {
        this.updateDisplay();
        // Accessibility and keyboard support are now the user's responsibility
    }

    private updateDisplay() {
        // Add type-specific logic-only classes
        this.classList.remove('modal-thumb-image', 'modal-thumb-video');
        this.classList.add(`modal-thumb-${this.mediaType}`);
        // Add/remove video indicator element for video thumbnails (no styles)
        if (this.mediaType === 'video') {
            this.addVideoIndicator();
        } else {
            this.removeVideoIndicator();
        }
        // Accessibility (aria-label) is now the user's responsibility
    }

    private addVideoIndicator() {
        let indicator = safeQuerySelector(this, '.modal-video-indicator');
        if (!indicator) {
            const indicatorDiv = document.createElement('div');
            indicatorDiv.className = 'modal-video-indicator';
            indicatorDiv.innerHTML = '▶'; // Play icon
            // No internal styles applied
            this.appendChild(indicatorDiv);
        }
    }

    private removeVideoIndicator() {
        const indicator = safeQuerySelector(this, '.modal-video-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    private getThumbnailSrc(): string {
        const img = safeQuerySelector<HTMLImageElement>(this, 'img');
        return img?.src || '';
    }

    // Public API methods
    public getMediaData(): MediaItem {
        return {
            type: this.mediaType,
            src: this.mediaData.src || '',
            videoType: this.mediaData.videoType,
            title: this.mediaData.title,
            description: this.mediaData.description,
            thumbnail: this.mediaData.thumbnail
        };
    }

    public setActive(active: boolean) {
        this.classList.toggle('active', active);
        // aria-selected is now the user's responsibility
    }

    public isActive(): boolean {
        return this.classList.contains('active');
    }

    public getMediaType(): MediaType {
        return this.mediaType;
    }

    public updateThumbnailImage(src: string) {
        const img = safeQuerySelector<HTMLImageElement>(this, 'img');
        if (img) {
            img.src = src;
            this.mediaData.thumbnail = src;
        }
    }
} 