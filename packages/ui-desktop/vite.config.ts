import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: "src/main.ts",
        vite: {
          build: {
            rollupOptions: {
              // Instructs the bundler to keep these modules external.
              external: ["dockerode", "ssh2"],
            },
          },
        },
      },
      {
        entry: "src/preload.ts",
        // Force the output filename to be .cjs
        fileName: "preload.cjs",
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete.
          options.reload();
        },
      },
    ]),
    renderer(),
  ],
});
