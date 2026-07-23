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
  /** Upper bound for qty — stock (merch) or free seats (workshop). */
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

/** Minimal item the client sends — server re-resolves price/stock from Directus. */
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
}

/** One priced line, computed server-side. */
export interface ComputedLine {
  productId: number
  variantId: number | null
  type: ProductType
  title: string
  unitPrice: number      // PLN
  qty: number
  lineTotal: number      // PLN
}

export interface ComputedOrder {
  lines: ComputedLine[]
  subtotal: number       // PLN
  shippingCost: number   // PLN
  total: number          // PLN
  totalGrosze: number    // Stripe minor units
  hasPhysical: boolean
  hasCourse: boolean
}

export interface CreateIntentResponse {
  clientSecret: string
  orderId: string
  publishableKey: string
}
