import { injectComponentDependencies } from './dependency-injector';

async function importComponent(selector: string, componentName: string) {
  if (!document.querySelector(selector)) return;

  // Get the current script URL
  const scripts = document.getElementsByTagName('script');
  const currentScript = Array.from(scripts).find(script =>
    script.src.includes('@pixelmakers/elements') || script.src.includes('index.js')
  );

  // Inject dependencies if requested
  await injectComponentDependencies(componentName);

  try {
    let importPath: string;
    
    if (currentScript?.src.includes('@pixelmakers/elements')) {
      // CDN usage - construct JSDelivr URL
      const versionMatch = currentScript.src.match(/elements@([^/]+)/);
      const version = versionMatch ? versionMatch[1] : __PACKAGE_VERSION__;
      importPath = `https://cdn.jsdelivr.net/npm/@pixelmakers/elements@${version}/dist/umd/${componentName}.js`;
    } else if (currentScript?.src) {
      // Local/custom URL usage - construct URL relative to current script
      const baseUrl = currentScript.src.substring(0, currentScript.src.lastIndexOf('/'));
      importPath = `${baseUrl}/${componentName}.js`;
    } else {
      // Fallback to relative import for true local development
      importPath = `./${componentName}`;
    }
    
    await import(/* @vite-ignore */ importPath);
  } catch (error) {
    console.error(`Failed to load component ${componentName}:`, error);
  }
}

async function main() {
  // Only import components that are present in the DOM
  const components = [
    { selector: "pxm-phone-input", name: "phone-input" },
    { selector: "pxm-lightbox", name: "lightbox" },
    { selector: "pxm-video", name: "video" },
    { selector: "pxm-tabs", name: "tabs" },
    { selector: "pxm-accordion", name: "accordion" },
    { selector: "pxm-number-input", name: "number-input" },
    { selector: "pxm-toggle", name: "toggle" }
  ];

  for (const component of components) {
    if (document.querySelector(component.selector)) {
      await importComponent(component.selector, component.name);
    }
  }
}

if (window.Webflow && window.Webflow.length === 0) {
  window.Webflow ||= [];
  window.Webflow.push(main);
} else {
  main();
}
