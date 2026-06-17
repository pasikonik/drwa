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
            'id', 'title', 'slug', 'type', 'price', 'description', 'image',
            'location', 'spots_total',
            'date_start', 'date_end', 'spots_booked', 'level', 'advance', 'short_description',
          ],
        })
      )) as Product[]
      return results[0] ?? null
    },
    { default: () => null }
  )
}
