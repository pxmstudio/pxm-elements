/**
 * Configuration management for the PXM Lightbox component
 */
import type { LightboxConfig, ZoomMode } from './types';
/**
 * Configuration manager class to handle lightbox settings
 */
export declare class ConfigManager {
    private readonly config;
    constructor(element: HTMLElement);
    /**
     * Get the current configuration
     */
    getConfig(): LightboxConfig;
    /**
     * Get a specific configuration value
     */
    get<K extends keyof LightboxConfig>(key: K): LightboxConfig[K];
    /**
     * Parse configuration from element attributes
     */
    private parseConfiguration;
    /**
     * Parse and validate lightbox mode
     */
    private parseMode;
    /**
     * Parse and validate zoom mode
     */
    parseZoomMode(zoomModeAttribute: string | null): ZoomMode;
    /**
     * Parse numeric values with fallback
     */
    private parseNumber;
}
