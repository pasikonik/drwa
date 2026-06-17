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
  slug: string | null
  type: ProductType
  price: number
  image: string | DirectusFile | null
  description: string
  // Conditional — only populated when type === 'course'
  course_access_url: string | null    // link to external course platform
  // Conditional — only populated when type === 'workshop'
  location: string | null
  spots_total: number | null
  date_start: string | null    // ISO datetime
  date_end: string | null      // ISO datetime
  spots_booked: number | null
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
  total_price: number   // PLN (same unit as product.price); converted to grosze only for Stripe
  subtotal: number | null
  shipping_method: string | null
  shipping_cost: number | null
  email: string | null
  payment_intent_id: string | null
  stripe_session_id: string | null
  customer: string | null         // relation → directus_users (nullable for guests)
  shpping_address: string | null  // intentional typo — matches DB column; holds JSON address
}

// Expanded order with its line items + product info — used by confirmation/panel.
export interface OrderWithItems extends Order {
  items: OrderItemExpanded[]
}

export interface OrderItemExpanded extends OrderItem {
  product: Pick<Product, 'id' | 'title' | 'slug' | 'type' | 'image' | 'course_access_url'> | null
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
  category: string | null
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
