import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dts from 'vite-plugin-dts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [
        dts({
            include: ['src/**/*.ts'],
            outDir: 'dist',
            rollupTypes: true
        })
    ],
    server: {
        host: "localhost",
        cors: true,
        port: 5173,
        hmr: {
            host: "localhost",
            protocol: "ws",
        },
    },
    build: {
        lib: {
            entry: {
                index: resolve(__dirname, "src/main.ts"),
                "phone-input": resolve(__dirname, "src/phone-input/index.ts"),
                "lightbox": resolve(__dirname, "src/lightbox/index.ts"),
                "accordion": resolve(__dirname, "src/accordion/index.ts"),
                "tabs": resolve(__dirname, "src/tabs/index.ts"),
                "video": resolve(__dirname, "src/video/index.ts"),
                "number-input": resolve(__dirname, "src/number-input/index.ts")
            },
            formats: ["es"],
            fileName: (format, entryName) => `${entryName}.js`
        },
        rollupOptions: {
            external: ["intl-tel-input", "medium-zoom", "swiper"],
            output: {
                globals: {
                    "intl-tel-input": "intlTelInput",
                    "medium-zoom": "mediumZoom",
                    "swiper": "Swiper"
                },
                preserveModules: false,
                format: 'es',
                exports: 'named'
            }
        },
        sourcemap: true,
        minify: true
    },
});