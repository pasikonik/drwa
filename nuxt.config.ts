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
    '~/assets/css/shop.css',
    '~/assets/css/blog.css',
    '~/assets/css/onas.css',
    '~/assets/css/kontakt.css',
    '~/assets/css/kurs.css',
  ],

  runtimeConfig: {
    // Server-only — never exposed to the client.
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    directusServiceToken: process.env.DIRECTUS_SERVICE_TOKEN || '',
    directusUrl: process.env.DIRECTUS_URL || 'http://localhost:8055',
    mailerLiteApiKey: process.env.MAILERLITE_API_KEY || '',
    mailerLiteGroupId: process.env.MAILERLITE_GROUP_ID || '',
    public: {
      directusUrl: process.env.NUXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || 'http://localhost:8055',
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
    }
  },

  // Long-term caching for Nuxt-served static files in public/.
  // Directus /assets/* are served by Directus itself — configure
  // ASSETS_CACHE_TTL (seconds) in the Directus environment for those.
  routeRules: {
    // Bezpieczna konfiguracja pod webhook Stripe (brak cache + surowe body)
    '/api/stripe/webhook': { 
      cache: false,
      experimentalNoDirectResponse: true 
    },

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