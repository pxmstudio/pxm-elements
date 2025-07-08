import type { PxmConfig } from './types';
/**
 * Get a copy of the current configuration
 * @returns {PxmConfig} A shallow copy of the config object
 */
export declare function getConfig(): PxmConfig;
/**
 * Update the configuration with new values (with validation)
 * @param {Partial<PxmConfig>} newConfig - Partial config to merge
 * @throws {Error} If newConfig is invalid
 */
export declare function setConfig(newConfig: Partial<PxmConfig>): void;
/**
 * Detect if GSAP is available in the current environment
 * @returns {boolean} True if GSAP is present on window
 */
export declare function isGsapAvailable(): boolean;
