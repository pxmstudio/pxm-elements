async function main() {
  if (document.querySelector("pxm-phone-input")) {
    await import("./logic/forms/phone-input");
  }
}

if (window.Webflow && window.Webflow.length === 0) {
  window.Webflow ||= [];
  window.Webflow.push(main);
} else {
  main();
}
