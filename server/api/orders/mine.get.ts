import { readItems } from '@directus/sdk'
import type { Order, OrderItem, Product, OrderWithItems, OrderItemExpanded } from '~/types/directus'
import { directusAdmin } from '../../utils/directusAdmin'
import { resolveUserId } from '../../utils/sessionUser'

export default defineEventHandler(async (event): Promise<OrderWithItems[]> => {
  const userId = await resolveUserId(event)
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Zaloguj się, aby zobaczyć zamówienia.' })

  const client = directusAdmin()

  const orders = (await client.request(
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

  if (!orders.length) return []

  const orderIds = orders.map((o) => o.id)
  const allItems = (await client.request(
    readItems('order_items', {
      filter: { order_id: { _in: orderIds } },
      fields: ['id', 'quantity', 'price_at_purchase', 'order_id', 'product_id', 'variant_id'],
      limit: -1,
    }),
  )) as OrderItem[]

  const productIds = [...new Set(allItems.map((i) => i.product_id).filter((v): v is number => v != null))]
  const products = productIds.length
    ? ((await client.request(
        readItems('products', {
          filter: { id: { _in: productIds } },
          fields: ['id', 'title', 'slug', 'type', 'image', 'course_access_url'],
          limit: -1,
        }),
      )) as Pick<Product, 'id' | 'title' | 'slug' | 'type' | 'image' | 'course_access_url'>[])
    : []

  const productById = new Map(products.map((p) => [p.id, p]))

  const itemsByOrder = new Map<string, OrderItemExpanded[]>()
  for (const item of allItems) {
    const expanded: OrderItemExpanded = {
      ...item,
      product: item.product_id != null ? productById.get(item.product_id) ?? null : null,
    }
    const key = item.order_id ?? ''
    const list = itemsByOrder.get(key) ?? []
    list.push(expanded)
    itemsByOrder.set(key, list)
  }

  return orders.map((o) => ({ ...o, items: itemsByOrder.get(o.id) ?? [] }))
})
