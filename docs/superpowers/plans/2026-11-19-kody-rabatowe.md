# Kody rabatowe — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kody rabatowe (procent/kwota, ważność, limit użyć, zawężenie do produktów) tworzone w Directusie i stosowane autorytatywnie w checkoutcie.

**Architecture:** Nowa kolekcja `discount_codes` w Directusie. `computeOrder()` (`server/utils/pricing.ts`) waliduje kod, liczy rabat i rozpisuje go na pozycje; `create-intent` zapisuje go na zamówieniu i pozycjach; nowy `POST /api/checkout/quote` daje stronie zamówienia podgląd. Liczba użyć = liczba zamówień `paid`/`shipped` z tym kodem (bez licznika).

**Tech Stack:** Nuxt 4, Directus SDK (`@directus/sdk`), Stripe PaymentIntent, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-19-kody-rabatowe-design.md`

## Global Constraints

- Wszystkie kwoty w PLN; grosze tylko przy Stripe (`totalGrosze`). Decimale z Directusa (`value`, `price`) przychodzą jako stringi → `Number()`.
- Kod w Directusie: regex `^[A-Z0-9_-]+$`; wejście klienta normalizowane `trim().toUpperCase()`.
- Pozycje `type === 'workshop'` nigdy nie dostają rabatu.
- Minimum po rabacie: `total >= 2` zł, inaczej 400 „Kwota po rabacie jest za niska.”
- Komunikaty 400 (dokładnie): „Nieprawidłowy kod rabatowy.”, „Kod rabatowy jest nieaktywny lub wygasł.”, „Kod rabatowy został już wykorzystany.”, „Kod nie dotyczy produktów w koszyku.”
- `discount_codes` i `discount_codes_products` NIE są czytelne dla polityki Public.
- Przed wdrożeniem: `CACHE_AUTO_PURGE=true` na serwerze Directusa (robi właściciel).
- Po każdej zmianie strukturalnej: `pnpm typecheck` i `pnpm build`.

## Review Focus

1. Kod wpisany małymi literami / ze spacjami (`" jesien10 "`) → działa jak `JESIEN10`. Test w Task 2.
2. Koszyk mieszany warsztat + merch z kodem „cały sklep” → rabat tylko od merchu; koszyk z samym warsztatem → „Kod nie dotyczy produktów w koszyku.” Test w Task 2.
3. Kod kwotowy większy niż wartość pasujących pozycji → rabat = wartość tych pozycji, nie więcej (i wtedy zadziała minimum 2 zł, jeśli nic innego nie zostało). Test w Task 2.
4. Kod wyłączony/wyczerpany między „Zastosuj” a „Przejdź do płatności” → `create-intent` zwraca 400 z komunikatem, strona go pokazuje i nie przechodzi do płatności. Weryfikacja ręczna w Task 4.
5. Zmiana metody dostawy po zastosowaniu kodu → podgląd odświeżony z serwera (próg darmowej dostawy po rabacie). Weryfikacja ręczna w Task 4.

---

### Task 1: Schemat Directusa i uprawnienia

**Files:** brak (zmiany w Directusie przez `mcp__directus__*`; uprawnienia przez zalogowaną kartę admin.drwa.pl — `fetch('/permissions', { credentials: 'include' })` w Chrome DevTools MCP).

**Interfaces:**
- Produces: kolekcje/pola używane przez Task 2–4:
  - `discount_codes`: `id` (int auto), `code` (string, unique, required, validation `^[A-Z0-9_-]+$`), `active` (boolean, default true), `type` (string, dropdown `percent`=„Procent” / `fixed`=„Kwota (zł)”, required), `value` (decimal 10,2, required), `valid_from` (timestamp, null), `valid_until` (timestamp, null), `max_uses` (integer, null), `products` (M2M → `products` przez `discount_codes_products(id, discount_codes_id, products_id)`), `orders` (O2M alias ← `orders.discount_code`). `display_template` kolekcji: `{{code}}`.
  - `orders.discount_code` (M2O → `discount_codes`, null), `orders.discount_amount` (decimal 10,2, null).
  - `order_items.discount_amount` (decimal 10,2, null).

- [ ] **Step 1: Odczytaj obecny schemat** `orders`, `order_items`, `products` (`mcp__directus__schema`) — potwierdź nazwy kluczy (`products.id` integer, `orders.id` uuid).
- [ ] **Step 2: Utwórz `discount_codes` z polami i junction `discount_codes_products` + relacje** (`mcp__directus__collections`, `fields`, `relations`), wg listy wyżej. Ikona `sell`, notatka kolekcji: „Kody rabatowe sklepu (nie dotyczą warsztatów). Puste produkty = cały sklep.”
- [ ] **Step 3: Dodaj pola na `orders` i `order_items`** wg listy wyżej.
- [ ] **Step 4: Uprawnienia** — polityka „Sklep” (token serwera): read `discount_codes`, `discount_codes_products`; create na `orders` i `order_items` obejmuje nowe pola (jeśli uprawnienia są per-pole, dopisz je); read `orders` z polami `discount_code`, `status` (do agregacji). Public: brak dostępu do obu nowych kolekcji.
- [ ] **Step 5: Weryfikacja** — utwórz testowy kod `TEST10` (percent, 10, active) przez MCP; potem:
  - `curl -s "$DIRECTUS_URL/items/discount_codes?fields=code" -H "Authorization: Bearer $DIRECTUS_SERVICE_TOKEN"` → zawiera `TEST10`
  - `curl -s -o /dev/null -w '%{http_code}' "$DIRECTUS_URL/items/discount_codes"` (anonimowo) → `403`
  - `curl -s "$DIRECTUS_URL/items/orders?aggregate[count]=*&filter[discount_code][_null]=true" -H "Authorization: Bearer $DIRECTUS_SERVICE_TOKEN"` → `200`

---

### Task 2: Rabat w `computeOrder`

**Files:**
- Modify: `app/types/shop.ts` (`ComputedLine`, `ComputedOrder`)
- Modify: `app/types/directus.ts` (`Order`, `OrderItem`, nowy `DiscountCode`)
- Modify: `server/utils/pricing.ts`
- Test: `tests/pricing.test.ts`

**Interfaces:**
- Consumes: schemat z Task 1.
- Produces:
  - `computeOrder(items: CheckoutItemInput[], shippingMethod: ShippingMethod | null, discountCode?: string | null): Promise<ComputedOrder>`
  - `ComputedLine.discount: number` (PLN, cała pozycja; 0 gdy nie dotyczy)
  - `ComputedOrder.discount: number`, `ComputedOrder.discountCodeId: number | null`, `ComputedOrder.discountCode: string | null` (znormalizowany)
  - `splitDiscount(lineTotals: number[], discount: number): number[]` (eksport z `pricing.ts`)
  - `interface DiscountCode { id: number; code: string; active: boolean; type: 'percent' | 'fixed'; value: number | string; valid_from: string | null; valid_until: string | null; max_uses: number | null; products?: { products_id: number }[] }`
  - `Order.discount_code: number | null`, `Order.discount_amount: number | string | null`, `OrderItem.discount_amount: number | string | null`

- [ ] **Step 1: Rozszerz mock w testach i napisz testy (failing)**

Mock routuje teraz po ścieżce: `/discount_codes` → lista kodów, `/orders` → `[{ count: String(uses) }]`, `/product_variants` → warianty, inaczej produkty:

```ts
function directus(products: unknown[], variants: unknown[] = [], codes: unknown[] = [], uses = 0) {
  request.mockImplementation(async (q: () => { path: string }) => {
    const p = q().path
    if (p.endsWith('/product_variants')) return variants
    if (p.endsWith('/discount_codes')) return codes
    if (p.endsWith('/orders')) return [{ count: String(uses) }]
    return products
  })
}
const code = (over = {}) => ({ id: 7, code: 'JESIEN', active: true, type: 'percent', value: '10.00',
  valid_from: null, valid_until: null, max_uses: null, products: [], ...over })
```

Nowy `describe('discount codes')`:
- `'applies a percent code to merch, normalizes input, and checks free shipping after the discount'` — `directus([merch], [variant()], [code()])`, `computeOrder([line(1, 3, 10)], 'kurier', ' jesien ')` → `subtotal === 300`, `discount === 30`, `shippingCost === 16.99` (próg 300 liczony po rabacie: 270 < 300), `total === 286.99`, `lines[0].discount === 30`, `discountCode === 'JESIEN'`, `discountCodeId === 7`.
- `'caps a fixed code at the eligible lines'` — kod `{ type: 'fixed', value: '1000.00' }` na kurs 800 + merch 100 z kodem zawężonym `products: [{ products_id: 1 }]` → `discount === 100`, `lines` kursu `discount === 0`.
- `'never discounts workshops'` — warsztat + merch, kod „cały sklep” 10% → `discount === 10` (tylko merch 100); sam warsztat → rejects `'Kod nie dotyczy produktów w koszyku.'`
- `'rejects unknown, inactive, expired, not-yet-valid and used-up codes'` — `[]` → `'Nieprawidłowy kod rabatowy.'`; `active: false` → to samo; `valid_until: past` i `valid_from: future` → `'Kod rabatowy jest nieaktywny lub wygasł.'`; `max_uses: 3`, `uses = 3` → `'Kod rabatowy został już wykorzystany.'`; `max_uses: 3`, `uses = 2` → resolves.
- `'rejects a total below 2 zł'` — kod percent 99 na kurs 100 zł (podmień `price`) → rejects `'Kwota po rabacie jest za niska.'`
- `'ignores an empty code'` — `computeOrder([...], 'kurier', '  ')` → `discount === 0`, `discountCodeId === null`, brak zapytania o `/discount_codes`.
- `'splitDiscount sums to the total to the grosz'` — `splitDiscount([33.33, 33.33, 33.34], 10)` → suma `=== 10` (porównanie po `Math.round(x*100)`), `splitDiscount([100], 5)` → `[5]`, `splitDiscount([50, 0], 5)` → `[5, 0]`.

- [ ] **Step 2: Uruchom** `pnpm test` → nowe testy FAIL (brak `splitDiscount` / `discount`).

- [ ] **Step 3: Zaimplementuj w `server/utils/pricing.ts`**

- `computeOrder` przyjmuje `discountCode?: string | null`. Po zbudowaniu `lines` i `subtotal`, jeśli `discountCode?.trim()`:
  - `readItems('discount_codes', { filter: { code: { _eq: normalized } }, fields: ['id','code','active','type','value','valid_from','valid_until','max_uses', { products: ['products_id'] }], limit: 1 })`
  - kolejność walidacji jak w Global Constraints (nie istnieje/nieaktywny → daty → limit → brak pasujących pozycji). Daty: `Date.parse(...)` vs `Date.now()`.
  - limit tylko gdy `max_uses != null`: `aggregate('orders', { aggregate: { count: '*' }, query: { filter: { discount_code: { _eq: id }, status: { _in: ['paid', 'shipped'] } } } })`, `Number(res[0]?.count ?? 0) >= max_uses` → fail.
  - pasujące: `l.type !== 'workshop' && (!productIds.length || productIds.includes(l.productId))`.
  - rabat: percent → `round2(eligible * value / 100)`, fixed → `min(value, eligible)`; potem `splitDiscount` na `lineTotal` pasujących pozycji i przypisanie `line.discount`.
- Próg darmowej dostawy liczony od `subtotal - discount`. `total = round2(subtotal - discount + shippingCost)`; przy aktywnym kodzie `total < 2` → fail.
- `splitDiscount`: część i = `round2(discount * lineTotal_i / sum)`; różnica `round2(discount - sum(części))` doliczona do indeksu o największym `lineTotal`. Gdy `sum === 0` → same zera.
- Pozycje bez kodu: `discount: 0`. Zwróć `discount`, `discountCodeId`, `discountCode`.

- [ ] **Step 4: Uruchom** `pnpm test` → wszystkie PASS (stare też). `pnpm typecheck` → bez błędów.

- [ ] **Step 5: Commit**

```bash
git add app/types server/utils/pricing.ts tests/pricing.test.ts
git commit -m "Kody rabatowe: walidacja i rozpisanie rabatu w computeOrder"
```

---

### Task 3: API — zapis rabatu i podgląd

**Files:**
- Modify: `app/types/shop.ts` (`CreateIntentPayload.discountCode`, nowe `QuotePayload`, `QuoteResponse`)
- Modify: `server/api/checkout/create-intent.post.ts`
- Create: `server/api/checkout/quote.post.ts`
- Modify: `server/api/orders/[id].get.ts`, `server/api/orders/mine.get.ts`, `server/utils/orders.ts` (dołącz `discount_amount` w `fields` zamówienia i pozycji)

**Interfaces:**
- Consumes: `computeOrder(..., discountCode)` i pola `ComputedOrder` z Task 2.
- Produces:
  - `CreateIntentPayload.discountCode: string | null`
  - `interface QuotePayload { items: CheckoutItemInput[]; shippingMethod: ShippingMethod | null; discountCode: string | null }`
  - `interface QuoteResponse { subtotal: number; discount: number; discountCode: string | null; shippingCost: number; total: number }`
  - `POST /api/checkout/quote` → `QuoteResponse` (400 z komunikatem z `computeOrder`)

- [ ] **Step 1: `create-intent`** — przekaż `body.discountCode` do `computeOrder`; na `orders` zapisz `discount_code: computed.discountCodeId`, `discount_amount: computed.discount || null`; na każdej `order_items` `discount_amount: l.discount || null`. `subtotal` zostaje przed rabatem, `total_price = computed.total`. Do metadanych PaymentIntent dodaj `discount_code` gdy jest (widoczne w panelu Stripe).
- [ ] **Step 2: `quote.post.ts`** — `readBody<QuotePayload>`, `computeOrder(items, shippingMethod, discountCode)`, zwróć pola `QuoteResponse`. Uwaga: `shippingMethod` może być null dla koszyka z merchem — wtedy `computeOrder` rzuci „Wybierz metodę dostawy.”; strona zawsze wysyła wybraną metodę, gdy `hasPhysical`.
- [ ] **Step 3: Odczyty zamówień** — dodaj `discount_amount` (i `discount_code` jako `{ discount_code: ['code'] }` lub samo id — wystarczy `discount_amount`) do `fields` w `orders/[id].get.ts`, `orders/mine.get.ts`; `discount_amount` do `fields` pozycji w `server/utils/orders.ts`.
- [ ] **Step 4: Weryfikacja** — `pnpm typecheck` czyste; `pnpm test` PASS; `pnpm dev` i:
  `curl -s -X POST localhost:3000/api/checkout/quote -H 'content-type: application/json' -d '{"items":[{"productId":<id kursu>,"variantId":null,"qty":1}],"shippingMethod":null,"discountCode":"test10"}'` → `discount` = 10% ceny kursu; z `"discountCode":"NIEMA"` → 400 „Nieprawidłowy kod rabatowy.”
- [ ] **Step 5: Commit** — `git commit -m "Kody rabatowe: zapis na zamówieniu i endpoint podglądu"`

---

### Task 4: UI checkoutu i potwierdzenia

**Files:**
- Modify: `app/composables/useCheckout.ts` (dodaj `quote(payload: QuotePayload): Promise<QuoteResponse | null>` z tym samym wzorcem błędów co `createIntent`, osobny ref `quoteError`)
- Modify: `app/components/OrderSummary.vue` (props `discount?: number`, `discountCode?: string | null`; wiersz „Rabat (KOD)” z `−{{ formatPrice(discount) }}` między „Produkty” a „Dostawa”, gdy `discount > 0`)
- Modify: `app/pages/zamowienie/index.vue`
- Modify: `app/pages/zamowienie/[id].vue` (przekaż `discount` = `Number(order.discount_amount) || 0` do `OrderSummary`)
- Modify: CSS strony zamówienia (plik, w którym są style `.checkout__*` — znajdź `grep -rl "checkout__hint" app/assets/css`)
- Modify: `CLAUDE.md` (sekcja „Checkout flow”: jedno zdanie o kodach rabatowych i `quote`; sekcja Data model: `discount_codes` niepubliczne, użycia liczone z zamówień)

**Interfaces:**
- Consumes: `QuotePayload`, `QuoteResponse`, `CreateIntentPayload.discountCode` z Task 3.

- [ ] **Step 1: Stan na stronie** — `codeInput = ref('')`, `applied = ref<QuoteResponse | null>(null)`, `codeError = ref<string | null>(null)`. `applyCode()` wywołuje `quote({ items: toCheckoutItems(), shippingMethod: hasPhysical ? shippingMethod : null, discountCode: codeInput })`; sukces → `applied = res`; błąd → `codeError`, `applied = null`. `removeCode()` czyści oba. `watch(shippingMethod)` → gdy `applied`, ponów `applyCode()`.
- [ ] **Step 2: Sumy** — gdy `applied`: `OrderSummary` dostaje `applied.subtotal/discount/discountCode/shippingCost/total`; bez kodu jak dziś. `shipOptions` liczone od `subtotal - discount` (żeby „gratis” i „brakuje do darmowej dostawy” zgadzały się z serwerem); `:amount-label` przy płatności używa tego samego `total`.
- [ ] **Step 3: Pole kodu** w `aside` pod `OrderSummary`, tylko gdy `!clientSecret`: `<input>` z `<label>` „Kod rabatowy” + przycisk „Zastosuj” (Enter też stosuje, `@keydown.enter.prevent`); po zastosowaniu: tekst „Kod {{ applied.discountCode }} zastosowany” + przycisk-link „Usuń”; `codeError` pod polem z `role="alert"`. Style tokenami z `drwa-tokens.css`.
- [ ] **Step 4: `startPayment`** wysyła `discountCode: applied.value?.discountCode ?? null`. Błąd 400 z `create-intent` (np. kod wyczerpany w międzyczasie) trafia do istniejącego `checkoutError` — bez zmian w obsłudze.
- [ ] **Step 5: Weryfikacja ręczna** (`pnpm dev`, Chrome DevTools MCP, Stripe w trybie testowym):
  - kurs + `test10` → wiersz „Rabat (TEST10) −X zł”, suma obniżona; „Usuń” przywraca.
  - merch tuż nad progiem darmowej dostawy + kod → dostawa przestaje być „gratis”; zmiana paczkomat/kurier odświeża sumę.
  - `NIEMA` → „Nieprawidłowy kod rabatowy.” pod polem.
  - zastosuj kod, w Directusie ustaw `active=false`, „Przejdź do płatności” → komunikat błędu, brak przejścia do płatności.
  - pełna płatność testowa kartą `4242 4242 4242 4242` → w Directusie zamówienie ma `discount_code`, `discount_amount`, pozycje mają `discount_amount` sumujące się do rabatu; w `discount_codes` → `orders` widać to zamówienie; strona `/zamowienie/<id>` pokazuje wiersz rabatu.
  - kod z `max_uses: 1` po jednej opłaconej płatności → „Kod rabatowy został już wykorzystany.”
- [ ] **Step 6: `pnpm typecheck && pnpm test && pnpm build`** → wszystko czyste.
- [ ] **Step 7: Usuń testowy kod `TEST10`** z Directusa (lub ustaw `active=false`) i commit:

```bash
git add app CLAUDE.md
git commit -m "Kody rabatowe: pole kodu w checkoutcie i rabat w podsumowaniach"
```
