import { describe, it, expect, vi, beforeEach } from 'vitest'

// computeOrder talks to Directus only through `directusAdmin().request(...)`,
// so a fake client that answers by collection is enough — no server needed.
const request = vi.fn()
vi.mock('../server/utils/directusAdmin', () => ({ directusAdmin: () => ({ request }) }))
// `createError` is a Nitro auto-import; outside Nitro it has to be provided.
vi.stubGlobal('createError', (o: { statusCode: number; statusMessage: string }) =>
  Object.assign(new Error(o.statusMessage), o))

import { computeOrder } from '../server/utils/pricing'

const future = new Date(Date.now() + 30 * 864e5).toISOString()
const past = new Date(Date.now() - 30 * 864e5).toISOString()

const merch = { id: 1, title: 'Bluza', price: '100.00' }
const course = { id: 3, title: 'Kurs', price: '800.00', course: [{ id: 'c1' }] }
const workshop = (over = {}) => ({
  id: 2, title: 'Warsztat', price: '2000.00',
  workshop: [{ id: 'w1', date_start: future, spots_total: 10, spots_booked: 8, advance: '300.00', ...over }],
})

function directus(products: unknown[], variants: unknown[] = []) {
  request.mockImplementation(async (q: () => { path: string }) =>
    q().path.endsWith('/product_variants') ? variants : products)
}

const variant = (over = {}) => ({ id: 10, product_id: 1, size: 'm', stock: 5, ...over })
const line = (productId: number, qty = 1, variantId: number | null = null) => ({ productId, variantId, qty })

// Braces matter: a function returned from a hook is run by vitest as cleanup.
beforeEach(() => { request.mockReset() })

describe('computeOrder', () => {
  it('charges the advance for a workshop, not the full price', async () => {
    directus([workshop()])
    const order = await computeOrder([line(2)], null)
    expect(order.total).toBe(300)
    expect(order.totalGrosze).toBe(30000)
  })

  it('counts split lines of one workshop against the free seats together', async () => {
    directus([workshop()]) // 2 seats free
    await expect(computeOrder([line(2), line(2), line(2)], null)).rejects.toThrow('Za mało wolnych miejsc')
    const ok = await computeOrder([line(2), line(2)], null)
    expect(ok.lines).toHaveLength(1)
    expect(ok.lines[0]!.qty).toBe(2)
  })

  it('rejects a past workshop', async () => {
    directus([workshop({ date_start: past })])
    await expect(computeOrder([line(2)], null)).rejects.toThrow('minion')
  })

  it('rejects malformed lines instead of letting NaN slip past the stock checks', async () => {
    directus([workshop()])
    await expect(computeOrder([line(2, Number.NaN)], null)).rejects.toThrow('Niepoprawna pozycja')
    await expect(computeOrder([{ productId: '2' as unknown as number, variantId: null, qty: 1 }], null)).rejects.toThrow('Niepoprawna pozycja')
    await expect(computeOrder('abc' as never, null)).rejects.toThrow('Niepoprawna pozycja')
  })

  it('sells a course once, whatever quantity is asked for', async () => {
    directus([course])
    const order = await computeOrder([line(3, 5)], null)
    expect(order.lines[0]!.qty).toBe(1)
    expect(order.total).toBe(800)
    expect(order.hasCourse).toBe(true)
  })

  it('checks variant ownership and stock', async () => {
    directus([merch], [variant({ product_id: 99 })])
    await expect(computeOrder([line(1, 1, 10)], 'kurier')).rejects.toThrow('niepoprawny')
    directus([merch], [variant({ stock: 1 })])
    await expect(computeOrder([line(1, 2, 10)], 'kurier')).rejects.toThrow('Za mało sztuk')
  })

  it('adds shipping below the free-shipping threshold and none at it', async () => {
    directus([merch], [variant()])
    const small = await computeOrder([line(1, 1, 10)], 'paczkomat')
    expect(small.shippingCost).toBe(12.99)
    expect(small.total).toBe(112.99)
    const big = await computeOrder([line(1, 3, 10)], 'paczkomat') // 300 = threshold
    expect(big.shippingCost).toBe(0)
  })

  it('requires a shipping method for physical goods only', async () => {
    directus([merch], [variant()])
    await expect(computeOrder([line(1, 1, 10)], null)).rejects.toThrow('metodę dostawy')
    directus([course])
    await expect(computeOrder([line(3)], null)).resolves.toMatchObject({ shippingCost: 0 })
  })
})
