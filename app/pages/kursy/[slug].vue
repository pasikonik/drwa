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
const materials = course?.materials ?? []
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
