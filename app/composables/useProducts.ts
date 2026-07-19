import { readItems } from '@directus/sdk'
import type { Product, ProductVariant, ProductType } from '~/types/directus'
import { normalizeProduct } from '~/utils/product'

// Returned by useProducts — contains both products and their variants in one
// round-trip so pages can await a single composable.
export interface ProductsWithVariants {
  products: Product[]
  variants: ProductVariant[]
}

/**
 * Fetch products of a given kind + all their variants.
 *
 * There is no `type` column on `products`; the kind is derived from which 1:1
 * extension (workshop / course) a product carries, so we fetch all products
 * with their (shallow) extensions and filter by the derived type in memory.
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
      const raw = (await directus.request(
        readItems('products', {
          sort: ['id'],
          limit: -1,
          fields: [
            'id', 'title', 'slug', 'price', 'description', 'image', 'short_description',
            {
              workshop: [
                'id', 'product_id', 'date_start', 'date_end', 'location',
                'spots_total', 'spots_booked', 'advance', 'level', 'blogpost_link',
                { instructors: [{ instructors_id: ['id', 'name', 'photo', 'role', 'bio'] }] },
              ],
            },
            { course: ['id', 'product_id', 'course_access_url', 'sort', 'subtitle'] },
          ],
        })
      )) as unknown[]

      const products = raw.map(normalizeProduct).filter((p) => p.type === type)

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
