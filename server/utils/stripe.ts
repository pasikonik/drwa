import Stripe from 'stripe'

let _stripe: Stripe | null = null

/**
 * Lazily-constructed Stripe client. Uses the SDK's pinned API version.
 * Throws a 500 if the secret key is not configured.
 */
export function getStripe(): Stripe {
  if (_stripe) return _stripe
  const { stripeSecretKey } = useRuntimeConfig()
  if (!stripeSecretKey) {
    throw createError({ statusCode: 500, statusMessage: 'Stripe nie jest skonfigurowany (brak STRIPE_SECRET_KEY).' })
  }
  _stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2026-05-27.dahlia',
  })
  return _stripe
}
