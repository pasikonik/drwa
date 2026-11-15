import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Server logic only (pricing, …): plain Node, no Nuxt runtime. `~` mirrors Nuxt's alias.
export default defineConfig({
  resolve: { alias: { '~': fileURLToPath(new URL('./app', import.meta.url)) } },
  test: { include: ['tests/**/*.test.ts'] },
})
