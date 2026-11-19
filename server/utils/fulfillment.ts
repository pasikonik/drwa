import { readItems, updateItem } from '@directus/sdk'
import type { OrderItem, Product } from '~/types/directus'
import { normalizeProduct } from '~/utils/product'
import { directusAdmin } from './directusAdmin'

/**
 * Apply post-payment side effects for an order: increment workshop bookings
 * and send the confirmation email. Must only be called once per order — the
 * webhook guards on the pending→paid transition for idempotency.
 */
export async function fulfillOrder(orderId: string): Promise<void> {
  const client = directusAdmin()

  const items = (await client.request(
    readItems('order_items', {
      filter: { order_id: { _eq: orderId } },
      fields: ['id', 'quantity', 'product_id'],
      limit: -1,
    }),
  )) as OrderItem[]

  const productIds = [...new Set(items.map((i) => i.product_id).filter((v): v is number => v != null))]
  const products: Product[] = productIds.length
    ? ((await client.request(
        readItems('products', {
          filter: { id: { _in: productIds } },
          fields: [
            'id',
            { workshop: ['id', 'spots_booked'] },
            { course: ['id'] },
          ],
          limit: -1,
        }),
      )) as unknown[]).map(normalizeProduct)
    : []

  const productById = new Map(products.map((p) => [p.id, p]))

  for (const item of items) {
    const product = item.product_id != null ? productById.get(item.product_id) : undefined
    if (!product) continue

    if (product.type === 'workshop' && product.workshop) {
      // Seats live on the workshops extension, keyed by its own UUID.
      const w = product.workshop
      const next = (w.spots_booked ?? 0) + item.quantity
      await client.request(updateItem('workshops', w.id, { spots_booked: next }))
      w.spots_booked = next // accumulate if the same workshop spans multiple lines
    }
    // course / merch: nothing to reserve (merch stock isn't tracked)
  }

  await sendOrderEmail(orderId)
}

/**
 * Send the order confirmation (and course-access links for digital items).
 * Stubbed until SMTP / an email provider is configured — see .env.example.
 */
export async function sendOrderEmail(orderId: string): Promise<void> {
  console.info(`[DRWA] Zamówienie ${orderId} opłacone — e-mail potwierdzający czeka na konfigurację SMTP.`)
}
