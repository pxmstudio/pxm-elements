import type { PxmConfig } from './types';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: PxmConfig = {
    animationEngine: 'vanilla',
    defaults: {
        duration: 0.3,
        easing: 'ease-in-out'
    }
};

let config: PxmConfig = { ...DEFAULT_CONFIG };

/**
 * Validate a partial or full configuration object
 * @param {Partial<PxmConfig>} cfg - Config to validate
 * @throws {Error} If config is invalid
 */
function validateConfig(cfg: Partial<PxmConfig>): void {
    if (cfg.animationEngine && cfg.animationEngine !== 'gsap' && cfg.animationEngine !== 'vanilla') {
        throw new Error(`Invalid animationEngine: '${cfg.animationEngine}'. Must be 'gsap' or 'vanilla'.`);
    }
    if (cfg.defaults) {
        if ('duration' in cfg.defaults && (typeof cfg.defaults.duration !== 'number' || cfg.defaults.duration <= 0)) {
            throw new Error(`Invalid duration: '${cfg.defaults.duration}'. Must be a positive number.`);
        }
        if ('easing' in cfg.defaults && (typeof cfg.defaults.easing !== 'string' || !cfg.defaults.easing.trim())) {
            throw new Error(`Invalid easing: '${cfg.defaults.easing}'. Must be a non-empty string.`);
        }
    }
}

/**
 * Get a copy of the current configuration
 * @returns {PxmConfig} A shallow copy of the config object
 */
export function getConfig(): PxmConfig {
    return { ...config, defaults: { ...config.defaults } };
}

/**
 * Update the configuration with new values (with validation)
 * @param {Partial<PxmConfig>} newConfig - Partial config to merge
 * @throws {Error} If newConfig is invalid
 */
export function setConfig(newConfig: Partial<PxmConfig>): void {
    validateConfig(newConfig);
    config = {
        ...config,
        ...newConfig,
        defaults: {
            ...config.defaults,
            ...(newConfig.defaults || {})
        }
    };
}

/**
 * Detect if GSAP is available in the current environment
 * @returns {boolean} True if GSAP is present on window
 */
export function isGsapAvailable(): boolean {
    return typeof window !== 'undefined' && typeof (window as any).gsap !== 'undefined';
} 