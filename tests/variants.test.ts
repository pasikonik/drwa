import { describe, it, expect } from 'vitest'
import { variantColors, variantSizes, defaultVariant, variantForColor, normalizeProduct } from '~/utils/product'
import type { ProductVariant } from '~/types/directus'

let nextId = 1
const v = (size: ProductVariant['size'], color: string | null, stock: number): ProductVariant =>
  ({ id: nextId++, product_id: 15, sku: '', size, color, stock })

const redM = v('m', 'czerwony', 0)
const redL = v('l', 'czerwony', 3)
const redS = v('s', 'czerwony', 2)
const greenM = v('m', 'zielony', 5)
const all = [redM, redL, redS, greenM]

describe('merch variant picking', () => {
  it('lists colours once, in first-seen order', () => {
    expect(variantColors(all)).toEqual(['czerwony', 'zielony'])
    expect(variantColors([v('m', null, 1)])).toEqual([])
  })

  it('lists sizes of one colour S → XL; null colour = colourless products', () => {
    expect(variantSizes(all, 'czerwony').map((x) => x.size)).toEqual(['s', 'm', 'l'])
    const plain = [v('xl', null, 1), v('s', null, 1)]
    expect(variantSizes(plain, null).map((x) => x.size)).toEqual(['s', 'xl'])
  })

  it('defaults to an in-stock M, else any in-stock, else the first', () => {
    expect(defaultVariant(all)).toBe(greenM)              // red M is sold out
    expect(defaultVariant([redM, redL])).toBe(redL)
    expect(defaultVariant([redM])).toBe(redM)             // all sold out → still shows something
    expect(defaultVariant([])).toBeNull()
  })

  it('keeps the size when switching colour if it is in stock there', () => {
    expect(variantForColor(all, greenM, 'czerwony')).toBe(redL) // red M sold out → first in-stock red
    expect(variantForColor(all, redS, 'zielony')).toBe(greenM)  // no green S → first in-stock green
    expect(variantForColor([redM, redL, greenM], redL, 'czerwony')).toBe(redL)
  })
})

describe('normalizeProduct merch extension', () => {
  it('collapses merch to one row with the gallery sorted', () => {
    const p = normalizeProduct({
      id: 15, title: 'Bluza', price: '179.00', workshop: [], course: [],
      merch: [{ id: 'm1', gallery: [
        { id: 'b', sort: 2, directus_files_id: 'f2' },
        { id: 'a', sort: 1, directus_files_id: 'f1' },
      ] }],
    })
    expect(p.type).toBe('merch')
    expect(p.merch?.gallery.map((g) => g.directus_files_id)).toEqual(['f1', 'f2'])
  })

  it('is null when not fetched (server queries)', () => {
    expect(normalizeProduct({ id: 1, title: 'X', price: '1', workshop: [], course: [] }).merch).toBeNull()
  })
})
