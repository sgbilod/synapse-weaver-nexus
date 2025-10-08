import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main process
        entry: "src/main.ts",
        vite: {
          build: {
            outDir: "dist-electron",
            lib: {
              entry: "src/main.ts",
              formats: ["es"],
              fileName: () => "main.js",
            },
            rollupOptions: {
              external: [
                "electron",
                "@synapse/nexus-core",
                "dockerode",
                "ssh2",
                "ssh2-streams",
                "cpu-features",
                "docker-modem",
              ],
            },
          },
        },
      },
      {
        // Preload scripts - MUST be CommonJS for Electron
        entry: "src/preload.ts",
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete
          options.reload();
        },
        vite: {
          build: {
            outDir: "dist-electron",
            lib: {
              entry: "src/preload.ts",
              formats: ["cjs"], // CommonJS required for preload
              fileName: () => "preload.cjs", // .cjs extension to avoid ES module interpretation
            },
            rollupOptions: {
              external: ["electron"],
            },
          },
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
});
