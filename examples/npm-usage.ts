/**
 * Example: Using Pixelmakers Components in a bundled project (Vite, Webpack, etc.)
 * 
 * This example shows how to import individual components for optimal tree-shaking
 * and bundle size optimization.
 * 
 * Note: This is a demonstration - actual imports work when package is published to npm
 */

// Import individual components (tree-shakable ESM builds)
// @ts-ignore - Demo file
import '@pixelmakers/elements/accordion';
// @ts-ignore - Demo file  
import '@pixelmakers/elements/tabs';
// @ts-ignore - Demo file
import '@pixelmakers/elements/video';

// Or import specific components with types
// @ts-ignore - Demo file
import { PxmAccordion, PxmTabs, PxmVideo } from '@pixelmakers/elements';

// Example: Programmatic usage with TypeScript support
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎉 Pixelmakers Components loaded via npm install');
    
    // Create components programmatically
    const accordion = document.createElement('pxm-accordion') as PxmAccordion;
    accordion.setAttribute('allow-multiple', 'false');
    
    // TypeScript knows about the component methods and properties
    console.log('Accordion mode:', accordion.getCurrentIndex?.()); // Type-safe
    
    // Add to page
    document.body.appendChild(accordion);
    
    // Listen for component events
    accordion.addEventListener('media-changed', (event) => {
        console.log('Accordion state changed:', event.detail);
    });
});

// Example: Heavy components can be loaded dynamically
async function loadLightbox() {
    // Only load lightbox when needed (code splitting)
    // @ts-ignore - Demo file
    const { PxmLightbox } = await import('@pixelmakers/elements/lightbox');
    
    const lightbox = document.createElement('pxm-lightbox') as InstanceType<typeof PxmLightbox>;
    lightbox.setAttribute('mode', 'modal');
    lightbox.setAttribute('zoom-mode', 'cursor-area');
    
    document.body.appendChild(lightbox);
    console.log('📦 Lightbox loaded dynamically');
}

// Example: Phone input with heavy dependency
async function loadPhoneInput() {
    // intl-tel-input is a peer dependency - your bundler will handle it
    // @ts-ignore - Demo file
    const { PxmPhoneInput } = await import('@pixelmakers/elements/phone-input');
    
    const phoneInput = document.createElement('pxm-phone-input') as InstanceType<typeof PxmPhoneInput>;
    phoneInput.setAttribute('country', 'us');
    
    document.body.appendChild(phoneInput);
    console.log('📞 Phone input loaded with intl-tel-input');
}

// Export for use in other modules
export {
    loadLightbox,
    loadPhoneInput
};

/*
Benefits of npm usage:
1. ✅ Tree-shaking: Only include components you use
2. ✅ TypeScript support: Full type checking and IntelliSense  
3. ✅ Code splitting: Load heavy components when needed
4. ✅ Dependency management: Your bundler handles peer dependencies
5. ✅ Development experience: Hot reload, source maps, etc.
6. ✅ Optimal bundle size: ESM builds are smaller (external deps)

File sizes (ESM builds - dependencies external):
- 📦 accordion.js: 6.6KB (+ any shared dependencies)
- 📦 tabs.js: 2.8KB 
- 📦 video.js: 16KB
- 📦 lightbox.js: 90KB (+ Swiper via your package manager)
- 📦 phone-input.js: 1.2KB (+ intl-tel-input via your package manager)
*/ 