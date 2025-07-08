import type { PxmAccordion, AccordionEventDetail } from './accordion';
import type { PxmTabs, TabsEventDetail } from './tabs';
import type { PxmToggle, ToggleEventDetail } from './toggle';
import type { PxmTooltip, TooltipEventDetail } from './tooltip';
import gsap from 'gsap';

async function main() {
  if (document.querySelector('pxm-accordion')) {
    await import('./accordion');

    const accordions = document.querySelectorAll('pxm-accordion') as NodeListOf<PxmAccordion>;

    // Only add GSAP animations if GSAP is available
    if (typeof window !== 'undefined') {
      accordions.forEach(accordion => {
        // Remove default animations when using GSAP
        accordion.removeDefaultAnimations();

        accordion.addEventListener('pxm:accordion:before-expand', (e: Event) => {
          const event = e as CustomEvent<AccordionEventDetail>;

          const { content } = event.detail;
          event.preventDefault(); // Take over the animation

          // Set display block and measure natural height
          content.style.display = 'block';
          content.style.opacity = '0';

          // Start animation from collapsed state
          gsap.fromTo(content,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
              onComplete: () => {
                // Reset to auto height for responsive behavior
                content.style.height = 'auto';
                event.detail.complete(); // Signal animation complete
              }
            }
          );
        });

        accordion.addEventListener('pxm:accordion:before-collapse', (e: Event) => {
          const event = e as CustomEvent<AccordionEventDetail>;
          const { content } = event.detail;
          event.preventDefault(); // Take over the animation

          gsap.to(content, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onStart: () => {
              // Force display to stay visible during animation with !important
              content.style.setProperty('display', 'block', 'important');
            },
            onComplete: () => {
              // Clean up and hide
              content.style.removeProperty('display');
              content.style.display = 'none';
              event.detail.complete(); // Signal animation complete
            }
          });
        });
      });
    }
  }

  if (document.querySelector('pxm-tabs')) {
    await import('./tabs');

    const tabs = document.querySelectorAll('pxm-tabs') as NodeListOf<PxmTabs>;

    // Only add GSAP animations if GSAP is available
    if (typeof window !== 'undefined') {
      tabs.forEach(tabsComponent => {
        // Remove default animations when using GSAP
        tabsComponent.removeDefaultAnimations();

        tabsComponent.addEventListener('pxm:tabs:before-show', (e: Event) => {
          const event = e as CustomEvent<TabsEventDetail>;
          const { panel } = event.detail;
          event.preventDefault(); // Take over the animation

          // Set initial state and make visible
          panel.style.display = 'block';

          // Animate in with fade and slide up
          gsap.fromTo(panel,
            {
              opacity: 0,
              y: 20
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: "power2.out",
              onComplete: () => {
                event.detail.complete(); // Signal animation complete
              }
            }
          );
        });

        tabsComponent.addEventListener('pxm:tabs:before-hide', (e: Event) => {
          const event = e as CustomEvent<TabsEventDetail>;
          const { panel } = event.detail;
          event.preventDefault(); // Take over the animation

          gsap.to(panel, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              // Hide the panel after animation
              panel.style.display = 'none';
              event.detail.complete(); // Signal animation complete
            }
          });
        });
      });
    }
  }

  if (document.querySelector('pxm-toggle')) {
    await import('./toggle');

    const toggles = document.querySelectorAll('pxm-toggle') as NodeListOf<PxmToggle>;

    // Only add GSAP animations if GSAP is available
    if (typeof window !== 'undefined') {
      toggles.forEach(toggle => {

        toggle.addEventListener('pxm:toggle:before-change', (e: Event) => {
          const event = e as CustomEvent<ToggleEventDetail>;
          const { element, pressed } = event.detail;
          event.preventDefault(); // Take over the animation

          // Animate the toggle with a subtle scale effect
          gsap.to(element, {
            scale: pressed ? 1.1 : 1.0,
            duration: 0.15,
            ease: "back.out(1.7)",
            onComplete: () => {
              // Reset scale after animation
              gsap.set(element, { scale: 1 });
              event.detail.complete(); // Signal animation complete
            }
          });
        });
      });
    }
  }

  if (document.querySelector('pxm-phone-input')) {
    await import('./phone-input');
  }
  if (document.querySelector('pxm-lightbox')) {
    await import('./lightbox');
  }
  if (document.querySelector('pxm-video')) {
    await import('./video');
  }
  if (document.querySelector('pxm-number-input')) {
    await import('./number-input');
  }
  if (document.querySelector('pxm-dialog')) {
    await import('./dialog');

    const dialogs = document.querySelectorAll('pxm-dialog');

    // Only add GSAP animations if GSAP is available
    if (typeof window !== 'undefined') {
      dialogs.forEach(dialog => {
        // Remove default animations when using GSAP
        (dialog as any).removeDefaultAnimations();

        dialog.addEventListener('pxm:dialog:before-open', (e: Event) => {
          const event = e as CustomEvent;
          const { content } = event.detail;
          event.preventDefault(); // Take over the animation

          // Set initial state
          content.style.display = 'flex';

          // Animate in with fade and scale
          gsap.fromTo(content,
            {
              opacity: 0,
              scale: 0.8,
              y: -50
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.3,
              ease: "back.out(1.7)",
              onComplete: () => {
                event.detail.complete(); // Signal animation complete
              }
            }
          );
        });

        dialog.addEventListener('pxm:dialog:before-close', (e: Event) => {
          const event = e as CustomEvent;
          const { content } = event.detail;
          event.preventDefault(); // Take over the animation

          gsap.to(content, {
            opacity: 0,
            scale: 0.9,
            y: -30,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
              content.style.display = 'none';
              event.detail.complete(); // Signal animation complete
            }
          });
        });
      });
    }
  }

  if (document.querySelector('pxm-switch')) {
    await import('./switch');
  }

  if (document.querySelector('pxm-select')) {
    await import('./select');
  }

  if (document.querySelector('pxm-tooltip')) {
    await import('./tooltip');

    const tooltips = document.querySelectorAll('pxm-tooltip') as NodeListOf<PxmTooltip>;

    // Only add GSAP animations if GSAP is available
    if (typeof window !== 'undefined') {
      tooltips.forEach(tooltip => {
        // Remove default animations when using GSAP
        tooltip.removeDefaultAnimations();

        tooltip.addEventListener('pxm:tooltip:before-show', (e: Event) => {
          const event = e as CustomEvent<TooltipEventDetail>;
          const { content, complete } = event.detail;
          event.preventDefault(); // Take over the animation

          // Set initial state for animation
          content.style.display = 'block';
          content.style.visibility = 'visible';

          // Animate in with fade and subtle scale
          gsap.fromTo(content,
            {
              opacity: 0,
              scale: 0.8,
              y: -10
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.2,
              ease: "back.out(1.7)",
              onComplete: () => {
                complete(); // Signal animation complete
              }
            }
          );
        });

        tooltip.addEventListener('pxm:tooltip:before-hide', (e: Event) => {
          const event = e as CustomEvent<TooltipEventDetail>;
          const { content, complete } = event.detail;
          event.preventDefault(); // Take over the animation

          gsap.to(content, {
            opacity: 0,
            scale: 0.9,
            y: -5,
            duration: 0.15,
            ease: "power2.in",
            onComplete: () => {
              // Hide after animation
              content.style.display = 'none';
              content.style.visibility = 'hidden';
              complete(); // Signal animation complete
            }
          });
        });
      });
    }
  }

  if (document.querySelector('pxm-dropdown')) {
    await import('./dropdown');

    const dropdownContents = document.querySelectorAll('pxm-dropdown-content');
    // dropdownContents.forEach(content => {
    //   // Remove default animations if available
    //   (content as any).removeDefaultAnimations?.();

    //   // Custom open animation
    //   content.addEventListener('pxm:dropdown:before-open', (e) => {
    //     const event = e as CustomEvent<{ content: HTMLElement, complete: () => void }>;
    //     e.preventDefault();
    //     const el = content as HTMLElement;
    //     el.style.display = 'block';
    //     el.style.opacity = '0';
    //     gsap.to(el, {
    //       opacity: 1,
    //       duration: 0.25,
    //       ease: 'power2.out',
    //       onComplete: () => {
    //         event.detail.complete();
    //       }
    //     });
    //   });

    //   // Custom close animation
    //   content.addEventListener('pxm:dropdown:before-close', (e) => {
    //     const event = e as CustomEvent<{ content: HTMLElement, complete: () => void }>;
    //     e.preventDefault();
    //     const el = content as HTMLElement;
    //     gsap.to(el, {
    //       opacity: 0,
    //       duration: 0.2,
    //       ease: 'power2.in',
    //       onComplete: () => {
    //         el.style.display = 'none';
    //         event.detail.complete();
    //       }
    //     });
    //   });
    // });

    // // Submenu support
    // const submenuContents = document.querySelectorAll('pxm-dropdown-submenu-content');
    // submenuContents.forEach(content => {
    //   (content as any).removeDefaultAnimations?.();

    //   content.addEventListener('pxm:dropdown:before-open', (e) => {
    //     const event = e as CustomEvent<{ content: HTMLElement, complete: () => void }>;
    //     e.preventDefault();
    //     const el = content as HTMLElement;
    //     el.style.display = 'block';
    //     el.style.opacity = '0';
    //     gsap.to(el, {
    //       opacity: 1,
    //       duration: 0.25,
    //       ease: 'power2.out',
    //       onComplete: () => {
    //         event.detail.complete();
    //       }
    //     });
    //   });

    //   content.addEventListener('pxm:dropdown:before-close', (e) => {
    //     const event = e as CustomEvent<{ content: HTMLElement, complete: () => void }>;
    //     e.preventDefault();
    //     const el = content as HTMLElement;
    //     gsap.to(el, {
    //       opacity: 0,
    //       duration: 0.2,
    //       ease: 'power2.in',
    //       onComplete: () => {
    //         el.style.display = 'none';
    //         event.detail.complete();
    //       }
    //     });
    //   });
    // });
  }
}

if (window.Webflow && window.Webflow.length === 0) {
  window.Webflow ||= [];
  window.Webflow.push(main);
} else {
  main();
}
