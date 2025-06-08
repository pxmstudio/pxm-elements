/**
 * Lightweight utilities for PXM components
 * Focused on simplicity and reducing code duplication
 */

export interface AttributeSchema {
  [key: string]: {
    type: 'boolean' | 'number' | 'string';
    default: any;
    min?: number;
    max?: number;
  };
}

/**
 * Parse component attributes based on a simple schema
 */
export function parseAttributes(element: HTMLElement, schema: AttributeSchema): Record<string, any> {
  const config: Record<string, any> = {};
  
  for (const [attr, definition] of Object.entries(schema)) {
    const value = element.getAttribute(attr);
    
    if (value === null) {
      config[attr] = definition.default;
      continue;
    }
    
    switch (definition.type) {
      case 'boolean':
        config[attr] = value === 'true';
        break;
      case 'number':
        const num = parseInt(value, 10);
        config[attr] = isNaN(num) ? definition.default : 
          Math.min(Math.max(num, definition.min ?? -Infinity), definition.max ?? Infinity);
        break;
      default:
        config[attr] = value;
    }
  }
  
  return config;
}

/**
 * Setup keyboard navigation with a simple handler map
 */
export function setupKeyboardNav(element: HTMLElement, handlers: Record<string, (event: KeyboardEvent) => void>): void {
  element.addEventListener('keydown', (event: KeyboardEvent) => {
    const handler = handlers[event.key];
    if (handler) {
      handler(event);
    }
  });
}

/**
 * Simple ARIA attribute helper
 */
export function setAriaAttributes(element: HTMLElement, attributes: Record<string, string>): void {
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
}

/**
 * Cache DOM queries to avoid repeated selections
 */
export function createQueryCache<T extends Element = Element>() {
  const cache = new Map<string, T | NodeListOf<T> | null>();
  
  return {
    query(selector: string, element: ParentNode = document): T | null {
      if (!cache.has(selector)) {
        cache.set(selector, element.querySelector<T>(selector));
      }
      return cache.get(selector) as T | null;
    },
    
    queryAll(selector: string, element: ParentNode = document): NodeListOf<T> {
      if (!cache.has(selector)) {
        cache.set(selector, element.querySelectorAll<T>(selector));
      }
      return cache.get(selector) as NodeListOf<T>;
    },
    
    clear() {
      cache.clear();
    }
  };
}

/**
 * Simple error boundary for component failures
 */
export function withErrorBoundary<T extends Function>(fn: T, fallback?: () => void): T {
  return ((...args: any[]) => {
    try {
      return fn(...args);
    } catch (error) {
      console.warn('Component error:', error);
      fallback?.();
    }
  }) as any;
} 