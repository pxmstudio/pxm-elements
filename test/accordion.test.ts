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
    const content = document.querySelector('pxm-accordion-content') as HTMLElement;
    
    expect(item?.getAttribute('active')).toBe('false');
    expect(content.style.display).not.toBe('block');
    expect(content.style.opacity).not.toBe('1');

    // Click trigger
    trigger.click();
    await new Promise(resolve => setTimeout(resolve, 60)); // Wait for animation
    expect(item).not.toBeNull();
    if (item) {
      expect(item.getAttribute('active')).toBe('true');
    }
    expect(content.style.display).toBe('block');
    expect(content.style.opacity).toBe('1');

    // Click again to close
    trigger.click();
    await new Promise(resolve => setTimeout(resolve, 60)); // Wait for animation
    expect(item).not.toBeNull();
    if (item) {
      expect(item.getAttribute('active')).toBe('false');
    }
    expect(content.style.display).toBe('none');
    expect(content.style.opacity).toBe('0');
  });

  test('public API: expandItem, collapseItem, toggleItem', async () => {
    document.body.innerHTML = `
      <pxm-accordion>
        <pxm-accordion-item>
          <pxm-accordion-trigger>Title 1</pxm-accordion-trigger>
          <pxm-accordion-content>Content 1</pxm-accordion-content>
        </pxm-accordion-item>
      </pxm-accordion>
    `;
    await new Promise(resolve => setTimeout(resolve, 10));
    const accordion = document.querySelector('pxm-accordion') as any;
    const item = document.querySelector('pxm-accordion-item');
    const content = document.querySelector('pxm-accordion-content') as HTMLElement;

    // Expand via API
    await accordion.expandItem(0);
    await new Promise(resolve => setTimeout(resolve, 60)); // Wait for animation
    expect(item).not.toBeNull();
    if (item) {
      expect(item.getAttribute('active')).toBe('true');
    }
    expect(content.style.display).toBe('block');
    expect(content.style.opacity).toBe('1');

    // Collapse via API
    await accordion.collapseItem(0);
    await new Promise(resolve => setTimeout(resolve, 60)); // Wait for animation
    expect(item).not.toBeNull();
    if (item) {
      expect(item.getAttribute('active')).toBe('false');
    }
    expect(content.style.display).toBe('none');
    expect(content.style.opacity).toBe('0');

    // Toggle via API
    await accordion.toggleItem(0);
    await new Promise(resolve => setTimeout(resolve, 60)); // Wait for animation
    expect(item).not.toBeNull();
    if (item) {
      expect(item.getAttribute('active')).toBe('true');
    }
    expect(content.style.display).toBe('block');
    expect(content.style.opacity).toBe('1');
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
    await new Promise(resolve => setTimeout(resolve, 60)); // Wait for animation
    expect(item?.getAttribute('active')).toBe('true');
    
    // Test Space key (should toggle back)
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    trigger.dispatchEvent(spaceEvent);
    await new Promise(resolve => setTimeout(resolve, 60)); // Wait for animation
    expect(item?.getAttribute('active')).toBe('false');
  });

  test('respects allow-multiple attribute (false)', async () => {
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
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(items[0].getAttribute('active')).toBe('true');
    
    // Open second item (should close first)
    triggers[1].click();
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(items[0].getAttribute('active')).toBe('false');
    expect(items[1].getAttribute('active')).toBe('true');
  });

  test('respects allow-multiple attribute (true)', async () => {
    document.body.innerHTML = `
      <pxm-accordion allow-multiple="true">
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
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(items[0].getAttribute('active')).toBe('true');
    
    // Open second item (should NOT close first)
    triggers[1].click();
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(items[0].getAttribute('active')).toBe('true');
    expect(items[1].getAttribute('active')).toBe('true');
  });

  test('edge cases: toggling already open/closed, rapid toggling', async () => {
    document.body.innerHTML = `
      <pxm-accordion>
        <pxm-accordion-item>
          <pxm-accordion-trigger>Title 1</pxm-accordion-trigger>
          <pxm-accordion-content>Content 1</pxm-accordion-content>
        </pxm-accordion-item>
      </pxm-accordion>
    `;
    await new Promise(resolve => setTimeout(resolve, 10));
    const accordion = document.querySelector('pxm-accordion') as any;
    const item = document.querySelector('pxm-accordion-item');
    const content = document.querySelector('pxm-accordion-content') as HTMLElement;

    // Toggle open
    await accordion.expandItem(0);
    expect(item).not.toBeNull();
    if (item) {
      expect(item.getAttribute('active')).toBe('true');
    }
    // Toggle open again (should remain open)
    await accordion.expandItem(0);
    expect(item).not.toBeNull();
    if (item) {
      expect(item.getAttribute('active')).toBe('true');
    }
    // Toggle close
    await accordion.collapseItem(0);
    expect(item).not.toBeNull();
    if (item) {
      expect(item.getAttribute('active')).toBe('false');
    }
    // Toggle close again (should remain closed)
    await accordion.collapseItem(0);
    expect(item).not.toBeNull();
    if (item) {
      expect(item.getAttribute('active')).toBe('false');
    }

    // Rapid toggling
    accordion.toggleItem(0);
    accordion.toggleItem(0);
    accordion.toggleItem(0);
    await new Promise(resolve => setTimeout(resolve, 50));
    // Should end up open
    expect(item).not.toBeNull();
    if (item) {
      expect(item.getAttribute('active')).toBe('true');
    }
    expect(content.style.display).toBe('block');
    expect(content.style.opacity).toBe('1');
  });
}); 