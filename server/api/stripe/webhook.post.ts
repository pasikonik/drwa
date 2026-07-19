import { readItem, updateItem } from '@directus/sdk'
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
      const order = (await client.request(readItem('orders', orderId, { fields: ['id', 'status'] }))) as Order | null
      // Idempotency guard — only fulfill on the first pending→paid transition.
      // Fulfill BEFORE flipping the status: if fulfillOrder throws, the order
      // stays 'pending' so the next retry of this event re-enters the guard
      // instead of being silently skipped as "already paid".
      if (order && order.status !== 'paid' && order.status !== 'shipped') {
        await fulfillOrder(orderId)
        await client.request(updateItem('orders', orderId, { status: 'paid' }))
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
