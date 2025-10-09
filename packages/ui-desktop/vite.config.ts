import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'src/main.ts',
        vite: {
          build: {
            rollupOptions: {
              external: ['dockerode', 'ssh2'],
            },
          },
        },
      },
    ]),
    renderer(),
  ],
});
