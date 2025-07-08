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
    const triggers = document.querySelectorAll('pxm-triggers [data-tab]');
    const panels = document.querySelectorAll('pxm-panel');
    
    expect(tabs).toBeTruthy();
    expect(triggersWrap).toBeTruthy();
    expect(triggers.length).toBe(2);
    expect(panels.length).toBe(2);
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

    // Wait for component to initialize and animation to complete
    await new Promise(resolve => setTimeout(resolve, 250));

    const panel1 = document.querySelector('pxm-panel[data-tab="tab1"]') as HTMLElement;
    const panel2 = document.querySelector('pxm-panel[data-tab="tab2"]') as HTMLElement;
    
    expect(panel1.getAttribute('aria-hidden')).toBe('false');
    expect(panel2.getAttribute('aria-hidden')).toBe('true');
    expect(panel1.style.display).toBe('block');
    expect(panel1.style.opacity).toBe('1');
    expect(panel2.style.display).toBe('none');
    expect(panel2.style.opacity).toBe('0');
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

    await new Promise(resolve => setTimeout(resolve, 250));

    const trigger2 = document.querySelector('pxm-triggers [data-tab="tab2"]') as HTMLElement;
    const panel1 = document.querySelector('pxm-panel[data-tab="tab1"]') as HTMLElement;
    const panel2 = document.querySelector('pxm-panel[data-tab="tab2"]') as HTMLElement;
    
    // Click second tab
    trigger2.click();
    await new Promise(resolve => setTimeout(resolve, 250));
    expect(panel1.getAttribute('aria-hidden')).toBe('true');
    expect(panel2.getAttribute('aria-hidden')).toBe('false');
    expect(panel1.style.display).toBe('none');
    expect(panel1.style.opacity).toBe('0');
    expect(panel2.style.display).toBe('block');
    expect(panel2.style.opacity).toBe('1');
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

    await new Promise(resolve => setTimeout(resolve, 250));

    const trigger1 = document.querySelector('pxm-triggers [data-tab="tab1"]') as HTMLElement;
    const trigger2 = document.querySelector('pxm-triggers [data-tab="tab2"]') as HTMLElement;
    const trigger3 = document.querySelector('pxm-triggers [data-tab="tab3"]') as HTMLElement;
    
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

  test('respects initial attribute', async () => {
    document.body.innerHTML = `
      <pxm-tabs initial="tab2">
        <pxm-triggers>
          <button data-tab="tab1">Tab 1</button>
          <button data-tab="tab2">Tab 2</button>
        </pxm-triggers>
        <pxm-panel data-tab="tab1">Content 1</pxm-panel>
        <pxm-panel data-tab="tab2">Content 2</pxm-panel>
      </pxm-tabs>
    `;

    await new Promise(resolve => setTimeout(resolve, 250));

    const panel1 = document.querySelector('pxm-panel[data-tab="tab1"]') as HTMLElement;
    const panel2 = document.querySelector('pxm-panel[data-tab="tab2"]') as HTMLElement;
    
    expect(panel1.getAttribute('aria-hidden')).toBe('true');
    expect(panel2.getAttribute('aria-hidden')).toBe('false');
    expect(panel1.style.display).toBe('none');
    expect(panel1.style.opacity).toBe('0');
    expect(panel2.style.display).toBe('block');
    expect(panel2.style.opacity).toBe('1');
  });

  test('public API: activateTab and focus methods', async () => {
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
    await new Promise(resolve => setTimeout(resolve, 250));
    const tabs = document.querySelector('pxm-tabs') as any;
    const panels = Array.from(document.querySelectorAll('pxm-panel')) as HTMLElement[];
    const triggers = document.querySelectorAll('pxm-triggers [data-tab]');

    // Activate by index
    await tabs.activateTab(2);
    await new Promise(resolve => setTimeout(resolve, 250));
    expect(panels[2].getAttribute('aria-hidden')).toBe('false');
    expect((panels[2] as HTMLElement).style.display).toBe('block');
    expect((panels[2] as HTMLElement).style.opacity).toBe('1');
    expect(panels[0].getAttribute('aria-hidden')).toBe('true');
    expect((panels[0] as HTMLElement).style.display).toBe('none');
    expect((panels[0] as HTMLElement).style.opacity).toBe('0');

    // Activate by name
    await tabs.activateTab('tab1');
    await new Promise(resolve => setTimeout(resolve, 250));
    expect(panels[0].getAttribute('aria-hidden')).toBe('false');
    expect((panels[0] as HTMLElement).style.display).toBe('block');
    expect((panels[0] as HTMLElement).style.opacity).toBe('1');
    expect(panels[2].getAttribute('aria-hidden')).toBe('true');
    expect((panels[2] as HTMLElement).style.display).toBe('none');
    expect((panels[2] as HTMLElement).style.opacity).toBe('0');

    // Focus methods
    tabs.focusNextTrigger(0);
    expect(document.activeElement).toBe(triggers[1]);
    tabs.focusPreviousTrigger(1);
    expect(document.activeElement).toBe(triggers[0]);
    tabs.focusFirstTrigger();
    expect(document.activeElement).toBe(triggers[0]);
    tabs.focusLastTrigger();
    expect(document.activeElement).toBe(triggers[2]);
  });

  test('edge cases: rapid tab switching and activating already active tab', async () => {
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
    await new Promise(resolve => setTimeout(resolve, 250));
    const tabs = document.querySelector('pxm-tabs') as any;
    const panels = Array.from(document.querySelectorAll('pxm-panel')) as HTMLElement[];

    // Rapid switching
    await tabs.activateTab('tab2');
    await new Promise(resolve => setTimeout(resolve, 250));
    await tabs.activateTab('tab1');
    await new Promise(resolve => setTimeout(resolve, 250));
    await tabs.activateTab('tab2');
    await new Promise(resolve => setTimeout(resolve, 250));
    expect(panels[1].getAttribute('aria-hidden')).toBe('false');
    expect((panels[1] as HTMLElement).style.display).toBe('block');
    expect((panels[1] as HTMLElement).style.opacity).toBe('1');
    expect(panels[0].getAttribute('aria-hidden')).toBe('true');
    expect((panels[0] as HTMLElement).style.display).toBe('none');
    expect(panels[0].style.display).toBe('none');
    expect(panels[0].style.opacity).toBe('0');

    // Activate already active tab
    await tabs.activateTab('tab2');
    await new Promise(resolve => setTimeout(resolve, 250));
    expect(panels[1].getAttribute('aria-hidden')).toBe('false');
    expect(panels[1].style.display).toBe('block');
    expect(panels[1].style.opacity).toBe('1');
  });
}); 