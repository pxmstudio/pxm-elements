import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Component entries mapping
const componentEntries = {
    "index": resolve(__dirname, "src/main.ts"),
    "phone-input": resolve(__dirname, "src/phone-input/index.ts"),
    "lightbox": resolve(__dirname, "src/lightbox/index.ts"),
    "accordion": resolve(__dirname, "src/accordion/index.ts"),
    "tabs": resolve(__dirname, "src/tabs/index.ts"),
    "video": resolve(__dirname, "src/video/index.ts"),
    "number-input": resolve(__dirname, "src/number-input/index.ts"),
};

// Global names for each component
const globalNames = {
    "index": "PxmElements",
    "phone-input": "PxmPhoneInput",
    "lightbox": "PxmLightbox",
    "accordion": "PxmAccordion",
    "tabs": "PxmTabs",
    "video": "PxmVideo",
    "number-input": "PxmNumberInput"
};

export default defineConfig(({ mode }) => {
    const component = mode || "index";
    const entry = componentEntries[component];
    const globalName = globalNames[component];

    if (!entry) {
        throw new Error(`Unknown component: ${component}`);
    }

    // Make heavy dependencies external for all components
    // Users can load them separately from CDN for better caching
    const external: string[] = [];
    const globals: Record<string, string> = {};
    
    if (component === 'lightbox') {
        external.push('swiper', 'swiper/modules', 'swiper/css', 'swiper/css/navigation', 'swiper/css/pagination');
        globals['swiper'] = 'Swiper';
        globals['swiper/modules'] = 'SwiperModules';
    } else if (component === 'phone-input') {
        external.push('intl-tel-input', 'intl-tel-input/intlTelInputWithUtils');
        globals['intl-tel-input'] = 'intlTelInput';
        globals['intl-tel-input/intlTelInputWithUtils'] = 'intlTelInput';
    }

    return {
        plugins: [],
        build: {
            lib: {
                entry,
                formats: ["umd"],
                fileName: () => `${component}.js`,
                name: globalName
            },
            outDir: 'dist/umd',
            rollupOptions: {
                external,
                output: {
                    format: 'umd',
                    exports: 'named',
                    ...(Object.keys(globals).length > 0 && { globals })
                },
                treeshake: {
                    preset: 'recommended',
                    moduleSideEffects: false
                }
            },
            sourcemap: true,
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.log', 'console.info'],
                    passes: 2
                },
                mangle: {
                    properties: {
                        regex: /^_/
                    }
                }
            },
            emptyOutDir: component === "index"
        },
    };
}); 