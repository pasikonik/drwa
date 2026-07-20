<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Nagłówek strony ===== -->
    <div class="pagehead">
      <div class="container">
        <span class="eyebrow eyebrow--ondark">Blog · Z lasu</span>
        <h1>Notatki zza warsztatu</h1>
        <p>O pracy z drewnem, naturalnym budownictwie i ludziach, których spotykamy przy wspólnym stole. Pisane powoli, jak schnie dobre drewno.</p>
      </div>
    </div>

    <main id="main-content" class="container">
      <!-- Filtry kategorii -->
      <div class="bfilters io">
        <div class="bfilters__tags" role="group" aria-label="Filtruj wpisy">
          <button
            v-for="c in CATS"
            :key="c"
            class="drwa-tag drwa-tag--interactive"
            :class="{ 'drwa-tag--active': cat === c }"
            @click="cat = c"
          >{{ c }}</button>
        </div>
        <span class="bfilters__count">{{ count }} {{ countLabel }}</span>
      </div>

      <!-- Wpis wyróżniony -->
      <NuxtLink v-if="featured" class="band io" :to="`/blog/${featured.slug}`">
        <div class="band__bg">
          <DrwaImg :src="featured.featured_image" :alt="featured.title" preset="hero" priority fallback="/assets/mist-hero.avif" />
        </div>
        <div class="band__scrim" />
        <div class="band__inner">
          <span class="eyebrow band__eyebrow">
            <template v-if="featured.category">{{ featured.category }} · </template>{{ readTime(featured.content) }}
          </span>
          <h2>{{ featured.title }}</h2>
          <p>{{ stripHtml(featured.content, 200) }}</p>
          <span class="btn btn--on-dark btn--md">
            Czytaj artykuł
            <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </NuxtLink>

      <!-- Siatka wpisów -->
      <section class="section--tight" style="padding-top: 0">
        <div class="bgrid">
          <NuxtLink v-for="a in list" :key="a.id" class="drwa-pcard io" :to="`/blog/${a.slug}`">
            <div class="drwa-pcard__media">
              <DrwaImg :src="a.featured_image" :alt="a.title" preset="card" fallback="/assets/forest-1.avif" />
            </div>
            <div class="drwa-pcard__body">
              <span class="drwa-pcard__eyebrow"><template v-if="a.category">{{ a.category }} · </template>{{ readTime(a.content, true) }}</span>
              <h3 class="drwa-pcard__title">{{ a.title }}</h3>
              <p class="drwa-pcard__desc">{{ stripHtml(a.content, 140) }}</p>
              <div class="drwa-pcard__foot">
                <span class="drwa-pcard__meta">{{ formatDate(a.publish_date) }}</span>
                <span class="bcard__go">
                  Czytaj
                  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>
    </main>

    <!-- ===== Newsletter ===== -->
    <section class="section container" style="padding-top: 0">
      <div class="news io">
        <span class="eyebrow eyebrow--ondark">Newsletter</span>
        <h2>Listy z lasu</h2>
        <p>Nowe wpisy, terminy warsztatów i krótkie historie zza warsztatu — raz w miesiącu, bez spamu.</p>
        <p v-if="sent" class="news__sent">Dziękujemy — do zobaczenia w lesie.</p>
        <form v-else class="news__form" @submit.prevent="subscribe">
          <input v-model="email" type="email" required placeholder="twój@email.pl" aria-label="E-mail" />
          <button class="btn btn--accent btn--md" type="submit">Zapisz się</button>
        </form>
      </div>
    </section>

    <!-- ===== Stopka ===== -->
    <DrwaFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { formatDate, stripHtml, readTime } from '~/utils/format'

useHead({
  title: 'Blog · Z lasu — DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const { data } = await useBlogPosts()

const allPosts = computed(() => data.value ?? [])

// Kategorie pobrane z realnych wpisów (unikalne, w kolejności pojawienia się)
const categories = computed(() => {
  const seen = new Set<string>()
  for (const p of allPosts.value) {
    if (p.category) seen.add(p.category)
  }
  return Array.from(seen)
})
const CATS = computed(() => ['Wszystkie', ...categories.value])

const cat = ref('Wszystkie')

// Wpisy pasujące do wybranej kategorii
const filtered = computed(() =>
  cat.value === 'Wszystkie'
    ? allPosts.value
    : allPosts.value.filter(p => p.category === cat.value)
)

// Najnowszy wpis jako wyróżniony — pokazujemy go nad siatką, gdy pasuje do filtra
const featured = computed(() => filtered.value[0] ?? null)
const list = computed(() => filtered.value.slice(1))

const count = computed(() => filtered.value.length)
const countLabel = computed(() => {
  if (count.value === 1) return 'wpis'
  if (count.value >= 2 && count.value <= 4) return 'wpisy'
  return 'wpisów'
})

const email = ref('')
const sent = ref(false)

function subscribe() {
  if (email.value.trim()) sent.value = true
}

const { reobserve } = useScrollReveal()

// Zmiana filtra tworzy nowe elementy .io — trzeba je dopiąć do obserwatora
watch(cat, () => nextTick(reobserve))
</script>
