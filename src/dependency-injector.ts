/**
 * Simple dependency injection for PXM components
 * Loads external CSS/JS dependencies when needed
 */

// Simple dependency map
const COMPONENT_DEPS = {
  'lightbox': {
    css: ['https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css'],
    js: ['https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js']
  },
  'phone-input': {
    css: ['https://cdn.jsdelivr.net/npm/intl-tel-input@25/build/css/intlTelInput.css'],
    js: ['https://cdn.jsdelivr.net/npm/intl-tel-input@25/build/js/intlTelInputWithUtils.js']
  }
} as const;

/**
 * Load CSS dependency if not already loaded
 */
function loadCSS(href: string): void {
  if (document.querySelector(`link[href="${href}"]`)) return;
  
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Load JS dependency if not already loaded
 */
function loadJS(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Inject dependencies for a specific component
 */
export async function injectComponentDependencies(componentName: string): Promise<void> {
  const deps = COMPONENT_DEPS[componentName as keyof typeof COMPONENT_DEPS];
  if (!deps) return;

  try {
    // Load CSS synchronously (non-blocking)
    deps.css?.forEach(loadCSS);

    // Load JS dependencies
    if (deps.js?.length) {
      await Promise.all(deps.js.map(loadJS));
    }
  } catch (error) {
    console.warn(`Failed to load dependencies for ${componentName}:`, error);
    // Don't throw - component should work without dependencies if possible
  }
} 