import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../src/tooltip/index';

describe('PXM Tooltip Component', () => {
  let container: HTMLElement;
  let tooltip: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <pxm-tooltip>
        <pxm-tooltip-trigger>
          <button>Test button</button>
        </pxm-tooltip-trigger>
        <pxm-tooltip-content>
          Test tooltip content
        </pxm-tooltip-content>
      </pxm-tooltip>
    `;
    document.body.appendChild(container);
    tooltip = container.querySelector('pxm-tooltip')!;
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should be defined', () => {
    expect(customElements.get('pxm-tooltip')).toBeDefined();
    expect(customElements.get('pxm-tooltip-trigger')).toBeDefined();
    expect(customElements.get('pxm-tooltip-content')).toBeDefined();
    expect(customElements.get('pxm-tooltip-arrow')).toBeDefined();
  });

  it('should register custom elements', () => {
    expect(tooltip).toBeInstanceOf(HTMLElement);
    expect(tooltip.tagName.toLowerCase()).toBe('pxm-tooltip');
  });

  it('should have default attributes', () => {
    expect(tooltip.getAttribute('data-side')).toBe('top');
    expect(tooltip.getAttribute('data-state')).toBe('closed');
  });

  it('should set side attribute correctly', () => {
    tooltip.setAttribute('side', 'bottom');
    // Wait for attribute change to be processed
    setTimeout(() => {
      expect(tooltip.getAttribute('data-side')).toBe('bottom');
    }, 0);
  });

  it('should have proper ARIA attributes', () => {
    const content = tooltip.querySelector('pxm-tooltip-content');
    expect(content?.getAttribute('role')).toBe('tooltip');
  });

  it('should be accessible through window global', () => {
    expect((window as any).PxmTooltip).toBeDefined();
    expect((window as any).PxmTooltipTrigger).toBeDefined();
    expect((window as any).PxmTooltipContent).toBeDefined();
    expect((window as any).PxmTooltipArrow).toBeDefined();
  });

  it('should support programmatic control', () => {
    const tooltipElement = tooltip as any;
    expect(typeof tooltipElement.showTooltip).toBe('function');
    expect(typeof tooltipElement.hideTooltip).toBe('function');
    expect(typeof tooltipElement.isAnimating).toBe('function');
    expect(typeof tooltipElement.removeDefaultAnimations).toBe('function');
  });

  it('should have proper getter/setter properties', () => {
    const tooltipElement = tooltip as any;
    
    // Test side property
    tooltipElement.side = 'left';
    expect(tooltipElement.side).toBe('left');
    
    // Test disabled property
    tooltipElement.disabled = true;
    expect(tooltipElement.disabled).toBe(true);
    
    // Test open property
    expect(typeof tooltipElement.open).toBe('boolean');
  });

  it('should handle disabled state', () => {
    tooltip.setAttribute('disabled', 'true');
    setTimeout(() => {
      expect(tooltip.getAttribute('data-disabled')).toBe('true');
      expect(tooltip.getAttribute('aria-disabled')).toBe('true');
    }, 0);
  });

  it('should emit events', async () => {
    const tooltipElement = tooltip as any;
    
    const eventPromise = new Promise<CustomEvent>((resolve) => {
      tooltip.addEventListener('pxm:tooltip:show', (e) => {
        resolve(e as CustomEvent);
      });
    });

    // Programmatically show tooltip
    tooltipElement.showTooltip();

    const event = await eventPromise;
    expect(event).toBeInstanceOf(CustomEvent);
    expect(event.type).toBe('pxm:tooltip:show');
  });
}); 