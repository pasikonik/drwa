// DRWA — shop domain types shared by the cart, checkout and server pricing.
// All monetary values are in PLN (same unit as products.price). Conversion to
// grosze (Stripe minor units) happens only at the Stripe boundary.

import type { ProductType } from '~/types/directus'

// ─── Cart (client) ──────────────────────────────────────────────────────────

export interface CartItem {
  /** Stable line key: `${productId}:${variantId ?? 'x'}`. */
  key: string
  productId: number
  variantId: number | null
  type: ProductType
  slug: string | null
  title: string
  price: number          // PLN per unit
  qty: number
  image: string | null   // Directus file id (or null)
  size: string | null    // variant size label, when applicable
  /** Upper bound for qty — free seats (workshop), 1 (course); 0 = no cap (merch → 99). */
  maxQty: number
}

// ─── Shipping ─────────────────────────────────────────────────────────────────

export type ShippingMethod = 'paczkomat' | 'kurier'

export interface ShippingOption {
  method: ShippingMethod
  label: string
  cost: number           // PLN
}

export interface ShippingAddress {
  name: string
  street: string
  postalCode: string
  city: string
  phone: string
  /** Paczkomat point code (only when method === 'paczkomat'). */
  pointCode?: string
}

// ─── Checkout request / pricing ────────────────────────────────────────────────

/** Minimal item the client sends — server re-resolves price/capacity from Directus. */
export interface CheckoutItemInput {
  productId: number
  variantId: number | null
  qty: number
}

export interface CreateIntentPayload {
  items: CheckoutItemInput[]
  email: string
  /** Buyer first name — required when the cart contains a course (Zanfia access). */
  firstName: string | null
  /** Buyer last name — required when the cart contains a course (Zanfia access). */
  lastName: string | null
  shippingMethod: ShippingMethod | null
  address: ShippingAddress | null
  /** Discount code as typed by the buyer — validated and normalized server-side. */
  discountCode: string | null
}

/** Price preview for the checkout page — same computeOrder, no side effects. */
export interface QuotePayload {
  items: CheckoutItemInput[]
  shippingMethod: ShippingMethod | null
  discountCode: string | null
}

export interface QuoteResponse {
  subtotal: number       // PLN, before discount
  discount: number       // PLN
  discountCode: string | null
  shippingCost: number   // PLN
  total: number          // PLN
}

/** One priced line, computed server-side. */
export interface ComputedLine {
  productId: number
  variantId: number | null
  type: ProductType
  title: string
  unitPrice: number      // PLN
  qty: number
  lineTotal: number      // PLN, before discount
  discount: number       // PLN, this line's share of the order discount (0 if not eligible)
}

export interface ComputedOrder {
  lines: ComputedLine[]
  subtotal: number       // PLN, before discount
  discount: number       // PLN
  discountCodeId: number | null
  discountCode: string | null   // normalized (upper-case)
  shippingCost: number   // PLN
  total: number          // PLN, after discount
  totalGrosze: number    // Stripe minor units
  hasPhysical: boolean
  hasCourse: boolean
}

export interface CreateIntentResponse {
  clientSecret: string
  orderId: string
  total: number          // PLN — the amount Stripe will charge
  publishableKey: string
}
