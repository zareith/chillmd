import preact from "@preact/preset-vite";
import { defineConfig } from "vite";
import { stylex } from "vite-plugin-stylex-dev";
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [
    preact(),
    stylex(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        navigateFallback: "index.html",
        type: "module"
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      strategies: "injectManifest",
      srcDir: 'src',
      filename: 'sw.ts',
      manifest: {
        name: 'Note Goblin',
        short_name: 'NGoblin',
        description: 'Versatile tool for managing Markdown notes',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
