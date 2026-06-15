# System sklepowy DRWA — specyfikacja

Data: 2026-06-14
Stack: Nuxt 4 (SSR) + Directus SDK + Stripe (Elements / PaymentIntents) + Nitro server routes.

## Decyzje (ustalone z właścicielem)
- **Konta:** zakup gościnny + opcjonalne konto. Konta = użytkownicy Directus. Panel klienta tylko dla zalogowanych.
- **Stripe:** Elements (embedded), PaymentIntents. BLIK/P24/karty przez `automatic_payment_methods`.
- **Kursy:** dostarczane przez zewnętrzną platformę — po opłaceniu pokazujemy/wysyłamy link dostępu (`products.course_access_url`).
- **Wysyłka merchu:** własny formularz adresu + własne stawki wysyłki liczone serwerowo.

## Typy produktów i reguły
- `merch` — fizyczny. Wariant (rozmiar) wymagany jeśli istnieją warianty. Ilość ≤ stan. Wymaga adresu + wysyłki.
- `course` — cyfrowy. Ilość = 1. Bez wysyłki. Po zakupie: link do zewnętrznej platformy.
- `workshop` — rezerwacja. Ilość = liczba miejsc. Walidacja `workshop_capacity - workshop_booked`. Bez wysyłki.

## Bezpieczeństwo (krytyczne)
- Sekretny klucz Stripe i token serwisowy Directus **tylko po stronie serwera** (`runtimeConfig`, nie `public`).
- Kwota PaymentIntent liczona **wyłącznie serwerowo** z cen w Directusie — nigdy z danych klienta.
- Webhook weryfikuje podpis Stripe; obsługa idempotentna (guard po statusie zamówienia).
- Stan magazynowy / wolne miejsca walidowane przy tworzeniu intent ORAZ dekrementowane w webhooku.

## Model danych (Directus)
Istnieją: `products`, `product_variants`, `orders`, `order_items`.
**Pola do dodania w Directusie** (typy TS rozszerzone z góry; fallback gdy puste):
- `orders`: `email` (string), `payment_intent_id` (string), `subtotal` (decimal), `shipping_method` (string), `shipping_cost` (decimal). Relacja `customer → directus_users` już jest. `shpping_address` (literówka w DB) przechowuje adres jako tekst/JSON.
- `products`: `course_access_url` (string, nullable) — link do zewnętrznej platformy kursu.

## Kontrakty — composables
`useCart()` → `{ items, count, subtotal, add(item), remove(key), setQty(key, n), clear(), hasPhysical }`
- `CartItem`: `{ key, productId, variantId|null, type, slug, title, price, qty, image, size|null, maxQty }`
- `key` = `${productId}:${variantId ?? 'x'}`. Persist w localStorage (`drwa-cart`), hydracja po stronie klienta.

`useAuth()` → `{ user, isLoggedIn, login(email,pass), register(payload), logout(), fetchMe() }`
- Token w cookie `drwa_auth` (czytelny w SSR). Plugin ustawia token na kliencie Directus.

`useCheckout()` → `{ createIntent(payload), confirming, error }`
- `createIntent` woła `POST /api/checkout/create-intent`, zwraca `{ clientSecret, orderId, publishableKey }`.

`useOrders()` → `{ fetchMine(), fetchOne(id) }` (panel + potwierdzenie).

## Kontrakty — serwer (Nitro `server/`)
- `server/utils/stripe.ts` → `getStripe(event)` (instancja Stripe z sekretu).
- `server/utils/directusAdmin.ts` → `directusAdmin(event)` (klient z tokenem serwisowym, pełne uprawnienia).
- `server/utils/pricing.ts` → `computeOrder({ items, shippingMethod })`:
  - pobiera produkty/warianty z Directusa, waliduje stan/miejsca, liczy `subtotal`, `shippingCost`, `total` (grosze).
  - stawki: paczkomat 1299, kurier 1699, darmowa wysyłka od 30000 (300 zł). Brak fizycznych → wysyłka 0.
- `POST /api/checkout/create-intent` → body `{ items, email, shippingMethod, address?, customerId? }`:
  1. `computeOrder`; 2. tworzy `orders` (pending) + `order_items`; 3. tworzy PaymentIntent (PLN, `automatic_payment_methods`, `metadata.order_id`); 4. zapisuje `payment_intent_id` na zamówieniu; 5. zwraca `{ clientSecret, orderId, publishableKey }`.
- `POST /api/stripe/webhook` → weryfikuje podpis; na `payment_intent.succeeded`: jeśli order nie `paid` → `paid`, dekrementuje stan / inkrementuje `workshop_booked`, wywołuje `fulfillOrder` (e-mail + dostęp do kursu — util z realną wysyłką do podpięcia później). Na `payment_intent.payment_failed` → `cancelled`.
- `GET /api/orders/[id]` → zamówienie + pozycje do strony potwierdzenia (gość: po id; zalogowany: weryfikacja właściciela).

## Strony / routing
- `/sklep`, `/sklep/[slug]` — lista + detal z Directusa (migracja `[id]`→`[slug]`), prawdziwy „Do koszyka".
- `/koszyk` — koszyk.
- `/zamowienie` — checkout (kontakt, adres+wysyłka jeśli fizyczne, Payment Element).
- `/zamowienie/[id]` — potwierdzenie / status (return_url).
- `/konto` — panel (middleware auth): dane, historia zamówień, dostęp do kursów.
- `/logowanie`, `/rejestracja`.

## Komponenty
`CartLink` (badge), `AddToCartButton`, `QtyStepper`, `CartLineItem`, `AddressForm`, `StripePaymentForm` (wrapper Elements), `OrderSummary`, `AuthForm`.

## Env (nowe)
Serwerowe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `DIRECTUS_SERVICE_TOKEN`.
Publiczne: `NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

## Fazy
1. Fundament (env, config, typy). 2. Serwer (utile + endpointy). 3. Composables + plugin + middleware. 4. Komponenty + strony UI. 5. Podpięcie add-to-cart + badge. 6. CSS. 7. Typecheck.
