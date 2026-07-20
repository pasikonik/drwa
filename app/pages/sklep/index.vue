<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <section class="shop-hero">
      <div class="shop-hero__bg">
        <img src="/assets/forest-band.avif" alt="Las świerkowy we mgle" />
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

    <main id="main-content">
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
                <DrwaImg v-if="p.image" :src="p.image" :alt="p.title" preset="card" img-class="mcard__img" />
                <div v-else class="mcard__placeholder">
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="m21 15-5-5L5 21"/>
                  </svg>
                  <span>Merch DRWA</span>
                </div>
                <NuxtLink class="mcard__cover" :to="`/sklep/${p.slug}`" :aria-label="'Zobacz: ' + p.title" />
              </div>
              <div class="mcard__body">
                <span class="mcard__eyebrow">{{ productEyebrow(p.title) }}</span>
                <h3 class="mcard__title">
                  <NuxtLink class="mcard__link" :to="`/sklep/${p.slug}`">{{ p.title }}</NuxtLink>
                </h3>
                <p class="mcard__desc">{{ stripHtml(p.description) }}</p>
                <div class="sizes" role="group" :aria-label="'Rozmiar · ' + p.title">
                  <button
                    v-for="s in availableSizes(p.id)"
                    :key="s"
                    class="size"
                    :class="{ 'is-on': sizes[p.id] === s }"
                    @click="sizes[p.id] = s"
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
    <DrwaFooter />

  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { formatPrice, stripHtml } from '~/utils/format'
import { fileId } from '~/utils/directus'
import type { Product } from '~/types/directus'

useHead({
  title: 'Sklep DRWA — Merch z lasu',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

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

// Auto-select first available size so the button is always ready
products.value.forEach(p => {
  const available = availableSizes(p.id)
  sizes[p.id] = available.includes('M') ? 'M' : available[0] ?? null
})
const { addProduct } = useCart()
const { showToast } = useCartToast()

function addToCart(p: Product) {
  const sizeSel = sizes[p.id]
  const vs = variants.value.filter(v => v.product_id === p.id)
  const variant = sizeSel ? vs.find(v => v.size?.toUpperCase() === sizeSel) ?? null : null
  // Don't add a sized product without a resolvable variant (avoids a cart line
  // with variantId: null and maxQty 0 that the qty cap would silently allow).
  if (vs.length && !variant) return
  addProduct(p, { variant, size: sizeSel ?? null })
  showToast({ title: p.title ?? '', price: Number(p.price), image: fileId(p.image), size: sizeSel ?? null })
}

useScrollReveal()
</script>
