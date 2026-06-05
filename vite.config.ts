import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'pwa-icon.svg', 'emulator.html'],
        manifest: {
          name: 'Retro Game Emulator',
          short_name: 'RetroEmu',
          description: 'A retro game emulator using EmulatorJS',
          theme_color: '#6366f1',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}'],
          maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/cdn\.emulatorjs\.org\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'emulatorjs-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
