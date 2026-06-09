// nuxt.config.ts
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2026-06-09',
  devtools: { enabled: true },
  
  // POPRAWKA: Usunęliśmy podwójne /app
  plugins: [
    '~/plugins/directus.ts'
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