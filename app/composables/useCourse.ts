import { readItems } from '@directus/sdk'
import type { Product } from '~/types/directus'
import { normalizeProduct } from '~/utils/product'

/**
 * Fetch a single course product together with its course extension, modules,
 * tiles and CMS template blocks. Accepts a product slug or — as a fallback for
 * courses that have no slug yet — a numeric product id (`/kursy/2`).
 *
 * The full field list requires the extended Directus schema (see
 * docs/superpowers/specs/2026-07-15-kursy-directus-design.md, Appendix A).
 * Until it is configured (fields + public read permissions), the full query
 * fails — we then retry with a core field set that works on the current
 * schema and warn loudly.
 *
 * @example const { data: course } = await useCourse(2)         // by id
 * @example const { data: course } = await useCourse('stodola') // by slug
 */
export const useCourse = (slugOrId: string | number) => {
  const { directus } = useDirectus()

  const isId = typeof slugOrId === 'number' || /^\d+$/.test(slugOrId)
  const filter = isId
    ? { id: { _eq: Number(slugOrId) } }
    : { slug: { _eq: String(slugOrId) } }

  return useAsyncData<Product | null>(
    `course-${slugOrId}`,
    async () => {
      let rows: unknown[]
      try {
        rows = (await directus.request(
          readItems('products', {
            filter,
            limit: 1,
            fields: [
              'id', 'title', 'slug', 'price', 'description', 'image', 'short_description',
              {
                course: [
                  'id', 'product_id', 'course_access_url', 'sort',
                  'hero_kicker', 'hero_facts', 'stats', 'main_heading',
                  'bonuses', 'quotes', 'offer_items', 'price_note',
                  { modules: ['id', 'title', 'description', 'sort', 'course'] },
                  { tiles: ['id', 'sort', 'eyebrow', 'title', 'description', 'image'] },
                  { materials: ['id', 'sort', 'icon', 'title', 'description'] },
                ],
              },
            ],
          })
        )) as unknown[]
      } catch (err) {
        console.warn(
          '[useCourse] Pełne zapytanie padło — w Directusie brakuje pól szablonu kursu '
            + 'albo uprawnień publicznych (spec 2026-07-15, Appendix A). Retry na polach podstawowych.',
          err,
        )
        rows = (await directus.request(
          readItems('products', {
            filter,
            limit: 1,
            fields: [
              'id', 'title', 'slug', 'price', 'description', 'image', 'short_description',
              {
                course: [
                  'id', 'product_id', 'course_access_url', 'sort',
                  { modules: ['id', 'title', 'description', 'sort', 'course'] },
                ],
              },
            ],
          })
        )) as unknown[]
      }
      return rows[0] ? normalizeProduct(rows[0]) : null
    },
    { default: () => null }
  )
}
