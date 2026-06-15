import { createDirectus, rest, staticToken } from '@directus/sdk'
import type { DirectusClient, RestClient } from '@directus/sdk'
import type { Schema } from '~/types/directus'

export type AdminClient = DirectusClient<Schema> & RestClient<Schema>

let _client: AdminClient | null = null

/**
 * Server-only Directus client authenticated with the service token.
 * Has the elevated permissions needed to create orders and adjust stock /
 * workshop bookings. NEVER import this into client-side code.
 */
export function directusAdmin(): AdminClient {
  if (_client) return _client
  const { directusUrl, directusServiceToken } = useRuntimeConfig()
  if (!directusServiceToken) {
    throw createError({ statusCode: 500, statusMessage: 'Brak DIRECTUS_SERVICE_TOKEN — serwer nie może zapisać zamówienia.' })
  }
  const base = (directusUrl || '').replace(/\/$/, '')
  _client = createDirectus<Schema>(base).with(staticToken(directusServiceToken)).with(rest()) as AdminClient
  return _client
}
