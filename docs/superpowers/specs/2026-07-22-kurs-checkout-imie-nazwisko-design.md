# Imię i nazwisko przy zakupie kursu (dostęp do Zanfii)

Data: 2026-07-22

## Cel

Kursy online są hostowane na zewnętrznej platformie Zanfia. Nadanie tam dostępu wymaga imienia i nazwiska kupującego, których dziś checkout w ogóle nie zbiera dla zamówień zawierających kurs — [app/pages/zamowienie/index.vue](../../../app/pages/zamowienie/index.vue) pyta wyłącznie o e-mail, chyba że koszyk zawiera fizyczny produkt (wtedy pojawia się jedno łączne pole „Imię i nazwisko” w `AddressForm.vue`, służące adresowi wysyłki, nie tożsamości uczestnika kursu).

Ten projekt dodaje osobne, wymagane pola „Imię” i „Nazwisko", widoczne wyłącznie gdy koszyk zawiera kurs, i zapisuje je na zamówieniu.

## Zakres

- Nowe pola `first_name` / `last_name` na kolekcji `orders` w Directusie — **już dodane ręcznie przez użytkownika** (string, nullable, bez wymagalności na poziomie Directusa; zweryfikowane odczytem `GET /items/orders?fields=id,first_name,last_name` → `200`, wartości `null` na istniejących wierszach).
- `hasCourse` — nowa flaga liczona tak samo jak istniejące `hasPhysical`, zarówno w koszyku (`useCart`) jak i autorytatywnie po stronie serwera (`computeOrder`).
- Nowa sekcja formularza w checkout (dwa pola: Imię, Nazwisko), renderowana gdy `hasCourse === true`.
- Walidacja wymagalności po stronie klienta (UX) i serwera (autorytatywna, spójna z resztą `create-intent.post.ts`, które nigdy nie ufa samemu klientowi).
- Zapis `first_name` / `last_name` na tworzonym wierszu `orders`.

## Poza zakresem (świadomie pominięte)

- Jakiekolwiek wywołanie API Zanfii / automatyczne nadawanie dostępu do kursu — dziś robione ręcznie poza tym systemem; ten projekt tylko zbiera i zapisuje dane.
- Zmiana istniejącego pola „Imię i nazwisko” w `AddressForm.vue` (adres wysyłki) — zostaje bez zmian, także gdy koszyk zawiera jednocześnie kurs i merch (patrz niżej).
- Osobne imię/nazwisko per pozycja zamówienia (np. dwa różne kursy dla dwóch różnych osób w jednym zamówieniu) — poza zakresem; imię/nazwisko dotyczy całego zamówienia, jednej osoby.
- Wyświetlanie imienia/nazwiska na stronie potwierdzenia zamówienia (`zamowienie/[id].vue`) — nice-to-have, nie wymagane teraz.
- Migracja/backfill istniejących zamówień kursowych — pola zostają `null` dla zamówień sprzed tej zmiany.

**Świadomy kompromis:** jeśli koszyk zawiera jednocześnie kurs i produkt fizyczny, użytkownik zobaczy zarówno nowe pola „Imię”/„Nazwisko" (dostęp do kursu) jak i istniejące łączne pole „Imię i nazwisko” w adresie dostawy (etykieta na paczkę). Te dwie tożsamości mogą się legalnie różnić (kurs dla siebie, paczka wysyłana gdzie indziej), więc nie są synchronizowane ani scalane.

## Komponenty

| Plik | Zmiana |
|---|---|
| `app/types/directus.ts` | `Order`: dodać `first_name: string \| null`, `last_name: string \| null` |
| `app/types/shop.ts` | `CreateIntentPayload`: dodać `firstName: string \| null`, `lastName: string \| null`. `ComputedOrder`: dodać `hasCourse: boolean` |
| `app/composables/useCart.ts` | dodać `hasCourse = computed(() => items.value.some(i => i.type === 'course'))`, zwrócić z composable |
| `app/pages/zamowienie/index.vue` | refy `firstName`/`lastName`; nowa sekcja formularza pod polem e-mail, widoczna gdy `hasCourse`; `validate()` wymaga obu pól gdy `hasCourse`; `startPayment()` wysyła `firstName`/`lastName` (przycięte, albo `null`) |
| `server/utils/pricing.ts` | `computeOrder` zwraca `hasCourse: lines.some(l => l.type === 'course')` |
| `server/api/checkout/create-intent.post.ts` | destrukturyzacja `firstName`/`lastName` z body; jeśli `computed.hasCourse` i brak/puste → `400`; zapis `first_name`/`last_name` (przycięte) na tworzonym `orders` |

## Przepływ danych

1. Użytkownik dodaje kurs do koszyka → `useCart` oznacza `hasCourse = true`.
2. Na `/zamowienie` pod polem e-mail pojawia się sekcja z dwoma polami: „Imię”, „Nazwisko” (hint: „Potrzebne do nadania dostępu do kursu online.”).
3. `validate()` — jeśli `hasCourse`, oba pola muszą być niepuste po `trim()`; błędy renderowane tym samym wzorcem co istniejące pola adresu.
4. `startPayment()` wysyła payload z `firstName`/`lastName` (lub `null`, gdy `!hasCourse`) do `POST /api/checkout/create-intent`.
5. Serwer: `computeOrder` re-liczy zamówienie i zwraca autorytatywne `hasCourse` na podstawie realnych typów produktów z Directusa (nie ufa `type` przysłanemu z klienta — koszyk może być spreparowany). Jeśli `hasCourse` i brak imienia/nazwiska → `400` z komunikatem PL, zanim cokolwiek zostanie zapisane lub obciążone w Stripe.
6. Wiersz `orders` zapisywany z `first_name`/`last_name` (przycięte stringi albo `null`).

## Obsługa błędów

| Sytuacja | Zachowanie |
|---|---|
| Koszyk zawiera kurs, pola puste, próba wysyłki z klienta | Blokada w `validate()` przed wywołaniem API — błąd przy polu, jak dziś przy adresie |
| Koszyk zawiera kurs, klient ominie walidację (spreparowane żądanie) | Serwer liczy `hasCourse` z realnych danych Directusa i odrzuca `400`, zanim powstanie zamówienie/PaymentIntent |
| Koszyk bez kursu | Pola niewidoczne, nie wysyłane, `null` w bazie — bez zmian względem dziś |

## Testowanie

Brak testów jednostkowych w projekcie (zgodnie z `CLAUDE.md`). Weryfikacja:
1. `pnpm build` — sprawdza typy i kompilację.
2. Ręczny test w `pnpm dev`: koszyk tylko z kursem → pola widoczne i wymagane; puste pola blokują przejście do płatności.
3. Ręczny test: koszyk z kursem + merch → widoczne oba zestawy pól (Imię/Nazwisko dostępu do kursu + Imię i nazwisko adresu dostawy).
4. Ręczny test: koszyk bez kursu (sam merch/warsztat) → pola niewidoczne, zamówienie zapisuje się jak dziś.
5. Sprawdzenie w Directusie po testowym zamówieniu kursowym, że `first_name`/`last_name` zapisały się poprawnie na wierszu `orders`.
