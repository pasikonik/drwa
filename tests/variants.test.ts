import { describe, it, expect } from 'vitest'
import { variantColors, variantSizes, defaultVariant, variantForColor, normalizeProduct } from '~/utils/product'
import type { ProductVariant } from '~/types/directus'

let nextId = 1
const v = (size: ProductVariant['size'], color: string | null): ProductVariant =>
  ({ id: nextId++, product_id: 15, sku: '', size, color })

const redL = v('l', 'czerwony')
const redM = v('m', 'czerwony')
const redS = v('s', 'czerwony')
const greenL = v('l', 'zielony')
const all = [redL, redM, redS, greenL]

describe('merch variant picking', () => {
  it('lists colours once, in first-seen order', () => {
    expect(variantColors(all)).toEqual(['czerwony', 'zielony'])
    expect(variantColors([v('m', null)])).toEqual([])
  })

  it('lists sizes of one colour S → XL; null colour = colourless products', () => {
    expect(variantSizes(all, 'czerwony').map((x) => x.size)).toEqual(['s', 'm', 'l'])
    const plain = [v('xl', null), v('s', null)]
    expect(variantSizes(plain, null).map((x) => x.size)).toEqual(['s', 'xl'])
  })

  it('defaults to size M, else the first variant', () => {
    expect(defaultVariant(all)).toBe(redM)
    expect(defaultVariant([greenL, redS])).toBe(greenL)
    expect(defaultVariant([])).toBeNull()
  })

  it('keeps the size when switching colour if that colour has it', () => {
    expect(variantForColor(all, redL, 'zielony')).toBe(greenL)
    expect(variantForColor(all, redM, 'zielony')).toBe(greenL) // no green M → first green
    expect(variantForColor(all, greenL, 'czerwony')).toBe(redL)
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
