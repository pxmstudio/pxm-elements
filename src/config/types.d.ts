/**
 * Types and interfaces for the PixelMakers Elements global configuration system
 */
/**
 * Supported animation engines
 * - 'gsap': Use GSAP for animations
 * - 'vanilla': Use built-in CSS/JS animations
 */
export type AnimationEngine = 'gsap' | 'vanilla';
/**
 * Default animation parameters
 * @property duration - Animation duration in seconds
 * @property easing - Animation easing function or keyword
 * @property [other] - Placeholder for future animation parameters
 */
export interface AnimationDefaults {
    /** Animation duration in seconds (e.g., 0.3) */
    duration: number;
    /** Animation easing (e.g., 'ease-in-out', 'power2.out') */
    easing: string;
}
/**
 * Global configuration for PixelMakers Elements
 * @property animationEngine - Selected animation engine ('gsap' or 'vanilla')
 * @property defaults - Default animation parameters
 */
export interface PxmConfig {
    /** Animation engine to use globally */
    animationEngine: AnimationEngine;
    /** Default animation parameters */
    defaults: AnimationDefaults;
}
