import { readItems } from '@directus/sdk'
import type { Product } from '~/types/directus'
import { normalizeProduct } from '~/utils/product'

/**
 * Fetch a single course product (by product id) together with its course
 * extension and modules. Course products currently have no slug, so they are
 * addressed by product id from the hand-built /kursy pages.
 *
 * @example const { data: course } = await useCourse(2)
 */
export const useCourse = (productId: number) => {
  const { directus } = useDirectus()

  return useAsyncData<Product | null>(
    `course-${productId}`,
    async () => {
      const rows = (await directus.request(
        readItems('products', {
          filter: { id: { _eq: productId } },
          limit: 1,
          fields: [
            'id', 'title', 'slug', 'price', 'description', 'image', 'short_description',
            {
              course: [
                'id', 'product_id', 'course_access_url', 'sort',
                { modules: ['id', 'status', 'title', 'description', 'sort', 'course'] },
              ],
            },
          ],
        })
      )) as unknown[]
      return rows[0] ? normalizeProduct(rows[0]) : null
    },
    { default: () => null }
  )
}
