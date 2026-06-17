import { computed } from 'vue'
import type { CartItem, CheckoutItemInput } from '~/types/shop'
import type { Product, ProductVariant } from '~/types/directus'

export const CART_STATE_KEY = 'drwa-cart'

const fileId = (f: Product['image']): string | null =>
  !f ? null : typeof f === 'object' ? f.id : f

const maxQtyFor = (product: Product, variant: ProductVariant | null): number => {
  if (product.type === 'course') return 1
  if (product.type === 'workshop') {
    return Math.max(0, (product.spots_total ?? 0) - (product.spots_booked ?? 0))
  }
  // merch
  return variant ? variant.stock : 0
}

/**
 * Reactive cart shared across the app (SSR-safe via useState). Persistence to
 * localStorage is handled by plugins/cart.client.ts.
 */
export const useCart = () => {
  const items = useState<CartItem[]>(CART_STATE_KEY, () => [])

  const count = computed(() => items.value.reduce((n, i) => n + i.qty, 0))
  const subtotal = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))
  const hasPhysical = computed(() => items.value.some((i) => i.type === 'merch'))
  const isEmpty = computed(() => items.value.length === 0)

  function add(input: Omit<CartItem, 'key'>): void {
    const key = `${input.productId}:${input.variantId ?? 'x'}`
    const cap = input.maxQty || 99
    const existing = items.value.find((i) => i.key === key)
    if (existing) {
      existing.qty = Math.min(cap, existing.qty + input.qty)
    } else {
      items.value = [...items.value, { ...input, key, qty: Math.min(cap, input.qty) }]
    }
  }

  /** Build a cart line from a Directus product (+ optional variant) and add it. */
  function addProduct(
    product: Product,
    opts: { variant?: ProductVariant | null; qty?: number; size?: string | null } = {},
  ): void {
    const variant = opts.variant ?? null
    add({
      productId: product.id,
      variantId: variant?.id ?? null,
      type: product.type,
      slug: product.slug,
      title: product.title,
      price: Number(product.price),
      qty: opts.qty ?? 1,
      image: fileId(product.image),
      size: opts.size ?? variant?.size ?? null,
      maxQty: maxQtyFor(product, variant),
    })
  }

  function setQty(key: string, n: number): void {
    const it = items.value.find((i) => i.key === key)
    if (!it) return
    const cap = it.maxQty || 99
    it.qty = Math.max(1, Math.min(cap, Math.floor(n)))
  }

  function remove(key: string): void {
    items.value = items.value.filter((i) => i.key !== key)
  }

  function clear(): void {
    items.value = []
  }

  /** Minimal payload for the server (prices re-resolved there). */
  function toCheckoutItems(): CheckoutItemInput[] {
    return items.value.map((i) => ({ productId: i.productId, variantId: i.variantId, qty: i.qty }))
  }

  return { items, count, subtotal, hasPhysical, isEmpty, add, addProduct, setQty, remove, clear, toCheckoutItems }
}
