/**
 * Tests for PXM Tabs Component
 * Simple tests focused on core functionality
 */

import { describe, test, expect, beforeEach } from 'vitest';

// Import component to register it
import '../src/tabs/index';

describe('PxmTabs', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('renders and initializes correctly', () => {
    document.body.innerHTML = `
      <pxm-tabs>
        <pxm-triggers>
          <button data-tab="tab1">Tab 1</button>
          <button data-tab="tab2">Tab 2</button>
        </pxm-triggers>
        <pxm-panel data-tab="tab1">Content 1</pxm-panel>
        <pxm-panel data-tab="tab2">Content 2</pxm-panel>
      </pxm-tabs>
    `;

    const tabs = document.querySelector('pxm-tabs');
    const triggersWrap = document.querySelector('pxm-triggers');
    const triggers = document.querySelectorAll('[data-tab]');
    const panels = document.querySelectorAll('pxm-panel');
    
    expect(tabs).toBeTruthy();
    expect(triggersWrap?.getAttribute('role')).toBe('tablist');
    expect(triggers[0].getAttribute('role')).toBe('tab');
    expect(panels[0].getAttribute('role')).toBe('tabpanel');
  });

  test('activates first tab by default', async () => {
    document.body.innerHTML = `
      <pxm-tabs>
        <pxm-triggers>
          <button data-tab="tab1">Tab 1</button>
          <button data-tab="tab2">Tab 2</button>
        </pxm-triggers>
        <pxm-panel data-tab="tab1">Content 1</pxm-panel>
        <pxm-panel data-tab="tab2">Content 2</pxm-panel>
      </pxm-tabs>
    `;

    // Wait for component to initialize
    await new Promise(resolve => setTimeout(resolve, 10));

    const trigger1 = document.querySelector('[data-tab="tab1"]');
    const trigger2 = document.querySelector('[data-tab="tab2"]');
    const panel1 = document.querySelector('pxm-panel[data-tab="tab1"]');
    const panel2 = document.querySelector('pxm-panel[data-tab="tab2"]');
    
    expect(trigger1?.getAttribute('aria-selected')).toBe('true');
    expect(trigger2?.getAttribute('aria-selected')).toBe('false');
    expect(panel1?.getAttribute('aria-hidden')).toBe('false');
    expect(panel2?.getAttribute('aria-hidden')).toBe('true');
  });

  test('switches tabs on click', async () => {
    document.body.innerHTML = `
      <pxm-tabs>
        <pxm-triggers>
          <button data-tab="tab1">Tab 1</button>
          <button data-tab="tab2">Tab 2</button>
        </pxm-triggers>
        <pxm-panel data-tab="tab1">Content 1</pxm-panel>
        <pxm-panel data-tab="tab2">Content 2</pxm-panel>
      </pxm-tabs>
    `;

    await new Promise(resolve => setTimeout(resolve, 10));

    const trigger2 = document.querySelector('[data-tab="tab2"]') as HTMLElement;
    const panel1 = document.querySelector('pxm-panel[data-tab="tab1"]');
    const panel2 = document.querySelector('pxm-panel[data-tab="tab2"]');
    
    // Click second tab
    trigger2.click();
    
    expect(trigger2.getAttribute('aria-selected')).toBe('true');
    expect(panel1?.getAttribute('aria-hidden')).toBe('true');
    expect(panel2?.getAttribute('aria-hidden')).toBe('false');
  });

  test('handles keyboard navigation', async () => {
    document.body.innerHTML = `
      <pxm-tabs>
        <pxm-triggers>
          <button data-tab="tab1">Tab 1</button>
          <button data-tab="tab2">Tab 2</button>
          <button data-tab="tab3">Tab 3</button>
        </pxm-triggers>
        <pxm-panel data-tab="tab1">Content 1</pxm-panel>
        <pxm-panel data-tab="tab2">Content 2</pxm-panel>
        <pxm-panel data-tab="tab3">Content 3</pxm-panel>
      </pxm-tabs>
    `;

    await new Promise(resolve => setTimeout(resolve, 10));

    const trigger1 = document.querySelector('[data-tab="tab1"]') as HTMLElement;
    const trigger2 = document.querySelector('[data-tab="tab2"]') as HTMLElement;
    const trigger3 = document.querySelector('[data-tab="tab3"]') as HTMLElement;
    
    // Focus first trigger
    trigger1.focus();
    
    // Test ArrowRight navigation
    const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
    trigger1.dispatchEvent(rightEvent);
    
    expect(document.activeElement).toBe(trigger2);
    
    // Test Home key
    const homeEvent = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
    trigger2.dispatchEvent(homeEvent);
    
    expect(document.activeElement).toBe(trigger1);
    
    // Test End key
    const endEvent = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
    trigger1.dispatchEvent(endEvent);
    
    expect(document.activeElement).toBe(trigger3);
  });

  test('respects data-initial attribute', async () => {
    document.body.innerHTML = `
      <pxm-tabs data-initial="tab2">
        <pxm-triggers>
          <button data-tab="tab1">Tab 1</button>
          <button data-tab="tab2">Tab 2</button>
        </pxm-triggers>
        <pxm-panel data-tab="tab1">Content 1</pxm-panel>
        <pxm-panel data-tab="tab2">Content 2</pxm-panel>
      </pxm-tabs>
    `;

    await new Promise(resolve => setTimeout(resolve, 10));

    const trigger1 = document.querySelector('[data-tab="tab1"]');
    const trigger2 = document.querySelector('[data-tab="tab2"]');
    const panel1 = document.querySelector('pxm-panel[data-tab="tab1"]');
    const panel2 = document.querySelector('pxm-panel[data-tab="tab2"]');
    
    expect(trigger1?.getAttribute('aria-selected')).toBe('false');
    expect(trigger2?.getAttribute('aria-selected')).toBe('true');
    expect(panel1?.getAttribute('aria-hidden')).toBe('true');
    expect(panel2?.getAttribute('aria-hidden')).toBe('false');
  });
}); 