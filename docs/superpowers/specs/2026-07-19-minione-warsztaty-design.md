# Minione warsztaty — projekt

Data: 2026-07-19

## Cel

Dostosować obsługę warsztatów w zależności od daty:

1. Warsztaty, które już się rozpoczęły, trafiają do sekcji „Minione warsztaty" (znikają z listy nadchodzących).
2. Nie można kupić miejsca (wpłacić zaliczki) na miniony warsztat.
3. Nie można dodać minionego warsztatu do koszyka.

## Decyzje

- **Kryterium daty:** `date_start`. Warsztat jest „miniony", gdy `date_start < teraz`. Warsztat bez `date_start` traktujemy jako nadchodzący.
- **Sekcja archiwum:** zastępujemy zahardkodowaną tablicę `PAST` danymi z Directusa (jedno źródło prawdy).
- **Linki archiwum:** wiersze minionych warsztatów linkują do strony szczegółów `/warsztaty/<slug>` (bez możliwości zapisu).

## Architektura

Warsztaty trafiają do koszyka **wyłącznie** przez `AddToCartButton` na `app/pages/warsztaty/[slug].vue`
(`sklep/index.vue` używa `addProduct` tylko dla merchu). To jedyny klient-owy punkt wejścia,
a `server/utils/pricing.ts` jest autorytatywnym guardem.

### 1. Wspólny helper — `app/utils/product.ts`

Jedno źródło prawdy dla „minioności", współdzielone przez strony i serwer (plik jest już wspólny client+server):

```ts
export const isWorkshopPast = (w: { date_start: string | null } | null): boolean =>
  !!w?.date_start && new Date(w.date_start).getTime() < Date.now()
```

### 2. Lista — `app/pages/warsztaty/index.vue`

- `workshops` computed rozdzielone na `upcomingWorkshops` i `pastWorkshops` (wg `isWorkshopPast(p.raw.workshop)`).
- „Nadchodzące terminy" oraz `<select>` w formularzu zapisów renderują tylko `upcomingWorkshops`
  (`form.workshopId` domyślnie z `upcomingWorkshops`).
- Sekcja „Minione warsztaty" renderuje `pastWorkshops` z Directusa; usuwamy statyczną tablicę `PAST`.
  - Wiersz: data (`formatDateRange` → `${day} ${month} ${year}`), tytuł jako `NuxtLink` do `/warsztaty/<slug>`
    (brak slug → sam tekst), etykieta „Zakończony".
  - Sekcję ukrywamy, gdy `pastWorkshops` jest puste.

### 3. Szczegóły — `app/pages/warsztaty/[slug].vue`

Dodajemy `isPast = computed(() => isWorkshopPast(workshop.value))`.

- Panel rezerwacji: zamiast `AddToCartButton` statyczny stan „Ten warsztat już się odbył"; nota o zaliczce
  (`book__deposit`) ukryta, gdy `isPast`.
- Hero: CTA „Zapisz się — {cena}" ukryte, gdy `isPast` (zostaje „Zobacz program").
- Sekcja `#zapisy`: zamiast formularza nota „Ten warsztat już się odbył" (sekcja zostaje, by nie łamać
  linków ze stopki).

### 4. Guard serwerowy — `server/utils/pricing.ts`

- Do pól warsztatu w `readItems('products', …)` dodajemy `date_start`.
- W gałęzi `product.type === 'workshop'`: jeśli `isWorkshopPast(w)` → `fail(\`Nie można zapisać się na
  miniony warsztat „${product.title}".\`)`.
- Chroni przed nieaktualnym koszykiem z `localStorage` (produkt dodany, gdy był aktualny) oraz
  spreparowanym żądaniem.

## Poza zakresem (follow-up)

- Proaktywne usuwanie/oznaczanie minionego warsztatu na stronie koszyka. Obecnie zniknie dopiero
  z czytelnym błędem serwera przy checkoucie.

## Weryfikacja

- `pnpm build` (TypeScript + kompilacja szablonów) — brak dedykowanych testów/lintu w repo.
- Ręczny sanity check listy (podział upcoming/past) i strony szczegółów minionego warsztatu.
