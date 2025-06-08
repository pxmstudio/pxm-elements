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
export declare function parseAttributes(element: HTMLElement, schema: AttributeSchema): Record<string, any>;
/**
 * Setup keyboard navigation with a simple handler map
 */
export declare function setupKeyboardNav(element: HTMLElement, handlers: Record<string, (event: KeyboardEvent) => void>): void;
/**
 * Simple ARIA attribute helper
 */
export declare function setAriaAttributes(element: HTMLElement, attributes: Record<string, string>): void;
/**
 * Cache DOM queries to avoid repeated selections
 */
export declare function createQueryCache<T extends Element = Element>(): {
    query(selector: string, element?: ParentNode): T | null;
    queryAll(selector: string, element?: ParentNode): NodeListOf<T>;
    clear(): void;
};
/**
 * Simple error boundary for component failures
 */
export declare function withErrorBoundary<T extends Function>(fn: T, fallback?: () => void): T;
