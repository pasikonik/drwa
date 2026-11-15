import { readItem } from '@directus/sdk'
import type { Order, OrderWithItems } from '~/types/directus'
import { directusAdmin } from '../../utils/directusAdmin'
import { expandOrders } from '../../utils/orders'
import { resolveUserId } from '../../utils/sessionUser'

export default defineEventHandler(async (event): Promise<OrderWithItems> => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Brak identyfikatora zamówienia.' })

  const client = directusAdmin()

  const order = (await client.request(
    readItem('orders', id, {
      fields: [
        'id', 'status', 'total_price', 'subtotal', 'shipping_method', 'shipping_cost',
        'email', 'payment_intent_id', 'date_created', 'shpping_address', 'customer',
      ],
    }),
  )) as Order | null

  if (!order) throw createError({ statusCode: 404, statusMessage: 'Zamówienie nie zostało znalezione.' })

  // Access control: a logged-in user may not read someone else's order. Guests
  // view by id — the UUID acts as an unguessable capability token.
  const userId = await resolveUserId(event)
  if (order.customer && userId && order.customer !== userId) {
    throw createError({ statusCode: 403, statusMessage: 'Brak dostępu do tego zamówienia.' })
  }

  return (await expandOrders([order]))[0]!
})
