// Helper function to safely inject a link tag if it doesn't already exist
function injectLink(href: string, rel: string = 'stylesheet', type?: string): void {
  // Check if link already exists
  const existingLink = document.querySelector(`link[href="${href}"]`);
  if (existingLink) return;

  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  if (type) link.type = type;
  
  // Inject into head
  document.head.appendChild(link);
}

// Helper function to safely inject a script tag if it doesn't already exist
function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    
    // Inject into head
    document.head.appendChild(script);
  });
}

// Function to get the current script tag that loaded this component
function getCurrentComponentScript(componentName: string): HTMLScriptElement | null {
  const scripts = document.getElementsByTagName('script');
  
  // First try to find a script with the specific component name
  let currentScript = Array.from(scripts).find(script => 
    script.src.includes(`@pixelmakers/elements`) && script.src.includes(`${componentName}.js`)
  );
  
  // Fallback to any pixelmakers elements script (for index.js)
  if (!currentScript) {
    currentScript = Array.from(scripts).find(script =>
      script.src.includes('@pixelmakers/elements')
    );
  }
  
  return currentScript || null;
}

// Function to inject dependencies for specific components
export async function injectComponentDependencies(componentName: string): Promise<void> {
  const currentScript = getCurrentComponentScript(componentName);
  
  // Check if we should inject dependencies
  const shouldInjectDependencies = currentScript?.hasAttribute('data-inject-dependencies') || 
                                   currentScript?.getAttribute('data-inject-dependencies') === 'true';
  
  if (!shouldInjectDependencies) return;

  // Extract version from the current script URL
  const versionMatch = currentScript?.src.match(/elements@([^/]+)/);
  const version = versionMatch ? versionMatch[1] : '0.1.13';
  
  const baseUrl = `https://cdn.jsdelivr.net/npm/@pixelmakers/elements@${version}`;

  try {
    // Always inject main CSS
    injectLink(`${baseUrl}/dist/esm/elements.css`);

    // Component-specific dependencies
    switch (componentName) {
      case 'lightbox':
        // Inject Swiper CSS and JS
        injectLink('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
        await injectScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
        break;

      case 'phone-input':
        // Inject intl-tel-input CSS and JS
        injectLink('https://cdn.jsdelivr.net/npm/intl-tel-input@25/build/css/intlTelInput.css');
        await injectScript('https://cdn.jsdelivr.net/npm/intl-tel-input@25/build/js/intlTelInputWithUtils.js');
        break;

      case 'video':
        // Video component might need medium-zoom (if using zoom functionality)
        // Add specific dependencies if needed
        break;

      // Add more dependencies as needed for other components
      default:
        // No additional dependencies needed
        break;
    }
  } catch (error) {
    console.warn(`Failed to inject dependencies for ${componentName}:`, error);
  }
} 