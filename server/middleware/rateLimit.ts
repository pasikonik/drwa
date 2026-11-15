// Throttle the public POST endpoints (checkout, contact, newsletter, signup):
// every checkout attempt creates an order + a Stripe PaymentIntent, and every
// form sends a real e-mail.
//
// shortcut: counters live in memory per PM2 worker, so the real limit is about
// MAX_PER_WINDOW × workers, and the IP comes from Cloudflare's header (a client
// that reaches the origin directly can fake it). Move to a Cloudflare rate-limit
// rule or a shared store if abuse continues.
const WINDOW_MS = 10 * 60_000
const MAX_PER_WINDOW = 10
const MAX_TRACKED = 5000

const hits = new Map<string, { count: number; resetAt: number }>()

export default defineEventHandler((event) => {
  if (import.meta.dev || event.method !== 'POST') return
  const path = event.path.split('?')[0]!
  // Stripe's webhook comes from Stripe's IPs and is verified by signature.
  if (!path.startsWith('/api/') || path.startsWith('/api/stripe/')) return

  const now = Date.now()
  if (hits.size > MAX_TRACKED) {
    for (const [key, v] of hits) if (v.resetAt <= now) hits.delete(key)
    if (hits.size > MAX_TRACKED) hits.clear() // flood of unique keys: fail open rather than grow forever
  }

  // Behind the proxy the socket address is the proxy itself — everyone would
  // share one bucket — so prefer the forwarded client address.
  const ip = getRequestHeader(event, 'cf-connecting-ip') || getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const key = `${ip}:${path}`
  const entry = hits.get(key)
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return
  }
  if (++entry.count > MAX_PER_WINDOW) {
    setResponseHeader(event, 'retry-after', Math.ceil((entry.resetAt - now) / 1000))
    throw createError({ statusCode: 429, statusMessage: 'Zbyt wiele prób. Spróbuj ponownie za kilka minut.' })
  }
})
