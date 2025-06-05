/**
 * PXM Lightbox Thumbnail Component
 * 
 * Represents an individual thumbnail with media information
 */

import type { MediaType, MediaItem } from '../types';
import { safeQuerySelector } from '../dom-utils';

export class PxmLightboxThumb extends HTMLElement {
    private mediaType: MediaType = 'image';
    private mediaData: Partial<MediaItem> = {};
    private initialized: boolean = false;

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
        if (oldValue !== newValue && PxmLightboxThumb.observedAttributes.includes(name)) {
            this.parseAttributes();
            if (this.initialized) {
                this.updateDisplay();
            }
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
        if (this.initialized) return;

        this.updateDisplay();
        this.setAttribute('role', 'button');
        this.setAttribute('tabindex', '0');
        
        // Add keyboard support
        this.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Add visual feedback
        this.style.cursor = 'pointer';
        
        this.initialized = true;
    }

    private handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.click();
        }
    }

    private updateDisplay() {
        // Add type-specific styling classes
        this.classList.remove('thumb-image', 'thumb-video');
        this.classList.add(`thumb-${this.mediaType}`);

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
        let indicator = safeQuerySelector(this, '.video-indicator');
        if (!indicator) {
            const indicatorEl = document.createElement('div');
            indicatorEl.className = 'video-indicator';
            indicatorEl.innerHTML = '▶'; // Play icon
            indicatorEl.style.position = 'absolute';
            indicatorEl.style.top = '50%';
            indicatorEl.style.left = '50%';
            indicatorEl.style.transform = 'translate(-50%, -50%)';
            indicatorEl.style.color = 'white';
            indicatorEl.style.fontSize = '16px';
            indicatorEl.style.textShadow = '0 0 4px rgba(0,0,0,0.8)';
            indicatorEl.style.pointerEvents = 'none';
            indicatorEl.style.zIndex = '1';
            
            this.style.position = 'relative';
            this.appendChild(indicatorEl);
        }
    }

    private removeVideoIndicator() {
        const indicator = safeQuerySelector(this, '.video-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    private updateAriaLabel() {
        const mediaDescription = this.mediaType === 'video' ? 
            `Video: ${this.mediaData.title || 'Untitled'}` :
            'Image thumbnail';
        
        this.setAttribute('aria-label', `${mediaDescription}. Click to view.`);
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
        
        // Add visual feedback for active state
        if (active) {
            this.style.opacity = '1';
            this.style.transform = 'scale(1.05)';
        } else {
            this.style.opacity = '0.7';
            this.style.transform = 'scale(1)';
        }
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