// DRWA — product normalization shared by client composables and server code.
//
// Directus returns the 1:1 workshop/course extensions as arrays (O2M aliases on
// `products`) and nested O2M lists (days, agenda) in arbitrary order. These
// helpers collapse the extensions to a single row, sort the program, and derive
// the product kind from which extension is present.

import type {
  Product,
  ProductType,
  Workshop,
  Course,
  Merch,
  OrderProductRef,
  ProductVariant,
} from '~/types/directus'

const bySort = (a: { sort: number | null }, b: { sort: number | null }) =>
  (a.sort ?? 0) - (b.sort ?? 0)

/** Collapse a Directus 1:1-as-array relation to a single row (or null). */
export const firstRelation = <T>(rel: T[] | T | null | undefined): T | null => {
  if (Array.isArray(rel)) return rel[0] ?? null
  return rel ?? null
}

/**
 * A workshop is "past" once it has started — booking closes at `date_start`.
 * Shared by the listing, the detail page and the server-side pricing guard.
 * A workshop with no `date_start` is treated as upcoming.
 */
export const isWorkshopPast = (
  w: { date_start: string | null } | null | undefined,
): boolean => !!w?.date_start && new Date(w.date_start).getTime() < Date.now()

/**
 * The amount actually charged at checkout for one unit of a product.
 *
 * Workshops charge the `advance` deposit rather than the full price; everything
 * else charges `price`. Directus sends both as decimal strings, so coerce.
 *
 * Single source of truth for the cart, the "added to cart" toast and the
 * server-side re-pricing in `computeOrder` — these must never disagree.
 */
export const chargePriceFor = (product: {
  type: ProductType
  price: number | string
  workshop?: { advance?: number | string | null } | null
}): number =>
  Number(
    product.type === 'workshop' && product.workshop?.advance != null
      ? product.workshop.advance
      : product.price,
  )

/** Ensure a course's modules/tiles/materials are always sorted arrays (when a course exists). */
const normalizeCourse = (c: Course | null): Course | null => {
  if (!c) return null
  return {
    ...c,
    modules: [...(c.modules ?? [])].sort(bySort),
    tiles: [...(c.tiles ?? [])].sort(bySort),
    materials: [...(c.materials ?? [])].sort(bySort),
  }
}

/** Turn a raw Directus product (extensions as arrays) into the app-facing shape. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeProduct = (raw: any): Product => {
  const workshop = firstRelation<Workshop>(raw.workshop)
  const course = normalizeCourse(firstRelation<Course>(raw.course))
  const merch = firstRelation<Merch>(raw.merch)
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug ?? null,
    price: raw.price,
    image: raw.image ?? null,
    description: raw.description ?? '',
    short_description: raw.short_description ?? null,
    type: workshop ? 'workshop' : course ? 'course' : 'merch',
    workshop,
    course,
    merch: merch && { ...merch, gallery: [...(merch.gallery ?? [])].sort(bySort) },
  }
}

// ─── Merch variant picking (shop listing + product page) ─────────────────────

const SIZE_ORDER = ['s', 'm', 'l', 'xl']

/** Distinct colours among a product's variants, in first-seen order. */
export const variantColors = (variants: ProductVariant[]): string[] =>
  [...new Set(variants.map((v) => v.color).filter((c): c is string => !!c))]

/** Sized variants in one colour (`null` = products without colours), S → XL. */
export const variantSizes = (variants: ProductVariant[], color: string | null): ProductVariant[] =>
  variants
    .filter((v) => v.size && (v.color ?? null) === color)
    .sort((a, b) => SIZE_ORDER.indexOf(a.size!) - SIZE_ORDER.indexOf(b.size!))

/** Initial selection: an in-stock M, else any in-stock variant, else the first one. */
export const defaultVariant = (variants: ProductVariant[]): ProductVariant | null =>
  variants.find((v) => v.size === 'm' && v.stock > 0)
  ?? variants.find((v) => v.stock > 0)
  ?? variants[0]
  ?? null

/** Switching colour keeps the current size if that colour has it in stock. */
export const variantForColor = (
  variants: ProductVariant[],
  current: ProductVariant | null,
  color: string,
): ProductVariant | null => {
  const inColor = variants.filter((v) => v.color === color)
  return inColor.find((v) => v.size === current?.size && v.stock > 0)
    ?? inColor.find((v) => v.stock > 0)
    ?? inColor[0]
    ?? null
}

/** Minimal product reference for an order line (course access flattened). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toOrderProductRef = (raw: any): OrderProductRef => {
  const workshop = firstRelation<Workshop>(raw.workshop)
  const course = firstRelation<Course>(raw.course)
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug ?? null,
    image: raw.image ?? null,
    type: workshop ? 'workshop' : course ? 'course' : 'merch',
    course_access_url: course?.course_access_url ?? null,
  }
}
