/**
 * TypeScript interfaces for PXM Slider Component
 */

export interface SliderConfig {
  min: number;
  max: number;
  step: number;
  value: string;
  orientation: 'horizontal' | 'vertical';
  disabled: boolean;
  form: boolean;
  name: string;
  inverted: boolean;
}

export interface SliderState {
  values: number[];
  isDragging: boolean;
  activeThumbIndex: number;
  isAnimating: boolean;
}

export interface SliderEventDetail {
  thumbIndex: number;
  thumbElement: HTMLElement;
  oldValue: number;
  newValue: number;
  percentage: number;
  complete: () => void;
}

export interface SliderAfterChangeEventDetail {
  thumbIndex: number;
  thumbElement: HTMLElement;
  oldValue: number;
  newValue: number;
  values: number[];
}

export interface SliderChangeEventDetail {
  value: number | number[];
  values: number[];
  thumbIndex: number;
}

export interface SliderValueCommitEventDetail {
  value: number | number[];
  values: number[];
  thumbIndex: number;
}

export interface SliderThumbDragEventDetail {
  thumbIndex: number;
  thumbElement: HTMLElement;
  value: number;
} 