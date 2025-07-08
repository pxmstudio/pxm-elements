/**
 * PXM Slider Component
 * 
 * A customizable slider component that supports single and multi-thumb ranges, form integration, and keyboard navigation.
 * This component provides structure and behavior only - all styling is controlled by your CSS.
 * 
 * Features:
 * - Single and multi-thumb range selection
 * - Horizontal and vertical orientation
 * - Full keyboard support (Arrow keys, Home, End, Page Up/Down)
 * - Form integration with hidden inputs
 * - Step values and min/max constraints
 * - Event-driven animation system for custom animations
 * - CSS-based styling via state attributes
 * - Dynamic thumb management
 * - Accessibility with ARIA support
 * - Lightweight and performant
 * 
 * Keyboard Navigation:
 * - `ArrowLeft/ArrowDown` - Decrease value by step
 * - `ArrowRight/ArrowUp` - Increase value by step
 * - `Home` - Set to minimum value
 * - `End` - Set to maximum value
 * - `PageDown` - Decrease by large step (10x step)
 * - `PageUp` - Increase by large step (10x step)
 * 
 * Basic Usage:
 * ```html
 * <!-- Simple slider -->
 * <pxm-slider min="0" max="100" value="50">
 *   <pxm-slider-track>
 *     <pxm-slider-range></pxm-slider-range>
 *   </pxm-slider-track>
 *   <pxm-slider-thumb></pxm-slider-thumb>
 * </pxm-slider>
 * 
 * <!-- Range slider with multiple thumbs -->
 * <pxm-slider min="0" max="100" value="20,80">
 *   <pxm-slider-track>
 *     <pxm-slider-range></pxm-slider-range>
 *   </pxm-slider-track>
 *   <pxm-slider-thumb></pxm-slider-thumb>
 *   <pxm-slider-thumb></pxm-slider-thumb>
 * </pxm-slider>
 * 
 * <!-- Vertical slider -->
 * <pxm-slider orientation="vertical" min="0" max="100" value="30">
 *   <pxm-slider-track>
 *     <pxm-slider-range></pxm-slider-range>
 *   </pxm-slider-track>
 *   <pxm-slider-thumb></pxm-slider-thumb>
 * </pxm-slider>
 * 
 * <!-- Form integration -->
 * <pxm-slider form="true" name="volume" min="0" max="100" value="75">
 *   <pxm-slider-track>
 *     <pxm-slider-range></pxm-slider-range>
 *   </pxm-slider-track>
 *   <pxm-slider-thumb></pxm-slider-thumb>
 * </pxm-slider>
 * 
 * <!-- Disabled slider -->
 * <pxm-slider disabled="true" min="0" max="100" value="50">
 *   <pxm-slider-track>
 *     <pxm-slider-range></pxm-slider-range>
 *   </pxm-slider-track>
 *   <pxm-slider-thumb></pxm-slider-thumb>
 * </pxm-slider>
 * ```
 * 
 * Dynamic Content:
 * ```javascript
 * // Programmatic control
 * const slider = document.querySelector('pxm-slider');
 * slider.value = [25, 75]; // Range slider
 * slider.value = 50; // Single slider
 * slider.disabled = false;
 * 
 * // Listen for changes
 * slider.addEventListener('pxm:slider:change', (e) => {
 *   console.log(`Slider value: ${e.detail.value}`);
 * });
 * 
 * // Add/remove thumbs dynamically
 * slider.addThumb(60);
 * slider.removeThumb(1);
 * ```
 * 
 * With Animation Library (via events - recommended for CDN):
 * ```javascript
 * const slider = document.querySelector('pxm-slider');
 * 
 * slider.addEventListener('pxm:slider:before-change', (e) => {
 *   const { thumbElement, value, complete } = e.detail;
 *   e.preventDefault(); // Take over the animation
 *   
 *   // Custom animation with GSAP, Anime.js, etc.
 *   gsap.to(thumbElement, {
 *     x: e.detail.position + 'px',
 *     duration: 0.3,
 *     ease: "power2.out",
 *     onComplete: () => {
 *       complete(); // Signal animation complete
 *     }
 *   });
 * });
 * ```
 * 
 * With CSS Transitions:
 * ```css
 * pxm-slider {
 *   width: 200px;
 *   height: 20px;
 *   position: relative;
 * }
 * 
 * pxm-slider-track {
 *   display: block;
 *   width: 100%;
 *   height: 4px;
 *   background: #e2e8f0;
 *   border-radius: 2px;
 *   position: relative;
 * }
 * 
 * pxm-slider-range {
 *   display: block;
 *   height: 100%;
 *   background: #3b82f6;
 *   border-radius: inherit;
 *   position: absolute;
 *   transition: all 0.2s ease;
 * }
 * 
 * pxm-slider-thumb {
 *   display: block;
 *   width: 20px;
 *   height: 20px;
 *   background: #3b82f6;
 *   border: 2px solid white;
 *   border-radius: 50%;
 *   position: absolute;
 *   cursor: grab;
 *   transition: all 0.2s ease;
 *   transform: translate(-50%, -50%);
 * }
 * 
 * pxm-slider-thumb:hover {
 *   transform: translate(-50%, -50%) scale(1.1);
 * }
 * 
 * pxm-slider-thumb[data-dragging="true"] {
 *   cursor: grabbing;
 *   transform: translate(-50%, -50%) scale(1.2);
 * }
 * 
 * pxm-slider[data-disabled="true"] {
 *   opacity: 0.5;
 *   cursor: not-allowed;
 * }
 * 
 * pxm-slider[data-disabled="true"] pxm-slider-thumb {
 *   cursor: not-allowed;
 * }
 * 
 * pxm-slider[data-orientation="vertical"] {
 *   width: 20px;
 *   height: 200px;
 * }
 * 
 * pxm-slider[data-orientation="vertical"] pxm-slider-track {
 *   width: 4px;
 *   height: 100%;
 * }
 * ```
 * 
 * With Tailwind CSS:
 * ```html
 * <pxm-slider 
 *   class="relative w-48 h-5
 *          data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed
 *          data-[orientation=vertical]:w-5 data-[orientation=vertical]:h-48"
 *   min="0" max="100" value="50">
 *   <pxm-slider-track class="block w-full h-1 bg-gray-300 rounded-full relative top-2">
 *     <pxm-slider-range class="block h-full bg-blue-500 rounded-full absolute transition-all duration-200"></pxm-slider-range>
 *   </pxm-slider-track>
 *   <pxm-slider-thumb class="block w-5 h-5 bg-blue-500 border-2 border-white rounded-full absolute cursor-grab 
 *                             transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2
 *                             hover:scale-110 data-[dragging=true]:cursor-grabbing data-[dragging=true]:scale-120"></pxm-slider-thumb>
 * </pxm-slider>
 * ```
 * 
 * Consumer Styling Examples:
 * Target data attributes for styling, not ARIA attributes.
 * 
 * SSR / Hydration Support:
 * Use CSS to prevent hydration flash with opacity transitions.
 * 
 * Events:
 * - `pxm:slider:before-change` - Cancelable. Fired before thumb position changes.
 * - `pxm:slider:after-change` - Fired after thumb position changes.
 * - `pxm:slider:change` - Fired when slider value changes.
 * - `pxm:slider:thumb-drag-start` - Fired when thumb drag starts.
 * - `pxm:slider:thumb-drag-end` - Fired when thumb drag ends.
 * - `pxm:slider:value-commit` - Fired when value is committed (mouseup/keyup).
 * 
 * Accessibility:
 * This component implements the dual-attribute pattern:
 * - ARIA attributes (aria-valuemin, aria-valuemax, aria-valuenow, aria-disabled) for screen readers
 * - Data attributes (data-orientation, data-disabled, data-dragging) for CSS styling and JavaScript interaction
 * Additional ARIA attributes, labels, and roles should be added by the consumer as needed.
 */

import { parseAttributes, withErrorBoundary, setupKeyboardNav, type AttributeSchema } from '../core/component-utils';
import type { SliderConfig, SliderState } from './types';

const SLIDER_SCHEMA: AttributeSchema = {
  'min': { type: 'number', default: 0 },
  'max': { type: 'number', default: 100 },
  'step': { type: 'number', default: 1 },
  'value': { type: 'string', default: '50' },
  'orientation': { type: 'string', default: 'horizontal' },
  'disabled': { type: 'boolean', default: false },
  'form': { type: 'boolean', default: false },
  'name': { type: 'string', default: '' },
  'inverted': { type: 'boolean', default: false }
};

export class PxmSlider extends HTMLElement {
  private config: SliderConfig = {} as SliderConfig;
  private state: SliderState = {
    values: [50],
    isDragging: false,
    activeThumbIndex: -1,
    isAnimating: false
  };
  
  private trackElement?: HTMLElement;
  private rangeElement?: HTMLElement;
  private thumbElements: HTMLElement[] = [];
  private hiddenInputs: HTMLInputElement[] = [];
  
  private animationPromises = new Map<string, { resolve: () => void }>();
  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;

  static get observedAttributes(): string[] {
    return Object.keys(SLIDER_SCHEMA);
  }

  constructor() {
    super();
    // NO Shadow DOM - consumers control all styling
    // Only set functionally necessary attributes
    this.setAttribute('role', 'group');
  }

  connectedCallback(): void {
    withErrorBoundary(() => {
      // Apply only essential positioning styles for functionality
      if (!this.style.position) {
        this.style.position = 'relative';
        this.style.display = 'block';
        this.style.touchAction = 'none';
        this.style.userSelect = 'none';
      }
      
      this.config = parseAttributes(this, SLIDER_SCHEMA) as SliderConfig;
      this.setupSlider();
      this.updateState();
      this.observeChanges();
      
      // Ensure positioning happens after DOM is ready
      requestAnimationFrame(() => {
        this.updateThumbPositions();
        this.updateRangeElement();
      });
    })();
  }

  disconnectedCallback(): void {
    this.cleanup();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    
    const oldConfig = { ...this.config };
    this.config = parseAttributes(this, SLIDER_SCHEMA) as SliderConfig;
    
    // Handle value changes specially
    if (name === 'value' && newValue !== oldValue) {
      this.handleValueChange(oldConfig);
    } else {
      this.updateState();
    }
  }

  private setupSlider(): void {
    this.findElements();
    this.parseInitialValues();
    this.updateThumbElements();
    this.createFormInputs();
    this.setupEventListeners();
    this.setupKeyboardNavigation();
  }

  private findElements(): void {
    this.trackElement = this.querySelector('pxm-slider-track') as HTMLElement;
    this.rangeElement = this.querySelector('pxm-slider-range') as HTMLElement;
    this.thumbElements = Array.from(this.querySelectorAll('pxm-slider-thumb')) as HTMLElement[];
    
    if (!this.trackElement) {
      console.warn('PxmSlider: No pxm-slider-track found');
    }
  }

  private parseInitialValues(): void {
    const valueStr = this.config.value || '50';
    const values = valueStr.split(',').map(v => this.normalizeValue(parseFloat(v.trim())));
    this.state.values = values.length > 0 ? values : [this.config.min];
  }

  private normalizeValue(value: number): number {
    const { min, max, step } = this.config;
    
    // Clamp to min/max
    value = Math.max(min, Math.min(max, value));
    
    // Snap to step
    const steps = Math.round((value - min) / step);
    return min + (steps * step);
  }

  private createFormInputs(): void {
    if (!this.config.form || !this.config.name) return;
    
    // Remove existing hidden inputs
    this.hiddenInputs.forEach(input => input.remove());
    this.hiddenInputs = [];
    
    // Create hidden inputs for each value
    this.state.values.forEach((value, index) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = this.state.values.length > 1 ? this.config.name + '[' + index + ']' : this.config.name;
      input.value = value.toString();
      this.appendChild(input);
      this.hiddenInputs.push(input);
    });
  }

  private setupEventListeners(): void {
    this.setupTrackEventListeners();
    this.setupThumbEventListeners();
  }

  private setupTrackEventListeners(): void {
    if (!this.trackElement) return;
    
    // Track click handling
    this.trackElement.addEventListener('pointerdown', withErrorBoundary((event: PointerEvent) => {
      if (this.config.disabled) return;
      
      event.preventDefault();
      const rect = this.trackElement!.getBoundingClientRect();
      const percentage = this.getPercentageFromEvent(event, rect);
      const value = this.percentageToValue(percentage);
      
      // Find closest thumb or create new one if needed
      const thumbIndex = this.findClosestThumbIndex(value);
      this.setThumbValue(thumbIndex, value);
      this.startThumbDrag(thumbIndex, event);
    }));
  }

  private setupThumbEventListeners(): void {
    // Clear any existing listeners and add new ones
    this.thumbElements.forEach((thumb, index) => {
      // Remove existing listeners by cloning the element (removes all listeners)
      if (thumb.hasAttribute('data-listeners-attached')) {
        const newThumb = thumb.cloneNode(true) as HTMLElement;
        thumb.parentNode?.replaceChild(newThumb, thumb);
        this.thumbElements[index] = newThumb;
        thumb = newThumb;
      }
      
      // Add the pointer down event listener
      thumb.addEventListener('pointerdown', withErrorBoundary((event: PointerEvent) => {
        if (this.config.disabled) return;
        
        event.preventDefault();
        event.stopPropagation();
        this.startThumbDrag(index, event);
      }));
      
      thumb.setAttribute('data-listeners-attached', 'true');
    });
  }

  private setupKeyboardNavigation(): void {
    setupKeyboardNav(this, {
      'ArrowLeft': (event) => this.handleKeyboardMove(event, -1),
      'ArrowDown': (event) => this.handleKeyboardMove(event, -1),
      'ArrowRight': (event) => this.handleKeyboardMove(event, 1),
      'ArrowUp': (event) => this.handleKeyboardMove(event, 1),
      'Home': (event) => this.handleKeyboardMove(event, 'min'),
      'End': (event) => this.handleKeyboardMove(event, 'max'),
      'PageDown': (event) => this.handleKeyboardMove(event, -10),
      'PageUp': (event) => this.handleKeyboardMove(event, 10)
    });
    
    // Make focusable
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  private handleKeyboardMove(event: KeyboardEvent, direction: number | string): void {
    if (this.config.disabled) return;
    
    event.preventDefault();
    
    let thumbIndex = this.state.activeThumbIndex;
    if (thumbIndex === -1) {
      thumbIndex = 0; // Default to first thumb
    }
    
    const currentValue = this.state.values[thumbIndex];
    let newValue: number;
    
    if (direction === 'min') {
      newValue = this.config.min;
    } else if (direction === 'max') {
      newValue = this.config.max;
    } else {
      const stepSize = typeof direction === 'number' && Math.abs(direction) > 1 
        ? this.config.step * Math.abs(direction)
        : this.config.step;
      newValue = currentValue + (stepSize * Math.sign(direction as number));
    }
    
    this.setThumbValue(thumbIndex, newValue, true);
  }

  private getPercentageFromEvent(event: PointerEvent, rect: DOMRect): number {
    const isVertical = this.config.orientation === 'vertical';
    const dimension = isVertical ? rect.height : rect.width;
    const offset = isVertical ? event.clientY - rect.top : event.clientX - rect.left;
    
    let percentage = offset / dimension;
    
    // Invert for vertical or inverted sliders
    if (isVertical || this.config.inverted) {
      percentage = 1 - percentage;
    }
    
    return Math.max(0, Math.min(1, percentage));
  }

  private percentageToValue(percentage: number): number {
    const { min, max } = this.config;
    return this.normalizeValue(min + (percentage * (max - min)));
  }

  private valueToPercentage(value: number): number {
    const { min, max } = this.config;
    return (value - min) / (max - min);
  }

  private findClosestThumbIndex(value: number): number {
    if (this.state.values.length === 0) return 0;
    
    let closestIndex = 0;
    let closestDistance = Math.abs(this.state.values[0] - value);
    
    for (let i = 1; i < this.state.values.length; i++) {
      const distance = Math.abs(this.state.values[i] - value);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  }

  private async setThumbValue(thumbIndex: number, value: number, isKeyboard = false): Promise<void> {
    if (thumbIndex < 0 || thumbIndex >= this.state.values.length) return;
    
    const normalizedValue = this.normalizeValue(value);
    const oldValue = this.state.values[thumbIndex];
    
    if (normalizedValue === oldValue) return;
    
    const animationId = 'thumb-' + thumbIndex + '-' + Date.now();
    const thumbElement = this.thumbElements[thumbIndex];
    
    try {
      // Dispatch cancelable before event
      const beforeEvent = new CustomEvent('pxm:slider:before-change', {
        detail: {
          thumbIndex,
          thumbElement,
          oldValue,
          newValue: normalizedValue,
          percentage: this.valueToPercentage(normalizedValue),
          complete: () => this.resolveAnimation(animationId)
        },
        cancelable: true
      });

      const eventPrevented = !this.dispatchEvent(beforeEvent) || beforeEvent.defaultPrevented;

      if (eventPrevented) {
        // Wait for custom animation
        await this.createAnimationPromise(animationId);
      }

      // Update state
      this.state.values[thumbIndex] = normalizedValue;
      this.state.activeThumbIndex = thumbIndex;
      
      // Update DOM
      this.updateThumbPositions();
      this.updateRangeElement();
      this.updateFormInputs();
      this.updateAriaAttributes();

      // Dispatch after events
      this.dispatchEvent(new CustomEvent('pxm:slider:after-change', {
        detail: {
          thumbIndex,
          thumbElement,
          oldValue,
          newValue: normalizedValue,
          values: [...this.state.values]
        }
      }));

      this.dispatchEvent(new CustomEvent('pxm:slider:change', {
        detail: {
          value: this.state.values.length === 1 ? normalizedValue : this.state.values,
          values: [...this.state.values],
          thumbIndex
        },
        bubbles: true
      }));

      // Dispatch value commit for keyboard interactions
      if (isKeyboard) {
        this.dispatchEvent(new CustomEvent('pxm:slider:value-commit', {
          detail: {
            value: this.state.values.length === 1 ? normalizedValue : this.state.values,
            values: [...this.state.values],
            thumbIndex
          },
          bubbles: true
        }));
      }

    } catch (error) {
      console.warn('Error setting thumb value:', error);
    }
  }

  private startThumbDrag(thumbIndex: number, startEvent: PointerEvent): void {
    if (this.config.disabled || thumbIndex >= this.thumbElements.length) return;
    
    this.state.isDragging = true;
    this.state.activeThumbIndex = thumbIndex;
    
    const thumbElement = this.thumbElements[thumbIndex];
    const trackRect = this.trackElement!.getBoundingClientRect();
    
    // Set pointer capture
    thumbElement.setPointerCapture(startEvent.pointerId);
    
    // Update thumb state
    thumbElement.setAttribute('data-dragging', 'true');
    
    // Dispatch drag start event
    this.dispatchEvent(new CustomEvent('pxm:slider:thumb-drag-start', {
      detail: {
        thumbIndex,
        thumbElement,
        value: this.state.values[thumbIndex]
      },
      bubbles: true
    }));
    
    const handlePointerMove = withErrorBoundary((event: PointerEvent) => {
      event.preventDefault();
      
      const percentage = this.getPercentageFromEvent(event, trackRect);
      const value = this.percentageToValue(percentage);
      this.setThumbValue(thumbIndex, value);
    });
    
    const handlePointerUp = withErrorBoundary((event: PointerEvent) => {
      event.preventDefault();
      
      this.state.isDragging = false;
      thumbElement.removeAttribute('data-dragging');
      thumbElement.releasePointerCapture(event.pointerId);
      
      // Remove event listeners
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      
      // Dispatch drag end and value commit events
      this.dispatchEvent(new CustomEvent('pxm:slider:thumb-drag-end', {
        detail: {
          thumbIndex,
          thumbElement,
          value: this.state.values[thumbIndex]
        },
        bubbles: true
      }));
      
      this.dispatchEvent(new CustomEvent('pxm:slider:value-commit', {
        detail: {
          value: this.state.values.length === 1 ? this.state.values[0] : this.state.values,
          values: [...this.state.values],
          thumbIndex
        },
        bubbles: true
      }));
    });
    
    // Add event listeners
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  }

  private updateThumbElements(): void {
    // First, refresh our thumb elements list from DOM (includes HTML-defined thumbs)
    this.thumbElements = Array.from(this.querySelectorAll('pxm-slider-thumb')) as HTMLElement[];
    
    // Ensure we have the right number of thumbs
    while (this.thumbElements.length < this.state.values.length) {
      const thumb = document.createElement('pxm-slider-thumb');
      this.appendChild(thumb);
      this.thumbElements.push(thumb);
    }
    
    // Remove extra thumbs
    while (this.thumbElements.length > this.state.values.length) {
      const thumb = this.thumbElements.pop();
      if (thumb) {
        thumb.remove();
      }
    }
    
    // Setup thumb attributes
    this.thumbElements.forEach((thumb, index) => {
      thumb.setAttribute('role', 'slider');
      thumb.setAttribute('tabindex', '-1');
      thumb.setAttribute('data-thumb-index', index.toString());
    });
    
    // Re-setup event listeners for all thumbs
    this.setupThumbEventListeners();
    this.updateThumbPositions();
  }

  private updateThumbPositions(): void {
    this.thumbElements.forEach((thumb, index) => {
      const value = this.state.values[index];
      const percentage = this.valueToPercentage(value);
      
      const isVertical = this.config.orientation === 'vertical';
      const position = isVertical 
        ? (this.config.inverted ? percentage : 1 - percentage) * 100
        : percentage * 100;
      
      if (isVertical) {
        thumb.style.left = '';
        thumb.style.top = position + '%';
      } else {
        thumb.style.top = '';
        thumb.style.left = position + '%';
      }
      
      // Update thumb ARIA and data attributes
      thumb.setAttribute('aria-valuemin', this.config.min.toString());
      thumb.setAttribute('aria-valuemax', this.config.max.toString());
      thumb.setAttribute('aria-valuenow', value.toString());
      thumb.setAttribute('data-value', value.toString());
      
      // Add display value attribute for easy value rendering
      thumb.setAttribute('data-display-value', value.toString());
      thumb.setAttribute('data-thumb-index', index.toString());
      
      // Update any HTML content inside thumbs with data-value-display attributes
      // Any element with data-value-display inside this thumb gets updated with this thumb's value
      const valueDisplayElements = thumb.querySelectorAll('[data-value-display]');
      valueDisplayElements.forEach((element) => {
        element.textContent = value.toString();
      });
      
      if (index === this.state.activeThumbIndex) {
        thumb.setAttribute('data-active', 'true');
      } else {
        thumb.removeAttribute('data-active');
      }
      
      // Update dragging state styles
      if (thumb.hasAttribute('data-dragging')) {
        thumb.style.cursor = 'grabbing';
      } else {
        thumb.style.cursor = 'grab';
      }
    });
  }

  private updateRangeElement(): void {
    if (!this.rangeElement) return;
    
    const isVertical = this.config.orientation === 'vertical';
    let startPercentage: number;
    let endPercentage: number;
    
    if (this.state.values.length === 1) {
      // Single thumb: range goes from min to thumb position
      startPercentage = 0; // Always start from minimum
      endPercentage = this.valueToPercentage(this.state.values[0]);
    } else {
      // Multiple thumbs: range goes between thumbs
      const values = [...this.state.values].sort((a, b) => a - b);
      startPercentage = this.valueToPercentage(values[0]);
      endPercentage = this.valueToPercentage(values[values.length - 1]);
    }
    
    if (isVertical) {
      const start = this.config.inverted ? startPercentage : 1 - endPercentage;
      const size = endPercentage - startPercentage;
      
      this.rangeElement.style.left = '';
      this.rangeElement.style.width = '';
      this.rangeElement.style.bottom = (start * 100) + '%';
      this.rangeElement.style.height = (size * 100) + '%';
    } else {
      this.rangeElement.style.top = '';
      this.rangeElement.style.height = '';
      this.rangeElement.style.left = (startPercentage * 100) + '%';
      this.rangeElement.style.width = ((endPercentage - startPercentage) * 100) + '%';
    }
  }

  private updateFormInputs(): void {
    this.hiddenInputs.forEach((input, index) => {
      if (index < this.state.values.length) {
        input.value = this.state.values[index].toString();
      }
    });
  }

  private updateAriaAttributes(): void {
    // Update main slider ARIA attributes
    this.setAttribute('aria-valuemin', this.config.min.toString());
    this.setAttribute('aria-valuemax', this.config.max.toString());
    
    if (this.state.values.length === 1) {
      this.setAttribute('aria-valuenow', this.state.values[0].toString());
    } else {
      this.setAttribute('aria-valuetext', this.state.values.join(', '));
    }
    
    if (this.config.disabled) {
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute('aria-disabled');
    }
  }

  private updateState(): void {
    // Update data attributes for styling
    this.setAttribute('data-orientation', this.config.orientation);
    this.setAttribute('data-disabled', this.config.disabled.toString());
    this.setAttribute('data-min', this.config.min.toString());
    this.setAttribute('data-max', this.config.max.toString());
    this.setAttribute('data-step', this.config.step.toString());
    
    if (this.config.inverted) {
      this.setAttribute('data-inverted', 'true');
    } else {
      this.removeAttribute('data-inverted');
    }
    
    // Update focus handling
    if (this.config.disabled) {
      this.setAttribute('tabindex', '-1');
    } else {
      this.setAttribute('tabindex', '0');
    }
    
    this.updateAriaAttributes();
    this.updateThumbPositions();
    this.updateRangeElement();
    this.createFormInputs();
  }

  private handleValueChange(oldConfig: SliderConfig): void {
    const oldValueStr = oldConfig.value || '50';
    const newValueStr = this.config.value || '50';
    
    if (oldValueStr === newValueStr) return;
    
    this.parseInitialValues();
    this.updateThumbElements();
    this.updateState();
  }

  private observeChanges(): void {
    // Observe thumb elements being added/removed
    this.mutationObserver = new MutationObserver(withErrorBoundary((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const thumbs = Array.from(this.querySelectorAll('pxm-slider-thumb')) as HTMLElement[];
          if (thumbs.length !== this.thumbElements.length) {
            this.findElements();
            this.setupEventListeners();
          }
        }
      });
    }));
    
    this.mutationObserver.observe(this, { childList: true, subtree: true });
    
    // Observe size changes for responsive handling
    this.resizeObserver = new ResizeObserver(withErrorBoundary(() => {
      this.updateThumbPositions();
      this.updateRangeElement();
    }));
    
    this.resizeObserver.observe(this);
  }

  private cleanup(): void {
    this.state.isDragging = false;
    this.state.isAnimating = false;
    
    // Clean up animation promises
    this.animationPromises.forEach(({ resolve }) => resolve());
    this.animationPromises.clear();
    
    // Clean up observers
    this.mutationObserver?.disconnect();
    this.resizeObserver?.disconnect();
    
    // Remove hidden inputs
    this.hiddenInputs.forEach(input => input.remove());
    this.hiddenInputs = [];
  }

  /**
   * Create a promise that resolves when animation completes
   */
  private createAnimationPromise(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.animationPromises.set(id, { resolve });
    });
  }

  /**
   * Resolve an animation promise
   */
  private resolveAnimation(id: string): void {
    const promise = this.animationPromises.get(id);
    if (promise) {
      promise.resolve();
      this.animationPromises.delete(id);
    }
  }

  // Public API
  /**
   * Get the current value(s)
   */
  get value(): number | number[] {
    return this.state.values.length === 1 ? this.state.values[0] : [...this.state.values];
  }

  /**
   * Set the current value(s)
   */
  set value(value: number | number[]) {
    let valueStr: string;
    
    if (Array.isArray(value)) {
      valueStr = value.join(',');
    } else {
      valueStr = value.toString();
    }
    
    this.setAttribute('value', valueStr);
  }

  /**
   * Get the disabled state
   */
  get disabled(): boolean {
    return this.config.disabled;
  }

  /**
   * Set the disabled state
   */
  set disabled(value: boolean) {
    this.setAttribute('disabled', String(value));
  }

  /**
   * Get the form integration state
   */
  get form(): boolean {
    return this.config.form;
  }

  /**
   * Set the form integration state
   */
  set form(value: boolean) {
    this.setAttribute('form', String(value));
  }

  /**
   * Get the form name
   */
  get name(): string {
    return this.config.name;
  }

  /**
   * Set the form name
   */
  set name(value: string) {
    this.setAttribute('name', value);
  }

  /**
   * Get the minimum value
   */
  get min(): number {
    return this.config.min;
  }

  /**
   * Set the minimum value
   */
  set min(value: number) {
    this.setAttribute('min', String(value));
  }

  /**
   * Get the maximum value
   */
  get max(): number {
    return this.config.max;
  }

  /**
   * Set the maximum value
   */
  set max(value: number) {
    this.setAttribute('max', String(value));
  }

  /**
   * Get the step value
   */
  get step(): number {
    return this.config.step;
  }

  /**
   * Set the step value
   */
  set step(value: number) {
    this.setAttribute('step', String(value));
  }

  /**
   * Get the orientation
   */
  get orientation(): 'horizontal' | 'vertical' {
    return this.config.orientation as 'horizontal' | 'vertical';
  }

  /**
   * Set the orientation
   */
  set orientation(value: 'horizontal' | 'vertical') {
    this.setAttribute('orientation', value);
  }

  /**
   * Add a new thumb at the specified value
   */
  public addThumb(value: number): void {
    const normalizedValue = this.normalizeValue(value);
    this.state.values.push(normalizedValue);
    this.updateThumbElements();
    this.updateState();
  }

  /**
   * Remove a thumb by index
   */
  public removeThumb(index: number): void {
    if (index >= 0 && index < this.state.values.length && this.state.values.length > 1) {
      this.state.values.splice(index, 1);
      this.updateThumbElements();
      this.updateState();
    }
  }

  /**
   * Check if the slider is currently being dragged
   */
  public isDragging(): boolean {
    return this.state.isDragging;
  }

  /**
   * Get the current values as an array
   */
  public getValues(): number[] {
    return [...this.state.values];
  }

  /**
   * Set multiple values at once
   */
  public setValues(values: number[]): void {
    this.value = values;
  }

  /**
   * Focus a specific thumb by index
   */
  public focusThumb(index: number): void {
    if (index >= 0 && index < this.thumbElements.length) {
      this.state.activeThumbIndex = index;
      this.updateThumbPositions();
      this.focus();
    }
  }
}

// Sub-components (placeholders managed by main slider)
export class PxmSliderTrack extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback(): void {
    // Track element - placeholder managed by parent slider
    this.setAttribute('data-slider-track', 'true');
    
    // Apply only essential positioning styles for functionality
    if (!this.style.position) {
      this.style.position = 'absolute';
      this.style.top = '50%';
      this.style.left = '0';
      this.style.right = '0';
      this.style.transform = 'translateY(-50%)';
    }
  }
}

export class PxmSliderRange extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback(): void {
    // Range element - placeholder managed by parent slider
    this.setAttribute('data-slider-range', 'true');
    
    // Apply only essential positioning styles for functionality
    if (!this.style.position) {
      this.style.position = 'absolute';
      this.style.height = '100%';
    }
  }
}

export class PxmSliderThumb extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback(): void {
    // Thumb element - placeholder managed by parent slider
    this.setAttribute('data-slider-thumb', 'true');
    
    // Apply only essential positioning styles for functionality
    if (!this.style.position) {
      this.style.position = 'absolute';
      this.style.top = '50%';
      this.style.transform = 'translate(-50%, -50%)';
      this.style.cursor = 'grab';
      this.style.zIndex = '1';
    }
  }
}

// Register the custom elements
customElements.define('pxm-slider', PxmSlider);
customElements.define('pxm-slider-track', PxmSliderTrack);
customElements.define('pxm-slider-range', PxmSliderRange);
customElements.define('pxm-slider-thumb', PxmSliderThumb);

// Make available globally for advanced usage
if (typeof window !== 'undefined') {
  (window as any).PxmSlider = PxmSlider;
  (window as any).PxmSliderTrack = PxmSliderTrack;
  (window as any).PxmSliderRange = PxmSliderRange;
  (window as any).PxmSliderThumb = PxmSliderThumb;
}

// Export types
export type { SliderConfig, SliderState, SliderEventDetail, SliderValueCommitEventDetail, SliderThumbDragEventDetail } from './types';

/**
 * Public TypeScript interface for the Slider Component
 */
export interface PxmSlider extends HTMLElement {
  /**
   * Get/set the current value(s)
   */
  value: number | number[];
  
  /**
   * Get/set the disabled state
   */
  disabled: boolean;

  /**
   * Get/set the form integration state
   */
  form: boolean;

  /**
   * Get/set the form name
   */
  name: string;

  /**
   * Get/set the minimum value
   */
  min: number;

  /**
   * Get/set the maximum value
   */
  max: number;

  /**
   * Get/set the step value
   */
  step: number;

  /**
   * Get/set the orientation
   */
  orientation: 'horizontal' | 'vertical';

  /**
   * Add a new thumb at the specified value
   */
  addThumb(value: number): void;

  /**
   * Remove a thumb by index
   */
  removeThumb(index: number): void;

  /**
   * Check if the slider is currently being dragged
   */
  isDragging(): boolean;

  /**
   * Get the current values as an array
   */
  getValues(): number[];

  /**
   * Set multiple values at once
   */
  setValues(values: number[]): void;

  /**
   * Focus a specific thumb by index
   */
  focusThumb(index: number): void;
}

/**
 * Public TypeScript interface for Slider Track
 */
export interface PxmSliderTrack extends HTMLElement {}

/**
 * Public TypeScript interface for Slider Range
 */
export interface PxmSliderRange extends HTMLElement {}

/**
 * Public TypeScript interface for Slider Thumb
 */
export interface PxmSliderThumb extends HTMLElement {} 