// DRWA — TypeScript types for Directus collections.
// Keep in sync with the Directus data-model schema.

// ─── Directus system types ────────────────────────────────────────────────────

export interface DirectusFile {
  id: string
  storage: string
  filename_disk: string
  filename_download: string
  title: string | null
  type: string | null
  width: number | null
  height: number | null
  filesize: number | null
}

// ─── Domain types ─────────────────────────────────────────────────────────────

export type ProductType = 'merch' | 'course' | 'workshop'

export interface Product {
  id: number
  title: string
  type: ProductType
  price: number
  image: string | DirectusFile | null
  description: string
  stock: number
  // Conditional — only populated when type === 'workshop'
  workshop_location: string | null
  workshop_capacity: number | null
  workshop_start_date: string | null   // ISO datetime
  workshop_end_date: string | null     // ISO datetime
  workshop_booked: number | null
}

export type VariantSize = 's' | 'm' | 'l' | 'xl'

export interface ProductVariant {
  id: number
  product_id: number | null
  sku: string
  size: VariantSize | null
  color: string | null
  stock: number
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled'

export interface Order {
  id: string            // UUID
  date_created: string  // timestamptz
  status: OrderStatus
  total_price: number
  stripe_session_id: string | null
  customer: string | null
  shpping_address: string | null  // intentional typo — matches DB column
}

export interface OrderItem {
  id: number
  quantity: number
  price_at_purchase: number
  order_id: string | null
  product_id: number | null
  variant_id: number | null
}

export type BlogPostStatus = 'draft' | 'published' | 'archived'

export interface BlogPost {
  id: number
  status: BlogPostStatus
  title: string
  slug: string
  content: string
  featured_image: string | DirectusFile | null
  publish_date: string  // ISO datetime
}

// ─── SDK schema map ───────────────────────────────────────────────────────────
// Passed as the generic to createDirectus<Schema>() so the SDK types all
// request/response objects automatically.

export interface Schema {
  products: Product[]
  product_variants: ProductVariant[]
  orders: Order[]
  order_items: OrderItem[]
  blog_posts: BlogPost[]
}
