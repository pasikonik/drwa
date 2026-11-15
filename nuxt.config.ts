// nuxt.config.ts
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2026-06-09',
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'pl' },
      // Site-wide favicon. Pages set their own `title` via useHead; the
      // description below is only the default for pages that set none.
      link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
      meta: [
        { name: 'description', content: 'DRWA — warsztaty stolarskie i ciesielskie, kursy online oraz blog o pracy z drewnem. Drewno · Rzemiosło · Szkolenia.' },
        { property: 'og:site_name', content: 'DRWA' },
        { property: 'og:locale', content: 'pl_PL' },
        { property: 'og:type', content: 'website' },
      ],
    },
  },

  // NOTE: this explicit list is load-bearing, not redundant. Nuxt runs listed
  // plugins before auto-scanned ones; directus.ts must provide `$directus`
  // before auth.ts calls useAuth(), and auto-scan order is alphabetical
  // (auth → cart → directus), which would break it.
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
    '~/assets/css/oferta.css',
    '~/assets/css/realizacje.css',
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
    resendApiKey: process.env.RESEND_API_KEY || '',
    public: {
      directusUrl: process.env.NUXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || 'http://localhost:8055',
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      gtmId: process.env.NUXT_PUBLIC_GTM_ID || ''
    }
  },

  // Long-term caching for Nuxt-served static files in public/.
  // Directus /assets/* are served by Directus itself — configure
  // ASSETS_CACHE_TTL (seconds) in the Directus environment for those.
  routeRules: {
    // No CSP on purpose: Stripe Elements and GTM make a correct policy a project of its own.
    '/**': {
      headers: {
        'strict-transport-security': 'max-age=31536000',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'SAMEORIGIN',
        'referrer-policy': 'strict-origin-when-cross-origin',
      },
    },

    // Bezpieczna konfiguracja pod webhook Stripe (brak cache + surowe body)
    '/api/stripe/webhook': { cache: false },

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
        '@directus/sdk',
        '@stripe/stripe-js',
      ]
    }
  }
})