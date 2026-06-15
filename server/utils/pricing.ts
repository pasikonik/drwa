import { readItems } from '@directus/sdk'
import type { Product, ProductVariant } from '~/types/directus'
import type {
  CheckoutItemInput,
  ComputedLine,
  ComputedOrder,
  ShippingMethod,
} from '~/types/shop'
import { SHIPPING_RATES, FREE_SHIPPING_THRESHOLD } from '~/utils/shipping'
import { directusAdmin } from './directusAdmin'

function fail(message: string): never {
  throw createError({ statusCode: 400, statusMessage: message })
}

/**
 * Re-price a cart authoritatively from Directus and validate stock / capacity.
 * The client's prices are ignored entirely — only product ids, variant ids and
 * quantities are trusted, and even those are validated here.
 */
export async function computeOrder(
  items: CheckoutItemInput[],
  shippingMethod: ShippingMethod | null,
): Promise<ComputedOrder> {
  if (!items?.length) fail('Koszyk jest pusty.')

  const client = directusAdmin()
  const productIds = [...new Set(items.map((i) => i.productId))]

  const products = (await client.request(
    readItems('products', {
      filter: { id: { _in: productIds } },
      fields: [
        'id', 'title', 'type', 'price', 'stock',
        'workshop_capacity', 'workshop_booked',
      ],
      limit: -1,
    }),
  )) as Product[]

  const variantIds = items.map((i) => i.variantId).filter((v): v is number => v != null)
  const variants = variantIds.length
    ? ((await client.request(
        readItems('product_variants', {
          filter: { id: { _in: variantIds } },
          fields: ['id', 'product_id', 'size', 'stock'],
          limit: -1,
        }),
      )) as ProductVariant[])
    : []

  const productById = new Map(products.map((p) => [p.id, p]))
  const variantById = new Map(variants.map((v) => [v.id, v]))

  const lines: ComputedLine[] = []

  for (const item of items) {
    const product = productById.get(item.productId)
    if (!product) fail(`Produkt #${item.productId} nie istnieje.`)

    const qty = Math.max(1, Math.floor(item.qty))
    const unitPrice = Number(product.price)
    if (!Number.isFinite(unitPrice) || unitPrice < 0) fail(`Niepoprawna cena produktu „${product.title}".`)

    if (product.type === 'merch') {
      if (item.variantId != null) {
        const variant = variantById.get(item.variantId)
        if (!variant || variant.product_id !== product.id) fail(`Wariant produktu „${product.title}" jest niepoprawny.`)
        if (variant.stock < qty) fail(`Za mało sztuk „${product.title}" (rozmiar ${variant.size ?? '—'}) na stanie.`)
      } else if (product.stock < qty) {
        fail(`Za mało sztuk „${product.title}" na stanie.`)
      }
    } else if (product.type === 'workshop') {
      const free = (product.workshop_capacity ?? 0) - (product.workshop_booked ?? 0)
      if (free < qty) fail(`Za mało wolnych miejsc na „${product.title}".`)
    }
    // course: no stock constraint

    const effectiveQty = product.type === 'course' ? 1 : qty
    lines.push({
      productId: product.id,
      variantId: item.variantId,
      type: product.type,
      title: product.title,
      unitPrice,
      qty: effectiveQty,
      lineTotal: round2(unitPrice * effectiveQty),
    })
  }

  const subtotal = round2(lines.reduce((sum, l) => sum + l.lineTotal, 0))
  const hasPhysical = lines.some((l) => l.type === 'merch')

  let shippingCost = 0
  if (hasPhysical) {
    if (!shippingMethod || !SHIPPING_RATES[shippingMethod]) fail('Wybierz metodę dostawy.')
    shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATES[shippingMethod].cost
  }

  const total = round2(subtotal + shippingCost)
  return {
    lines,
    subtotal,
    shippingCost,
    total,
    totalGrosze: Math.round(total * 100),
    hasPhysical,
  }
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}
