import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
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
                "lightbox": resolve(__dirname, "src/lightbox/index.ts")
            },
            formats: ["es"],
            fileName: (format, entryName) => `${entryName}.js`
        },
        rollupOptions: {
            external: ["intl-tel-input"],
            output: {
                globals: {
                    "intl-tel-input": "intlTelInput"
                }
            }
        },
        sourcemap: true,
        minify: true
    },
});