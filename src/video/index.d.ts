import { PxmVideo } from './video';
import type { VideoConfig } from './types';
export { PxmVideo };
export type { VideoConfig };
declare global {
    interface Window {
        PxmVideo: typeof PxmVideo;
    }
}
