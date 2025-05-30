export interface VideoConfig {
  src: string;
  type: 'youtube' | 'vimeo' | 'mux' | 'mp4' | 'other';
  thumbnail?: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  title?: string;
  description?: string;
}

export interface VideoOptions {
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
}

export interface VideoState {
  isPlaying: boolean;
  isLoaded: boolean;
  error?: string;
}

export type VideoSource = {
  url: string;
  type: VideoConfig['type'];
}; 