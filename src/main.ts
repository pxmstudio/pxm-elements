async function importComponent(selector: string, componentName: string) {
  if (!document.querySelector(selector)) return;

  // Get the base URL of the current script
  const scripts = document.getElementsByTagName('script');
  const currentScript = Array.from(scripts).find(script =>
    script.src.includes('@pixelmakers/elements')
  );

  // If we're using CDN, use absolute path for imports
  if (currentScript?.src) {
    try {
      // Extract version from the current script URL
      const versionMatch = currentScript.src.match(/elements@([^/]+)/);
      const version = versionMatch ? versionMatch[1] : '0.1.9';
      // Construct the import path using the package name directly
      const importPath = `https://cdn.jsdelivr.net/npm/@pixelmakers/elements@${version}/dist/${componentName}.js`;
      await import(/* @vite-ignore */ importPath);
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error);
    }
  } else {
    // Local development
    try {
      await import(/* @vite-ignore */ `./${componentName}`);
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error);
    }
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
    { selector: "pxm-number-input", name: "number-input" }
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
