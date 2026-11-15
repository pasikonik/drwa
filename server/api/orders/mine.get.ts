import { readItems } from '@directus/sdk'
import type { Order, OrderWithItems } from '~/types/directus'
import { directusAdmin } from '../../utils/directusAdmin'
import { expandOrders } from '../../utils/orders'
import { resolveUserId } from '../../utils/sessionUser'

export default defineEventHandler(async (event): Promise<OrderWithItems[]> => {
  const userId = await resolveUserId(event)
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Zaloguj się, aby zobaczyć zamówienia.' })

  const orders = (await directusAdmin().request(
    readItems('orders', {
      filter: { customer: { _eq: userId } },
      sort: ['-date_created'],
      fields: [
        'id', 'status', 'total_price', 'subtotal', 'shipping_method', 'shipping_cost',
        'email', 'date_created', 'shpping_address', 'customer',
      ],
      limit: -1,
    }),
  )) as Order[]

  return expandOrders(orders)
})
