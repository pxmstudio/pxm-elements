export { getConfig, setConfig, isGsapAvailable } from './pxm-config';
export type { PxmConfig, AnimationEngine, AnimationDefaults } from './types';
import { setConfig } from './pxm-config';
import type { PxmConfig } from './types';

import * as pxmConfigModule from './pxm-config';

/**
 * Initialize the configuration system with a partial config
 * @param {Partial<PxmConfig>} config - Initial configuration
 */
export function init(config: Partial<PxmConfig>): void {
    setConfig(config);
}

/**
 * Reset the configuration to default values
 */
export function reset(): void {
    setConfig({
        animationEngine: 'vanilla',
        defaults: {
            duration: 0.3,
            easing: 'ease-in-out'
        }
    });
}

// For CommonJS compatibility (optional)
export default {
    ...pxmConfigModule,
    init,
    reset
}; 