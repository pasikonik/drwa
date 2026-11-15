import { createDirectus, rest } from '@directus/sdk'
import type { Schema } from '~/types/directus'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // SSR talks to Directus over the internal address (same VPS) instead of
  // going out through the public URL and back; the browser needs the public one.
  const url = import.meta.server ? config.directusUrl : config.public.directusUrl
  const directus = createDirectus<Schema>(url.replace(/\/$/, '')).with(rest())

  return {
    provide: { directus }
  }
})