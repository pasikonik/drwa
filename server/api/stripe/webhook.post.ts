import { readItem, updateItem, updateItems } from '@directus/sdk'
import type Stripe from 'stripe'
import type { Order } from '~/types/directus'
import { getStripe } from '../../utils/stripe'
import { directusAdmin } from '../../utils/directusAdmin'
import { fulfillOrder } from '../../utils/fulfillment'

export default defineEventHandler(async (event) => {
  const stripe = getStripe()
  const { stripeWebhookSecret } = useRuntimeConfig()
  const sig = getHeader(event, 'stripe-signature')
  const raw = await readRawBody(event)

  if (!sig || !raw || !stripeWebhookSecret) {
    throw createError({ statusCode: 400, statusMessage: 'Brak podpisu webhooka lub konfiguracji.' })
  }

  let evt: Stripe.Event
  try {
    evt = stripe.webhooks.constructEvent(raw, sig, stripeWebhookSecret)
  } catch (err) {
    throw createError({ statusCode: 400, statusMessage: `Weryfikacja podpisu nie powiodła się: ${(err as Error).message}` })
  }

  const client = directusAdmin()

  const orderIdFrom = (pi: Stripe.PaymentIntent): string | undefined => pi.metadata?.order_id

  if (evt.type === 'payment_intent.succeeded') {
    const orderId = orderIdFrom(evt.data.object as Stripe.PaymentIntent)
    if (orderId) {
      // Idempotency guard — claim the order with ONE conditional write, then
      // fulfill only if this request flipped it. Checking the status first and
      // writing later let two simultaneous deliveries (Stripe retries, PM2
      // cluster) both pass the check and fulfill twice.
      // shortcut: Directus resolves the filter and then updates by key, so the
      // window is tiny but not zero — upgrade to a DB-level lock if it ever bites.
      const claimed = (await client.request(
        updateItems(
          'orders',
          { filter: { id: { _eq: orderId }, status: { _nin: ['paid', 'shipped'] } } },
          { status: 'paid' },
        ),
      )) as Order[]
      if (claimed.length) {
        try {
          await fulfillOrder(orderId)
        } catch (err) {
          // Give the order back so Stripe's retry of this event can try again
          // instead of being skipped as "already paid".
          await client.request(updateItem('orders', orderId, { status: 'pending' })).catch(() => {})
          throw err
        }
      }
    }
  } else if (evt.type === 'payment_intent.payment_failed') {
    const orderId = orderIdFrom(evt.data.object as Stripe.PaymentIntent)
    if (orderId) {
      const order = (await client.request(readItem('orders', orderId, { fields: ['id', 'status'] }))) as Order | null
      if (order && order.status === 'pending') {
        await client.request(updateItem('orders', orderId, { status: 'cancelled' }))
      }
    }
  }

  return { received: true }
})
