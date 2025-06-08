/**
 * Tests for PXM Accordion Component
 * Simple tests focused on core functionality
 */

import { describe, test, expect, beforeEach } from 'vitest';

// Import component to register it
import '../src/accordion/index';

describe('PxmAccordion', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('renders and initializes correctly', () => {
    document.body.innerHTML = `
      <pxm-accordion>
        <pxm-accordion-item>
          <pxm-accordion-trigger>Title 1</pxm-accordion-trigger>
          <pxm-accordion-content>Content 1</pxm-accordion-content>
        </pxm-accordion-item>
      </pxm-accordion>
    `;

    const accordion = document.querySelector('pxm-accordion');
    const trigger = document.querySelector('pxm-accordion-trigger');
    
    expect(accordion).toBeTruthy();
    expect(trigger).toBeTruthy();
    expect(accordion?.getAttribute('role')).toBe('list');
    expect(trigger?.getAttribute('role')).toBe('button');
  });

  test('toggles item on click', async () => {
    document.body.innerHTML = `
      <pxm-accordion>
        <pxm-accordion-item>
          <pxm-accordion-trigger>Title 1</pxm-accordion-trigger>
          <pxm-accordion-content>Content 1</pxm-accordion-content>
        </pxm-accordion-item>
      </pxm-accordion>
    `;

    // Wait for component to initialize
    await new Promise(resolve => setTimeout(resolve, 10));

    const trigger = document.querySelector('pxm-accordion-trigger') as HTMLElement;
    const item = document.querySelector('pxm-accordion-item');
    
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(item?.getAttribute('active')).toBe('false');

    // Click trigger
    trigger.click();
    
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(item?.getAttribute('active')).toBe('true');
  });

  test('handles keyboard navigation', async () => {
    document.body.innerHTML = `
      <pxm-accordion>
        <pxm-accordion-item>
          <pxm-accordion-trigger>Title 1</pxm-accordion-trigger>
          <pxm-accordion-content>Content 1</pxm-accordion-content>
        </pxm-accordion-item>
      </pxm-accordion>
    `;

    await new Promise(resolve => setTimeout(resolve, 10));

    const trigger = document.querySelector('pxm-accordion-trigger') as HTMLElement;
    const item = document.querySelector('pxm-accordion-item');
    
    // Test Enter key
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    trigger.dispatchEvent(enterEvent);
    
    expect(item?.getAttribute('active')).toBe('true');
    
    // Test Space key (should toggle back)
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    trigger.dispatchEvent(spaceEvent);
    
    expect(item?.getAttribute('active')).toBe('false');
  });

  test('respects allow-multiple attribute', async () => {
    document.body.innerHTML = `
      <pxm-accordion allow-multiple="false">
        <pxm-accordion-item>
          <pxm-accordion-trigger>Title 1</pxm-accordion-trigger>
          <pxm-accordion-content>Content 1</pxm-accordion-content>
        </pxm-accordion-item>
        <pxm-accordion-item>
          <pxm-accordion-trigger>Title 2</pxm-accordion-trigger>
          <pxm-accordion-content>Content 2</pxm-accordion-content>
        </pxm-accordion-item>
      </pxm-accordion>
    `;

    await new Promise(resolve => setTimeout(resolve, 10));

    const triggers = document.querySelectorAll('pxm-accordion-trigger') as NodeListOf<HTMLElement>;
    const items = document.querySelectorAll('pxm-accordion-item');
    
    // Open first item
    triggers[0].click();
    expect(items[0].getAttribute('active')).toBe('true');
    
    // Open second item (should close first)
    triggers[1].click();
    expect(items[0].getAttribute('active')).toBe('false');
    expect(items[1].getAttribute('active')).toBe('true');
  });
}); 