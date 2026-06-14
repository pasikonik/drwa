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
          <NuxtLink class="nav__link nav__item" to="/warsztaty">Warsztaty stacjonarne</NuxtLink>
          <a class="nav__link nav__item" href="/#kursy">Kursy online</a>
          <NuxtLink class="nav__link nav__item" to="/o-nas">O nas</NuxtLink>
          <NuxtLink class="nav__link nav__item" to="/sklep">Sklep</NuxtLink>
          <a class="nav__link nav__item nav__link--current" href="#">Blog</a>
          <NuxtLink class="nav__link nav__item" to="/kontakt">Kontakt</NuxtLink>
        </nav>
        <div class="nav__spacer" />
        <div class="nav__actions">
          <NuxtLink class="btn btn--primary btn--sm" to="/warsztaty">Zapisz się</NuxtLink>
        </div>
      </div>
    </header>

    <!-- ===== Nagłówek strony ===== -->
    <div class="pagehead">
      <div class="container">
        <span class="eyebrow eyebrow--ondark">Blog · Z lasu</span>
        <h1>Notatki zza warsztatu</h1>
        <p>O pracy z drewnem, naturalnym budownictwie i ludziach, których spotykamy przy wspólnym stole. Pisane powoli, jak schnie dobre drewno.</p>
      </div>
    </div>

    <main class="container">
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
          <DrwaImg :src="featured.featured_image" :alt="featured.title" preset="hero" priority fallback="/assets/mist-hero.png" />
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
              <DrwaImg :src="a.featured_image" :alt="a.title" preset="card" fallback="/assets/forest-1.png" />
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
    <footer class="foot">
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
            <h4>Blog</h4>
            <ul>
              <li><NuxtLink to="/blog">Wszystkie wpisy</NuxtLink></li>
              <li><NuxtLink to="/blog/dlaczego-budujemy-z-drewna">Dlaczego budujemy z drewna</NuxtLink></li>
              <li><NuxtLink to="/kontakt">Napisz do nas</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4>DRWA</h4>
            <ul>
              <li><NuxtLink to="/warsztaty">Warsztaty 2026</NuxtLink></li>
              <li><a href="/#kursy">Kursy online</a></li>
              <li><NuxtLink to="/o-nas">O nas</NuxtLink></li>
              <li><NuxtLink to="/sklep">Sklep · Merch</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li><a href="mailto:czesc@drwa.pl">czesc@drwa.pl</a></li>
              <li><a href="tel:+48600100200">+48 600 100 200</a></li>
              <li><NuxtLink to="/">Strona główna</NuxtLink></li>
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
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
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

let observer: IntersectionObserver | null = null

function observeIo() {
  const els = document.querySelectorAll('.io:not(.io--in)')
  if (!observer) {
    els.forEach(el => el.classList.add('io--in'))
    return
  }
  els.forEach(el => observer!.observe(el))
}

onMounted(() => {
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('io--in'); observer!.unobserve(en.target) }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
  }
  observeIo()
})

// Zmiana filtra tworzy nowe elementy .io — trzeba je dopiąć do obserwatora
watch(cat, () => nextTick(observeIo))

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>
