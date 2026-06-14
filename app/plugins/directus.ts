import { createDirectus, rest } from '@directus/sdk'
import type { Schema } from '~/types/directus'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const directus = createDirectus<Schema>(config.public.directusUrl.replace(/\/$/, '')).with(rest())

  return {
    provide: { directus }
  }
})