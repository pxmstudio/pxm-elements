/**
 * @typedef {Object} AnimationDefaults
 * @property {number} duration - Animation duration in seconds (e.g., 0.3)
 * @property {string} easing - Animation easing (e.g., 'ease-in-out', 'power2.out')
 */

/**
 * @typedef {Object} PxmConfig
 * @property {'gsap'|'vanilla'} animationEngine - Animation engine to use globally
 * @property {AnimationDefaults} defaults - Default animation parameters
 */

/**
 * @type {PxmConfig}
 */
const DEFAULT_CONFIG = {
  animationEngine: 'vanilla',
  defaults: {
    duration: 0.3,
    easing: 'ease-in-out'
  }
};

/**
 * @type {PxmConfig}
 */
let config = { ...DEFAULT_CONFIG };

/**
 * Get a copy of the current configuration
 * @returns {PxmConfig} A shallow copy of the config object
 */
export function getConfig() {
  return { ...config, defaults: { ...config.defaults } };
}

/**
 * Update the configuration with new values
 * @param {Partial<PxmConfig>} newConfig - Partial config to merge
 */
export function setConfig(newConfig) {
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
export function isGsapAvailable() {
  return typeof window !== 'undefined' && typeof window.gsap !== 'undefined';
} 