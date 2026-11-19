import { readItems } from '@directus/sdk'
import type { Order, OrderItem, OrderProductRef, OrderWithItems } from '~/types/directus'
import { toOrderProductRef } from '~/utils/product'
import { directusAdmin } from './directusAdmin'

/**
 * Attach line items (with product info) to orders, in three Directus reads
 * regardless of how many orders. The course access link is only revealed once
 * the order is paid — an unpaid order must not unlock the course.
 */
export async function expandOrders(orders: Order[]): Promise<OrderWithItems[]> {
  if (!orders.length) return []
  const client = directusAdmin()

  const items = (await client.request(
    readItems('order_items', {
      filter: { order_id: { _in: orders.map((o) => o.id) } },
      fields: ['id', 'quantity', 'price_at_purchase', 'discount_amount', 'order_id', 'product_id', 'variant_id'],
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

  const itemsByOrder = new Map<string, OrderItem[]>()
  for (const item of items) {
    const key = item.order_id ?? ''
    itemsByOrder.set(key, [...(itemsByOrder.get(key) ?? []), item])
  }

  return orders.map((order) => {
    const paid = order.status === 'paid' || order.status === 'shipped'
    return {
      ...order,
      items: (itemsByOrder.get(order.id) ?? []).map((item) => {
        const product = item.product_id != null ? productById.get(item.product_id) : undefined
        return {
          ...item,
          product: product ? { ...product, course_access_url: paid ? product.course_access_url : null } : null,
        }
      }),
    }
  })
}
