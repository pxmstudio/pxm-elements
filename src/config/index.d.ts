export { getConfig, setConfig, isGsapAvailable } from './pxm-config';
export type { PxmConfig, AnimationEngine, AnimationDefaults } from './types';
import type { PxmConfig } from './types';
/**
 * Initialize the configuration system with a partial config
 * @param {Partial<PxmConfig>} config - Initial configuration
 */
export declare function init(config: Partial<PxmConfig>): void;
/**
 * Reset the configuration to default values
 */
export declare function reset(): void;
declare const _default: {
    init: typeof init;
    reset: typeof reset;
    getConfig(): PxmConfig;
    setConfig(newConfig: Partial<PxmConfig>): void;
    isGsapAvailable(): boolean;
};
export default _default;
