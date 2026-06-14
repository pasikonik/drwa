import { readItems } from '@directus/sdk'
import type { Product } from '~/types/directus'

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
            'id', 'title', 'slug', 'type', 'price', 'description', 'stock', 'image',
            'workshop_location', 'workshop_capacity',
            'workshop_start_date', 'workshop_end_date', 'workshop_booked',
          ],
        })
      )) as Product[]
      return results[0] ?? null
    },
    { default: () => null }
  )
}
