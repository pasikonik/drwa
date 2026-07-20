<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <section class="dhero" id="top">
      <div class="dhero__bg">
        <DrwaImg :src="heroImage" :alt="title" preset="hero" priority fallback="/assets/forest-1.png" />
      </div>
      <div class="dhero__scrim" />
      <div class="container dhero__inner">
        <div class="dhero__crumb">
          <NuxtLink to="/warsztaty">Warsztaty 2026</NuxtLink>
          <span class="sep">·</span>
          <span class="cur">{{ title }}</span>
        </div>
        <h1>{{ title }}</h1>
        <p class="dhero__lead">{{ lead }}</p>
        <div class="dhero__meta">
          <span class="dhero__fact">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            {{ dateStr }}
          </span>
          <span class="dhero__fact">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M14 12 3 23"/><path d="M18 2 8 12l4 4L22 6a2.83 2.83 0 0 0-4-4Z"/>
            </svg>
            poziom {{ levelLabel }}
          </span>
          <span class="dhero__fact">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {{ location }}
          </span>
        </div>
        <div class="dhero__cta">
          <button v-if="!isPast" class="btn btn--on-dark btn--lg" @click="jump('zapisy')">Zapisz się — {{ priceStr }}</button>
          <button class="btn btn--accent btn--lg" @click="jump('program')">Zobacz program</button>
        </div>
      </div>
    </section>

    <main id="main-content">
      <!-- ===== Treść + panel ===== -->
      <div class="section container detail">
        <div class="detail__main">

          <!-- O warsztacie -->
          <section class="dsec io" id="o-warsztacie">
            <span class="eyebrow">O warsztacie</span>
            <h2>{{ title }}</h2>
            <div v-if="descHtml" v-html="descHtml" class="dsec__content" />
            <ul class="learn">
              <li v-for="item in LEARN" :key="item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- Program -->
          <section class="dsec io" id="program">
            <span class="eyebrow">Program</span>
            <h2>Dzień po dniu</h2>
            <div class="prog">
              <article v-for="day in PROGRAM" :key="day.id" class="pday">
                <div class="pday__label">
                  <span class="pday__num">{{ day.num }}</span>
                  <span class="pday__sub">{{ day.sub }}</span>
                  <span class="pday__hours">{{ day.hours }}</span>
                </div>
                <div>
                  <h3 class="pday__title">{{ day.title }}</h3>
                  <ul>
                    <li v-for="it in day.items" :key="it.id">{{ it.text }}</li>
                  </ul>
                </div>
              </article>
            </div>
            <a v-if="blogpostLink" :href="blogpostLink" class="relacja">
              <span class="relacja__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                  <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z"/>
                </svg>
              </span>
              <span class="relacja__body">
                <span class="relacja__kicker">Na blogu DRWA</span>
                <span class="relacja__title">Zobacz relację z tego warsztatu</span>
              </span>
              <svg class="relacja__arrow" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </section>

        </div>

        <!-- Panel rezerwacji -->
        <aside class="book">
          <div class="card card--padded">
            <div class="book__facts">
              <span class="book__fact">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                {{ daysCount }}<template v-if="scheduleSummary"> · {{ scheduleSummary }}</template>
              </span>
              <span class="book__fact">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {{ location }}
              </span>
              <span class="book__fact">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {{ capacityLabel }}
              </span>
              <span class="book__fact">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M14 12 3 23"/><path d="M18 2 8 12l4 4L22 6a2.83 2.83 0 0 0-4-4Z"/>
                </svg>
                {{ levelNote }}
              </span>
            </div>
            <div class="book__rule" v-if="!isPast" />
            <div class="book__pricerow" v-if="!isPast">
              <span class="book__price">{{ priceStr }}</span>
              <span class="book__per">od osoby</span>
            </div>
            <p class="book__deposit" v-if="hasAdvance && !isPast">
              Płacisz teraz <strong>zaliczkę {{ advanceStr }}</strong>, która rezerwuje Twoje miejsce - resztę dopłacasz przed warsztatem.
            </p>
            <div class="book__cta" v-if="!isPast">
              <div class="badge" :class="spots.tone === 'warning' ? 'badge--warning' : 'badge--success'">
                <span class="badge__dot" />
                {{ spots.label }}
              </div>
              <AddToCartButton :product="prod" label="Rezerwuj miejsce" />
            </div>
          </div>

          <!-- Prowadzący -->
          <div class="card card--padded book__tutors" id="prowadzacy">
            <div class="eyebrow book__eyebrow">Prowadzący</div>
            <ul class="ptutors">
              <li v-for="t in instructors" :key="t.name" class="ptutor">
                <div class="avatar avatar--ring" aria-hidden="true">
                  <img v-if="t.photoUrl" :src="t.photoUrl" :alt="t.name" />
                  <template v-else>{{ t.initials }}</template>
                </div>
                <div class="ptutor__body">
                  <span class="ptutor__name">{{ t.name }}</span>
                  <span class="ptutor__role">{{ t.role }}</span>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <!-- ===== Zapisy ===== -->
      <section class="signup-sec" id="zapisy">
        <div class="signup">
          <div class="signup__intro io">
            <span class="eyebrow">Zapisy</span>
            <template v-if="isPast">
              <h2 class="signup__heading">Ten warsztat już się odbył</h2>
              <p>Zapisy na tę edycję są zamknięte. Sprawdź <NuxtLink to="/warsztaty">nadchodzące terminy</NuxtLink> albo napisz do nas — chętnie damy znać o kolejnej odsłonie.</p>
            </template>
            <template v-else>
              <h2 class="signup__heading">Zajmij miejsce przy drewnie</h2>
              <p>Wyślij zgłoszenie, a w ciągu dwóch dni odezwiemy się z potwierdzeniem miejsca i szczegółami dojazdu. Zaliczka 400 zł rezerwuje miejsce.</p>
            </template>
            <div class="signup__contact">
              <a href="mailto:czesc@drwa.pl">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                czesc@drwa.pl
              </a>
            </div>
          </div>
          <div class="io">
            <div class="card card--padded">
              <div v-if="isPast" class="signup__sent">
                <h3>Warsztat zakończony</h3>
                <p>Ta edycja już się odbyła. Zajrzyj na stronę <NuxtLink to="/warsztaty">Warsztaty 2026</NuxtLink>, żeby zapisać się na najbliższy termin.</p>
              </div>
              <div v-else-if="sent" class="signup__sent">
                <h3>Dziękujemy za zgłoszenie.</h3>
                <p>Odezwiemy się w ciągu dwóch dni roboczych z potwierdzeniem miejsca i szczegółami. Do zobaczenia w stolarni.</p>
              </div>
              <form v-else class="signup__form" @submit.prevent="submit">
                <div class="eyebrow">{{ formEyebrow }}</div>
                <div class="field">
                  <label class="field__label" for="f-name">Imię i nazwisko</label>
                  <input
                    id="f-name"
                    v-model="form.name"
                    class="field__input"
                    :class="{ 'field__input--error': errors.name }"
                    type="text"
                    autocomplete="name"
                  />
                  <span v-if="errors.name" class="field__error" role="alert">{{ errors.name }}</span>
                </div>
                <div class="field">
                  <label class="field__label" for="f-email">E-mail</label>
                  <input
                    id="f-email"
                    v-model="form.email"
                    class="field__input"
                    :class="{ 'field__input--error': errors.email }"
                    type="email"
                    autocomplete="email"
                  />
                  <span v-if="errors.email" class="field__error" role="alert">{{ errors.email }}</span>
                  <span class="field__hint">Tu wyślemy potwierdzenie.</span>
                </div>
                <div class="field">
                  <label class="field__label" for="f-msg">Wiadomość (opcjonalnie)</label>
                  <textarea
                    id="f-msg"
                    v-model="form.message"
                    class="field__textarea"
                    rows="3"
                    placeholder="Pytania, doświadczenie, dieta…"
                  />
                </div>
                <label class="field__check">
                  <input v-model="form.newsletter" type="checkbox" />
                  <span class="field__check-label">Zapisz mnie też do newslettera „Listy z lasu"</span>
                </label>
                <div class="signup__actions">
                  <button type="submit" class="btn btn--primary btn--lg">Wyślij zgłoszenie</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- ===== Stopka ===== -->
    <footer class="foot" id="kontakt">
      <div class="container">
        <div class="foot__top">
          <div class="foot__brand">
            <div class="brandrow">
              <img src="/assets/drwa-mark.png" alt="DRWA" />
              <span class="wm">DRWA</span>
            </div>
            <p>Drewno, rzemiosło i szkolenia. Pracujemy z drewnem i budujemy wokół niego społeczność — w duchu natury i ekologii.</p>
          </div>
          <div>
            <h4>Ten warsztat</h4>
            <ul>
              <li><a @click.prevent="jump('program')">Program dzień po dniu</a></li>
              <li><a @click.prevent="jump('prowadzacy')">Prowadzący</a></li>
              <li v-if="blogpostLink"><a :href="blogpostLink">Relacja z warsztatu</a></li>
              <li><a @click.prevent="jump('zapisy')">Zapisy</a></li>
            </ul>
          </div>
          <div>
            <h4>DRWA</h4>
            <ul>
              <li><NuxtLink to="/">Strona główna</NuxtLink></li>
              <li><NuxtLink to="/warsztaty">Warsztaty 2026</NuxtLink></li>
              <li><NuxtLink to="/o-nas">O nas</NuxtLink></li>
              <li><NuxtLink to="/blog">Blog</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li><a href="mailto:czesc@drwa.pl">czesc@drwa.pl</a></li>
              <li><span>Stolarnia pod lasem</span></li>
            </ul>
          </div>
        </div>
        <div class="foot__bottom">
          <span>© 2026 DRWA · Drewno · Rzemiosło · Szkolenia</span>
          <div class="foot__social">
            <a aria-label="Instagram" href="#">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>
              </svg>
            </a>
            <a aria-label="Facebook" href="#">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a aria-label="YouTube" href="#">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                <path d="m9.75 15.02 5.75-3.27-5.75-3.27v6.54z"/>
              </svg>
            </a>
            <a aria-label="E-mail" href="mailto:czesc@drwa.pl">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { formatPrice, formatDateRange, formatTimeRange, stripHtml, workshopSpots } from '~/utils/format'
import { isWorkshopPast } from '~/utils/product'
const LEVEL_LABEL: Record<string, string> = {
  beginner: 'podstawowy',
  intermediate: 'średni',
  advanced: 'zaawansowany',
}

const LEVEL_NOTE: Record<string, string> = {
  beginner: 'poziom podstawowy — zaczynamy od zera',
  intermediate: 'poziom średni — przyda się jedno doświadczenie',
  advanced: 'poziom zaawansowany — dla wprawionych w drewnie',
}

const levelKey = (level: string | null) => level?.toLowerCase() ?? ''

const route = useRoute()
const { data: product } = await useProduct(route.params.slug as string)

if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Warsztat nie znaleziony', fatal: true })
}

useHead({
  title: `${product.value.title} — Warsztaty DRWA`,
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

// ─── Display values ───────────────────────────────────────────────────────────

// Non-null product (we threw a 404 above when absent) — for AddToCartButton.
const prod = computed(() => product.value!)
const title = computed(() => product.value?.title ?? '—')
const heroImage = computed(() => product.value?.image ?? null)
const descHtml = computed(() => product.value?.description ?? '')
const lead = computed(() =>
  product.value?.short_description ?? (product.value?.description ? stripHtml(product.value.description, 260) : '')
)
const workshop = computed(() => product.value?.workshop ?? null)

const location = computed(() =>
  workshop.value?.location ?? 'Stolarnia pod lasem · Beskid Niski'
)
const priceStr = computed(() =>
  product.value ? formatPrice(product.value.price) : '—'
)

const advanceStr = computed(() => {
  const a = workshop.value?.advance
  return a != null ? formatPrice(Number(a)) : priceStr.value
})

const hasAdvance = computed(() => workshop.value?.advance != null)

const isPast = computed(() => isWorkshopPast(workshop.value))

const dateStr = computed(() => {
  const s = workshop.value?.date_start
  const e = workshop.value?.date_end
  if (!s || !e) return '—'
  const dr = formatDateRange(s, e)
  return `${dr.day} ${dr.month} ${dr.year}`
})

// Program — built from the workshop's days + agenda (sorted in normalizeProduct).
const PROGRAM = computed(() =>
  (workshop.value?.days ?? []).map((d) => ({
    id: d.id,
    num: d.day_number != null ? `Dzień ${d.day_number}` : 'Dzień',
    sub: d.day_name ?? '',
    hours: formatTimeRange(d.start_time, d.end_time),
    title: d.theme ?? '',
    items: (d.agenda_items ?? [])
      .filter((a) => !!a.description)
      .map((a) => ({ id: a.id, text: a.description as string })),
  }))
)

const daysCount = computed(() => {
  const days = workshop.value?.days ?? []
  let count = days.length
  if (!count) {
    // Fall back to the date span when the program isn't filled in.
    const s = workshop.value?.date_start
    const e = workshop.value?.date_end
    if (!s || !e) return '—'
    count = Math.round((new Date(e).getTime() - new Date(s).getTime()) / (1000 * 60 * 60 * 24)) + 1
  }
  return `${count} ${count === 1 ? 'dzień' : 'dni'}`
})

// e.g. 'Piątek–Niedziela, 9:00–17:00' — derived from the days when they exist.
const scheduleSummary = computed(() => {
  const days = workshop.value?.days ?? []
  if (!days.length) return ''
  const first = days[0]
  if (!first) return ''
  const last = days[days.length - 1]
  // Show a name range only when every day is named (positional endpoints), so a
  // multi-day block with partially-filled names isn't mislabelled as one day.
  const allNamed = days.every((d) => !!d.day_name)
  const range = days.length > 1
    ? (allNamed ? `${first.day_name}–${last?.day_name}` : '')
    : (first.day_name ?? '')
  const sameHours = days.every((d) => d.start_time === first.start_time && d.end_time === first.end_time)
  const hours = sameHours ? formatTimeRange(first.start_time, first.end_time) : ''
  return [range, hours].filter(Boolean).join(', ')
})

const spots = computed(() =>
  workshopSpots(workshop.value?.spots_total ?? null, workshop.value?.spots_booked ?? null)
)

const capacityLabel = computed(() => {
  const cap = workshop.value?.spots_total
  return cap ? `grupa maks. ${cap} osób` : 'mała grupa'
})

const levelLabel = computed(() =>
  LEVEL_LABEL[levelKey(workshop.value?.level ?? null)] ?? 'podstawowy'
)

const levelNote = computed(() =>
  LEVEL_NOTE[levelKey(workshop.value?.level ?? null)] ?? 'poziom podstawowy'
)

// Link to a related blog post (relacja) — surfaced only when set in Directus.
const blogpostLink = computed(() => workshop.value?.blogpost_link ?? null)

const formEyebrow = computed(() => {
  const t = title.value
  return dateStr.value !== '—' ? `${t} · ${dateStr.value}` : t
})

const { assetUrl } = useDirectus()

const instructors = computed(() =>
  (workshop.value?.instructors ?? [])
    .map(j => j.instructors_id)
    .filter(Boolean)
    .map(i => ({
      name: i.name,
      role: i.role ?? '',
      initials: i.name.split(' ').map((p: string) => p[0] ?? '').join('').slice(0, 2).toUpperCase(),
      photoUrl: assetUrl(i.photo, { width: 120, quality: 82 }),
    }))
)

const LEARN = [
  'Trasowanie i wykonywanie łączeń czopowych — dłutem i piłą',
  'Czytanie drewna: słoje, sęki i praca materiału w konstrukcji',
  'Składanie ram i wspólne stawianie więźby dachowej',
  'Plan konstrukcji, który zabierzesz do domu i powtórzysz u siebie',
]

// ─── Form ─────────────────────────────────────────────────────────────────────

const form = reactive({ name: '', email: '', message: '', newsletter: false })
const errors = reactive({ name: '', email: '' })
const sent = ref(false)

function jump(id: string) {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' })
}

function submit() {
  errors.name = form.name.trim() ? '' : 'Podaj imię i nazwisko.'
  errors.email = form.email.trim() && form.email.includes('@') ? '' : 'Podaj poprawny adres e-mail.'
  if (!errors.name && !errors.email) sent.value = true
}

// ─── Intersection observer ────────────────────────────────────────────────────

useScrollReveal()
</script>
