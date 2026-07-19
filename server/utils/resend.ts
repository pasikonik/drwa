import { Resend } from 'resend'

let _resend: Resend | null = null

/**
 * Lazily-constructed Resend client.
 * Throws a 500 if the API key is not configured.
 */
export function getResend(): Resend {
  if (_resend) return _resend
  const { resendApiKey } = useRuntimeConfig()
  if (!resendApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Wysyłka wiadomości nie jest skonfigurowana (brak RESEND_API_KEY).' })
  }
  _resend = new Resend(resendApiKey)
  return _resend
}
