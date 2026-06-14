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
          <NuxtLink class="nav__link nav__item" to="/">Strona główna</NuxtLink>
          <NuxtLink class="nav__link nav__item" to="/warsztaty">Warsztaty 2026</NuxtLink>
          <a class="nav__link nav__item" href="/#kursy">Kursy online</a>
          <NuxtLink class="nav__link nav__item" to="/o-nas">O nas</NuxtLink>
          <a class="nav__link nav__item nav__link--current" href="#">Sklep</a>
          <NuxtLink class="nav__link nav__item" to="/blog">Blog</NuxtLink>
          <NuxtLink class="nav__link nav__item" to="/kontakt">Kontakt</NuxtLink>
        </nav>
        <div class="nav__spacer" />
        <div class="nav__actions">
          <button class="cartbtn nav__link" aria-label="Koszyk">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Koszyk
            <span v-if="cartCount > 0" class="cartbtn__count">{{ cartCount }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- ===== Hero ===== -->
    <section class="shop-hero">
      <div class="shop-hero__bg">
        <img src="/assets/forest-band.png" alt="Las świerkowy we mgle" />
      </div>
      <div class="shop-hero__scrim" />
      <div class="container">
        <div class="shop-hero__inner io">
          <span class="eyebrow eyebrow--ondark">Sklep · Merch DRWA</span>
          <h1>Noś las ze sobą.</h1>
          <p>Bluzy i koszulki z naszej stolarni — bawełna organiczna, spokojne kolory lasu i znak DRWA. Garść rzeczy, które naprawdę nosimy na warsztatach.</p>
        </div>
      </div>
    </section>

    <main>
      <section class="shop">
        <div class="container">
          <!-- Pasek filtrów -->
          <div class="shop__bar io">
            <span class="shop__count">{{ products.length }} {{ products.length === 1 ? 'produkt' : 'produktów' }}</span>
          </div>

          <!-- Siatka produktów -->
          <div class="mgrid">
            <article
              v-for="p in products"
              :key="p.id"
              class="mcard io"
            >
              <div class="mcard__media">
                <img v-if="assetUrl(p.image)" class="mcard__img" :src="assetUrl(p.image) || ''" :alt="p.title" />
                <div v-else class="mcard__placeholder">
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="m21 15-5-5L5 21"/>
                  </svg>
                  <span>Merch DRWA</span>
                </div>
                <NuxtLink class="mcard__cover" :to="`/sklep/${p.id}`" :aria-label="'Zobacz: ' + p.title" />
              </div>
              <div class="mcard__body">
                <span class="mcard__eyebrow">{{ productEyebrow(p.title) }}</span>
                <h3 class="mcard__title">
                  <NuxtLink class="mcard__link" :to="`/sklep/${p.id}`">{{ p.title }}</NuxtLink>
                </h3>
                <p class="mcard__desc">{{ stripHtml(p.description) }}</p>
                <div class="sizes" role="group" :aria-label="'Rozmiar · ' + p.title">
                  <button
                    v-for="s in availableSizes(p.id)"
                    :key="s"
                    class="size"
                    :class="{ 'is-on': sizes[p.id] === s }"
                    @click="sizes[p.id] = sizes[p.id] === s ? null : s"
                  >{{ s }}</button>
                </div>
                <div class="mcard__foot">
                  <span class="mcard__price">{{ formatPrice(p.price) }}</span>
                  <button class="btn btn--secondary btn--sm" @click="addToCart(p)">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                      <path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    Do koszyka
                  </button>
                </div>
              </div>
            </article>
          </div>

          <!-- Pasek zapewnień -->
          <div class="assur io">
            <div v-for="a in ASSUR" :key="a.title" class="assur__item">
              <div class="assur__ic" aria-hidden="true">
                <component :is="a.icon" />
              </div>
              <div>
                <p class="assur__t">{{ a.title }}</p>
                <p class="assur__d">{{ a.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

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
            <h4>Sklep</h4>
            <ul>
              <li><NuxtLink to="/sklep">Wszystkie produkty</NuxtLink></li>
              <li><NuxtLink to="/kontakt">Wysyłka i zwroty</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4>DRWA</h4>
            <ul>
              <li><NuxtLink to="/warsztaty">Warsztaty 2026</NuxtLink></li>
              <li><a href="/#kursy">Kursy online</a></li>
              <li><NuxtLink to="/o-nas">O nas</NuxtLink></li>
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

    <!-- ===== Toast ===== -->
    <div class="toast" :class="{ 'is-on': toast.on }" role="status" aria-live="polite">
      <svg class="toast__check" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5"/>
      </svg>
      <span>{{ toast.msg }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { formatPrice, stripHtml } from '~/utils/format'

useHead({
  title: 'Sklep DRWA — Merch z lasu',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const { assetUrl } = useDirectus()
const { data } = await useProducts('merch')

const products = computed(() => data.value?.products ?? [])
const variants = computed(() => data.value?.variants ?? [])

const SIZES_ORDER = ['S', 'M', 'L', 'XL']

function availableSizes(productId: number): string[] {
  const vs = variants.value.filter(v => v.product_id === productId)
  if (!vs.length) return SIZES_ORDER
  return vs
    .map(v => v.size?.toUpperCase())
    .filter((s): s is string => !!s)
    .sort((a, b) => SIZES_ORDER.indexOf(a) - SIZES_ORDER.indexOf(b))
}

function productEyebrow(title: string): string {
  if (/bluza/i.test(title)) return 'Bluza'
  if (/koszulka/i.test(title)) return 'Koszulka'
  return 'Merch DRWA'
}

const ASSUR = [
  {
    title: 'Wysyłka w 48 h',
    desc: 'Pakujemy w papier, bez plastiku. Kurier lub paczkomat w całej Polsce.',
    icon: defineComponent({
      render: () => h('svg', { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
        h('path', { d: 'M5 18H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11v12' }),
        h('path', { d: 'M14 9h4l4 4v3h-8V9Z' }),
        h('circle', { cx: '7', cy: '18', r: '2' }),
        h('circle', { cx: '17', cy: '18', r: '2' }),
      ]),
    }),
  },
  {
    title: 'Bawełna organiczna',
    desc: 'Tkaniny z certyfikowanych, odpowiedzialnych źródeł. Druk wodny.',
    icon: defineComponent({
      render: () => h('svg', { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
        h('path', { d: 'M7 20h10' }),
        h('path', { d: 'M10 20c5.5-2.5.8-6.4 3-10' }),
        h('path', { d: 'M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4.4 5.5.8z' }),
        h('path', { d: 'M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z' }),
      ]),
    }),
  },
  {
    title: 'Wspiera warsztaty',
    desc: 'Część dochodu z merchu zasila wspólne warsztaty i sadzenie drzew.',
    icon: defineComponent({
      render: () => h('svg', { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
        h('path', { d: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z' }),
        h('path', { d: 'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' }),
      ]),
    }),
  },
]

const sizes = reactive<Record<number, string | null>>({})
const cartCount = ref(0)
const toast = reactive({ on: false, msg: '' })
let toastTimer: ReturnType<typeof setTimeout> | null = null

function addToCart(p: { id: number; title: string }) {
  cartCount.value++
  const size = sizes[p.id]
  const tag = size ? ` (rozm. ${size})` : ''
  toast.msg = `Dodano: ${p.title}${tag}`
  toast.on = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.on = false }, 2600)
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

onUnmounted(() => {
  if (observer) observer.disconnect()
  if (toastTimer) clearTimeout(toastTimer)
})
</script>
