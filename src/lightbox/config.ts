/**
 * Configuration management for the PXM Lightbox component
 */

import type { LightboxConfig, LightboxMode, ZoomMode } from './types';

/**
 * Default configuration values for the lightbox
 */
const DEFAULT_CONFIG: LightboxConfig = {
    mode: "modal",
    targetSelector: "[data-target-img]",
    thumbnailSelector: "[data-thumb-item]",
    zoomSelector: "[data-zoom-overlay]",
    modalSelector: "[data-modal]",
    zoomSize: 150,
    zoomLevel: 2,
    fadeAnimationDuration: 200
};

/**
 * Configuration manager class to handle lightbox settings
 */
export class ConfigManager {
    private readonly config: LightboxConfig;

    constructor(element: HTMLElement) {
        this.config = this.parseConfiguration(element);
    }

    /**
     * Get the current configuration
     */
    public getConfig(): LightboxConfig {
        return { ...this.config };
    }

    /**
     * Get a specific configuration value
     */
    public get<K extends keyof LightboxConfig>(key: K): LightboxConfig[K] {
        return this.config[key];
    }

    /**
     * Parse configuration from element attributes
     */
    private parseConfiguration(element: HTMLElement): LightboxConfig {
        const mode = this.parseMode(element.getAttribute("data-mode"));
        const zoomSize = this.parseNumber(element.getAttribute("data-zoom-size"), DEFAULT_CONFIG.zoomSize);
        const zoomLevel = this.parseNumber(element.getAttribute("data-zoom-level"), DEFAULT_CONFIG.zoomLevel);
        const fadeAnimationDuration = this.parseNumber(
            element.getAttribute("data-fade-duration"),
            DEFAULT_CONFIG.fadeAnimationDuration
        );

        return {
            ...DEFAULT_CONFIG,
            mode,
            zoomSize,
            zoomLevel,
            fadeAnimationDuration
        };
    }

    /**
     * Parse and validate lightbox mode
     */
    private parseMode(modeAttribute: string | null): LightboxMode {
        if (modeAttribute === "swap-target" || modeAttribute === "modal") {
            return modeAttribute;
        }
        return DEFAULT_CONFIG.mode;
    }

    /**
     * Parse and validate zoom mode
     */
    public parseZoomMode(zoomModeAttribute: string | null): ZoomMode {
        if (zoomModeAttribute === "cursor-area" || zoomModeAttribute === "none") {
            return zoomModeAttribute;
        }
        return "cursor-area"; // Default zoom mode
    }

    /**
     * Parse numeric values with fallback
     */
    private parseNumber(value: string | null, fallback: number): number {
        if (value === null) return fallback;
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? fallback : parsed;
    }
} 