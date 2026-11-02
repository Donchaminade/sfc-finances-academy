import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.png', 'icons/apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'SFC Finances',
        short_name: 'SFC Finances',
        description: 'La sagesse divine au service de vos finances : formations en éducation financière chrétienne.',
        lang: 'fr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#FAF6EC',
        theme_color: '#015C30',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,webp,jpg,ico,svg}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/sitemap\.xml/, /^\/robots\.txt/],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        runtimeCaching: [
          { urlPattern: /^https:\/\/fonts\.googleapis\.com\//, handler: 'StaleWhileRevalidate', options: { cacheName: 'google-fonts-css' } },
          { urlPattern: /^https:\/\/fonts\.gstatic\.com\//, handler: 'CacheFirst', options: { cacheName: 'google-fonts', expiration: { maxEntries: 30, maxAgeSeconds: 31536000 }, cacheableResponse: { statuses: [0, 200] } } },
        ],
      },
    }),
  ],
})
