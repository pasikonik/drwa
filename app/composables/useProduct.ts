import { readItems } from '@directus/sdk'
import type { Product } from '~/types/directus'
import { normalizeProduct } from '~/utils/product'
import { withRetry } from '~/utils/directus'

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

  return recoverOnClient(useAsyncData<Product | null>(
    `product-${slugOrId}`,
    () => withRetry(async () => {
      const results = (await directus.request(
        readItems('products', {
          filter,
          limit: 1,
          fields: [
            'id', 'title', 'slug', 'price', 'description', 'image', 'short_description',
            {
              // '*' a nie lista pól: nowe pola (np. organizational_info) dochodzą bez
              // zmian w kodzie, a brak pola w Directusie nie wywala zapytania.
              workshop: [
                '*',
                { instructors: [{ instructors_id: ['id', 'name', 'photo', 'role', 'bio'] }] },
              ],
            },
            { course: ['id', 'product_id', 'course_access_url', 'sort', 'subtitle'] },
          ],
        })
      )) as unknown[]
      return results[0] ? normalizeProduct(results[0]) : null
    }),
    { default: () => null }
  ))
}
