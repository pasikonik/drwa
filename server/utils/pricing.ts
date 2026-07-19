import { readItems } from '@directus/sdk'
import type { Product, ProductVariant } from '~/types/directus'
import type {
  CheckoutItemInput,
  ComputedLine,
  ComputedOrder,
  ShippingMethod,
} from '~/types/shop'
import { SHIPPING_RATES, FREE_SHIPPING_THRESHOLD } from '~/utils/shipping'
import { normalizeProduct, isWorkshopPast } from '~/utils/product'
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

  // Merge duplicate lines (same product + variant) so each is priced and
  // validated against its CUMULATIVE quantity. Without this, a crafted request
  // could split a workshop/variant across several lines and slip past the
  // per-line capacity/stock checks below, overselling seats or stock.
  const mergedById = new Map<string, CheckoutItemInput>()
  for (const it of items) {
    const key = `${it.productId}:${it.variantId ?? 'x'}`
    const existing = mergedById.get(key)
    const qty = Math.max(1, Math.floor(it.qty))
    if (existing) existing.qty += qty
    else mergedById.set(key, { productId: it.productId, variantId: it.variantId, qty })
  }
  items = [...mergedById.values()]

  const client = directusAdmin()
  const productIds = [...new Set(items.map((i) => i.productId))]

  const rawProducts = (await client.request(
    readItems('products', {
      filter: { id: { _in: productIds } },
      fields: [
        'id', 'title', 'price',
        { workshop: ['id', 'date_start', 'spots_total', 'spots_booked', 'advance'] },
        { course: ['id'] },
      ],
      limit: -1,
    }),
  )) as unknown[]
  const products: Product[] = rawProducts.map(normalizeProduct)

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
    const unitPrice = product.type === 'workshop' && product.workshop?.advance != null
      ? Number(product.workshop.advance)
      : Number(product.price)
    if (!Number.isFinite(unitPrice) || unitPrice < 0) fail(`Niepoprawna cena produktu „${product.title}".`)

    if (product.type === 'merch') {
      if (item.variantId != null) {
        const variant = variantById.get(item.variantId)
        if (!variant || variant.product_id !== product.id) fail(`Wariant produktu „${product.title}" jest niepoprawny.`)
        if (variant.stock < qty) fail(`Za mało sztuk „${product.title}" (rozmiar ${variant.size ?? '—'}) na stanie.`)
      }
    } else if (product.type === 'workshop') {
      const w = product.workshop
      if (isWorkshopPast(w)) fail(`Nie można zapisać się na miniony warsztat „${product.title}".`)
      const free = (w?.spots_total ?? 0) - (w?.spots_booked ?? 0)
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
