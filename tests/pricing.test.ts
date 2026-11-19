import { describe, it, expect, vi, beforeEach } from 'vitest'

// computeOrder talks to Directus only through `directusAdmin().request(...)`,
// so a fake client that answers by collection is enough — no server needed.
const request = vi.fn()
vi.mock('../server/utils/directusAdmin', () => ({ directusAdmin: () => ({ request }) }))
// `createError` is a Nitro auto-import; outside Nitro it has to be provided.
vi.stubGlobal('createError', (o: { statusCode: number; statusMessage: string }) =>
  Object.assign(new Error(o.statusMessage), o))

import { computeOrder, splitDiscount } from '../server/utils/pricing'

const future = new Date(Date.now() + 30 * 864e5).toISOString()
const past = new Date(Date.now() - 30 * 864e5).toISOString()

const merch = { id: 1, title: 'Bluza', price: '100.00' }
const course = { id: 3, title: 'Kurs', price: '800.00', course: [{ id: 'c1' }] }
const workshop = (over = {}) => ({
  id: 2, title: 'Warsztat', price: '2000.00',
  workshop: [{ id: 'w1', date_start: future, spots_total: 10, spots_booked: 8, advance: '300.00', ...over }],
})

function directus(products: unknown[], variants: unknown[] = [], codes: unknown[] = [], uses = 0) {
  request.mockImplementation(async (q: () => { path: string }) => {
    const p = q().path
    if (p.endsWith('/product_variants')) return variants
    if (p.endsWith('/discount_codes')) return codes
    if (p.endsWith('/orders')) return [{ count: String(uses) }]
    return products
  })
}
const code = (over = {}) => ({ id: 7, code: 'JESIEN', active: true, type: 'percent', value: '10.00',
  valid_from: null, valid_until: null, max_uses: null, products: [], ...over })

const variant = (over = {}) => ({ id: 10, product_id: 1, size: 'm', ...over })
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

  it('checks variant ownership; merch quantity is not stock-limited', async () => {
    directus([merch], [variant({ product_id: 99 })])
    await expect(computeOrder([line(1, 1, 10)], 'kurier')).rejects.toThrow('niepoprawny')
    directus([merch], [variant()])
    await expect(computeOrder([line(1, 20, 10)], 'kurier')).resolves.toMatchObject({ lines: [{ qty: 20 }] })
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

describe('discount codes', () => {
  it('applies a percent code to merch, normalizes input, and checks free shipping after the discount', async () => {
    directus([merch], [variant()], [code()])
    const o = await computeOrder([line(1, 3, 10)], 'kurier', ' jesien ')
    expect(o.subtotal).toBe(300)
    expect(o.discount).toBe(30)
    expect(o.shippingCost).toBe(16.99) // threshold is checked after the discount: 270 < 300
    expect(o.total).toBe(286.99)
    expect(o.totalGrosze).toBe(28699)
    expect(o.lines[0]!.discount).toBe(30)
    expect(o.discountCode).toBe('JESIEN')
    expect(o.discountCodeId).toBe(7)
  })

  it('caps a fixed code at the eligible lines', async () => {
    directus([merch, course], [variant()], [code({ type: 'fixed', value: '1000.00', products: [{ products_id: 1 }] })])
    const o = await computeOrder([line(1, 1, 10), line(3)], 'kurier', 'JESIEN')
    expect(o.discount).toBe(100)
    expect(o.lines.find((l) => l.productId === 3)!.discount).toBe(0)
    expect(o.lines.find((l) => l.productId === 1)!.discount).toBe(100)
    expect(o.total).toBe(800) // 900 − 100 is still over the free-shipping threshold
  })

  it('never discounts workshops', async () => {
    directus([merch, workshop()], [variant()], [code()])
    const o = await computeOrder([line(1, 1, 10), line(2)], 'kurier', 'JESIEN')
    expect(o.discount).toBe(10)
    directus([workshop()], [], [code()])
    await expect(computeOrder([line(2)], null, 'JESIEN')).rejects.toThrow('Kod nie dotyczy produktów w koszyku.')
  })

  it('rejects unknown, inactive, expired, not-yet-valid and used-up codes', async () => {
    directus([course], [], [])
    await expect(computeOrder([line(3)], null, 'NIEMA')).rejects.toThrow('Nieprawidłowy kod rabatowy.')
    directus([course], [], [code({ active: false })])
    await expect(computeOrder([line(3)], null, 'JESIEN')).rejects.toThrow('Nieprawidłowy kod rabatowy.')
    directus([course], [], [code({ valid_until: past })])
    await expect(computeOrder([line(3)], null, 'JESIEN')).rejects.toThrow('Kod rabatowy jest nieaktywny lub wygasł.')
    directus([course], [], [code({ valid_from: future })])
    await expect(computeOrder([line(3)], null, 'JESIEN')).rejects.toThrow('Kod rabatowy jest nieaktywny lub wygasł.')
    directus([course], [], [code({ max_uses: 3 })], 3)
    await expect(computeOrder([line(3)], null, 'JESIEN')).rejects.toThrow('Kod rabatowy został już wykorzystany.')
    directus([course], [], [code({ max_uses: 3 })], 2)
    await expect(computeOrder([line(3)], null, 'JESIEN')).resolves.toMatchObject({ discount: 80 })
  })

  it('rejects a total below 2 zł', async () => {
    directus([{ ...course, price: '100.00' }], [], [code({ value: '99.00' })])
    await expect(computeOrder([line(3)], null, 'JESIEN')).rejects.toThrow('Kwota po rabacie jest za niska.')
  })

  it('ignores an empty code', async () => {
    directus([course], [], [code()])
    const o = await computeOrder([line(3)], null, '  ')
    expect(o.discount).toBe(0)
    expect(o.discountCodeId).toBeNull()
    expect(request.mock.calls.some(([q]) => (q as () => { path: string })().path.endsWith('/discount_codes'))).toBe(false)
  })

  it('splitDiscount sums to the total to the grosz', () => {
    const grosze = (xs: number[]) => xs.reduce((s, x) => s + Math.round(x * 100), 0)
    expect(grosze(splitDiscount([33.33, 33.33, 33.34], 10))).toBe(1000)
    expect(grosze(splitDiscount([19.99, 0.01, 7], 3.33))).toBe(333)
    expect(splitDiscount([100], 5)).toEqual([5])
    expect(splitDiscount([50, 0], 5)).toEqual([5, 0])
  })
})
