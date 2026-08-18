// DRWA — Directus helpers shared across composables and components.

import type { DirectusFile } from '~/types/directus'

/**
 * Extract a Directus file ID from a file reference, which may be a bare ID
 * string, an expanded `DirectusFile` object, or null/undefined.
 */
export const fileId = (
  file: string | DirectusFile | null | undefined,
): string | null => (!file ? null : typeof file === 'object' ? file.id : file)

/**
 * Is this error worth retrying?
 *
 * Transport failures (undici throws a bare `TypeError: fetch failed` when the
 * connection to Directus drops) carry no HTTP response at all — those are the
 * flaky ones. HTTP errors are only retried when the status says "try again":
 * 408 timeout, 429 rate limit, 5xx server side. A 403 (missing anonymous read
 * permission) is a real bug and must surface immediately, not be retried.
 */
export const isTransientError = (err: unknown): boolean => {
  if (!err || typeof err !== 'object') return false
  const status = (err as { response?: { status?: number } }).response?.status
  if (typeof status !== 'number') return true
  return status === 408 || status === 429 || status >= 500
}

/**
 * Run a Directus request, retrying transient failures with a short backoff.
 *
 * Directus is a remote host, so an SSR render occasionally loses the socket
 * mid-request and throws `fetch failed`. Without this the whole page renders as
 * if the collection were empty (see `recoverOnClient` for the other half).
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  { attempts = 3, baseDelay = 150 }: { attempts?: number; baseDelay?: number } = {},
): Promise<T> => {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt >= attempts - 1 || !isTransientError(err)) throw err
      await new Promise((resolve) => setTimeout(resolve, baseDelay * 2 ** attempt))
    }
  }
}
