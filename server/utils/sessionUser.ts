import { createDirectus, rest, staticToken, readMe } from '@directus/sdk'
import type { H3Event } from 'h3'
import type { Schema } from '~/types/directus'

/** Cookie name shared with the client-side useAuth composable. */
export const AUTH_COOKIE = 'drwa_auth'

/**
 * Resolve the currently logged-in Directus user id from the auth cookie, or
 * null for guests. Used to attach orders to accounts and to gate order access.
 */
export async function resolveUserId(event: H3Event): Promise<string | null> {
  const token = getCookie(event, AUTH_COOKIE)
  if (!token) return null
  try {
    const { directusUrl } = useRuntimeConfig()
    const base = (directusUrl || '').replace(/\/$/, '')
    const client = createDirectus<Schema>(base).with(staticToken(token)).with(rest())
    const me = (await client.request(readMe({ fields: ['id'] }))) as { id?: string } | null
    return me?.id ?? null
  } catch {
    return null
  }
}
