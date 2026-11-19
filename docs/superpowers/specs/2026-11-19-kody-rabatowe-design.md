# Kody rabatowe w sklepie

Data: 2026-11-19

## Cel

Właściciel sklepu chce tworzyć w panelu Directusa kody rabatowe z datą ważności, limitem użyć i zawężeniem do konkretnych produktów, a klient ma je wpisywać przy zamówieniu. Rabat musi być liczony autorytatywnie na serwerze (jak cała reszta cen), nie w przeglądarce.

## Cele / poza zakresem

**Cele**
- Kod procentowy albo kwotowy (PLN).
- Ważność od–do (każda z dat opcjonalna).
- Limit użyć (opcjonalny; puste = bez limitu).
- Zawężenie do wybranych produktów (puste = cały sklep).
- Włącznik „aktywny” do szybkiego wyłączenia kodu.
- Zamówienie pamięta użyty kod i kwotę rabatu; w Directusie widać zamówienia danego kodu.

**Poza zakresem**
- Warsztaty — obecnie nie są sprzedawane przez stronę. Pozycje warsztatowe **nigdy** nie dostają rabatu (żeby nie trzeba było rozstrzygać kwestii zaliczka vs pełna cena).
- Limit użyć na klienta/e-mail, łączenie kilku kodów, kod na darmową dostawę, minimalna wartość koszyka, kody 100% / darmowe zamówienia.
- Kupony Stripe — odrzucone (działają tylko z hostowanym Stripe Checkout/fakturami, sklep używa PaymentIntent + Payment Element).

**Anty-cele**
- Rabat liczony lub ufany po stronie klienta.
- Kody czytelne publicznie przez API Directusa (wyciek wszystkich kodów).

## Podejście (wybrane: A)

| | Opis | Decyzja |
|---|---|---|
| **A** | Kolekcja `discount_codes` w Directusie, walidacja i rabat w `computeOrder()`, użycia liczone z opłaconych zamówień | **wybrane** |
| B | Stripe Promotion Codes | odrzucone — wymaga przebudowy checkoutu na Stripe Checkout + dubla produktów w Stripe |
| C | Jak A, ale użycie „rezerwowane” przy tworzeniu PaymentIntent | odrzucone — porzucone koszyki zjadają limit |

**Świadomy kompromis (zaakceptowany przez właściciela):** dwie płatności tym samym kodem w tej samej chwili przy ostatnim wolnym użyciu mogą obie przejść — limit może zostać przekroczony o 1–2 użycia.

## Model danych (Directus)

**Nowa kolekcja `discount_codes`**

| Pole | Typ | Uwagi |
|---|---|---|
| `id` | integer, auto | |
| `code` | string, unique, required | walidacja regex `^[A-Z0-9_-]+$` (wymusza wielkie litery w panelu) |
| `active` | boolean, default `true` | |
| `type` | string, dropdown `percent` / `fixed`, required | etykiety: „Procent”, „Kwota (zł)” |
| `value` | decimal, required | procent (1–100) albo PLN |
| `valid_from` | timestamp, nullable | |
| `valid_until` | timestamp, nullable | |
| `max_uses` | integer, nullable | puste = bez limitu |
| `products` | M2M → `products` przez `discount_codes_products` | puste = cały sklep (poza warsztatami) |
| `orders` | O2M alias ← `orders.discount_code` | podgląd zamówień z tym kodem |

**Nowe pola na `orders`:** `discount_code` (M2O → `discount_codes`, nullable), `discount_amount` (decimal, nullable, PLN).

**Nowe pole na `order_items`:** `discount_amount` (decimal, nullable, PLN) — część rabatu przypadająca na całą pozycję (nie na sztukę). Cena pozycji po rabacie = `price_at_purchase * quantity - discount_amount`. Decyzja właściciela: rabat rozpisany na pozycje, bo faktury i częściowe zwroty robi na podstawie cen pozycji.

**Uprawnienia:** `discount_codes` i `discount_codes_products` **bez** odczytu dla Public. Polityka „Sklep” (token serwera): odczyt `discount_codes`, `discount_codes_products`, oraz `orders` (agregacja); create na `orders` musi obejmować nowe pola. Uprawnienia ustawiane z zalogowanej karty admin.drwa.pl (MCP nie ma dostępu do `directus_*`).

## Logika (serwer)

`computeOrder(items, shippingMethod, discountCode?)` w `server/utils/pricing.ts`:

1. Bez kodu (pusty/whitespace) → zachowanie bez zmian, `discount = 0`.
2. Kod normalizowany: `trim().toUpperCase()`. Szukany po `code`.
3. Walidacja, każda z osobnym komunikatem 400:
   - nie istnieje lub `active = false` → „Nieprawidłowy kod rabatowy.”
   - przed `valid_from` / po `valid_until` → „Kod rabatowy jest nieaktywny lub wygasł.”
   - liczba zamówień z tym kodem o statusie `paid` lub `shipped` ≥ `max_uses` → „Kod rabatowy został już wykorzystany.”
   - brak pasujących pozycji → „Kod nie dotyczy produktów w koszyku.”
4. Pozycje kwalifikujące się: `type !== 'workshop'` i (brak produktów na kodzie lub `productId` w zbiorze).
5. Rabat: `percent` → `round2(eligibleSubtotal * value / 100)`; `fixed` → `min(value, eligibleSubtotal)`.
6. Rozpisanie na pozycje: łączny rabat dzielony proporcjonalnie do `lineTotal` kwalifikujących się pozycji, każda część `round2`, a różnica z zaokrągleń doliczana do pozycji o największym `lineTotal` — suma części zawsze równa się łącznemu rabatowi co do grosza. `ComputedLine` dostaje `discount: number` (0 dla pozycji niekwalifikujących się).
7. Próg darmowej dostawy liczony od `subtotal - discount` (po rabacie).
8. `total = subtotal - discount + shippingCost`; jeśli `total < 2` zł (minimum Stripe dla PLN) → 400 „Kwota po rabacie jest za niska.”
9. `ComputedOrder` dostaje `discount: number` i `discountCodeId: number | null`.

Licznik użyć **nie jest przechowywany** — liczba użyć to liczba zamówień `paid`/`shipped` z tym kodem. Dzięki temu webhook/fulfillment się nie zmienia i nie ma licznika, który mógłby się rozjechać.

**Ryzyko — cache Directusa:** Directus cache'uje odpowiedzi GET i nie czyści ich po edycji (patrz CLAUDE/notatki). Bez obejścia: świeżo utworzony/wyłączony kod i liczba użyć mogą być nieaktualne przez TTL. Rozwiązanie: właściciel ustawia `CACHE_AUTO_PURGE=true` na serwerze Directusa (naprawia też `spots_booked`). Wymagane przed wdrożeniem; kod sklepu nie obchodzi cache.

## API

- `POST /api/checkout/create-intent` — payload dostaje `discountCode: string | null`; zapisuje `discount_code` i `discount_amount` na zamówieniu oraz `discount_amount` na każdej pozycji. `subtotal` na zamówieniu zostaje przed rabatem, `total_price` po.
- **Nowy** `POST /api/checkout/quote` — `{ items, shippingMethod, discountCode }` → `{ subtotal, discount, shippingCost, total }`, czyli wywołanie `computeOrder` bez skutków ubocznych. Służy podglądowi na stronie zamówienia. Objęty istniejącym rate limitem (`server/middleware/rateLimit.ts`) — chroni przed zgadywaniem kodów.

## UI

- `app/pages/zamowienie/index.vue`: w bocznym podsumowaniu pole „Kod rabatowy” + przycisk „Zastosuj”. Po sukcesie: kod zablokowany z linkiem „Usuń”, błąd pokazany pod polem. Zmiana metody dostawy przy aktywnym kodzie odświeża wycenę. Kod wysyłany w `create-intent`.
- Podgląd sumy (koszt dostawy, „brakuje do darmowej dostawy”) liczony od kwot po rabacie.
- `OrderSummary.vue`: opcjonalny wiersz „Rabat (KOD) −X zł”.
- Strona potwierdzenia `zamowienie/[id].vue`: wiersz rabatu, jeśli `discount_amount > 0` (inaczej suma się nie zgadza z pozycjami).
- Koszyk (`koszyk.vue`) — bez pola kodu.

## Testy

`tests/pricing.test.ts`: procent, kwota (ograniczona do wartości pozycji), zawężenie do produktów, pomijanie warsztatów, wygasły/nieaktywny/wyczerpany kod, próg darmowej dostawy po rabacie, minimum 2 zł, suma rabatów pozycji = łączny rabat (np. 10% od 3 pozycji po 33,33 zł).

## Decyzje zostawione builderowi
- Dokładne komunikaty i stylowanie pola kodu (zgodnie z istniejącymi tokenami CSS).
- Kolejność/układ pól w panelu Directusa.
