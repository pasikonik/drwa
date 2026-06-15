// DRWA — shipping rates shared by the client (display) and server (authoritative
// pricing). All values in PLN. Single source of truth for the shop.

import type { ShippingMethod, ShippingOption } from '~/types/shop'

export const SHIPPING_RATES: Record<ShippingMethod, { label: string; cost: number }> = {
  paczkomat: { label: 'Paczkomat InPost', cost: 12.99 },
  kurier: { label: 'Kurier', cost: 16.99 },
}

/** Free shipping at or above this subtotal (PLN). */
export const FREE_SHIPPING_THRESHOLD = 300

/** Shipping options for a subtotal, applying the free-shipping rule. */
export function shippingOptions(subtotal: number): ShippingOption[] {
  const free = subtotal >= FREE_SHIPPING_THRESHOLD
  return (Object.keys(SHIPPING_RATES) as ShippingMethod[]).map((method) => ({
    method,
    label: SHIPPING_RATES[method].label,
    cost: free ? 0 : SHIPPING_RATES[method].cost,
  }))
}
