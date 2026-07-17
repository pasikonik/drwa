# Kafelki materiałów do pobrania (`course_materials`) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sekcja „Program" w generycznym szablonie `/kursy/[slug]` dostaje CMS-owy blok kafelków materiałów (ikona + tytuł + opis, czysto opisowe — bez linku do pobrania), zasilany nową kolekcją Directusa `course_materials`, analogicznie do istniejącego `course_tiles`.

**Architecture:** Ten sam wzorzec co `course_tiles`/`tiles`: nowy typ + pole na `Course`, `useCourse` dociąga `materials` w pełnym zapytaniu (obok `tiles`), `normalizeCourse` sortuje po `sort`, szablon `[slug].vue` renderuje sekcję warunkowo (`v-if="materials.length"`) reużywając istniejących klas `extras`/`extra` z `kurs.css`.

**Tech Stack:** Nuxt 4, @directus/sdk, TypeScript. Brak frameworka testowego — **weryfikacja to `pnpm build`** (zgodnie z CLAUDE.md) + ręczny przebieg na dev serwerze.

**Spec:** `docs/superpowers/specs/2026-07-15-kursy-directus-design.md`, sekcja „Dodatek 2026-07-17 — kafelki materiałów do pobrania (`course_materials`)". Konfiguracja kolekcji w Directus UI (Appendix A, dopisek) NIE jest częścią tego planu — kod działa bez niej: pełne zapytanie `useCourse` po prostu pada i idzie w istniejący fallback (jak dziś dla `tiles`), sekcja materiałów się nie renderuje, zero regresji.

## Global Constraints

- Zero nowych zależności npm.
- Copy po polsku, w tonie istniejących stron.
- Kolory/spacing tylko przez tokeny CSS (`var(--…)`) — w tym tasku nie dopisujemy nowego CSS, reużywamy istniejące klasy `.extras`/`.extra` z `app/assets/css/kurs.css:156-163`.
- Strony **bez** `<style scoped>` (konwencja repo).
- `pnpm build` musi przechodzić po każdym tasku.
- Commit po każdym tasku.

---

### Task 1: Typy i normalizacja — `CourseMaterial`

**Files:**
- Modify: `app/types/directus.ts` (blok „Course template CMS blocks", ok. linii 94-128)
- Modify: `app/utils/product.ts:49-57` (`normalizeCourse`)

**Interfaces:**
- Consumes: istniejące `Course`, `Schema`, `bySort` (`app/utils/product.ts:16-17`).
- Produces (dla Tasków 2-3):
  - `export type CourseMaterialIcon = 'model-3d' | 'document' | 'video' | 'general'`
  - `export interface CourseMaterial { id: string; sort: number | null; icon: CourseMaterialIcon | null; title: string; description: string | null }`
  - `Course.materials?: CourseMaterial[]`
  - `Schema.course_materials: CourseMaterial[]`
  - `normalizeCourse` zwraca `course.materials` zawsze jako posortowaną (po `sort`) tablicę, tak jak `tiles`/`modules`.

- [ ] **Step 1: Dopisz `CourseMaterialIcon` i `CourseMaterial` w `app/types/directus.ts`**

Zaraz PO bloku `CourseTile` (kończącym się `}` przed `// Course extension (courses collection) — 1:1 with a product.`) wstaw:

```ts
export type CourseMaterialIcon = 'model-3d' | 'document' | 'video' | 'general'

// One descriptive "what's included" tile under a course's Program section
// (course_materials collection, O2M alias `materials` on courses). Purely
// informational — no actual file attachment/download link.
export interface CourseMaterial {
  id: string
  sort: number | null
  icon: CourseMaterialIcon | null
  title: string
  description: string | null
}
```

- [ ] **Step 2: Dopisz pole `materials` w `Course`**

W `export interface Course`, po linii `tiles?: CourseTile[]`, dopisz:

```ts
  materials?: CourseMaterial[]
```

- [ ] **Step 3: Dopisz `course_materials` w `Schema`**

W `export interface Schema`, po linii `course_tiles: CourseTile[]`, dopisz:

```ts
  course_materials: CourseMaterial[]
```

- [ ] **Step 4: Sortowanie w `normalizeCourse` (`app/utils/product.ts`)**

Zamień:

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

na:

```ts
/** Ensure a course's modules/tiles/materials are always sorted arrays (when a course exists). */
const normalizeCourse = (c: Course | null): Course | null => {
  if (!c) return null
  return {
    ...c,
    modules: [...(c.modules ?? [])].sort(bySort),
    tiles: [...(c.tiles ?? [])].sort(bySort),
    materials: [...(c.materials ?? [])].sort(bySort),
  }
}
```

- [ ] **Step 5: Weryfikacja — `pnpm build`**

Run: `pnpm build`
Expected: kończy się sukcesem (`✓ built`), bez błędów TypeScript. Nic jeszcze nie konsumuje nowych pól, więc to czysto addytywna zmiana.

- [ ] **Step 6: Commit**

```bash
git add app/types/directus.ts app/utils/product.ts
git commit -m "$(cat <<'EOF'
feat(kursy): typy CourseMaterial + sortowanie materials

Przygotowanie pod kafelki materiałów do pobrania w sekcji Program
(course_materials, analogicznie do course_tiles).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: `useCourse` — dociąganie `materials`

**Files:**
- Modify: `app/composables/useCourse.ts:36-47` (pełne zapytanie, blok `course: [...]`)

**Interfaces:**
- Consumes: `CourseMaterial` z Tasku 1 (pośrednio, przez `normalizeProduct`/`normalizeCourse`).
- Produces (dla Tasku 3): `data.value?.course?.materials` — posortowana tablica `CourseMaterial` (pusta gdy brak danych/kolekcji w schemacie), dostępna wszędzie tam, gdzie dziś jest `data.value?.course?.tiles`.

- [ ] **Step 1: Dopisz `materials` do pełnego zapytania**

W `app/composables/useCourse.ts`, w bloku **pierwszego** (pełnego, w `try`) wywołania `readItems('products', ...)`, w polu `course: [...]`, zaraz PO linii:

```ts
                  { tiles: ['id', 'sort', 'eyebrow', 'title', 'description', 'image'] },
```

dopisz:

```ts
                  { materials: ['id', 'sort', 'icon', 'title', 'description'] },
```

**Nie dotykaj** zapytania fallbackowego w `catch` — `materials`, tak jak `tiles`, istnieje tylko w pełnym schemacie (po Appendix A) i celowo nie ma go w fallbacku.

- [ ] **Step 2: Weryfikacja — `pnpm build`**

Run: `pnpm build`
Expected: kończy się sukcesem, bez błędów TypeScript (pole `materials` istnieje na typie `Course` z Tasku 1, więc literal w `fields` się typuje).

- [ ] **Step 3: Weryfikacja — dev server, brak regresji**

Run: `pnpm dev`, otwórz `http://localhost:3000/kursy/2`.
Expected: strona ładuje się jak dotychczas (Appendix A jeszcze nie wykonany w Directusie, więc pełne zapytanie pada i leci fallback — w konsoli devtools widoczny istniejący `console.warn('[useCourse] Pełne zapytanie padło…')`, bez nowych błędów). Zatrzymaj dev server (Ctrl+C) po sprawdzeniu.

- [ ] **Step 4: Commit**

```bash
git add app/composables/useCourse.ts
git commit -m "$(cat <<'EOF'
feat(kursy): useCourse dociąga course_materials w pełnym zapytaniu

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Szablon `[slug].vue` — sekcja kafelków materiałów

**Files:**
- Modify: `app/pages/kursy/[slug].vue` (template: sekcja Program, ok. linii 72-104; script: deklaracje `computed`/`const`, ok. linii 209-216)

**Interfaces:**
- Consumes: `course?.materials` (z Tasku 2), `CourseMaterialIcon` (z Tasku 1, tylko jako dokumentacja typu — w template porównujemy stringi).
- Produces: brak (liść — nic dalej tego nie konsumuje).

- [ ] **Step 1: Dodaj `const materials` w `<script setup>`**

W `app/pages/kursy/[slug].vue`, zaraz PO linii:

```ts
const tiles = course?.tiles ?? []
```

dopisz:

```ts
const materials = course?.materials ?? []
```

- [ ] **Step 2: Dodaj blok kafelków w sekcji Program (template)**

W sekcji `<section v-if="modules.length" class="section container" id="program" ...>`, zaraz PO zamknięciu `</div>` diva `.mods` (czyli po linii `</div>` kończącej akordeon modułów, PRZED zamknięciem `</section>`), wstaw:

```html
        <div v-if="materials.length" class="extras io">
          <div v-for="m in materials" :key="m.id" class="extra">
            <svg v-if="m.icon === 'model-3d'" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
              <path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>
            </svg>
            <svg v-else-if="m.icon === 'document'" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
              <path d="M14 2v4a2 2 0 0 0 2 2h4M9 13h6M9 17h6"/>
            </svg>
            <svg v-else-if="m.icon === 'video'" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect width="18" height="18" x="3" y="3" rx="2"/>
              <path d="M7 3v18M17 3v18M3 7.5h4M3 16.5h4M17 7.5h4M17 16.5h4"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
              <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
            </svg>
            <div>
              <div class="extra__name">{{ m.title }}</div>
              <div class="extra__desc">{{ m.description }}</div>
            </div>
          </div>
        </div>
```

Uwaga: `v-else` (fallback `general`) obejmuje zarówno `icon: 'general'`, jak i `icon: null`/pusty — celowo, żeby brak wartości nie zostawiał kafelka bez ikony.

- [ ] **Step 3: Weryfikacja — `pnpm build`**

Run: `pnpm build`
Expected: kończy się sukcesem, bez błędów szablonu/TypeScript.

- [ ] **Step 4: Weryfikacja — dev server, sekcja znika przy braku danych**

Run: `pnpm dev`, otwórz `http://localhost:3000/kursy/2`.
Expected: sekcja „Program" wygląda jak dotychczas (bez bloku kafelków materiałów, bo `materials` jest puste — Appendix A jeszcze nie wykonany) — brak pustego/połamanego layoutu, brak błędów w konsoli poza istniejącym warnem z Tasku 2. Zatrzymaj dev server po sprawdzeniu.

- [ ] **Step 5: Commit**

```bash
git add app/pages/kursy/[slug].vue
git commit -m "$(cat <<'EOF'
feat(kursy): sekcja kafelków materiałów w [slug].vue

Renderuje course.materials (course_materials z Directusa) w sekcji
Program, pod akordeonem modułów — reużywa klas .extras/.extra z
kurs.css. Sekcja znika, gdy brak danych (przed konfiguracją Directusa
w Appendix A).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Poza zakresem tego planu

- Konfiguracja kolekcji `course_materials` w Directus UI (Appendix A, dopisek w spec) — wykonuje Michał ręcznie, niezależnie od tego kodu.
- Zmiany w `od-wiaty-do-chaty.vue` (świadomie zamrożona strona-podgląd, zob. spec).
- Realny upload/link do pliku — kafelki zostają czysto opisowe.
