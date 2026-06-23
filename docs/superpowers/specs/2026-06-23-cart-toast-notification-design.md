# Cart Toast Notification — Design Spec
_Date: 2026-06-23_

## Problem

After adding a product to the cart, only the counter number in the nav updates. Users need clear, prominent visual confirmation that the action succeeded.

## Solution

A slide-in toast card in the bottom-right corner showing product details, auto-dismissing after 4 seconds, with a simultaneous pulse animation on the cart icon in the nav.

---

## Architecture

### `useCartToast` composable (`app/composables/useCartToast.ts`)

Global singleton via `useState`. Holds:
- `toast: { product: CartToastProduct; visible: boolean } | null`

Exposes:
- `showToast(product: CartToastProduct): void` — sets state + starts 4s auto-hide timer
- `hideToast(): void` — clears state

`CartToastProduct` shape (subset of what `AddToCartButton` already has):
```ts
interface CartToastProduct {
  title: string
  price: number       // in PLN (charge price, already resolved)
  image: string | null  // Directus file ID or null
}
```

Auto-hide timer is stored in a module-level ref and cleared on each new `showToast` call to prevent races when the user adds multiple items quickly.

### `CartToast.vue` (`app/components/CartToast.vue`)

- Rendered once in `app/app.vue` (global, no per-page changes needed)
- Uses `<Teleport to="body">` so z-index stacking is clean
- Uses `<Transition>` for enter/leave animations
- Auto-hides on route change to `/koszyk`

### Changes to existing files

| File | Change |
|---|---|
| `app/components/AddToCartButton.vue` | Call `showToast({ title, price, image })` after `addProduct` |
| `app/components/CartLink.vue` | Watch `bumped` state from composable; toggle `is-bumped` class for 600ms |
| `app/app.vue` | Add `<CartToast />` |

---

## Visual Design

**Position:** `position: fixed; bottom: 24px; right: 24px; z-index: 9000`

**Card:**
- Width: `280px`
- Background: `var(--surface-card)` (white)
- Border: `1px solid var(--border-soft)`
- Border-radius: `var(--radius-lg)` (16px)
- Shadow: `var(--shadow-lg)`

**Layout (horizontal):**
```
┌──────────────────────────────────┐
│  [img 56×56]  Dodano do koszyka  │ [×]
│               Tytuł produktu     │
│               XXX zł             │
│  [Przejdź do koszyka]            │
└──────────────────────────────────┘
```

- Label "Dodano do koszyka": `--text-2xs`, `--font-mono`, `--text-muted`
- Product title: `--font-serif`, `--text-base`, `--fw-medium`, `--text-strong`
- Price: `--font-sans`, `--text-sm`, `--text-accent` (timber)
- CTA: `btn btn--primary btn--sm` (existing class), full width, links to `/koszyk`
- Close button: `×` top-right corner, `--text-muted`
- Thumbnail: Directus CDN URL `<img>`, `56×56px`, `border-radius: var(--radius-sm)`, `object-fit: cover`; fallback to a generic bag SVG icon when `image` is null

---

## Animation

### Toast enter/leave (`<Transition name="cart-toast">`)

```css
/* Enter */
.cart-toast-enter-from { transform: translateX(110%); opacity: 0; }
.cart-toast-enter-active { transition: transform var(--dur-slow) var(--ease-out), opacity var(--dur-slow) var(--ease-out); }
.cart-toast-enter-to { transform: translateX(0); opacity: 1; }

/* Leave */
.cart-toast-leave-from { transform: translateX(0); opacity: 1; }
.cart-toast-leave-active { transition: transform var(--dur-base) var(--ease-in), opacity var(--dur-base) var(--ease-in); }
.cart-toast-leave-to { transform: translateX(110%); opacity: 0; }
```

### Cart icon pulse (`.is-bumped` on `CartLink`)

```css
@keyframes cart-bump {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.28); }
  70%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}
.cartbtn.is-bumped { animation: cart-bump 600ms var(--ease-out) forwards; }
```

The `is-bumped` class is added for 600ms via a `setTimeout` cleared on each new add.

---

## Auto-dismiss Behavior

- Toast hides after **4 seconds** from `showToast`
- Toast hides immediately when the user navigates to `/koszyk`
- Clicking the CTA "Przejdź do koszyka" navigates + hides toast
- Clicking `×` hides toast
- A new `showToast` while one is visible resets the 4s timer and updates the content

---

## Mobile

- On screens `< 480px`: toast stretches `left: 16px; right: 16px; bottom: 16px; width: auto` so it doesn't get cut off
- Thumbnail hidden on very small screens (`< 360px`) to save space

---

## Files Changed

1. `app/composables/useCartToast.ts` — **new**
2. `app/components/CartToast.vue` — **new**
3. `app/components/AddToCartButton.vue` — call `showToast` after `addProduct`
4. `app/components/CartLink.vue` — `is-bumped` pulse class
5. `app/app.vue` — mount `<CartToast />`
