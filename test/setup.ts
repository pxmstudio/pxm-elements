/**
 * Test setup for PXM Elements
 * Configures jsdom environment for web component testing
 */

import { beforeEach } from 'vitest';

// Setup custom elements support
beforeEach(() => {
  // Clean up DOM before each test
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  
  // Reset any custom element definitions if needed
  // Note: customElements.define() can't be undone, so we just start fresh
});

// Mock console.warn for cleaner test output
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  // Only show warnings that aren't from our error boundaries
  if (!args[0]?.includes?.('Component error:')) {
    originalWarn(...args);
  }
}; 