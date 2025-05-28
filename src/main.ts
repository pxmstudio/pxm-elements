async function main() {
  if (document.querySelector("pxm-phone-input")) {
    // Get the base URL of the current script
    const scripts = document.getElementsByTagName('script');
    const currentScript = Array.from(scripts).find(script => 
      script.src.includes('@pixelmakers/elements')
    );
    
    // If we're using CDN, use absolute path for imports
    if (currentScript?.src) {
      const baseUrl = currentScript.src.split('/').slice(0, -1).join('/');
      await import(`${baseUrl}/phone-input.js`);
    } else {
      // Local development
      await import("./logic/forms/phone-input");
    }
  }
}

if (window.Webflow && window.Webflow.length === 0) {
  window.Webflow ||= [];
  window.Webflow.push(main);
} else {
  main();
}
