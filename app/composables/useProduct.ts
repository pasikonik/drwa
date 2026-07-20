import { readItems } from '@directus/sdk'
import type { Product } from '~/types/directus'
import { normalizeProduct } from '~/utils/product'

/**
 * Fetch a single product by slug or — as a fallback for products that have no
 * slug yet — a numeric product id (`/sklep/2`, `/warsztaty/2`).
 */
export const useProduct = (slugOrId: string | number) => {
  const { directus } = useDirectus()

  const isId = typeof slugOrId === 'number' || /^\d+$/.test(slugOrId)
  const filter = isId
    ? { id: { _eq: Number(slugOrId) } }
    : { slug: { _eq: String(slugOrId) } }

  return useAsyncData<Product | null>(
    `product-${slugOrId}`,
    async () => {
      const results = (await directus.request(
        readItems('products', {
          filter,
          limit: 1,
          fields: [
            'id', 'title', 'slug', 'price', 'description', 'image', 'short_description',
            {
              workshop: [
                'id', 'product_id', 'date_start', 'date_end', 'location',
                'spots_total', 'spots_booked', 'advance', 'level', 'blogpost_link',
                {
                  days: [
                    'id', 'day_number', 'day_name', 'start_time', 'end_time', 'theme',
                    { agenda_items: ['id', 'description', 'sort'] },
                  ],
                },
                { instructors: [{ instructors_id: ['id', 'name', 'photo', 'role', 'bio'] }] },
              ],
            },
            { course: ['id', 'product_id', 'course_access_url', 'sort', 'subtitle'] },
          ],
        })
      )) as unknown[]
      return results[0] ? normalizeProduct(results[0]) : null
    },
    { default: () => null }
  )
}
