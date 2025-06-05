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
        if (oldValue !== newValue) {
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
        this.setAttribute('role', 'button');
        this.setAttribute('tabindex', '0');
        
        // Add keyboard support
        this.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    private handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.click();
        }
    }

    private updateDisplay() {
        // Add type-specific styling classes
        this.classList.remove('modal-thumb-image', 'modal-thumb-video');
        this.classList.add(`modal-thumb-${this.mediaType}`);

        // Add visual indicators for video thumbnails
        if (this.mediaType === 'video') {
            this.addVideoIndicator();
        } else {
            this.removeVideoIndicator();
        }

        // Update aria-label for accessibility
        this.updateAriaLabel();
    }

    private addVideoIndicator() {
        let indicator = safeQuerySelector(this, '.modal-video-indicator');
        if (!indicator) {
            const indicatorDiv = document.createElement('div');
            indicatorDiv.className = 'modal-video-indicator';
            indicatorDiv.innerHTML = '▶'; // Play icon
            indicatorDiv.style.position = 'absolute';
            indicatorDiv.style.top = '50%';
            indicatorDiv.style.left = '50%';
            indicatorDiv.style.transform = 'translate(-50%, -50%)';
            indicatorDiv.style.color = 'white';
            indicatorDiv.style.fontSize = '20px';
            indicatorDiv.style.pointerEvents = 'none';
            this.style.position = 'relative';
            this.appendChild(indicatorDiv);
        }
    }

    private removeVideoIndicator() {
        const indicator = safeQuerySelector(this, '.modal-video-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    private updateAriaLabel() {
        const mediaDescription = this.mediaType === 'video' ? 
            `Video: ${this.mediaData.title || 'Untitled'}` :
            'Image thumbnail';
        
        this.setAttribute('aria-label', `${mediaDescription}. Click to view in modal.`);
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
        this.setAttribute('aria-selected', active.toString());
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