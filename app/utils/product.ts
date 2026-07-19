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
  OrderProductRef,
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

/** Product kind is determined by which extension a product carries. */
export const deriveProductType = (raw: {
  workshop?: unknown
  course?: unknown
}): ProductType => {
  if (firstRelation(raw.workshop as unknown[] | null | undefined)) return 'workshop'
  if (firstRelation(raw.course as unknown[] | null | undefined)) return 'course'
  return 'merch'
}

/** Sort a workshop's days by day_number and each day's agenda by `sort`. */
const sortWorkshopProgram = (w: Workshop | null): Workshop | null => {
  if (!w) return null
  const days = [...(w.days ?? [])]
    .sort((a, b) => (a.day_number ?? 0) - (b.day_number ?? 0))
    .map((d) => ({
      ...d,
      agenda_items: [...(d.agenda_items ?? [])].sort(
        (a, b) => (a.sort ?? 0) - (b.sort ?? 0),
      ),
    }))
  return { ...w, days }
}

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
  const workshop = sortWorkshopProgram(firstRelation<Workshop>(raw.workshop))
  const course = normalizeCourse(firstRelation<Course>(raw.course))
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
  }
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
