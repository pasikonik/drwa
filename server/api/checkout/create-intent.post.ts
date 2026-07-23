import { createItem, createItems, updateItem } from '@directus/sdk'
import type { Order } from '~/types/directus'
import type { CreateIntentPayload, CreateIntentResponse } from '~/types/shop'
import { computeOrder } from '../../utils/pricing'
import { directusAdmin } from '../../utils/directusAdmin'
import { getStripe } from '../../utils/stripe'
import { resolveUserId } from '../../utils/sessionUser'

export default defineEventHandler(async (event): Promise<CreateIntentResponse> => {
  const body = await readBody<CreateIntentPayload>(event)
  const { items, email, firstName, lastName, shippingMethod, address } = body ?? ({} as CreateIntentPayload)

  if (!email || !email.includes('@')) {
    throw createError({ statusCode: 400, statusMessage: 'Podaj poprawny adres e-mail.' })
  }

  // Authoritative re-pricing + stock/capacity validation. Throws 400 on problems.
  const computed = await computeOrder(items, shippingMethod)

  if (computed.hasPhysical && !address) {
    throw createError({ statusCode: 400, statusMessage: 'Podaj adres dostawy.' })
  }

  // Course orders need buyer identity for external access provisioning (Zanfia).
  // hasCourse is derived server-side from real Directus product types, so a
  // crafted client cart cannot skip this by lying about item types.
  const firstNameTrimmed = firstName?.trim() || null
  const lastNameTrimmed = lastName?.trim() || null
  if (computed.hasCourse && (!firstNameTrimmed || !lastNameTrimmed)) {
    throw createError({ statusCode: 400, statusMessage: 'Podaj imię i nazwisko — są potrzebne do dostępu do kursu.' })
  }
  if (computed.totalGrosze < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Kwota zamówienia jest nieprawidłowa.' })
  }

  const config = useRuntimeConfig()
  const client = directusAdmin()
  const stripe = getStripe()
  const customerId = await resolveUserId(event)

  // 1. Pending order
  const order = (await client.request(
    createItem('orders', {
      status: 'pending',
      total_price: computed.total,
      subtotal: computed.subtotal,
      shipping_method: computed.hasPhysical ? shippingMethod : null,
      shipping_cost: computed.shippingCost,
      email,
      first_name: firstNameTrimmed,
      last_name: lastNameTrimmed,
      shpping_address: address ? JSON.stringify(address) : null,
      ...(customerId ? { customer: customerId } : {}),
    }),
  )) as Order

  // 2. Line items
  await client.request(
    createItems(
      'order_items',
      computed.lines.map((l) => ({
        order_id: order.id,
        product_id: l.productId,
        variant_id: l.variantId,
        quantity: l.qty,
        price_at_purchase: l.unitPrice,
      })),
    ),
  )

  // 3. PaymentIntent — amount is server-computed, never trusted from the client
  const intent = await stripe.paymentIntents.create({
    amount: computed.totalGrosze,
    currency: 'pln',
    automatic_payment_methods: { enabled: true },
    receipt_email: email,
    metadata: { order_id: order.id },
  })

  // 4. Persist the intent id for webhook reconciliation
  await client.request(updateItem('orders', order.id, { payment_intent_id: intent.id }))

  if (!intent.client_secret) {
    throw createError({ statusCode: 502, statusMessage: 'Stripe nie zwrócił client_secret.' })
  }

  return {
    clientSecret: intent.client_secret,
    orderId: order.id,
    publishableKey: config.public.stripePublishableKey,
  }
})
