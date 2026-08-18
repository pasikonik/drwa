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
      <div v-if="hasPosts" class="bfilters io">
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

      <!-- Brak wpisów: nieudany odczyt vs. pusty blog -->
      <div v-if="loadFailed" class="blist-empty io">
        <svg class="blist-empty__icon" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>
        </svg>
        <h2 class="blist-empty__title">Nie udało się wczytać wpisów</h2>
        <p class="blist-empty__text">Coś nie zadziałało po naszej stronie — wpisy są, tylko chwilowo do nas nie dotarły.</p>
        <button type="button" class="btn btn--primary btn--md" :disabled="retrying" @click="refresh()">
          {{ retrying ? 'Wczytuję…' : 'Spróbuj ponownie' }}
        </button>
      </div>
      <div v-else-if="!hasPosts" class="blist-empty io">
        <svg class="blist-empty__icon" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>
        </svg>
        <h2 class="blist-empty__title">Pierwsze wpisy niedługo się pojawią</h2>
        <p class="blist-empty__text">Piszemy je powoli, jak schnie dobre drewno. Zajrzyj tu wkrótce albo zapisz się na newsletter — damy znać, gdy tylko coś wyjdzie z warsztatu.</p>
      </div>

      <!-- Siatka wpisów -->
      <section v-if="list.length" class="section--tight" style="padding-top: 0">
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
})

const { data, error, status, refresh } = await useBlogPosts()

const allPosts = computed(() => data.value ?? [])
const hasPosts = computed(() => allPosts.value.length > 0)

// Nieudany odczyt zostawia `data` na domyślnej pustej liście — nie wolno tego
// pokazać jako „bloga bez wpisów". Composable ponawia raz po hydracji;
// `retrying` obejmuje to okno oraz ręczne kliknięcie „Spróbuj ponownie".
const loadFailed = computed(() => !!error.value && !hasPosts.value)
const retrying = computed(() => status.value === 'pending')

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

// Zmiana filtra oraz wpisy doczytane po hydracji tworzą nowe elementy .io —
// trzeba je dopiąć do obserwatora, inaczej zostaną niewidoczne.
watch([cat, allPosts], () => nextTick(reobserve))
</script>
