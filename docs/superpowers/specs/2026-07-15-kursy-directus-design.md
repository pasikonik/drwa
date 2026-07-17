# Kursy z Directusa — design

**Data:** 2026-07-15
**Status:** zaakceptowany przez Michała (brainstorming 2026-07-14/15)

## Cel

Kursy online mają być zarządzane z Directusa — jak warsztaty. Dochodzi:

1. link **„Kursy"** w głównej nawigacji,
2. listing `/kursy` pokazujący wszystkie produkty-kursy z Directusa,
3. **szablon strony kursu** `/kursy/[slug]` — uproszczona wersja layoutu „Od wiaty do chaty":
   Hero → Staty → Główna sekcja (opis + dynamiczne kafelki) → Program kursu → Bonusy → Opinie → Co w kursie + zakup.

Każdy nowy kurs = nowy rekord w Directusie, zero nowego kodu.

Stare, ręcznie zbudowane strony (`/kursy/od-wiaty-do-chaty`, `/kursy/minikurs-podstaw`)
**zostają bez zmian** jako podgląd pierwotnego widoku, dostępne z grupy „Kursy online"
w nav. Statyczne strony Nuxt mają priorytet nad `[slug]`, więc nie ma kolizji.

## Poza zakresem

- Przepisywanie / usuwanie starych stron kursów (nastąpi po dopracowaniu szablonu).
- Zmiany w checkout, koszyku, webhookach Stripe (kursy już są wspierane).
- Cookie banner / consent, inne strony.

## Decyzje (z brainstormingu)

| Decyzja | Wybór |
|---|---|
| Schemat CMS | Rozszerzamy teraz: JSON-repeatery na `courses` + kolekcja `course_tiles`; Michał klika w Directus UI wg instrukcji (Appendix A) — token serwisowy nie ma uprawnień do schematu |
| Zakup | Prawdziwy zakup przez koszyk — `AddToCartButton` (kurs: pełna cena, max 1 szt.) |
| Routing | `/kursy/<slug>`, fallback `/kursy/<id>` gdy sluga brak — działa od razu i pozwala oglądać nowy szablon obok starej strony |
| Architektura | Jedna samowystarczalna strona `[slug].vue` (konwencja repo — brak layoutów, strony inline'ują nav/footer); bez komponentów per sekcja |

## Routing i nawigacja

- `DrwaNav.vue`: nowy element `{ id: 'kursy', label: 'Kursy', route: '/kursy' }`
  **po** „Warsztaty stacjonarne", **przed** grupą „Kursy online". Obecna grupa
  „Kursy online" zmienia `id` na `kursy-online` (unikalność id; label bez zmian).
- `app/pages/kursy/index.vue` — nowy listing.
- `app/pages/kursy/[slug].vue` — nowy szablon. Param numeryczny (`/^\d+$/`) →
  lookup po `products.id`, inaczej po `products.slug`. Produkt nieistniejący albo
  bez rozszerzenia `course` → `createError({ statusCode: 404 })`.

## Dane

### Stan obecny (produkcyjny Directus, 2026-07-15)

- Produkty-kursy: id 2 „od Wiaty do Chaty" (800 zł), id 7 „Minikurs podstaw" (100 zł)
  — oba bez sluga, obrazka i opisów.
- `courses`: tylko `course_access_url`, `sort`, `modules`.
- `course_modules`: 1 testowy moduł „Rysowanie".
- **Bug:** rola publiczna nie może czytać `course_modules.status` → obecne zapytanie
  `useCourse` zawsze pada i strona „Od wiaty do chaty" po cichu renderuje hardcodowany
  fallback modułów. Naprawa = uprawnienia w Directus UI (Appendix A, krok 3).

### Nowy schemat Directus (Appendix A — instrukcja klik-po-kliku)

Pola na **`courses`** (JSON-repeatery przechowują czyste dane, bez plików):

| Pole | Typ / interfejs | Sub-pola | Sekcja |
|---|---|---|---|
| `hero_kicker` | string / Input | — | Hero: zdanie nad tytułem |
| `hero_facts` | json / Repeater | `text` (string) | Hero: szybkie fakty (3–4) |
| `stats` | json / Repeater | `num` (string!), `label` (string) | Staty |
| `main_heading` | string / Input | — | Główna sekcja: h2 |
| `bonuses` | json / Repeater | `title` (string), `description` (text) | Bonusy |
| `quotes` | json / Repeater | `name` (string), `text` (text) | Opinie |
| `offer_items` | json / Repeater | `text` (string), `bonus` (boolean) | Co w kursie |
| `price_note` | string / Input | — | np. „jednorazowo · dostęp 3 lata" |

`stats[].num` jest **stringiem** (wartości typu „+380", „24 h").

Nowa kolekcja **`course_tiles`** (kafelki mają obrazki → repeater nie wystarczy):

| Pole | Typ |
|---|---|
| `id` | uuid (auto) |
| `course` | M2O → `courses`; alias O2M **`tiles`** na `courses` |
| `sort` | integer (sortowanie ręczne) |
| `eyebrow` | string — np. „Etap 01" |
| `title` | string |
| `description` | text |
| `image` | file (Image) |

Dane już istniejące i używane przez szablon: `products.title/price/image/description/short_description/slug`,
`courses.course_access_url`, `course_modules` (program).

### Composables i typy

- **`useCourse(slugOrId: string | number)`** — rozszerzenie istniejącego composable
  (obecnie przyjmuje tylko id; stara strona woła `useCourse(2)` i dalej działa):
  - filtr po `id` gdy wartość numeryczna, inaczej po `slug`;
  - pełna lista pól: dotychczasowe + `hero_kicker, hero_facts, stats, main_heading,
    bonuses, quotes, offer_items, price_note` + `tiles` (z polami j.w.);
  - **odporność na schema drift**: pełne query w `try`; gdy padnie (pola jeszcze nie
    istnieją / brak uprawnień), retry na minimalnym zestawie pól (obecna lista **minus
    `modules.status`**, bo to on dziś wywala zapytanie) + `console.warn` z powodem.
    Strona działa od razu po deployu, sekcje CMS dochodzą po konfiguracji Directusa.
    Koszt: podwójny round-trip tylko w stanie przejściowym.
  - moduł bez pola `status` (fallback) traktowany jak `published`
    (`(m.status ?? 'published') === 'published'`); po pełnej konfiguracji filtr działa
    normalnie. Stara strona ma własny filtr `m.status === 'published'` → w fallbacku
    dostaje 0 modułów CMS i renderuje swój statyczny program — zachowanie jak dziś,
    brak regresji.
- Listing używa istniejącego `useProducts('course')` bez zmian.
- Typy (`app/types/directus.ts`): rozszerzyć `Course` o nowe pola
  (`hero_kicker: string | null`, `hero_facts: { text: string }[] | null`, …,
  `tiles: CourseTile[]`), dodać `CourseTile`, dopisać `course_tiles` do `Schema`.
- `normalizeProduct` / `normalizeCourse`: sortować `tiles` po `sort` (jak `modules`).
- **Gotcha dziesiętna**: `price` przychodzi jako string — wszędzie `Number()` przed
  arytmetyką; wyświetlanie przez `formatPrice()`.

## Szablon `[slug].vue` — sekcje

Wszystkie klasy istnieją w `kurs.css` (`khero`, `kstats`, `builds`, `mods`, `bonuses`,
`quote`, `offer`) — reuse 1:1, bez hardcodowanych kolorów. Sekcje 2–6 **znikają, gdy
brak danych**; Hero i Oferta renderują się zawsze (title + price zawsze istnieją).

1. **Hero** (`khero khero--paper`): crumb `DRWA · Kursy online (→ /kursy) · {title}`;
   kicker = `hero_kicker`; h1 = `title`; lead = `short_description`; fakty =
   `hero_facts` (wspólna mała ikona check); CTA primary „Dołącz do kursu — {cena}"
   (scroll do `#cena`), secondary „Zobacz program" (scroll do `#program`, tylko gdy są
   moduły). Media: `DrwaImg` z `products.image` (preset `hero`, `priority` — LCP);
   brak obrazka → hero jednokolumnowe (modifier na `khero__inner`).
2. **Staty** (`kstats`): `stats[]` → `{num, label}`.
3. **Główna sekcja** (`section` + `builds`): sec-head z eyebrow „O kursie",
   h2 = `main_heading` (fallback: `title`), treść = `products.description`
   (`v-html`, rich text z własnego CMS — zaufany); kafelki = `tiles[]`
   (`build`: obrazek przez `DrwaImg` preset `card`, eyebrow, tytuł, opis).
   Brak opisu **i** kafelków → sekcja znika.
4. **Program** (`mods`): akordeon (pierwszy otwarty, jak w od-wiaty) z modułów
   `published` posortowanych po `sort`; sec-head „Program" + auto podtytuł
   „{n} modułów"; opis modułu przez `v-html`. Brak modułów → sekcja znika.
5. **Bonusy** (`bonuses`): `bonuses[]`, auto numeracja „Bonus 01…", wspólna ikona
   (prezent). Brak → znika.
6. **Opinie** (`quotes`/`quote`): `quotes[]`, inicjały auto z `name`, rola stała
   „uczestnik kursu". Brak → znika.
7. **Co w kursie + zakup** (`offer-sec`, `id="cena"`): lista `offer_items`
   (`is-bonus` dla `bonus: true`; pusta lista → sama karta ceny), cena
   `formatPrice(Number(price))` + `price_note`, **`AddToCartButton`**
   (label „Dodaj do koszyka") → toast → istniejący checkout Stripe; po zakupie
   dostęp w koncie przez `course_access_url`.

Wspólne: `DrwaNav` + **`DrwaFooter`** (kanoniczny, nie inline), `useHead`
(title `„{title} — kurs online DRWA"`, meta description z `short_description` ??
`stripHtml(description, 160)`), `useScrollReveal()` + klasy `io`.

## Listing `/kursy`

- Hero pasek jak na warsztatach (`phero` z `forest-band.png`): eyebrow
  „ONLINE · W SWOIM TEMPIE", h1 „Kursy online", krótki lead.
- Karty w gridzie `builds`/`build` (reuse): obrazek (`DrwaImg` preset `card`;
  fallback rotacyjny z istniejących `/assets/kurs-*.png`), eyebrow „Kurs online",
  tytuł, `short_description` ?? `stripHtml(description, 180)`, wiersz z ceną
  (`formatPrice`) i CTA „Zobacz kurs" → `/kursy/{slug ?? id}`. Linkują tytuł i CTA
  (nie cała karta); drobne dopiski stylów (wiersz cena+CTA) do `kurs.css`
  w tej samej konwencji BEM.
- Pusta lista → komunikat „Wkrótce nowe kursy" zamiast pustego grida.
- `DrwaNav` + `DrwaFooter`, `useHead`, `useScrollReveal()`.

## Obsługa błędów

- `[slug].vue`: brak produktu / typ ≠ `course` → 404 (`createError`).
- Query CMS: fallback pól + `console.warn` (opisany wyżej) — strona nigdy nie umiera
  od brakującego schematu.
- Directus zwraca dziesiętne jako stringi → `Number()` przy cenie.
- `fileId()` przy każdym odwołaniu do plików (UUID vs obiekt).

## Weryfikacja

Repo nie ma testów — kontrola to `pnpm build` + ręczny przebieg:

1. `pnpm build` przechodzi (TypeScript + szablony).
2. Dev server: `/kursy` listuje 2 kursy z produkcyjnego Directusa.
3. `/kursy/2` renderuje szablon w trybie fallback (przed konfiguracją CMS): hero
   z tytułem i ceną, sekcja zakupu; sekcje bez danych ukryte; `console.warn` obecny.
4. „Dodaj do koszyka" → toast → `/koszyk` pokazuje kurs za 800 zł, qty zablokowane na 1.
5. `/kursy/od-wiaty-do-chaty` (stara strona) działa bez zmian.
6. `/kursy/999` i `/kursy/3` (bluza — merch) → 404.
7. Po konfiguracji Directusa przez Michała (Appendix A): sekcje wypełnione danymi CMS
   pojawiają się na `/kursy/2`, warn znika.

## Appendix A — konfiguracja Directusa (wykonuje Michał w UI)

Kolejność dowolna, ale przed krokiem 3 zrób krok 4a (moduł testowy).

**1. Pola na `courses`** (Settings → Data Model → courses → Create Field):

- `hero_kicker` — Input (String)
- `hero_facts` — Repeater; sub-pole: `text` (Input)
- `stats` — Repeater; sub-pola: `num` (Input — string, bo wartości „+380"), `label` (Input)
- `main_heading` — Input (String)
- `bonuses` — Repeater; sub-pola: `title` (Input), `description` (Textarea)
- `quotes` — Repeater; sub-pola: `name` (Input), `text` (Textarea)
- `offer_items` — Repeater; sub-pola: `text` (Input), `bonus` (Boolean/Toggle)
- `price_note` — Input (String)

**2. Kolekcja `course_tiles`** (Settings → Data Model → Create Collection, id: UUID):

- pola: `sort` (Integer, jako pole sortowania kolekcji), `eyebrow` (Input),
  `title` (Input), `description` (Textarea), `image` (Image),
  `course` (M2O → `courses`; przy tworzeniu relacji dodaj **odwrotny alias O2M
  na `courses` o nazwie `tiles`**).

**3. Uprawnienia roli publicznej** (Settings → Access Control → Public):

- `courses` — Read: All Access, pola: wszystkie (w tym nowe).
- `course_tiles` — Read: All Access, pola: wszystkie.
- `course_modules` — Read, pola: **wszystkie łącznie ze `status`** (to naprawia
  obecny bug od-wiaty); opcjonalnie dodatkowo custom filter `status = published`.
- `directus_files` — Read (już działa dla obrazków produktów; nic nie zmieniaj).

**4. Higiena danych:**

- a) Moduł testowy „Rysowanie" → usuń albo ustaw `draft`. **Ważne:** po naprawie
  uprawnień ze `status` stara strona od-wiaty zacznie czytać moduły z CMS — jeśli
  „Rysowanie" będzie `published` i podpięty pod kurs id 2, strona pokaże 1 moduł
  zamiast 12 statycznych.
- b) Produktom-kursom warto nadać: `image`, `short_description`, docelowo `slug`.
  Uwaga: jeśli nadasz slug `od-wiaty-do-chaty`, statyczna strona przykryje nowy
  szablon pod tym adresem — dopóki ona istnieje, nowy szablon tego kursu oglądasz
  przez `/kursy/2` (albo pod innym slugiem).
  **Slug kursu nie może być czysto numeryczny** (np. `2024`) — routing traktuje
  liczby jako id produktu (`/kursy/<id>`), więc numeryczny slug prowadziłby do
  złego produktu albo 404.

## Follow-upy po wykonaniu Appendixu A (z finalnego code review)

- Usunąć gałąź `catch` (fallback pól) z `app/composables/useCourse.ts` — po
  konfiguracji schematu staje się martwym kodem; jej usunięcie likwiduje też
  duplikację listy pól i maskowanie przejściowych błędów Directusa jako 404.
- Przetestować ścieżkę slugową (`/kursy/<slug>`) po nadaniu slugów — dziś kursy
  nie mają slugów, więc automatyczne asercje pokrywają tylko ścieżkę po id.
- c) Realne treści sekcji (staty, kafelki, bonusy, opinie, oferta) — można
  przepisać ze starej strony od-wiaty.

## Dodatek 2026-07-17 — kafelki materiałów do pobrania (`course_materials`)

**Status:** zaakceptowany przez Michała (brainstorming 2026-07-17). Część tego
samego, jeszcze nie wykonanego pakietu zmian schematu (Appendix A) — dochodzi
jako kolejna kolekcja obok `course_tiles`.

**Cel:** sekcja „Program" w `od-wiaty-do-chaty.vue` ma pod akordeonem modułów
dwa statyczne kafelki opisujące materiały do kursu („Plik SketchUp — model 3D",
„Rysunki techniczne — pliki PDF"). To czysto opisowe kafelki (ikona + tytuł +
opis) — **bez** rzeczywistego linku do pobrania (materiały i tak trafiają do
kursanta przez zewnętrzną platformę pod `course_access_url`). W `[slug].vue`
tej sekcji dziś w ogóle nie ma. Dodajemy ją jako kolejny CMS-owy blok kafelków,
edytowalny z Directusa, po wzorze `course_tiles`.

**Zakres:** tylko generyczny szablon `[slug].vue`. Stara strona
`od-wiaty-do-chaty.vue` zostaje z hardcodowanymi dwoma kafelkami bez zmian
(zgodnie z resztą tego speca — stare strony to zamrożony podgląd).

### Nowa kolekcja `course_materials`

| Pole | Typ |
|---|---|
| `id` | uuid (auto) |
| `course` | M2O → `courses`; odwrotny alias O2M **`materials`** na `courses` |
| `sort` | integer (sortowanie ręczne) |
| `icon` | select (dropdown), wartości: `model-3d`, `document`, `video`, `general` |
| `title` | string — np. „Plik SketchUp" |
| `description` | text — np. „Model 3D · trzy wersje projektu" |

Brak pola `image` — to odróżnia ją od `course_tiles` (te mają zdjęcie, te mają
ikonę z ustalonej listy).

### Typy (`app/types/directus.ts`)

- `export type CourseMaterialIcon = 'model-3d' | 'document' | 'video' | 'general'`
- `CourseMaterial { id, sort: number | null, icon: CourseMaterialIcon | null, title: string, description: string | null }`
- `Course.materials?: CourseMaterial[]`
- `Schema.course_materials: CourseMaterial[]`

### `useCourse.ts`

`materials` dochodzi **wyłącznie do pełnego zapytania** (ten sam `try`, obok
`tiles`) — analogicznie do `tiles`, bo to też pole czekające na Appendix A.
Zapytanie fallbackowe (`catch`) zostaje bez zmian. Sortowanie po `sort` tak
jak `tiles`/`modules`.

### Szablon `[slug].vue`

Blok dochodzi do sekcji **Program** (`#program`), pod akordeonem modułów,
widoczny tylko gdy `materials.length`. Reużywa istniejących klas `extras`/
`extra` z `kurs.css` (dziś używanych tylko w `od-wiaty-do-chaty.vue`):

```html
<div v-if="materials.length" class="extras io">
  <div v-for="m in materials" :key="m.id" class="extra">
    <!-- inline SVG dobrany po m.icon: model-3d→box, document→sheet, video→film, general→plik -->
    <div>
      <div class="extra__name">{{ m.title }}</div>
      <div class="extra__desc">{{ m.description }}</div>
    </div>
  </div>
</div>
```

Ikona: 4 gotowe inline SVG wybierane przez `v-if`/`v-else-if` na `m.icon`
(`model-3d`/`document` to te same SVG co dziś w `od-wiaty-do-chaty.vue`; `video`
i `general` to dwie nowe, w tym samym stylu — stroke 1.75, 22×22). Brak
dopasowania ikony (np. `icon` puste) → fallback na `general`.

### Appendix A — dopisek do kroku 2 (Michał, Directus UI)

Obok tworzenia `course_tiles`, tym samym trybem:

**Kolekcja `course_materials`** (Settings → Data Model → Create Collection, id: UUID):

- pola: `sort` (Integer, pole sortowania kolekcji), `icon` (Select Dropdown,
  opcje: `model-3d`, `document`, `video`, `general`), `title` (Input),
  `description` (Textarea), `course` (M2O → `courses`; przy tworzeniu relacji
  dodaj odwrotny alias O2M na `courses` o nazwie `materials`).

Uprawnienia roli publicznej (krok 3): dopisać `course_materials` — Read: All
Access, pola: wszystkie.

### Poza zakresem tego dodatku

- Rzeczywisty upload/link do pliku (Directus file field) — świadomie
  odrzucone; kafelki zostają czysto opisowe, tak jak dziś.
- Zmiany w `od-wiaty-do-chaty.vue`.

### Weryfikacja

`pnpm build` przechodzi; przed konfiguracją Directusa (`materials` nie
istnieje jeszcze w schemacie) `/kursy/2` wpada w istniejący fallback `useCourse`
(sekcja materiałów po prostu nie renderuje się — `materials` puste), bez nowych
błędów w konsoli poza istniejącym warnem. Po wykonaniu Appendixu A i dodaniu
przykładowych rekordów `course_materials` — kafelki pojawiają się w sekcji
Program na `/kursy/2`.
