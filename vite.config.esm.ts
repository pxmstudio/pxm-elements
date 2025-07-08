import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get the current version
const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
const PACKAGE_VERSION = packageJson.version;

export default defineConfig({
    define: {
        __PACKAGE_VERSION__: JSON.stringify(PACKAGE_VERSION)
    },
    plugins: [],
    build: {
        lib: {
            entry: {
                index: resolve(__dirname, "src/main.ts"),
                "phone-input": resolve(__dirname, "src/phone-input/index.ts"),
                "lightbox": resolve(__dirname, "src/lightbox/index.ts"),
                "accordion": resolve(__dirname, "src/accordion/index.ts"),
                "tabs": resolve(__dirname, "src/tabs/index.ts"),
                "video": resolve(__dirname, "src/video/index.ts"),
                "number-input": resolve(__dirname, "src/number-input/index.ts"),
                "toggle": resolve(__dirname, "src/toggle/index.ts"),
                "select": resolve(__dirname, "src/select/index.ts"),
                "slider": resolve(__dirname, "src/slider/index.ts"),
                "tooltip": resolve(__dirname, "src/tooltip/index.ts"),
                "dialog": resolve(__dirname, "src/dialog/index.ts"),
                "dropdown": resolve(__dirname, "src/dropdown/index.ts"),
                "switch": resolve(__dirname, "src/switch/index.ts")
            },
            formats: ["es"],
            fileName: (format, entryName) => `${entryName}.js`
        },
        outDir: 'dist/esm',
        rollupOptions: {
            // Keep dependencies external for ESM builds (tree-shaking, peer deps)
            external: ["intl-tel-input", "medium-zoom", "swiper"],
            output: {
                format: 'es',
                exports: 'named',
                preserveModules: false
            }
        },
        sourcemap: true,
        minify: true,
        emptyOutDir: true
    },
}); 