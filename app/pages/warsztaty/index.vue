<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <section class="phero" id="top">
      <div class="phero__bg">
        <img src="/assets/warsztaty-band.avif" alt="Grupa uczestników przy stole warsztatowym w stolarni" />
      </div>
      <div class="phero__scrim" />
      <div class="container phero__inner">
        <span class="eyebrow eyebrow--ondark">STACJONARNIE</span>
        <h1>Warsztaty {{ currentYear }}</h1>
        <p class="phero__lead">Kilka dni wspólnej pracy przy realnym drewnie — w małej grupie, pod okiem cieśli i przy ognisku. Sprawdź terminy i zajmij miejsce.</p>
      </div>
    </section>

    <main id="main-content">
      <!-- ===== Nadchodzące terminy ===== -->
      <section class="section container" id="lista">
        <div class="sec-head io">
          <span class="eyebrow">Nadchodzące terminy</span>
          <h2>Trzy warsztaty, trzy konstrukcje</h2>
          <p>Każdy warsztat to jeden realny budynek — od przygotowania drewna po gotową konstrukcję. Pracujemy w grupach do dziesięciu osób.</p>
        </div>
        <div v-if="upcomingWorkshops.length" class="wlist">
          <article v-for="w in upcomingWorkshops" :key="w.id" class="wrow io">
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
                <span class="wrow__price">
                  {{ w.price }}<small>{{ w.advance ? `od osoby · zaliczka ${w.advance}` : 'od osoby' }}</small>
                </span>
                <NuxtLink v-if="w.route" :to="w.route" class="btn btn--primary btn--md">Szczegóły i zapisy</NuxtLink>
              </div>
            </div>
            <div class="wrow__img">
              <DrwaImg :src="w.rawImage" :alt="w.title" preset="hero" :img-style="{ objectPosition: w.pos }" :fallback="w.img" />
            </div>
          </article>
        </div>
        <div v-else-if="loadFailed" class="wlist-empty io">
          <svg class="wlist-empty__icon" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>
          </svg>
          <h3 class="wlist-empty__title">Nie udało się wczytać terminów</h3>
          <p class="wlist-empty__text">Coś nie zadziałało po naszej stronie — terminy są, tylko chwilowo do nas nie dotarły.</p>
          <button type="button" class="btn btn--primary btn--md" :disabled="retrying" @click="refresh()">
            {{ retrying ? 'Wczytuję…' : 'Spróbuj ponownie' }}
          </button>
        </div>
        <div v-else class="wlist-empty io">
          <svg class="wlist-empty__icon" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>
          </svg>
          <h3 class="wlist-empty__title">Aktualnie nie mamy zaplanowanych terminów</h3>
          <p class="wlist-empty__text">Pracujemy nad kolejnym sezonem warsztatów. Zajrzyj tu wkrótce — nowe daty pojawią się niebawem.</p>
        </div>
      </section>

      <!-- ===== Info strip ===== -->
      <section class="strip" id="informacje">
        <div class="strip__grid">
          <div class="io">
            <span class="eyebrow eyebrow--ondark">Co w cenie</span>
            <h3>Przyjedź z pustymi rękami, wróć z nowymi umiejętnościami</h3>
            <ul class="strip__list">
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                Ok. 6h praktyki i 3h teorii dziennie — blisko 50h w ciągu tygodnia
              </li>
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                Prowadzenie przez cały proces budowy obiektu, od A do Z
              </li>
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                Zakwaterowanie i pełne wyżywienie
              </li>
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                Narzędzia, materiały i w pełni wyposażona stolarnia
              </li>
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                Kameralna grupa i kilku prowadzących
              </li>
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                Notatki, prezentacje i materiały edukacyjne po warsztacie
              </li>
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                Włączenie do społeczności Drew — wsparcie, wydarzenia zamknięte, zniżki na warsztaty i w sklepie dluta.pl
              </li>
            </ul>
          </div>
          <div class="io">
            <span class="eyebrow eyebrow--ondark">Dla kogo</span>
            <h3>Dla nowicjuszy, hobbystów i tych, którzy nigdy nie przestają się uczyć</h3>
            <p>Tak jak my! Budowanie z drewna to cały wszechświat, w którym wciąż odkrywamy nowe planety i kontynenty.</p>
            <p>Każdy projekt jest inny — podczas każdego warsztatu uczymy się czegoś nowego. Osoby początkujące i te bardziej doświadczone znajdują swoje miejsce w grupie i rozwijają rzemiosło według własnych możliwości, a dba o to kadra instruktorska.</p>
            <p>Jedyny warunek uczestnictwa to <strong>chęć pracy własnymi rękami</strong> i bliskiego spotkania z drewnem. Warsztaty kierujemy do osób pełnoletnich — niepełnoletni mogą wziąć udział pod opieką rodziców.</p>
          </div>
        </div>
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

      <!-- ===== Archiwum ===== -->
      <section v-if="pastWorkshops.length" class="section container" id="archiwum">
        <div class="sec-head io">
          <span class="eyebrow">Archiwum</span>
          <h2>Minione warsztaty</h2>
          <p>Te konstrukcje i przedmioty już służą ludziom, a na podwórkach absolwentów powstają kolejne.</p>
        </div>
        <ul class="arch io">
          <li v-for="p in pastWorkshops" :key="p.id" class="arch__row">
            <span class="arch__date">{{ p.dateLabel }}</span>
            <span class="arch__title">
              <NuxtLink v-if="p.route" :to="p.route">{{ p.title }}</NuxtLink>
              <template v-else>{{ p.title }}</template>
            </span>
            <span class="arch__done">Zakończony</span>
          </li>
        </ul>
      </section>

      <!-- ===== Zapisy ===== -->
      <section v-if="upcomingWorkshops.length" class="signup-sec" id="zapisy">
        <div class="signup">
          <div class="signup__intro io">
            <span class="eyebrow">Zapisy</span>
            <h2 class="signup__heading">Dołącz do warsztatu</h2>
            <p>Wyślij zgłoszenie, a w ciągu dwóch dni odezwiemy się z potwierdzeniem miejsca i szczegółami dojazdu. Miejsce rezerwuje zaliczka.</p>
            <div class="signup__contact">
              <a href="mailto:warsztaty@drwa.pl">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                warsztaty@drwa.pl
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
                <input
                  v-model="form.website"
                  type="text"
                  name="website"
                  tabindex="-1"
                  autocomplete="off"
                  class="signup__hp"
                  aria-hidden="true"
                />
                <div class="field">
                  <label class="field__label" for="sf-workshop">Warsztat</label>
                  <select id="sf-workshop" v-model="form.workshopId" class="field__select">
                    <option v-for="w in upcomingWorkshops" :key="w.id" :value="w.id">
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
                <p v-if="errorMessage" class="signup__error">{{ errorMessage }}</p>
                <div class="signup__actions">
                  <button type="submit" class="btn btn--primary btn--lg" :disabled="sending">
                    {{ sending ? 'Wysyłanie…' : 'Wyślij zgłoszenie' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- ===== Stopka ===== -->
    <DrwaFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { formatPrice, formatDateRange, stripHtml, workshopSpots } from '~/utils/format'
import { isWorkshopPast } from '~/utils/product'
import type { WorkshopInstructor } from '~/types/directus'

function instructorLead(instructors?: WorkshopInstructor[]): string {
  const names = (instructors ?? []).map(j => j.instructors_id?.name).filter(Boolean)
  if (!names.length) return 'prowadzi DRWA'
  return `prowadzi ${names.join(', ')}`
}

const LEVEL_LABEL: Record<string, string> = {
  beginner: 'podstawowy',
  intermediate: 'średni',
  advanced: 'zaawansowany',
}

const levelLabelOf = (level: string | null) =>
  (level && LEVEL_LABEL[level.toLowerCase()]) || 'podstawowy'

const currentYear = new Date().getFullYear()

useHead({
  title: `Warsztaty ${currentYear} — DRWA`,
})

const { data, error, refresh, status } = await useProducts('workshop')

const FALLBACK_IMGS = ['/assets/forest-1.avif', '/assets/timber-2.avif', '/assets/forest-3.avif']

const workshops = computed(() =>
  (data.value?.products ?? []).map((p, i) => {
    const w = p.workshop
    const dates = w?.date_start && w?.date_end
      ? formatDateRange(w.date_start, w.date_end)
      : { day: '—', month: '—', year: '—' }

    const days = w?.date_start && w?.date_end
      ? (() => {
          const diff = Math.round(
            (new Date(w.date_end).getTime() - new Date(w.date_start).getTime())
            / (1000 * 60 * 60 * 24)
          ) + 1
          return `${diff} ${diff === 1 ? 'dzień' : 'dni'}`
        })()
      : '—'

    const spots = workshopSpots(w?.spots_total ?? null, w?.spots_booked ?? null)

    return {
      id: p.id,
      raw: p,
      isPast: isWorkshopPast(w),
      title: p.title,
      slug: p.slug ?? String(p.id),
      route: `/warsztaty/${p.slug ?? p.id}`,
      day: dates.day,
      month: dates.month,
      year: dates.year,
      dateLabel: dates.year === '—' ? '—' : `${dates.day} ${dates.month} ${dates.year}`,
      days,
      level: levelLabelOf(w?.level ?? null),
      price: formatPrice(p.price),
      advance: w?.advance != null ? formatPrice(Number(w.advance)) : null,
      spotsLabel: spots.label,
      spotsTone: spots.tone,
      place: w?.location ?? 'Dolina Harmonii · Kopaniec, Góry Izerskie',
      lead: instructorLead(w?.instructors),
      rawImage: p.image,
      img: FALLBACK_IMGS[i % FALLBACK_IMGS.length],
      pos: '50% 50%',
      desc: p.short_description ?? stripHtml(p.description, 180),
    }
  })
)

const upcomingWorkshops = computed(() => workshops.value.filter((w) => !w.isPast))
const pastWorkshops = computed(() => workshops.value.filter((w) => w.isPast))

// A failed Directus read leaves `data` at its empty default, which must never be
// presented as "no workshops planned" — that is a lie about the offer. The
// composable retries once after hydration; `retrying` covers that window.
const loadFailed = computed(() => !!error.value && !workshops.value.length)
const retrying = computed(() => status.value === 'pending')

const FAQ = [
  {
    q: 'Gdzie odbywają się warsztaty?',
    a: 'Większość warsztatów odbywa się w naszym siedlisku w Górach Izerskich, w Kopańcu koło Jeleniej Góry. Organizujemy też warsztaty w innych lokalizacjach — sprawdź aktualne terminy w sekcji powyżej.',
  },
  {
    q: 'Ile trwają warsztaty stacjonarne?',
    a: 'Zależnie od terminu najczęściej organizujemy warsztaty tygodniowe, ale zdarzają się też krótsze — 4, 5 i 6-dniowe.',
  },
  {
    q: 'Jak wygląda zakwaterowanie i wyżywienie?',
    a: 'Zakwaterowanie zależy od miejsca — w naszym siedlisku mamy komfortowe pokoje dwu- i trzyosobowe z łazienkami. Zapewniamy pełne wyżywienie, 3 posiłki dziennie. Z zasady gotujemy wegetariańsko, pysznie i wystarczająco pożywnie, by nasycić mięsożerców.',
  },
  {
    q: 'Jak zarezerwować miejsce?',
    a: 'Wypełnij formularz zgłoszeniowy, który znajdziesz w opisie odpowiedniego warsztatu. W odpowiedzi na formularz otrzymasz email z danymi do zaliczki, której wpłata stanowi o rezerwacji miejsca na warsztatach.',
  },
  {
    q: 'Czy potrzebuję mieć jakieś doświadczenie?',
    a: 'Nie. Na każdy warsztat można przyjechać bez żadnego doświadczenia — wiemy, jak przekazywać wiedzę i budować z osobami, które robią to po raz pierwszy. Każdy może bezpiecznie i skutecznie nauczyć się tworzyć rzeczy z drewna.',
  },
  {
    q: 'Czy potrzebuję mieć swoje narzędzia?',
    a: 'Nie musisz nic zabierać — mamy w pełni wyposażoną stolarnię. Jeśli masz swoje narzędzia ręczne, wkrętarkę czy pilarkę, śmiało przywieź; ułatwią pracę Tobie i innym.',
  },
  {
    q: 'Czy zrobicie taki warsztat u mnie?',
    a: 'Warsztaty wyjazdowe organizujemy tylko dla organizacji społecznych oraz dla naszych absolwentów. Jeśli chcesz zorganizować coś takiego u siebie, poznajmy się najpierw na naszych warsztatach.',
  },
  {
    q: 'To jak, mam coś komuś zbudować i jeszcze za to zapłacić?',
    a: 'Dokładnie tak :) Tylko poprzez realną praktykę można nauczyć się samodzielnie tworzyć z drewna, a dzięki tej nauce powstaje użyteczny, służący ludziom obiekt. W ramach wymiany za wykonaną pracę gospodarze warsztatu pokrywają część kosztów zakwaterowania i wyżywienia — dzięki temu cały warsztat jest tańszy dla uczestników (obniżka jest już wliczona w podane ceny).',
  },
  {
    q: 'Czy mogę przyjechać z dzieckiem, z psem, z osobą towarzyszącą?',
    a: 'W większości przypadków zdecydowanie tak. Szczegóły ustalamy indywidualnie, zależnie od miejsca i charakteru warsztatu.',
  },
]

const openFaq = ref<number | null>(0)
const form = reactive({
  workshopId: upcomingWorkshops.value[0]?.id ?? null as number | null,
  name: '', email: '', message: '', newsletter: false, website: '',
})
const errors = reactive({ name: '', email: '' })
const sent = ref(false)
const sending = ref(false)
const errorMessage = ref('')

const selectedWorkshop = computed(() =>
  upcomingWorkshops.value.find((w) => w.id === form.workshopId) ?? null
)

// Data can land after setup (client-side recovery from a failed SSR fetch), so
// the select would otherwise stay on its initial empty value.
watch(upcomingWorkshops, (list) => {
  if (form.workshopId == null) form.workshopId = list[0]?.id ?? null
})

async function submit() {
  errors.name = form.name.trim() ? '' : 'Podaj imię i nazwisko.'
  errors.email = form.email.trim() && form.email.includes('@') ? '' : 'Podaj poprawny adres e-mail.'
  if (errors.name || errors.email) return

  errorMessage.value = ''
  sending.value = true
  try {
    await $fetch('/api/warsztaty-signup', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        message: form.message,
        workshopTitle: selectedWorkshop.value?.title,
        workshopSlug: selectedWorkshop.value?.slug,
        website: form.website,
      },
    })
    if (form.newsletter) {
      $fetch('/api/newsletter', { method: 'POST', body: { email: form.email } }).catch(() => {})
    }
    sent.value = true
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || 'Nie udało się wysłać zgłoszenia, spróbuj ponownie lub napisz na warsztaty@drwa.pl.'
  } finally {
    sending.value = false
  }
}

const { reobserve } = useScrollReveal()

// Rows rendered after mount are not observed yet and would stay at opacity: 0.
watch(() => workshops.value.length, () => nextTick(reobserve))
</script>
