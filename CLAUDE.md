# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # dev server at http://localhost:3000
pnpm build      # production build (runs nuxt build)
pnpm preview    # preview the production build locally
```

No lint or test commands exist — TypeScript (`nuxt build`) is the primary correctness check. After any structural change, run `pnpm build` to verify imports and templates compile.

Required environment variables (see `nuxt.config.ts` `runtimeConfig`):

```
DIRECTUS_URL                    # Directus instance base URL
DIRECTUS_SERVICE_TOKEN          # server-only admin token
NUXT_PUBLIC_DIRECTUS_URL        # public URL (client-side fetches)
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
MAILERLITE_API_KEY
MAILERLITE_GROUP_ID
NUXT_PUBLIC_GTM_ID               # optional — GTM container; analytics disabled if empty
```

## Architecture

**Nuxt 4** (`compatibilityVersion: 4`) + **Vue 3 Composition API** + **TypeScript**. Source lives under `app/` (Nuxt 4 convention). The `server/` directory holds Nitro API routes.

### Data model — Directus

All content comes from a **Directus** headless CMS. The schema is typed in [app/types/directus.ts](app/types/directus.ts) and [app/types/shop.ts](app/types/shop.ts).

**Critical shape:** `products` is the commerce anchor. Two 1:1 extension collections hang off it via `product_id`:
- `workshops` — stationary events (dates, spots, level, days/agenda, instructors M2M)
- `courses` — online courses (access URL, modules)
- Merch = a product with neither extension

There is **no `type` column** on `products`. The kind (`'workshop' | 'course' | 'merch'`) is derived by `normalizeProduct` in [app/utils/product.ts](app/utils/product.ts) based on which extension is present. Directus returns 1:1 extensions as arrays; `normalizeProduct` collapses them to a single item (or null).

**Decimal gotcha:** Directus sends `decimal` columns (e.g. `advance`, `price`) as **strings**. Always wrap with `Number()` before arithmetic.

**File references:** A field may be a bare UUID string or an expanded `DirectusFile` object. Always extract the ID with `fileId()` from [app/utils/directus.ts](app/utils/directus.ts) — never inline the extraction.

### Two Directus clients

| Client | Location | Auth | Used for |
|---|---|---|---|
| Public REST | `plugins/directus.ts` → `useDirectus()` | Anonymous / anon permissions | Client-side reads |
| Admin REST | `server/utils/directusAdmin.ts` | `staticToken(DIRECTUS_SERVICE_TOKEN)` | Server API routes — write orders, adjust stock |

The admin client is a module-level singleton. **Never import it into client-side code.**

New Directus collections need anonymous read permissions granted in the Directus UI before `useProducts`/`useProduct` can fetch them.

### Query pattern

`useProducts(type)` and `useProduct(slug)` in `app/composables/` fetch via `readItems('products', { fields: [...] })` and cast results to `unknown[]` before passing to `normalizeProduct`. The SDK type checker is bypassed — correctness is in the field lists and TypeScript interfaces, not in SDK generics.

Nested relation fields follow the Directus SDK object syntax:
```ts
{ workshop: ['id', 'date_start', { days: ['id', 'theme', { agenda_items: ['id', 'description'] }] }] }
// M2M instructors on workshops:
{ instructors: [{ instructors_id: ['id', 'name', 'photo', 'role', 'bio'] }] }
```

### Pricing and cart

All monetary values are **PLN throughout the app**. Conversion to grosze (Stripe minor units = PLN × 100) happens only inside `server/api/checkout/create-intent.post.ts`.

Workshop checkout charges the **advance** deposit (`workshop.advance`), not the full price. `useCart.addProduct()` handles this — don't bypass it.

The cart is `useState('drwa-cart')` (SSR-safe). `plugins/cart.client.ts` hydrates from `localStorage` and persists on every change — runs client-only.

Prices are always displayed with `formatPrice()` from [app/utils/format.ts](app/utils/format.ts), which uses `Intl.NumberFormat('pl-PL')` to produce `"1 450 zł"`.

### Checkout flow (server-side)

`POST /api/checkout/create-intent` does **authoritative re-pricing** via `computeOrder()` (`server/utils/pricing.ts`) — never trusts client-sent prices. It creates a pending `orders` row, line items, a Stripe PaymentIntent, then persists the intent id. `POST /api/stripe/webhook` handles `payment_intent.succeeded` to mark the order paid.

### CSS architecture

Design tokens in `assets/css/drwa-tokens.css` define all CSS custom properties: `--surface-*`, `--text-*`, `--pine-*`, `--timber-*`, fonts, spacing, radius. Reference these vars in components — don't hardcode colours.

Valid surface tokens: `--surface-page`, `--surface-raised`, `--surface-card`, `--surface-sunken`, `--surface-inverse`, `--surface-inverse-2`. (`--surface-subtle` does not exist.)

CSS is split per page group (`warsztat.css`, `sklep.css`, `kurs.css`, etc.) and loaded globally via `nuxt.config.ts`. There are **no scoped styles** on pages; components use `<style scoped>` only when necessary.

### Scroll reveal

Elements that should animate in on scroll get class `io`. `useScrollReveal()` composable (called once per page) attaches an `IntersectionObserver` that adds `io--in` when the element enters the viewport. CSS in `site.css` defines the `opacity`/`translateY` transition. Call `reobserve()` (returned from the composable) after dynamic renders that add new `.io` elements.

### Images

Always use `<DrwaImg>` for Directus images — it builds an AVIF → WebP → JPEG `<picture>` chain via `assetSources()` and accepts a `preset` (`'thumb' | 'card' | 'portrait' | 'hero'`) that controls width and quality. For LCP images, pass `priority`.

### No shared layout

There is no `app/layouts/` directory. Each page inlines `<DrwaNav />` and a `<footer>` block (or `<DrwaFooter />`). Pages that use `DrwaFooter` get the canonical nav links; pages with an inline footer have page-specific nav sections. This is known technical debt.

### Auth

`useAuth()` composable wraps Directus user/token state. Pages that require login apply `definePageMeta({ middleware: 'auth' })`. The middleware redirects to `/logowanie?redirect=<current>`.

### Analytics (GTM)

`plugins/gtm.client.ts` loads Google Tag Manager **lazily on `requestIdleCallback`, production only**, gated on `NUXT_PUBLIC_GTM_ID`. **Consent Mode v2 defaults all consent to `denied`** (EU/RODO) — there is no cookie banner yet; `useConsent()` exposes `grantConsent()`/`denyConsent()` to wire one up. SPA pageviews are pushed to `dataLayer` as `{ event: 'pageview', page_path }` on each client navigation; configure the matching trigger inside the GTM container.
