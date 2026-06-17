<template>
  <div class="site">
    <!-- ===== Nawigacja ===== -->
    <header class="nav">
      <div class="container nav__row">
        <NuxtLink class="brand" to="/">
          <img src="/assets/drwa-mark-ink.png" alt="DRWA" />
          <span class="brand__wm">DRWA</span>
        </NuxtLink>
        <nav class="nav__links" aria-label="Główne">
          <NuxtLink class="nav__link" to="/">Strona główna</NuxtLink>
          <button class="nav__link nav__link--current" @click="jump('lista')">Warsztaty 2026</button>
          <button class="nav__link" @click="jump('archiwum')">Minione</button>
          <button class="nav__link" @click="jump('faq')">FAQ</button>
        </nav>
        <div class="nav__spacer" />
        <div class="nav__actions">
          <CartLink />
        </div>
      </div>
    </header>

    <!-- ===== Hero ===== -->
    <section class="phero" id="top">
      <div class="phero__bg">
        <img src="/assets/forest-band.png" alt="Las we mgle" />
      </div>
      <div class="phero__scrim" />
      <div class="container phero__inner">
        <span class="eyebrow eyebrow--ondark">STACJONARNIE · BESKID NISKI · 2026</span>
        <h1>Warsztaty 2026</h1>
        <p class="phero__lead">Kilka dni wspólnej pracy przy realnym drewnie — w małej grupie, pod okiem cieśli i przy ognisku. Sprawdź terminy i zajmij miejsce.</p>
      </div>
    </section>

    <main>
      <!-- ===== Nadchodzące terminy ===== -->
      <section class="section container" id="lista">
        <div class="sec-head io">
          <span class="eyebrow">Nadchodzące terminy</span>
          <h2>Trzy warsztaty, trzy konstrukcje</h2>
          <p>Każdy warsztat to jeden realny budynek — od przygotowania drewna po gotową konstrukcję. Pracujemy w grupach do dziesięciu osób.</p>
        </div>
        <div class="wlist">
          <article v-for="w in workshops" :key="w.id" class="wrow io">
            <div class="wrow__date">
              <span class="wrow__day">{{ w.day }}</span>
              <span class="wrow__month">{{ w.month }}</span>
              <span class="wrow__year">{{ w.year }}</span>
            </div>
            <div class="wrow__body">
              <div class="wrow__meta">
                <span class="eyebrow">{{ w.days }} · poziom {{ w.level }}</span>
                <div class="badge" :class="w.spotsTone === 'warning' ? 'badge--warning' : 'badge--success'">
                  <span class="badge__dot" />
                  {{ w.spotsLabel }}
                </div>
              </div>
              <h3 class="wrow__title">
                <NuxtLink v-if="w.route" :to="w.route">{{ w.title }}</NuxtLink>
                <template v-else>{{ w.title }}</template>
              </h3>
              <p class="wrow__desc">{{ w.desc }}</p>
              <div class="wrow__info">
                <span class="wrow__fact">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ w.place }}
                </span>
                <span class="wrow__fact">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  {{ w.lead }}
                </span>
              </div>
              <div class="wrow__cta">
                <span class="wrow__price">{{ w.price }}<small>od osoby</small></span>
                <NuxtLink v-if="w.route" :to="w.route" class="btn btn--secondary btn--md">Szczegóły</NuxtLink>
                <AddToCartButton :product="w.raw" label="Rezerwuj miejsce" />
              </div>
            </div>
            <div class="wrow__img">
              <DrwaImg :src="w.rawImage" :alt="w.title" preset="hero" :img-style="{ objectPosition: w.pos }" :fallback="w.img" />
            </div>
          </article>
        </div>
      </section>

      <!-- ===== Info strip ===== -->
      <section class="strip" id="informacje">
        <div class="strip__grid">
          <div class="io">
            <span class="eyebrow eyebrow--ondark">Co w cenie</span>
            <h3>Przyjedź z pustymi rękami</h3>
            <ul class="strip__list">
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                Wszystkie narzędzia i materiały — pracujesz na naszym
              </li>
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                Obiady przy ognisku, kawa i herbata przez cały dzień
              </li>
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                Notatki i rysunki konstrukcyjne w PDF po warsztacie
              </li>
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                Mała grupa — maksymalnie 10 osób na dwóch prowadzących
              </li>
            </ul>
          </div>
          <div class="io">
            <span class="eyebrow eyebrow--ondark">Dla kogo</span>
            <h3>Dla tych, którzy chcą zrobić, nie obejrzeć</h3>
            <p>Nie musisz nic umieć — musisz chcieć pracować rękami. Warsztaty <strong>podstawowe</strong> zaczynamy od pierwszego cięcia i podstaw czytania drewna.</p>
            <p>Poziom <strong>średni</strong> to projekty na kilka dni, przy których przyda się jeden warsztat za sobą albo własne doświadczenie przy drewnie.</p>
          </div>
        </div>
      </section>

      <!-- ===== Archiwum ===== -->
      <section class="section container" id="archiwum">
        <div class="sec-head io">
          <span class="eyebrow">Archiwum</span>
          <h2>Minione warsztaty</h2>
          <p>To już za nami — konstrukcje stoją, kursanci wrócili do domów z nowymi umiejętnościami.</p>
        </div>
        <ul class="arch io">
          <li v-for="p in PAST" :key="p.title" class="arch__row">
            <span class="arch__date">{{ p.date }}</span>
            <span class="arch__title">{{ p.title }}</span>
            <span class="arch__done">Zakończony</span>
          </li>
        </ul>
      </section>

      <!-- ===== FAQ ===== -->
      <section class="section container" id="faq">
        <div class="sec-head io">
          <span class="eyebrow">Pytania i odpowiedzi</span>
          <h2>Zanim się zapiszesz</h2>
        </div>
        <div class="faq__wrap io">
          <div
            v-for="(item, i) in FAQ"
            :key="i"
            class="faq__item"
            :class="{ 'faq__item--open': openFaq === i }"
          >
            <button class="faq__q" :aria-expanded="openFaq === i" @click="openFaq = openFaq === i ? null : i">
              {{ item.q }}
              <svg class="faq__chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <p v-show="openFaq === i" class="faq__a">{{ item.a }}</p>
          </div>
        </div>
      </section>

      <!-- ===== Zapisy ===== -->
      <section class="signup-sec" id="zapisy">
        <div class="signup">
          <div class="signup__intro io">
            <span class="eyebrow">Zapisy</span>
            <h2 class="signup__heading">Dołącz do warsztatu</h2>
            <p>Wyślij zgłoszenie, a w ciągu dwóch dni odezwiemy się z potwierdzeniem miejsca i szczegółami dojazdu. Miejsce rezerwuje zaliczka.</p>
            <div class="signup__contact">
              <a href="mailto:czesc@drwa.pl">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                czesc@drwa.pl
              </a>
              <a href="tel:+48600100200">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>
                </svg>
                +48 600 100 200
              </a>
            </div>
          </div>
          <div class="io">
            <div class="card card--padded">
              <div v-if="sent" class="signup__sent">
                <h3>Dziękujemy za zgłoszenie.</h3>
                <p>Odezwiemy się w ciągu dwóch dni roboczych z potwierdzeniem miejsca i szczegółami. Do zobaczenia w stolarni.</p>
              </div>
              <form v-else class="signup__form" @submit.prevent="submit">
                <div class="field">
                  <label class="field__label" for="sf-workshop">Warsztat</label>
                  <select id="sf-workshop" v-model="form.workshopId" class="field__select">
                    <option v-for="w in workshops" :key="w.id" :value="w.id">
                      {{ w.title }} · {{ w.day }} {{ w.month }} {{ w.year }}
                    </option>
                  </select>
                </div>
                <div class="field">
                  <label class="field__label" for="sf-name">Imię i nazwisko</label>
                  <input id="sf-name" v-model="form.name" class="field__input" :class="{ 'field__input--error': errors.name }" type="text" autocomplete="name" />
                  <span v-if="errors.name" class="field__error" role="alert">{{ errors.name }}</span>
                </div>
                <div class="field">
                  <label class="field__label" for="sf-email">E-mail</label>
                  <input id="sf-email" v-model="form.email" class="field__input" :class="{ 'field__input--error': errors.email }" type="email" autocomplete="email" />
                  <span v-if="errors.email" class="field__error" role="alert">{{ errors.email }}</span>
                  <span class="field__hint">Tu wyślemy potwierdzenie.</span>
                </div>
                <div class="field">
                  <label class="field__label" for="sf-msg">Wiadomość (opcjonalnie)</label>
                  <textarea id="sf-msg" v-model="form.message" class="field__textarea" rows="3" placeholder="Pytania, doświadczenie, dieta…" />
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
            <h4>Na tej stronie</h4>
            <ul>
              <li><a @click.prevent="jump('lista')">Nadchodzące terminy</a></li>
              <li><a @click.prevent="jump('archiwum')">Minione warsztaty</a></li>
              <li><a @click.prevent="jump('faq')">FAQ</a></li>
              <li><a @click.prevent="jump('zapisy')">Zapisy</a></li>
            </ul>
          </div>
          <div>
            <h4>DRWA</h4>
            <ul>
              <li><NuxtLink to="/">Strona główna</NuxtLink></li>
              <li><NuxtLink to="/">Kursy online</NuxtLink></li>
              <li><NuxtLink to="/o-nas">O nas</NuxtLink></li>
              <li><NuxtLink to="/blog">Blog</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li><a href="mailto:czesc@drwa.pl">czesc@drwa.pl</a></li>
              <li><a href="tel:+48600100200">+48 600 100 200</a></li>
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { formatPrice, formatDateRange, stripHtml, workshopSpots } from '~/utils/format'

useHead({
  title: 'Warsztaty 2026 — DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const { data } = await useProducts('workshop')

const FALLBACK_IMGS = ['/assets/forest-1.png', '/assets/timber-2.png', '/assets/forest-3.png']

const workshops = computed(() =>
  (data.value?.products ?? []).map((p, i) => {
    const dates = p.date_start && p.date_end
      ? formatDateRange(p.date_start, p.date_end)
      : { day: '—', month: '—', year: '—' }

    const days = p.date_start && p.date_end
      ? (() => {
          const diff = Math.round(
            (new Date(p.date_end).getTime() - new Date(p.date_start).getTime())
            / (1000 * 60 * 60 * 24)
          ) + 1
          return `${diff} ${diff === 1 ? 'dzień' : 'dni'}`
        })()
      : '—'

    const spots = workshopSpots(p.spots_total, p.spots_booked)

    return {
      id: p.id,
      raw: p,
      title: p.title,
      route: p.slug ? `/warsztaty/${p.slug}` : null,
      day: dates.day,
      month: dates.month,
      year: dates.year,
      days,
      level: 'podstawowy',
      price: formatPrice(p.price),
      spotsLabel: spots.label,
      spotsTone: spots.tone,
      place: p.location ?? 'Stolarnia pod lasem · Beskid Niski',
      lead: 'prowadzi Jędrzej Cyganik',
      rawImage: p.image,
      img: FALLBACK_IMGS[i % FALLBACK_IMGS.length],
      pos: '50% 50%',
      desc: stripHtml(p.description, 180),
    }
  })
)

const PAST = [
  { date: '10–12 kwietnia 2026',    title: 'Budowanie stolarni' },
  { date: '17–19 października 2025', title: 'Budowanie małego domku' },
  { date: '22–24 sierpnia 2025',    title: 'Budowanie sauny' },
  { date: '13–15 czerwca 2025',     title: 'Budowanie wiaty' },
  { date: '9–11 maja 2025',         title: 'Budowanie altany' },
]

const FAQ = [
  {
    q: 'Czy muszę mieć doświadczenie?',
    a: 'Nie. Większość uczestników zaczyna od zera — warsztaty podstawowe prowadzimy od pierwszego cięcia. Przy poziomie średnim przyda się jeden warsztat za sobą albo trochę pracy z drewnem na własną rękę.',
  },
  {
    q: 'Czy potrzebuję własnych narzędzi?',
    a: 'Nie — wszystkie narzędzia i materiały są w cenie. Jeśli masz swoje dłuto czy piłę, którą lubisz, śmiało przywieź; chętnie popracujemy na twoim.',
  },
  {
    q: 'Co z noclegiem i wyżywieniem?',
    a: 'Obiady przy ognisku są w cenie warsztatu. Noclegi organizujesz we własnym zakresie — po zapisie wyślemy listę sprawdzonych miejsc w okolicy, od pola namiotowego po agroturystykę.',
  },
  {
    q: 'Co, jeśli będzie padać?',
    a: 'Pracujemy niezależnie od pogody — większość zajęć odbywa się pod zadaszeniem stolarni. Weź ubranie robocze i buty, które mogą się ubrudzić.',
  },
]

const openFaq = ref<number | null>(0)
const form = reactive({
  workshopId: workshops.value[0]?.id ?? null as number | null,
  name: '', email: '', message: '', newsletter: false,
})
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

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.io').forEach(el => el.classList.add('io--in'))
    return
  }
  observer = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('io--in'); observer!.unobserve(en.target) }
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
  document.querySelectorAll('.io:not(.io--in)').forEach(el => observer!.observe(el))
})

onUnmounted(() => { if (observer) observer.disconnect() })
</script>
