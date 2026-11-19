import { aggregate, readItems } from '@directus/sdk'
import type { DiscountCode, Product, ProductVariant } from '~/types/directus'
import type {
  CheckoutItemInput,
  ComputedLine,
  ComputedOrder,
  ShippingMethod,
} from '~/types/shop'
import { SHIPPING_RATES, FREE_SHIPPING_THRESHOLD } from '~/utils/shipping'
import { normalizeProduct, isWorkshopPast, chargePriceFor } from '~/utils/product'
import { directusAdmin } from './directusAdmin'

function fail(message: string): never {
  throw createError({ statusCode: 400, statusMessage: message })
}

/**
 * Re-price a cart authoritatively from Directus and validate variants / capacity.
 * The client's prices are ignored entirely — only product ids, variant ids and
 * quantities are trusted, and even those are validated here.
 */
export async function computeOrder(
  items: CheckoutItemInput[],
  shippingMethod: ShippingMethod | null,
  discountCode?: string | null,
): Promise<ComputedOrder> {
  if (!items?.length) fail('Koszyk jest pusty.')

  // Merge duplicate lines (same product + variant) so each is priced and
  // validated against its CUMULATIVE quantity. Without this, a crafted request
  // could split a workshop across several lines and slip past the per-line
  // capacity check below, overselling seats.
  const mergedById = new Map<string, CheckoutItemInput>()
  for (const it of items) {
    // Trust boundary: the body is client-controlled. A NaN quantity would slip
    // past the `free < qty` check below (NaN comparisons are false).
    if (
      !Number.isInteger(it?.productId)
      || !(it.variantId == null || Number.isInteger(it.variantId))
      || !Number.isFinite(it.qty)
    ) fail('Niepoprawna pozycja koszyka.')
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
          fields: ['id', 'product_id'],
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
    const unitPrice = chargePriceFor(product)
    if (!Number.isFinite(unitPrice) || unitPrice < 0) fail(`Niepoprawna cena produktu „${product.title}".`)

    if (product.type === 'merch') {
      if (item.variantId != null) {
        const variant = variantById.get(item.variantId)
        if (!variant || variant.product_id !== product.id) fail(`Wariant produktu „${product.title}" jest niepoprawny.`)
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
      discount: 0,
    })
  }

  const subtotal = round2(lines.reduce((sum, l) => sum + l.lineTotal, 0))
  const code = typeof discountCode === 'string' && discountCode.trim()
    ? await resolveDiscountCode(discountCode.trim().toUpperCase())
    : null
  let discount = 0
  if (code) {
    const allowed = (code.products ?? []).map((p) => p.products_id)
    const eligible = lines.filter((l) => l.type !== 'workshop' && (!allowed.length || allowed.includes(l.productId)))
    if (!eligible.length) fail('Kod nie dotyczy produktów w koszyku.')
    const eligibleTotal = round2(eligible.reduce((sum, l) => sum + l.lineTotal, 0))
    const value = Number(code.value)
    discount = code.type === 'percent'
      ? round2(eligibleTotal * Math.min(value, 100) / 100)
      : round2(Math.min(value, eligibleTotal))
    splitDiscount(eligible.map((l) => l.lineTotal), discount).forEach((d, i) => { eligible[i]!.discount = d })
  }
  const hasPhysical = lines.some((l) => l.type === 'merch')
  const hasCourse = lines.some((l) => l.type === 'course')

  let shippingCost = 0
  if (hasPhysical) {
    if (!shippingMethod || !SHIPPING_RATES[shippingMethod]) fail('Wybierz metodę dostawy.')
    shippingCost = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATES[shippingMethod].cost
  }

  const total = round2(subtotal - discount + shippingCost)
  // Stripe's minimum charge for PLN is 2.00 zł.
  if (code && total < 2) fail('Kwota po rabacie jest za niska.')
  return {
    lines,
    subtotal,
    discount,
    discountCodeId: code?.id ?? null,
    discountCode: code?.code ?? null,
    shippingCost,
    total,
    totalGrosze: Math.round(total * 100),
    hasPhysical,
    hasCourse,
  }
}

/** Look up a code and check it is active, in its date window and not used up. Throws 400 otherwise. */
async function resolveDiscountCode(normalized: string): Promise<DiscountCode> {
  const client = directusAdmin()
  const [code] = (await client.request(
    readItems('discount_codes', {
      filter: { code: { _eq: normalized } },
      fields: ['id', 'code', 'active', 'type', 'value', 'valid_from', 'valid_until', 'max_uses', { products: ['products_id'] }],
      limit: 1,
    }),
  )) as DiscountCode[]
  if (!code || !code.active) fail('Nieprawidłowy kod rabatowy.')
  const now = Date.now()
  if ((code.valid_from && Date.parse(code.valid_from) > now) || (code.valid_until && Date.parse(code.valid_until) < now)) {
    fail('Kod rabatowy jest nieaktywny lub wygasł.')
  }
  if (code.max_uses != null) {
    // Uses = paid orders, so abandoned checkouts never burn a use.
    // shortcut: two payments racing for the last use can both succeed (accepted in the spec).
    const [row] = (await client.request(
      aggregate('orders', {
        aggregate: { count: '*' },
        query: { filter: { discount_code: { _eq: code.id }, status: { _in: ['paid', 'shipped'] } } },
      }),
    )) as { count: string | number }[]
    if (Number(row?.count ?? 0) >= code.max_uses) fail('Kod rabatowy został już wykorzystany.')
  }
  return code
}

/**
 * Split an order discount across lines in proportion to their totals, so each
 * line carries its own discounted price (invoices, partial refunds). Rounding
 * leftovers go to the largest line, so the parts always sum to `discount`.
 */
export function splitDiscount(lineTotals: number[], discount: number): number[] {
  const sum = lineTotals.reduce((s, t) => s + t, 0)
  if (sum <= 0) return lineTotals.map(() => 0)
  const parts = lineTotals.map((t) => round2(discount * t / sum))
  const largest = lineTotals.indexOf(Math.max(...lineTotals))
  parts[largest] = round2(parts[largest]! + discount - parts.reduce((s, p) => s + p, 0))
  return parts
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}
