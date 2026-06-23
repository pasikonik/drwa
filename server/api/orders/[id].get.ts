import { readItem, readItems } from '@directus/sdk'
import type { Order, OrderItem, OrderProductRef, OrderWithItems, OrderItemExpanded } from '~/types/directus'
import { toOrderProductRef } from '~/utils/product'
import { directusAdmin } from '../../utils/directusAdmin'
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

  const items = (await client.request(
    readItems('order_items', {
      filter: { order_id: { _eq: id } },
      fields: ['id', 'quantity', 'price_at_purchase', 'order_id', 'product_id', 'variant_id'],
      limit: -1,
    }),
  )) as OrderItem[]

  const productIds = [...new Set(items.map((i) => i.product_id).filter((v): v is number => v != null))]
  const products: OrderProductRef[] = productIds.length
    ? ((await client.request(
        readItems('products', {
          filter: { id: { _in: productIds } },
          fields: [
            'id', 'title', 'slug', 'image',
            { workshop: ['id'] },
            { course: ['id', 'course_access_url'] },
          ],
          limit: -1,
        }),
      )) as unknown[]).map(toOrderProductRef)
    : []

  const productById = new Map(products.map((p) => [p.id, p]))

  const expanded: OrderItemExpanded[] = items.map((i) => ({
    ...i,
    product: i.product_id != null ? productById.get(i.product_id) ?? null : null,
  }))

  return { ...order, items: expanded }
})
