import { describe, it, expect, vi } from 'vitest'

// The handler runs outside Nitro: stub its auto-imports and the three services it talks to.
const writes: { collection: string; data: unknown }[] = []
const computed = {
  lines: [{ productId: 15, variantId: 3, type: 'merch', title: 'Bluza', unitPrice: 179, qty: 1, lineTotal: 179, discount: 17.9 }],
  subtotal: 179, discount: 17.9, discountCodeId: 7, discountCode: 'JESIEN',
  shippingCost: 12.99, total: 174.09, totalGrosze: 17409, hasPhysical: true, hasCourse: false,
}
vi.mock('../server/utils/pricing', () => ({ computeOrder: vi.fn(async () => computed) }))
vi.mock('../server/utils/sessionUser', () => ({ resolveUserId: async () => null }))
vi.mock('../server/utils/stripe', () => ({
  getStripe: () => ({ paymentIntents: { create: async () => ({ id: 'pi_1', client_secret: 'cs_1' }) } }),
}))
vi.mock('../server/utils/directusAdmin', () => ({
  directusAdmin: () => ({
    request: async (cmd: () => { path: string; body?: string }) => {
      const { path, body } = cmd()
      writes.push({ collection: path.split('/').filter(Boolean)[1]!, data: body ? JSON.parse(body) : null })
      return { id: 'order-1' }
    },
  }),
}))
const body = {
  items: [{ productId: 15, variantId: 3, qty: 1 }], email: 'a@b.pl', firstName: null, lastName: null,
  shippingMethod: 'paczkomat', discountCode: 'jesien',
  address: { name: 'A', street: 'B 1', postalCode: '00-001', city: 'C', phone: '1', pointCode: 'X' },
}
vi.stubGlobal('defineEventHandler', (fn: unknown) => fn)
vi.stubGlobal('readBody', async () => body)
vi.stubGlobal('useRuntimeConfig', () => ({ public: { stripePublishableKey: 'pk_1' } }))
vi.stubGlobal('createError', (o: { statusMessage: string }) => Object.assign(new Error(o.statusMessage), o))

const { default: handler } = await import('../server/api/checkout/create-intent.post')

describe('create-intent with a discount code', () => {
  it('stores the discount on the order and its lines, and returns the charged total', async () => {
    const res = await (handler as (e: unknown) => Promise<Record<string, unknown>>)({})
    const order = writes.find((w) => w.collection === 'orders')!.data as Record<string, unknown>
    expect(order).toMatchObject({ subtotal: 179, discount_code: 7, discount_amount: 17.9, total_price: 174.09 })
    const items = writes.find((w) => w.collection === 'order_items')!.data as Record<string, unknown>[]
    expect(items[0]).toMatchObject({ price_at_purchase: 179, discount_amount: 17.9 })
    // The payment step must show what Stripe charges, not a client-side recomputation.
    expect(res.total).toBe(174.09)
  })
})
