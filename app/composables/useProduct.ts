import { readItems } from '@directus/sdk'
import type { Product } from '~/types/directus'
import { normalizeProduct } from '~/utils/product'

export const useProduct = (slug: string) => {
  const { directus } = useDirectus()

  return useAsyncData<Product | null>(
    `product-${slug}`,
    async () => {
      const results = (await directus.request(
        readItems('products', {
          filter: { slug: { _eq: slug } },
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
            { course: ['id', 'product_id', 'course_access_url', 'sort'] },
          ],
        })
      )) as unknown[]
      return results[0] ? normalizeProduct(results[0]) : null
    },
    { default: () => null }
  )
}
