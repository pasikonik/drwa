// nuxt.config.ts
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2026-06-09',
  devtools: { enabled: true },

  plugins: [
    '~/plugins/directus.ts'
  ],

  css: [
    '~/assets/css/drwa-tokens.css',
    '~/assets/css/site.css',
    '~/assets/css/warsztat.css',
    '~/assets/css/sklep.css',
    '~/assets/css/produkt.css',
    '~/assets/css/blog.css',
    '~/assets/css/onas.css',
    '~/assets/css/kontakt.css',
    '~/assets/css/kurs.css',
  ],

  runtimeConfig: {
    public: {
      directusUrl: process.env.DIRECTUS_URL || 'http://localhost:8055'
    }
  },

  // Long-term caching for Nuxt-served static files in public/.
  // Directus /assets/* are served by Directus itself — configure
  // ASSETS_CACHE_TTL (seconds) in the Directus environment for those.
  routeRules: {
    '/assets/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/*.avif':    { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/*.png':     { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/*.jpg':     { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/*.webp':    { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/*.svg':     { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },

  nitro: {
    // Brotli + gzip for all static assets served by Nitro.
    compressPublicAssets: { brotli: true, gzip: true },
  },

  vite: {
    optimizeDeps: {
      include: [
        '@directus/sdk'
      ]
    }
  }
})