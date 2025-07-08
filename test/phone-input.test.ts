import { describe, it, expect, beforeEach, vi } from 'vitest';

// Ensure the component is registered
import '../src/phone-input/index';

// Mock intl-tel-input for all tests
vi.mock('../src/phone-input/iti', () => {
  return {
    __esModule: true,
    iti: ({ input }) => {
      return {
        getNumber: () => {
          const val = input.value;
          // Return a valid E.164 number for 10-digit US numbers
          if (/^\d{10}$/.test(val)) return '+15551234567';
          return '';
        },
        isValidNumber: () => {
          const val = input.value;
          return /^\d{10}$/.test(val);
        }
      };
    }
  };
});

describe('PxmPhoneInput', () => {
  let container: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('initializes and renders correctly', async () => {
    container.innerHTML = `
      <pxm-phone-input data-initial-country="US">
        <input type="tel" name="phone">
      </pxm-phone-input>
    `;
    const el = container.querySelector('pxm-phone-input') as any;
    expect(el).toBeTruthy();
    expect(el.input).toBeInstanceOf(HTMLInputElement);
    expect(el.hiddenInput).toBeInstanceOf(HTMLInputElement);
    expect(el.errorElement).toBeInstanceOf(HTMLElement);
  });

  it('formats and masks input using intl-tel-input', async () => {
    container.innerHTML = `
      <pxm-phone-input data-initial-country="US">
        <input type="tel" name="phone">
      </pxm-phone-input>
    `;
    const el = container.querySelector('pxm-phone-input') as any;
    // Wait for itiInstance to be defined
    for (let i = 0; i < 40 && !el.itiInstance; i++) await new Promise(r => setTimeout(r, 5));
    el.input.value = '5551234567';
    el.input.dispatchEvent(new Event('input'));
    await new Promise(r => setTimeout(r, 100));
    // Debug logs
    // eslint-disable-next-line no-console
    console.log('data-full-phone:', el.input.getAttribute('data-full-phone'), 'typeof:', typeof el.input.getAttribute('data-full-phone'));
    // eslint-disable-next-line no-console
    console.log('hiddenInput.value:', el.hiddenInput.value, 'typeof:', typeof el.hiddenInput.value);
    expect(el.input.getAttribute('data-full-phone')).toMatch(/\+1/);
    expect(el.hiddenInput.value).toMatch(/\+1/);
  });

  it('validates input and displays error with animation', async () => {
    container.innerHTML = `
      <pxm-phone-input data-initial-country="US">
        <input type="tel" name="phone">
      </pxm-phone-input>
    `;
    const el = container.querySelector('pxm-phone-input') as any;
    for (let i = 0; i < 40 && !el.itiInstance; i++) await new Promise(r => setTimeout(r, 5));
    el.input.value = '123'; // Invalid US number
    el.input.dispatchEvent(new Event('blur'));
    await new Promise(r => setTimeout(r, 100));
    expect(el.errorElement.textContent).toMatch(/invalid/i);
    expect(el.errorElement.style.display).toBe('block');
    expect(el.errorElement.style.opacity).not.toBe('0');
    expect(el.input.getAttribute('aria-invalid')).toBe('true');
  });

  it('clears error on valid input', async () => {
    container.innerHTML = `
      <pxm-phone-input data-initial-country="US">
        <input type="tel" name="phone">
      </pxm-phone-input>
    `;
    const el = container.querySelector('pxm-phone-input') as any;
    for (let i = 0; i < 40 && !el.itiInstance; i++) await new Promise(r => setTimeout(r, 5));
    el.input.value = '5551234567';
    el.input.dispatchEvent(new Event('input'));
    await new Promise(r => setTimeout(r, 100));
    el.input.dispatchEvent(new Event('blur'));
    await new Promise(r => setTimeout(r, 100));
    expect(el.errorElement.textContent).toBe('');
    expect(el.errorElement.style.display).toBe('none');
    expect(el.input.getAttribute('aria-invalid')).toBe('false');
  });

  it('supports custom validation and error messages', async () => {
    container.innerHTML = `
      <pxm-phone-input data-initial-country="US">
        <input type="tel" name="phone">
      </pxm-phone-input>
    `;
    const el = container.querySelector('pxm-phone-input') as any;
    for (let i = 0; i < 40 && !el.itiInstance; i++) await new Promise(r => setTimeout(r, 5));
    el.props.validate = (val: string) => val === '999' ? 'Custom error' : null;
    el.input.value = '999';
    el.input.dispatchEvent(new Event('blur'));
    await new Promise(r => setTimeout(r, 100));
    expect(el.errorElement.textContent).toBe('Custom error');
    expect(el.input.getAttribute('aria-invalid')).toBe('true');
  });

  it('supports i18n for error messages', async () => {
    container.innerHTML = `
      <pxm-phone-input data-initial-country="US" data-i18n='{"invalid":"Num\u0103r invalid"}'>
        <input type="tel" name="phone">
      </pxm-phone-input>
    `;
    const el = container.querySelector('pxm-phone-input') as any;
    for (let i = 0; i < 40 && !el.itiInstance; i++) await new Promise(r => setTimeout(r, 5));
    el.input.value = '123';
    el.input.dispatchEvent(new Event('blur'));
    await new Promise(r => setTimeout(r, 100));
    expect(el.errorElement.textContent).toMatch(/num\u0103r invalid/i);
  });

  it('exposes public API methods', async () => {
    container.innerHTML = `
      <pxm-phone-input data-initial-country="US">
        <input type="tel" name="phone">
      </pxm-phone-input>
    `;
    const el = container.querySelector('pxm-phone-input') as any;
    expect(typeof el.getFormattedNumber).toBe('function');
    expect(typeof el.isValid).toBe('function');
    expect(typeof el.setError).toBe('function');
    expect(typeof el.clearError).toBe('function');
    expect(typeof el.focus).toBe('function');
    expect(typeof el.blur).toBe('function');
    // Test setError/clearError
    el.setError('Test error');
    expect(el.errorElement.textContent).toBe('Test error');
    el.clearError();
    await new Promise(r => setTimeout(r, 100));
    expect(el.errorElement.textContent).toBe('');
  });

  it('handles edge cases: empty and invalid input', async () => {
    container.innerHTML = `
      <pxm-phone-input data-initial-country="US">
        <input type="tel" name="phone">
      </pxm-phone-input>
    `;
    const el = container.querySelector('pxm-phone-input') as any;
    for (let i = 0; i < 40 && !el.itiInstance; i++) await new Promise(r => setTimeout(r, 5));
    el.input.value = '';
    el.input.dispatchEvent(new Event('blur'));
    await new Promise(r => setTimeout(r, 100));
    // Should show error for empty/invalid
    expect(el.errorElement.textContent).toMatch(/invalid/i);
    el.input.value = '5551234567';
    el.input.dispatchEvent(new Event('input'));
    await new Promise(r => setTimeout(r, 100));
    el.input.dispatchEvent(new Event('blur'));
    await new Promise(r => setTimeout(r, 100));
    expect(el.errorElement.textContent).toBe('');
  });
}); 