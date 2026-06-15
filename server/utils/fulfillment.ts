import { readItems, updateItem } from '@directus/sdk'
import type { OrderItem, Product, ProductVariant } from '~/types/directus'
import { directusAdmin } from './directusAdmin'

/**
 * Apply post-payment side effects for an order: decrement merch stock and
 * increment workshop bookings. Must only be called once per order — the
 * webhook guards on the pending→paid transition for idempotency.
 */
export async function fulfillOrder(orderId: string): Promise<void> {
  const client = directusAdmin()

  const items = (await client.request(
    readItems('order_items', {
      filter: { order_id: { _eq: orderId } },
      fields: ['id', 'quantity', 'product_id', 'variant_id'],
      limit: -1,
    }),
  )) as OrderItem[]

  const productIds = [...new Set(items.map((i) => i.product_id).filter((v): v is number => v != null))]
  const products = productIds.length
    ? ((await client.request(
        readItems('products', {
          filter: { id: { _in: productIds } },
          fields: ['id', 'type', 'stock', 'workshop_booked'],
          limit: -1,
        }),
      )) as Product[])
    : []

  const variantIds = items.map((i) => i.variant_id).filter((v): v is number => v != null)
  const variants = variantIds.length
    ? ((await client.request(
        readItems('product_variants', {
          filter: { id: { _in: variantIds } },
          fields: ['id', 'stock'],
          limit: -1,
        }),
      )) as ProductVariant[])
    : []

  const productById = new Map(products.map((p) => [p.id, p]))
  const variantById = new Map(variants.map((v) => [v.id, v]))

  for (const item of items) {
    const product = item.product_id != null ? productById.get(item.product_id) : undefined
    if (!product) continue

    if (product.type === 'merch') {
      if (item.variant_id != null) {
        const variant = variantById.get(item.variant_id)
        if (variant) {
          await client.request(updateItem('product_variants', variant.id, {
            stock: Math.max(0, variant.stock - item.quantity),
          }))
        }
      } else {
        await client.request(updateItem('products', product.id, {
          stock: Math.max(0, product.stock - item.quantity),
        }))
      }
    } else if (product.type === 'workshop') {
      await client.request(updateItem('products', product.id, {
        workshop_booked: (product.workshop_booked ?? 0) + item.quantity,
      }))
    }
    // course: nothing to reserve
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
