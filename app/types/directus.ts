// DRWA — TypeScript types for Directus collections.
// Keep in sync with the Directus data-model schema.
//
// Data model (Directus): `products` holds the purchasable/commerce fields
// (title, price, slug, image, description). Two 1:1 extension collections add
// type-specific data, linked by `product_id`:
//   • workshops — stationary events (dates, location, seats, level, program)
//   • courses   — online courses (access url)
// A product's *kind* is derived from which extension it carries (see
// `deriveProductType` in ~/utils/product). Merch = a product with neither.

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

export type WorkshopLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Instructor {
  id: string
  name: string
  photo: string | DirectusFile | null
  role: string | null
  bio: string | null
}

// Junction row for the workshops ↔ instructors M2M relation.
export interface WorkshopInstructor {
  id: number
  instructors_id: Instructor
}

// One agenda line within a workshop day (workshop_agenda collection).
export interface WorkshopAgendaItem {
  id: string
  description: string | null
  sort: number | null
}

// A single day of a workshop block (workshop_days collection).
export interface WorkshopDay {
  id: string
  day_number: number | null
  day_name: string | null      // e.g. 'Piątek'
  start_time: string | null    // 'HH:MM:SS'
  end_time: string | null      // 'HH:MM:SS'
  theme: string | null         // e.g. 'Drewno i trasowanie'
  agenda_items: WorkshopAgendaItem[]
}

// Workshop extension (workshops collection) — 1:1 with a product.
export interface Workshop {
  id: string                   // UUID
  product_id: number | null
  date_start: string | null    // ISO datetime
  date_end: string | null      // ISO datetime
  location: string | null
  spots_total: number | null
  spots_booked: number | null
  advance: number | null       // deposit charged at checkout (arrives as decimal string)
  level: WorkshopLevel | null
  blogpost_link: string | null // link to a related blog post (relacja)
  days: WorkshopDay[]
  instructors: WorkshopInstructor[]
}

export type CourseModuleStatus = 'draft' | 'published' | 'archived'

// One module/lesson within a course (course_modules collection).
export interface CourseModule {
  id: string
  status: CourseModuleStatus
  title: string
  description: string | null   // rich text (HTML)
  sort: number | null
  course: string | null        // M2O → courses.id (uuid)
}

// ── Course template CMS blocks ───────────────────────────────────────────────
// JSON-repeater fields on `courses` driving the /kursy/[slug] template.
// Optional (`?`) because they exist only after the Directus schema gains the
// fields — useCourse falls back to a core field set on the older schema.

export interface CourseHeroFact { text: string }
export interface CourseStat { num: string; label: string }  // num is a string: '+380', '24'
export interface CourseBonus { title: string; description: string | null }
export interface CourseQuote { name: string; text: string }
export interface CourseOfferItem { text: string; bonus: boolean | null }

// One image tile in the course "o kursie" section
// (course_tiles collection, O2M alias `tiles` on courses).
export interface CourseTile {
  id: string
  sort: number | null
  eyebrow: string | null           // e.g. 'Etap 01'
  title: string
  description: string | null
  image: string | DirectusFile | null
}

// Course extension (courses collection) — 1:1 with a product.
export interface Course {
  id: string                   // UUID
  product_id: number | null
  course_access_url: string | null  // link to external course platform
  sort: number | null
  modules: CourseModule[]
  // CMS-driven template sections — absent until the Directus schema has them.
  hero_kicker?: string | null
  hero_facts?: CourseHeroFact[] | null
  stats?: CourseStat[] | null
  main_heading?: string | null
  bonuses?: CourseBonus[] | null
  quotes?: CourseQuote[] | null
  offer_items?: CourseOfferItem[] | null
  price_note?: string | null
  tiles?: CourseTile[]
}

// App-facing product: commerce fields + resolved 1:1 extension + derived kind.
// Produced by `normalizeProduct` (Directus returns the extensions as arrays).
export interface Product {
  id: number
  title: string
  slug: string | null
  price: number              // PLN — note: Directus sends decimals as strings
  image: string | DirectusFile | null
  description: string
  short_description: string | null  // 1-2 zdania do hero/kart (warsztaty, kursy)
  type: ProductType          // derived from which extension is present
  workshop: Workshop | null  // populated when type === 'workshop'
  course: Course | null      // populated when type === 'course'
}

// Raw product as returned by the SDK before normalization — the 1:1 extensions
// come back as arrays (O2M alias on `products`).
export interface RawProduct {
  id: number
  title: string
  slug: string | null
  price: number
  image: string | DirectusFile | null
  description: string
  short_description: string | null
  workshop: Workshop[]
  course: Course[]
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

// Minimal product info attached to an order line. `course_access_url` is
// flattened from the course extension for convenient display.
export interface OrderProductRef {
  id: number
  title: string
  slug: string | null
  type: ProductType
  image: string | DirectusFile | null
  course_access_url: string | null
}

export interface OrderItemExpanded extends OrderItem {
  product: OrderProductRef | null
}

export interface OrderItem {
  id: number
  quantity: number
  price_at_purchase: number
  order_id: string | null
  product_id: number | null
  variant_id: number | null
}

export type ProjectStatus = 'draft' | 'published' | 'archived'

// Junction row for the projects ↔ directus_files M2M relation (projects_files).
export interface ProjectImage {
  id: number
  directus_files_id: string | DirectusFile
}

// A completed build shown in the "Realizacje" gallery.
export interface Project {
  id: string                  // UUID
  status: ProjectStatus
  title: string
  date: string | null         // 'YYYY-MM-DD'
  sort: number | null
  images: ProjectImage[]
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
// request/response objects automatically. `products` uses RawProduct so nested
// relation fields (workshop/course) type-check; we normalize after fetch.

export interface Schema {
  products: RawProduct[]
  product_variants: ProductVariant[]
  workshops: Workshop[]
  workshop_days: WorkshopDay[]
  workshop_agenda: WorkshopAgendaItem[]
  instructors: Instructor[]
  workshops_instructors: WorkshopInstructor[]
  courses: Course[]
  course_modules: CourseModule[]
  course_tiles: CourseTile[]
  projects: Project[]
  projects_files: ProjectImage[]
  orders: Order[]
  order_items: OrderItem[]
  blog_posts: BlogPost[]
}
