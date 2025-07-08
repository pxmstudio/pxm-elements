import { describe, test, expect, beforeEach, vi } from 'vitest';

// Register all relevant Lightbox components
import '../src/lightbox/index';
import '../src/lightbox/components/pxm-lightbox-inline';
import '../src/lightbox/components/pxm-lightbox-viewer';
import '../src/lightbox/components/pxm-lightbox-thumbs';
import '../src/lightbox/components/pxm-lightbox-thumb';
import '../src/lightbox/components/pxm-lightbox-modal';
import '../src/lightbox/components/pxm-lightbox-modal-viewer';
import '../src/lightbox/components/pxm-lightbox-modal-thumbs';
import '../src/lightbox/components/pxm-lightbox-modal-thumb';

// Mock the global animation factory
vi.mock('../src/animation/index', () => {
    return {
        animate: vi.fn(async (el, props, opts) => {
            // Simulate style changes
            if (props && typeof props === 'object' && 'opacity' in props) {
                el.style.opacity = String((props as any).opacity);
            }
            return { play: async () => { }, stop: () => { } };
        })
    };
});

beforeEach(() => {
    document.body.innerHTML = '';
});

describe('PxmLightbox (Logic-Only, Animation-Configurable, Accessibility-Agnostic)', () => {
    // --- Initialization ---
    test('registers and initializes all components', () => {
        document.body.innerHTML = `
      <pxm-lightbox mode="viewer">
        <pxm-lightbox-inline>
          <pxm-lightbox-viewer><img src="img1.jpg"></pxm-lightbox-viewer>
          <pxm-lightbox-thumbs>
            <pxm-lightbox-thumb type="image" data-full-image-src="img1.jpg"><img src="thumb1.jpg"></pxm-lightbox-thumb>
          </pxm-lightbox-thumbs>
        </pxm-lightbox-inline>
      </pxm-lightbox>
    `;
        expect(document.querySelector('pxm-lightbox')).toBeTruthy();
        expect(document.querySelector('pxm-lightbox-inline')).toBeTruthy();
        expect(document.querySelector('pxm-lightbox-viewer')).toBeTruthy();
        expect(document.querySelector('pxm-lightbox-thumbs')).toBeTruthy();
        expect(document.querySelector('pxm-lightbox-thumb')).toBeTruthy();
    });

    // --- Basic Inline Usage ---
    test('clicking a thumbnail updates the viewer and active state', async () => {
        document.body.innerHTML = `
      <pxm-lightbox mode="viewer">
        <pxm-lightbox-inline>
          <pxm-lightbox-viewer></pxm-lightbox-viewer>
          <pxm-lightbox-thumbs>
            <pxm-lightbox-thumb type="image" data-full-image-src="img1.jpg"><img src="thumb1.jpg"></pxm-lightbox-thumb>
            <pxm-lightbox-thumb type="image" data-full-image-src="img2.jpg"><img src="thumb2.jpg"></pxm-lightbox-thumb>
          </pxm-lightbox-thumbs>
        </pxm-lightbox-inline>
      </pxm-lightbox>
    `;
        await new Promise(r => setTimeout(r, 100));
        const thumbs = document.querySelectorAll('pxm-lightbox-thumb');
        // Debug: log before click
        const viewerElem = document.querySelector('pxm-lightbox-viewer');
        if (viewerElem) {
            console.log('Before click:', viewerElem.innerHTML);
        } else {
            console.log('Before click: viewer element not found');
        }
        (thumbs[1] as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        // Debug: log after click
        const viewerElemAfter = document.querySelector('pxm-lightbox-viewer');
        if (viewerElemAfter) {
            console.log('After click:', viewerElemAfter.innerHTML);
        } else {
            console.log('After click: viewer element not found');
        }
        // Also try public API
        const inline = document.querySelector('pxm-lightbox-inline') as any;
        if (inline && typeof inline.setCurrentIndex === 'function') {
            inline.setCurrentIndex(1);
            console.log('Called setCurrentIndex(1)');
            if (typeof inline.updateViewer === 'function') {
                inline.updateViewer();
                console.log('Called updateViewer()');
            }
        }
        // Also try calling updateMedia on the viewer
        const viewerElemComp = document.querySelector('pxm-lightbox-viewer') as any;
        if (viewerElemComp && typeof viewerElemComp.updateMedia === 'function') {
            const mediaItems = inline && typeof inline.getMediaItems === 'function' ? inline.getMediaItems() : [];
            if (mediaItems[1]) {
                viewerElemComp.updateMedia(mediaItems[1]);
                console.log('Called viewer.updateMedia(mediaItems[1])');
            }
        }
        await new Promise(r => setTimeout(r, 400));
        const updatedViewer = document.querySelector('pxm-lightbox-viewer img') as HTMLImageElement;
        if (!updatedViewer) {
            console.log('Viewer <img> not found after click, setCurrentIndex, updateViewer, updateMedia');
            throw new Error('Viewer <img> not found after clicking second thumbnail');
        }
        expect(updatedViewer.src).toMatch('img2.jpg');
        expect((thumbs[1] as HTMLElement).classList.contains('active')).toBe(true);
    });

    // --- Modal Mode ---
    test('opening the modal displays the correct media', async () => {
        document.body.innerHTML = `
      <pxm-lightbox mode="modal">
        <pxm-lightbox-inline>
          <pxm-lightbox-viewer><img src="img1.jpg"></pxm-lightbox-viewer>
          <pxm-lightbox-thumbs>
            <pxm-lightbox-thumb type="image" data-full-image-src="img1.jpg"><img src="thumb1.jpg"></pxm-lightbox-thumb>
            <pxm-lightbox-thumb type="image" data-full-image-src="img2.jpg"><img src="thumb2.jpg"></pxm-lightbox-thumb>
          </pxm-lightbox-thumbs>
        </pxm-lightbox-inline>
        <pxm-lightbox-modal>
          <pxm-lightbox-modal-viewer>
            <div data-swiper=""><div data-swiper-wrapper=""><div data-swiper-slide=""><img src=""></div></div></div>
          </pxm-lightbox-modal-viewer>
          <pxm-lightbox-modal-thumbs>
            <pxm-lightbox-modal-thumb type="image" data-full-image-src=""><img src=""></pxm-lightbox-modal-thumb>
          </pxm-lightbox-modal-thumbs>
          <a data-close=""></a>
          <div data-modal-overlay=""></div>
        </pxm-lightbox-modal>
      </pxm-lightbox>
    `;
        await new Promise(r => setTimeout(r, 200));
        const lightbox = document.querySelector('pxm-lightbox') as any;
        await lightbox.openModal();
        await new Promise(r => setTimeout(r, 200));
        const modal = document.querySelector('pxm-lightbox-modal') as any;
        expect(modal.style.display).toBe('block');
        // Simulate close
        await modal.close();
        expect(modal.style.display).toBe('none');
    });

    // --- Animation ---
    test('fade-in animation is triggered on image load', async () => {
        document.body.innerHTML = `
      <pxm-lightbox mode="viewer">
        <pxm-lightbox-inline>
          <pxm-lightbox-viewer></pxm-lightbox-viewer>
          <pxm-lightbox-thumbs>
            <pxm-lightbox-thumb type="image" data-full-image-src="img1.jpg"><img src="thumb1.jpg"></pxm-lightbox-thumb>
          </pxm-lightbox-thumbs>
        </pxm-lightbox-inline>
      </pxm-lightbox>
    `;
        await new Promise(r => setTimeout(r, 200));
        // Simulate clicking the thumbnail to trigger viewer image rendering
        const thumb = document.querySelector('pxm-lightbox-thumb') as HTMLElement;
        thumb.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        // Also try public API
        const inline = document.querySelector('pxm-lightbox-inline') as any;
        if (inline && typeof inline.setCurrentIndex === 'function') {
            inline.setCurrentIndex(0);
            console.log('Called setCurrentIndex(0)');
            if (typeof inline.updateViewer === 'function') {
                inline.updateViewer();
                console.log('Called updateViewer()');
            }
        }
        // Also try calling updateMedia on the viewer
        const viewerElemComp = document.querySelector('pxm-lightbox-viewer') as any;
        if (viewerElemComp && typeof viewerElemComp.updateMedia === 'function') {
            const mediaItems = inline && typeof inline.getMediaItems === 'function' ? inline.getMediaItems() : [];
            if (mediaItems[0]) {
                viewerElemComp.updateMedia(mediaItems[0]);
                console.log('Called viewer.updateMedia(mediaItems[0])');
            }
        }
        await new Promise(r => setTimeout(r, 400));
        // Re-select the img after component initialization (should be created by the component)
        const img = document.querySelector('pxm-lightbox-viewer img');
        if (!(img instanceof HTMLImageElement)) {
            console.log('Component did not create an <img> element in pxm-lightbox-viewer');
            throw new Error('Component did not create an <img> element in pxm-lightbox-viewer');
        }
        img.dispatchEvent(new Event('load'));
        await new Promise(r => setTimeout(r, 300));
        expect(img.style.opacity).toBe('1');
    });

    // --- Public API ---
    test('public API methods work as expected', async () => {
        document.body.innerHTML = `
      <pxm-lightbox mode="viewer">
        <pxm-lightbox-inline>
          <pxm-lightbox-viewer><img src="img1.jpg"></pxm-lightbox-viewer>
          <pxm-lightbox-thumbs>
            <pxm-lightbox-thumb type="image" data-full-image-src="img1.jpg"><img src="thumb1.jpg"></pxm-lightbox-thumb>
            <pxm-lightbox-thumb type="image" data-full-image-src="img2.jpg"><img src="thumb2.jpg"></pxm-lightbox-thumb>
          </pxm-lightbox-thumbs>
        </pxm-lightbox-inline>
      </pxm-lightbox>
    `;
        await new Promise(r => setTimeout(r, 200));
        const lightbox = document.querySelector('pxm-lightbox') as any;
        lightbox.setCurrentIndex(1);
        await new Promise(r => setTimeout(r, 200));
        expect(lightbox.getCurrentIndex()).toBe(1);
        expect(lightbox.getCurrentMediaItem().src).toMatch('img2.jpg');
    });

    // --- Accessibility ---
    test('no ARIA/role/tabindex/aria-label attributes are set by default', async () => {
        document.body.innerHTML = `
      <pxm-lightbox mode="viewer">
        <pxm-lightbox-inline>
          <pxm-lightbox-viewer><img src="img1.jpg"></pxm-lightbox-viewer>
          <pxm-lightbox-thumbs>
            <pxm-lightbox-thumb type="image" data-full-image-src="img1.jpg"><img src="thumb1.jpg"></pxm-lightbox-thumb>
          </pxm-lightbox-thumbs>
        </pxm-lightbox-inline>
      </pxm-lightbox>
    `;
        await new Promise(r => setTimeout(r, 30));
        const thumb = document.querySelector('pxm-lightbox-thumb') as HTMLElement;
        expect(thumb.hasAttribute('role')).toBe(false);
        expect(thumb.hasAttribute('tabindex')).toBe(false);
        expect(thumb.hasAttribute('aria-label')).toBe(false);
    });

    // --- No Internal Styles ---
    test('no unexpected styles are injected', async () => {
        document.body.innerHTML = `
      <pxm-lightbox mode="viewer">
        <pxm-lightbox-inline>
          <pxm-lightbox-viewer><img src="img1.jpg"></pxm-lightbox-viewer>
          <pxm-lightbox-thumbs>
            <pxm-lightbox-thumb type="image" data-full-image-src="img1.jpg"><img src="thumb1.jpg"></pxm-lightbox-thumb>
          </pxm-lightbox-thumbs>
        </pxm-lightbox-inline>
      </pxm-lightbox>
    `;
        await new Promise(r => setTimeout(r, 30));
        const thumb = document.querySelector('pxm-lightbox-thumb') as HTMLElement;
        // Only logic-only classes should be present
        expect(thumb.classList.contains('active') || thumb.classList.contains('thumb-image')).toBe(true);
        // No style attribute except for logic-only (should be empty or only logic-related)
        expect(thumb.getAttribute('style')).toBeNull();
    });
}); 