import { defineConfig } from "vite";

export default defineConfig({
    plugins: [],
    server: {
        host: "localhost",
        cors: true,
        port: 5173,
        hmr: {
            host: "localhost",
            protocol: "ws",
        },
    },
    // This config is primarily for development
    // Production builds use vite.config.esm.ts and vite.config.umd.ts
});