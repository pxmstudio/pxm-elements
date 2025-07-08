import { withErrorBoundary } from '../../core/component-utils';

/**
 * Base class for all PXM Select sub-components
 * Provides common functionality for finding parent select and error handling
 */
export abstract class BaseSelectComponent extends HTMLElement {
  protected selectRoot?: HTMLElement;
  protected initialized = false;

  constructor() {
    super();
  }

  connectedCallback(): void {
    withErrorBoundary(() => {
      if (this.initialized) return;
      this.initialize();
    })();
  }

  disconnectedCallback(): void {
    this.cleanup();
  }

  protected abstract initialize(): void;
  protected abstract cleanup(): void;

  protected findSelectRoot(): void {
    this.selectRoot = this.closest('pxm-select') as HTMLElement;
    if (!this.selectRoot) {
      console.warn(`${this.constructor.name} must be inside a pxm-select element`);
    }
  }

  protected getSelectInstance(): any {
    return this.selectRoot ? (this.selectRoot as any).selectInstance : null;
  }

  protected safeSelectCall(methodName: string, ...args: any[]): any {
    const selectInstance = this.getSelectInstance();
    if (selectInstance?.[methodName]) {
      return selectInstance[methodName](...args);
    }
    return null;
  }
} 