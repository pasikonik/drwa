import { readItems } from '@directus/sdk'
import type { Product, ProductVariant, ProductType } from '~/types/directus'

// Returned by useProducts — contains both products and their variants in one
// round-trip so pages can await a single composable.
export interface ProductsWithVariants {
  products: Product[]
  variants: ProductVariant[]
}

/**
 * Fetch products of a given type + all their variants.
 * Results are cached by Nuxt's useAsyncData with a stable key.
 *
 * @example const { data } = await useProducts('merch')
 * @example const { data } = await useProducts('workshop')
 */
export const useProducts = (type: ProductType) => {
  const { directus } = useDirectus()

  return useAsyncData<ProductsWithVariants>(
    `products-${type}`,
    async () => {
      const products = (await directus.request(
        readItems('products', {
          filter: { type: { _eq: type } },
          sort: ['id'],
          fields: [
            'id', 'title', 'type', 'price', 'description', 'stock', 'image',
            'workshop_location', 'workshop_capacity',
            'workshop_start_date', 'workshop_end_date', 'workshop_booked',
          ],
        })
      )) as Product[]

      const ids = products.map((p) => p.id)

      const variants =
        ids.length > 0
          ? ((await directus.request(
              readItems('product_variants', {
                filter: { product_id: { _in: ids } },
                fields: ['id', 'product_id', 'sku', 'size', 'color', 'stock'],
                sort: ['product_id', 'size'],
              })
            )) as ProductVariant[])
          : []

      return { products, variants }
    },
    {
      default: (): ProductsWithVariants => ({ products: [], variants: [] }),
    }
  )
}
