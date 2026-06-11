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
    '~/assets/css/blog.css',
    '~/assets/css/onas.css',
  ],

  runtimeConfig: {
    public: {
      directusUrl: process.env.DIRECTUS_URL || 'http://localhost:8055'
    }
  },

  vite: {
    optimizeDeps: {
      include: [
        '@directus/sdk'
      ]
    }
  }
})