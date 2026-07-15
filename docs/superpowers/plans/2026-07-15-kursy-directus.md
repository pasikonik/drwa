# Kursy z Directusa — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Listing `/kursy` + generyczny szablon strony kursu `/kursy/[slug]` zasilany z Directusa, z prawdziwym zakupem przez koszyk, plus link „Kursy" w nawigacji.

**Architecture:** Nuxt 4 + Vue 3 Composition API. Strony samowystarczalne (bez layoutów — konwencja repo), dane z Directusa przez rozszerzony composable `useCourse` (slug lub id, z fallbackiem pól na obecny schemat). Style — reuse istniejących klas `kurs.css`/`site.css`/`warsztat.css` + kilka dopisków w `kurs.css`.

**Tech Stack:** Nuxt 4, @directus/sdk 22, TypeScript. Brak frameworka testowego — **weryfikacja to `pnpm build` + asercje `curl` na dev serwerze** (zgodnie z CLAUDE.md).

**Spec:** `docs/superpowers/specs/2026-07-15-kursy-directus-design.md` (Appendix A = konfiguracja Directusa po stronie użytkownika — NIE jest częścią tego planu; kod działa bez niej dzięki fallbackowi).

## Global Constraints

- Ceny: Directus wysyła decimal jako **string** — zawsze `Number()` przed arytmetyką; wyświetlanie tylko przez `formatPrice()` z `~/utils/format`.
- Obrazy Directusa wyłącznie przez `<DrwaImg>` (propsy: `src`, `alt`, `preset`, `priority`, `fallback`).
- Kolory/spacing tylko przez tokeny CSS (`var(--…)`); zero hardcodowanych kolorów; strony **bez** `<style scoped>` — dopiski idą do `app/assets/css/kurs.css`.
- Elementy animowane na scroll dostają klasę `io`; strona woła `useScrollReveal()` raz.
- Copy po polsku, w tonie istniejących stron.
- Zero nowych zależności npm.
- Commit po każdym tasku; komunikaty kończą się linią `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- `useHead` na każdej nowej stronie z faviconem `/assets/drwa-mark-ink.png` (wzorzec repo).

---

### Task 1: Warstwa danych — typy, normalizacja, `useCourse`

**Files:**
- Modify: `app/types/directus.ts` (sekcja Course, ok. linii 80–99 + `Schema` na końcu)
- Modify: `app/utils/product.ts:49-53` (`normalizeCourse`)
- Modify: `app/composables/useCourse.ts` (całość)

**Interfaces:**
- Consumes: istniejące `normalizeProduct`, `useDirectus()`, typy `Product`/`Course`/`DirectusFile`.
- Produces (dla Tasków 3–4):
  - typy: `CourseHeroFact { text }`, `CourseStat { num, label }` (oba string!), `CourseBonus { title, description }`, `CourseQuote { name, text }`, `CourseOfferItem { text, bonus }`, `CourseTile { id, sort, eyebrow, title, description, image }`;
  - `Course` zyskuje opcjonalne pola `hero_kicker?`, `hero_facts?`, `stats?`, `main_heading?`, `bonuses?`, `quotes?`, `offer_items?`, `price_note?`, `tiles?`;
  - `useCourse(slugOrId: string | number): ReturnType<typeof useAsyncData<Product | null>>` — po awaicie `data.value` to znormalizowany `Product | null` z posortowanymi `course.modules` i `course.tiles`.
- Kompatybilność wsteczna: `app/pages/kursy/od-wiaty-do-chaty.vue:353` woła `useCourse(2)` — liczba nadal działa, klucz cache `course-2` bez zmian.

- [ ] **Step 1: Dopisz typy w `app/types/directus.ts`**

Bezpośrednio NAD `export interface Course` (po bloku `CourseModule`) wstaw:

```ts
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
```

W `export interface Course` dopisz po `modules: CourseModule[]`:

```ts
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
```

W `export interface Schema` dopisz po `course_modules: CourseModule[]`:

```ts
  course_tiles: CourseTile[]
```

- [ ] **Step 2: Sortowanie kafelków w `app/utils/product.ts`**

Zamień istniejącą funkcję `normalizeCourse` (linie 49–53):

```ts
/** Ensure a course's modules are always a sorted array (when a course exists). */
const normalizeCourse = (c: Course | null): Course | null => {
  if (!c) return null
  return { ...c, modules: [...(c.modules ?? [])].sort(bySort) }
}
```

na:

```ts
/** Ensure a course's modules/tiles are always sorted arrays (when a course exists). */
const normalizeCourse = (c: Course | null): Course | null => {
  if (!c) return null
  return {
    ...c,
    modules: [...(c.modules ?? [])].sort(bySort),
    tiles: [...(c.tiles ?? [])].sort(bySort),
  }
}
```

- [ ] **Step 3: Przepisz `app/composables/useCourse.ts`**

Całą zawartość pliku zamień na:

```ts
import { readItems } from '@directus/sdk'
import type { Product } from '~/types/directus'
import { normalizeProduct } from '~/utils/product'

/**
 * Fetch a single course product together with its course extension, modules,
 * tiles and CMS template blocks. Accepts a product slug or — as a fallback for
 * courses that have no slug yet — a numeric product id (`/kursy/2`).
 *
 * The full field list requires the extended Directus schema (see
 * docs/superpowers/specs/2026-07-15-kursy-directus-design.md, Appendix A).
 * Until it is configured (fields + public read permissions, incl.
 * course_modules.status), the full query fails — we then retry with a core
 * field set that works on the current schema and warn loudly.
 *
 * @example const { data: course } = await useCourse(2)         // by id
 * @example const { data: course } = await useCourse('stodola') // by slug
 */
export const useCourse = (slugOrId: string | number) => {
  const { directus } = useDirectus()

  const isId = typeof slugOrId === 'number' || /^\d+$/.test(slugOrId)
  const filter = isId
    ? { id: { _eq: Number(slugOrId) } }
    : { slug: { _eq: String(slugOrId) } }

  return useAsyncData<Product | null>(
    `course-${slugOrId}`,
    async () => {
      let rows: unknown[]
      try {
        rows = (await directus.request(
          readItems('products', {
            filter,
            limit: 1,
            fields: [
              'id', 'title', 'slug', 'price', 'description', 'image', 'short_description',
              {
                course: [
                  'id', 'product_id', 'course_access_url', 'sort',
                  'hero_kicker', 'hero_facts', 'stats', 'main_heading',
                  'bonuses', 'quotes', 'offer_items', 'price_note',
                  { modules: ['id', 'status', 'title', 'description', 'sort', 'course'] },
                  { tiles: ['id', 'sort', 'eyebrow', 'title', 'description', 'image'] },
                ],
              },
            ],
          })
        )) as unknown[]
      } catch (err) {
        console.warn(
          '[useCourse] Pełne zapytanie padło — w Directusie brakuje pól szablonu kursu '
            + 'albo uprawnień publicznych (spec 2026-07-15, Appendix A). Retry na polach podstawowych.',
          err,
        )
        rows = (await directus.request(
          readItems('products', {
            filter,
            limit: 1,
            fields: [
              'id', 'title', 'slug', 'price', 'description', 'image', 'short_description',
              {
                // Bez modules.status — rola publiczna nie może go dziś czytać.
                course: [
                  'id', 'product_id', 'course_access_url', 'sort',
                  { modules: ['id', 'title', 'description', 'sort', 'course'] },
                ],
              },
            ],
          })
        )) as unknown[]
      }
      return rows[0] ? normalizeProduct(rows[0]) : null
    },
    { default: () => null }
  )
}
```

Uwaga: gdyby TypeScript odrzucił unię obiektów w `filter` przy generykach SDK,
zrzutuj w obu wywołaniach `filter: filter as never` — **nie zmieniaj list pól**
(repo i tak omija generyki SDK — patrz CLAUDE.md „Query pattern").

- [ ] **Step 4: Build**

Run: `pnpm build`
Expected: kończy się sukcesem (exit 0), zero błędów TS.

- [ ] **Step 5: Commit**

```bash
git add app/types/directus.ts app/utils/product.ts app/composables/useCourse.ts
git commit -m "feat(kursy): typy szablonu kursu + useCourse po slugu/id z fallbackiem pól

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Link „Kursy" w nawigacji

**Files:**
- Modify: `app/components/DrwaNav.vue:149-166` (stała `NAV`)

**Interfaces:**
- Produces: pozycja nav `/kursy` (płaski link) między „Warsztaty stacjonarne" a grupą „Kursy online". Desktop i drawer mobilny renderują się z tej samej tablicy — zero zmian w template.
- Grupa „Kursy online" zmienia tylko `id` na `kursy-online` (unikalność id; `id` steruje wyłącznie stanem otwarcia dropdownu).

- [ ] **Step 1: Edytuj tablicę `NAV`**

Zamień pierwsze dwa elementy tablicy `NAV`:

```ts
const NAV: NavItem[] = [
  { id: 'warsztaty', label: 'Warsztaty stacjonarne', route: '/warsztaty' },
  {
    id: 'kursy', label: 'Kursy online', children: [
```

na:

```ts
const NAV: NavItem[] = [
  { id: 'warsztaty', label: 'Warsztaty stacjonarne', route: '/warsztaty' },
  { id: 'kursy', label: 'Kursy', route: '/kursy' },
  {
    id: 'kursy-online', label: 'Kursy online', children: [
```

(children grupy zostają bez zmian). Znany kosmetyczny efekt przejściowy: na
`/kursy/od-wiaty-do-chaty` aktywny będzie i link „Kursy" (prefix match
NuxtLink), i grupa „Kursy online" — znika wraz z wycofaniem starych stron.

- [ ] **Step 2: Build**

Run: `pnpm build`
Expected: sukces. (Strona `/kursy` jeszcze nie istnieje — NuxtLink na
nieistniejącą ścieżkę nie psuje builda; powstanie w Tasku 3.)

- [ ] **Step 3: Commit**

```bash
git add app/components/DrwaNav.vue
git commit -m "feat(kursy): link Kursy w nawigacji

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Listing `/kursy`

**Files:**
- Create: `app/pages/kursy/index.vue`
- Modify: `app/assets/css/kurs.css` (dopisek na końcu pliku)

**Interfaces:**
- Consumes: `useProducts('course')` → `{ data }`, gdzie `data.value.products: Product[]`; `formatPrice`, `stripHtml` z `~/utils/format`; `<DrwaImg>`, `<DrwaNav>`, `<DrwaFooter>`; klasy `phero*` (warsztat.css), `builds`/`build*` (kurs.css), `sec-head`/`eyebrow`/`section`/`container`/`btn*`/`io` (site.css).
- Produces: trasa `/kursy`; link do kursu = `/kursy/{slug ?? id}` (kontrakt z Taskiem 4).

- [ ] **Step 1: Dopisz style listingu na końcu `app/assets/css/kurs.css`**

```css
/* ============ Listing /kursy ============ */
.build--course .build__body { display: flex; flex-direction: column; flex: 1; }
.build__title a { color: inherit; text-decoration: none; transition: color var(--dur-fast) var(--ease-standard); }
.build__title a:hover { color: var(--text-accent); }
.build__pricerow {
  display: flex; align-items: center; justify-content: space-between; gap: var(--space-3);
  margin-top: auto; padding-top: var(--space-5);
}
.build__price { font-family: var(--font-mono); font-weight: 500; font-size: var(--text-lg); letter-spacing: -0.01em; color: var(--text-strong); }
.klist-empty { font-size: var(--text-md); color: var(--text-muted); }
```

(`margin-top: auto` działa, bo `.build--course .build__body` jest flex-kolumną —
wiersz z ceną siada na dole karty niezależnie od długości opisu. Stare karty
`.build` na od-wiaty nie dostają modyfikatora, więc nic im się nie zmienia.)

- [ ] **Step 2: Utwórz `app/pages/kursy/index.vue`**

```vue
<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <section class="phero" id="top">
      <div class="phero__bg">
        <img src="/assets/forest-band.png" alt="Las we mgle" />
      </div>
      <div class="phero__scrim" />
      <div class="container phero__inner">
        <span class="eyebrow eyebrow--ondark">ONLINE · W SWOIM TEMPIE</span>
        <h1>Kursy online</h1>
        <p class="phero__lead">Ciesielstwo krok po kroku — ucz się z instrukcji wideo, kiedy chcesz i gdzie chcesz. Dostęp od razu po zakupie.</p>
      </div>
    </section>

    <main id="main-content">
      <section class="section container" id="lista">
        <div class="sec-head io">
          <span class="eyebrow">Do wyboru</span>
          <h2>Wybierz swój kurs</h2>
          <p>Każdy kurs to komplet instrukcji wideo i materiałów — od podstaw pracy z drewnem po całe konstrukcje.</p>
        </div>

        <div v-if="courses.length" class="builds io">
          <article v-for="c in courses" :key="c.id" class="build build--course">
            <div class="build__img">
              <DrwaImg :src="c.image" :alt="c.title" preset="card" :fallback="c.fallback" />
            </div>
            <div class="build__body">
              <span class="build__eyebrow">Kurs online</span>
              <h3 class="build__title"><NuxtLink :to="c.route">{{ c.title }}</NuxtLink></h3>
              <p class="build__desc">{{ c.desc }}</p>
              <div class="build__pricerow">
                <span class="build__price">{{ c.price }}</span>
                <NuxtLink :to="c.route" class="btn btn--secondary btn--md">Zobacz kurs</NuxtLink>
              </div>
            </div>
          </article>
        </div>
        <p v-else class="klist-empty io">Wkrótce nowe kursy — zajrzyj niebawem.</p>
      </section>
    </main>

    <DrwaFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatPrice, stripHtml } from '~/utils/format'

useHead({
  title: 'Kursy online — DRWA',
  meta: [{ name: 'description', content: 'Kursy online DRWA — ciesielstwo i praca z drewnem krok po kroku, w swoim tempie.' }],
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const { data } = await useProducts('course')

const FALLBACK_IMGS = ['/assets/kurs-wiata.png', '/assets/kurs-altana.png', '/assets/kurs-domek.png']

const courses = computed(() =>
  (data.value?.products ?? []).map((p, i) => ({
    id: p.id,
    title: p.title,
    route: `/kursy/${p.slug ?? p.id}`,
    desc: p.short_description ?? stripHtml(p.description, 180),
    // Directus wysyła decimal jako string — Number() przed formatowaniem.
    price: formatPrice(Number(p.price)),
    image: p.image,
    fallback: FALLBACK_IMGS[i % FALLBACK_IMGS.length]!,
  }))
)

useScrollReveal()
</script>
```

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: sukces.

- [ ] **Step 4: Weryfikacja na dev serwerze**

```bash
pnpm dev &   # albo w drugim terminalu; odczekaj aż wstanie
sleep 8
curl -s http://localhost:3000/kursy | grep -c 'build--course'
curl -s http://localhost:3000/kursy | grep -o 'od Wiaty do Chaty\|Minikurs podstaw' | sort -u
```

Expected: `2` (dwie karty) oraz obie nazwy kursów. Karty linkują do
`/kursy/2` i `/kursy/7` (produkty nie mają slugów) — sprawdź:
`curl -s http://localhost:3000/kursy | grep -o '/kursy/[0-9]*' | sort -u` →
`/kursy/2` i `/kursy/7`.

- [ ] **Step 5: Commit**

```bash
git add app/pages/kursy/index.vue app/assets/css/kurs.css
git commit -m "feat(kursy): listing /kursy z produktów Directusa

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Szablon strony kursu `/kursy/[slug]`

**Files:**
- Create: `app/pages/kursy/[slug].vue`
- Modify: `app/assets/css/kurs.css` (dopisek na końcu pliku)

**Interfaces:**
- Consumes: `useCourse(slugOrId)` z Taska 1 (typy `CourseStat` itd. przez `Product['course']`); `<AddToCartButton :product="Product" label="string">` (dodaje kurs do koszyka w pełnej cenie, max 1 szt. — logika już istnieje w `useCart`); `<DrwaImg>`; `formatPrice`, `stripHtml`; klasy `khero*`, `kstats*`, `builds*`, `mods*`, `bonuses*`, `offer*` (kurs.css), `quotes`/`quote*` (site.css + `quote__mark` w kurs.css).
- Produces: trasa `/kursy/:slug` obsługująca slug **i** numeryczne id (`/kursy/2`). Statyczne strony (`od-wiaty-do-chaty.vue`, `minikurs-podstaw.vue`) mają w Nuxt priorytet nad `[slug]` — bez kolizji.
- Sekcje warunkowe: Staty/O kursie/Program/Bonusy/Opinie renderują się tylko przy danych; Hero i Oferta zawsze.

- [ ] **Step 1: Dopisz style szablonu na końcu `app/assets/css/kurs.css`**

```css
/* ============ Szablon CMS kursu (/kursy/[slug]) ============ */
/* Hero bez obrazka — jedna kolumna zamiast grida 2-kolumnowego. */
.khero--paper .khero__inner--single { grid-template-columns: 1fr; }
/* Pas liczb o zmiennej liczbie statów (od-wiaty ma sztywne 5 kolumn). */
.kstats__row--auto { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
/* Opis kursu (rich text z products.description) nad kafelkami. */
.kdesc { max-width: 68ch; font-size: var(--text-md); line-height: 1.7; color: var(--text-body); }
.kdesc p { margin: 0 0 var(--space-4); }
.kdesc > :last-child { margin-bottom: 0; }
```

(Odstęp kafelków od opisu daje istniejący `.builds { margin-top: var(--space-7) }`.)

- [ ] **Step 2: Utwórz `app/pages/kursy/[slug].vue`**

```vue
<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <section class="khero khero--paper" id="top">
      <div class="container khero__inner" :class="{ 'khero__inner--single': !product.image }">
        <div>
          <div class="khero__crumb">
            <NuxtLink to="/">DRWA</NuxtLink>
            <span class="sep">·</span>
            <NuxtLink to="/kursy">Kursy online</NuxtLink>
            <span class="sep">·</span>
            <span class="cur">{{ product.title }}</span>
          </div>
          <p v-if="course?.hero_kicker" class="khero__kicker">{{ course.hero_kicker }}</p>
          <h1>{{ product.title }}</h1>
          <p v-if="product.short_description" class="khero__lead">{{ product.short_description }}</p>
          <div v-if="heroFacts.length" class="khero__meta">
            <span v-for="f in heroFacts" :key="f.text" class="khero__fact">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>
              </svg>
              {{ f.text }}
            </span>
          </div>
          <div class="khero__cta">
            <button class="btn btn--primary btn--lg" @click="scrollTo('cena')">Dołącz do kursu — {{ priceLabel }}</button>
            <button v-if="modules.length" class="btn btn--secondary btn--lg" @click="scrollTo('program')">Zobacz program</button>
          </div>
        </div>
        <figure v-if="product.image" class="khero__media" style="margin:0">
          <DrwaImg :src="product.image" :alt="product.title" preset="hero" priority />
        </figure>
      </div>
    </section>

    <!-- ===== Pas liczb ===== -->
    <section v-if="stats.length" class="kstats" aria-label="Kurs w liczbach">
      <div class="container">
        <div class="kstats__row kstats__row--auto">
          <div v-for="s in stats" :key="s.label" class="kstat">
            <div class="kstat__num">{{ s.num }}</div>
            <div class="kstat__label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <main id="main-content">
      <!-- ===== O kursie: opis + dynamiczne kafelki ===== -->
      <section v-if="hasMain" class="section container" id="o-kursie">
        <div class="sec-head io">
          <span class="eyebrow">O kursie</span>
          <h2>{{ course?.main_heading || product.title }}</h2>
        </div>
        <div v-if="product.description" class="kdesc io" v-html="product.description" />
        <div v-if="tiles.length" class="builds io">
          <article v-for="t in tiles" :key="t.id" class="build">
            <div class="build__img">
              <DrwaImg :src="t.image" :alt="t.title" preset="card" />
            </div>
            <div class="build__body">
              <span v-if="t.eyebrow" class="build__eyebrow">{{ t.eyebrow }}</span>
              <h3 class="build__title">{{ t.title }}</h3>
              <p v-if="t.description" class="build__desc">{{ t.description }}</p>
            </div>
          </article>
        </div>
      </section>

      <!-- ===== Program kursu ===== -->
      <section v-if="modules.length" class="section container" id="program" style="padding-top:0">
        <div class="sec-head io">
          <span class="eyebrow">Program</span>
          <h2>Program kursu</h2>
          <p>{{ modulesLabel(modules.length) }} — każdy to instrukcje wideo i materiały opisowe.</p>
        </div>
        <div class="mods io">
          <article
            v-for="(m, i) in modules"
            :key="m.id"
            class="mod"
            :class="{ 'is-open': openMod === i }"
          >
            <button
              class="mod__head"
              :aria-expanded="openMod === i"
              @click="openMod = openMod === i ? -1 : i"
            >
              <span class="mod__num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="mod__title">{{ m.title }}</span>
              <span class="mod__chev">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </span>
            </button>
            <div class="mod__body">
              <div class="mod__copy" v-html="m.description ?? ''" />
            </div>
          </article>
        </div>
      </section>

      <!-- ===== Bonusy ===== -->
      <section v-if="bonuses.length" class="section container" id="bonusy" style="padding-top:0">
        <div class="sec-head io">
          <span class="eyebrow">Bonusy</span>
          <h2>Do kursu dorzucamy</h2>
        </div>
        <div class="bonuses io">
          <article v-for="(b, i) in bonuses" :key="b.title" class="bonus">
            <div class="bonus__top">
              <span class="bonus__num">Bonus {{ String(i + 1).padStart(2, '0') }}</span>
              <!-- Gift -->
              <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
              </svg>
            </div>
            <h3 class="bonus__title">{{ b.title }}</h3>
            <p v-if="b.description" class="bonus__desc">{{ b.description }}</p>
          </article>
        </div>
      </section>

      <!-- ===== Opinie ===== -->
      <section v-if="quotes.length" class="section container" id="opinie" style="padding-top:0">
        <div class="sec-head io">
          <span class="eyebrow">Opinie</span>
          <h2>Listy od budujących</h2>
        </div>
        <div class="quotes io">
          <figure v-for="q in quotes" :key="q.name" class="quote" style="margin:0">
            <div class="quote__mark">„</div>
            <blockquote class="quote__text" style="margin:0">{{ q.text }}</blockquote>
            <figcaption class="quote__by">
              <div class="quote__avatar" aria-hidden="true">{{ initials(q.name) }}</div>
              <div>
                <div class="quote__name">{{ q.name }}</div>
                <div class="quote__role">uczestnik kursu</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      <!-- ===== Co w kursie + zakup ===== -->
      <section class="offer-sec section" id="cena">
        <div class="container">
          <div class="sec-head sec-head--center io">
            <span class="eyebrow eyebrow--ondark">Dołącz do kursu</span>
            <h2>Oto wszystko, co otrzymasz</h2>
          </div>
          <div class="offer io">
            <div class="drwa-card drwa-card--pad">
              <div class="offer__head">
                <span class="eyebrow">Kurs online</span>
                <h3 class="offer__title">{{ product.title }}</h3>
              </div>
              <ul v-if="offerItems.length" class="offer__list">
                <li v-for="o in offerItems" :key="o.text" :class="o.bonus ? 'is-bonus' : ''">
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span>{{ o.text }}</span>
                </li>
              </ul>
              <div class="offer__pricerow">
                <span class="offer__price">{{ priceLabel }}</span>
                <span v-if="course?.price_note" class="offer__per">{{ course.price_note }}</span>
              </div>
              <div class="offer__cta">
                <AddToCartButton :product="product" label="Dodaj do koszyka" />
              </div>
              <p class="offer__note">Bezpieczna płatność online · dostęp do kursu w <NuxtLink to="/konto">Twoim koncie</NuxtLink></p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <DrwaFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatPrice, stripHtml } from '~/utils/format'

const route = useRoute()
const { data } = await useCourse(String(route.params.slug))

// Wzorzec jak w sklep/[slug].vue — snapshot po awaicie + 404.
const product = data.value
if (!product || product.type !== 'course') {
  throw createError({ statusCode: 404, statusMessage: 'Kurs nie znaleziony', fatal: true })
}

useHead({
  title: `${product.title} — kurs online DRWA`,
  meta: [{
    name: 'description',
    content: product.short_description ?? stripHtml(product.description, 160),
  }],
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const course = product.course
const heroFacts = course?.hero_facts ?? []
const stats = course?.stats ?? []
const tiles = course?.tiles ?? []
const bonuses = course?.bonuses ?? []
const quotes = course?.quotes ?? []
const offerItems = course?.offer_items ?? []
// Moduł bez pola `status` (fallback query na starym schemacie) = opublikowany.
const modules = (course?.modules ?? []).filter((m) => (m.status ?? 'published') === 'published')
const hasMain = Boolean(product.description) || tiles.length > 0
// Directus wysyła decimal jako string — Number() przed formatowaniem.
const priceLabel = formatPrice(Number(product.price))

const openMod = ref(0)

/** '12 modułów wiedzy' z poprawną polską odmianą. */
function modulesLabel(n: number): string {
  if (n === 1) return '1 moduł wiedzy'
  const d = n % 10
  const h = n % 100
  const word = d >= 2 && d <= 4 && !(h >= 12 && h <= 14) ? 'moduły' : 'modułów'
  return `${n} ${word} wiedzy`
}

function initials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' })
}

useScrollReveal()
</script>
```

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: sukces.

- [ ] **Step 4: Weryfikacja na dev serwerze**

```bash
# Szablon po id (fallback pól — Directus jeszcze bez nowych pól):
curl -s http://localhost:3000/kursy/2 | grep -o '<h1>[^<]*</h1>'
curl -s http://localhost:3000/kursy/2 | grep -c 'Dodaj do koszyka'
curl -s http://localhost:3000/kursy/2 | grep -c 'kstat__num'
# 404-ki: merch (id 3), nieistniejące id, nieistniejący slug:
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/kursy/3
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/kursy/999
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/kursy/nie-ma-takiego
# Stara strona nietknięta (statyczna wygrywa z [slug]):
curl -s http://localhost:3000/kursy/od-wiaty-do-chaty | grep -c 'Jedna budowa, trzy przystanki'
```

Expected (kolejno): `<h1>od Wiaty do Chaty</h1>`; `1`+ (przycisk jest); `0`
(brak statów przed konfiguracją CMS — sekcja ukryta; uwaga: `grep -c` przy zeru
trafień kończy się exit code 1 — to oczekiwane, liczy się wypisane `0`);
`404`; `404`; `404`; `1`.
W logu dev serwera widoczny `console.warn` `[useCourse] Pełne zapytanie padło…`
— to oczekiwane do czasu wykonania Appendixu A przez użytkownika.

- [ ] **Step 5: Commit**

```bash
git add app/pages/kursy/[slug].vue app/assets/css/kurs.css
git commit -m "feat(kursy): szablon strony kursu /kursy/[slug] z zakupem przez koszyk

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Weryfikacja end-to-end i regresja

**Files:** brak zmian w kodzie (task wyłącznie weryfikacyjny; poprawki tylko
gdy któraś asercja padnie).

**Interfaces:**
- Consumes: wszystko z Tasków 1–4.
- Produces: potwierdzony, działający feature + lista rzeczy do ręcznego kliknięcia przez użytkownika.

- [ ] **Step 1: Pełny build produkcyjny**

Run: `pnpm build`
Expected: sukces, zero błędów.

- [ ] **Step 2: Suite curl na dev serwerze**

```bash
# Listing:
curl -s http://localhost:3000/kursy | grep -c 'build--course'          # → 2
curl -s http://localhost:3000/kursy | grep -o '/kursy/[0-9]*' | sort -u # → /kursy/2, /kursy/7
# Szablon obu kursów:
curl -s http://localhost:3000/kursy/2 | grep -c 'Dodaj do koszyka'      # → ≥1
curl -s http://localhost:3000/kursy/7 | grep -o '<h1>[^<]*</h1>'        # → Minikurs podstaw
# Nav na stronie głównej zawiera nowy link:
curl -s http://localhost:3000/ | grep -c 'href="/kursy"'                # → ≥1
# Regresja starych stron:
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/kursy/od-wiaty-do-chaty  # → 200
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/kursy/minikurs-podstaw   # → 200
# Regresja warsztatów i sklepu (useProducts/normalizeProduct dotknięte pośrednio):
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/warsztaty                # → 200
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/sklep                    # → 200
```

- [ ] **Step 3: Raport dla użytkownika**

Zbierz wyniki i przekaż użytkownikowi listę do ręcznego kliknięcia w przeglądarce
(tego curl nie pokryje):

1. `/kursy/2` → „Dodaj do koszyka" → toast → `/koszyk` pokazuje kurs za 800 zł, ilość zablokowana na 1.
2. Menu mobilne (burger) zawiera „Kursy".
3. Po wykonaniu Appendixu A ze speca (pola + uprawnienia w Directusie) i wpisaniu treści: sekcje Staty/Kafelki/Bonusy/Opinie/Oferta pojawiają się na `/kursy/2`, a warn `[useCourse]` znika z konsoli.
