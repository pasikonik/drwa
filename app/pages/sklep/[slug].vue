<template>
  <div class="site">
    <ShopNav />

    <main>
      <div class="container section" style="padding-top: var(--space-6)">
        <nav class="drwa-crumb" aria-label="Breadcrumb">
          <NuxtLink to="/sklep">Sklep</NuxtLink>
          <span class="drwa-crumb__sep">·</span>
          <span class="drwa-crumb__current" aria-current="page">{{ product.title }}</span>
        </nav>

        <div class="pdp" style="margin-top: var(--space-6)">
          <!-- Zdjęcie -->
          <div class="pdp__gallery io">
            <div class="pdp__main">
              <DrwaImg v-if="product.image" :src="product.image" :alt="product.title" preset="card" img-class="pdp__img" priority />
              <div v-else class="mcard__placeholder">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
                </svg>
                <span>{{ product.title }}</span>
              </div>
            </div>
          </div>

          <!-- Panel zakupu -->
          <div class="pdp__buy io">
            <span class="eyebrow">Merch DRWA</span>
            <h1 class="pdp__title">{{ product.title }}</h1>
            <p class="pdp__price">{{ formatPrice(product.price) }}</p>
            <p class="pdp__desc">{{ stripHtml(product.description, 240) }}</p>

            <template v-if="sizes.length">
              <p class="pdp__label">
                Rozmiar
                <span v-if="selectedVariant" class="picked">{{ selectedVariant.size?.toUpperCase() }}</span>
                <span v-else>wybierz</span>
              </p>
              <div class="sizes" role="group" aria-label="Rozmiar">
                <button
                  v-for="v in sizes"
                  :key="v.id"
                  class="size"
                  :class="{ 'is-on': selectedVariant?.id === v.id, 'is-off': v.stock <= 0 }"
                  :disabled="v.stock <= 0"
                  @click="selectVariant(v)"
                >{{ v.size?.toUpperCase() }}</button>
              </div>
            </template>

            <div class="pdp__cta">
              <AddToCartButton
                :product="product"
                :variant="selectedVariant"
                :disabled="sizes.length > 0 && !selectedVariant"
                :label="`Do koszyka · ${formatPrice(product.price)}`"
                @added="onAdded"
              />
              <p v-if="sizes.length > 0 && !selectedVariant" class="pdp__pick-hint">Wybierz rozmiar, aby dodać do koszyka.</p>
            </div>

            <div class="pdp__perks">
              <span class="pdp__perk">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M10 17h4V5H2v12h3" /><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
                </svg>
                Wysyłka w 48 h · kurier lub paczkomat
              </span>
              <span class="pdp__perk">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" />
                </svg>
                30 dni na zwrot, bez pytań
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Opis -->
      <section v-if="product.description" class="section--tight container">
        <div class="pdp__story io">
          <div class="sec-head">
            <span class="eyebrow">O tej rzeczy</span>
          </div>
          <div class="pdp__longhtml" v-html="product.description" />
        </div>
      </section>

      <!-- Inne produkty -->
      <section v-if="others.length" class="section--tight container pdp-more">
        <div class="sec-head io">
          <span class="eyebrow">Sklep · Merch</span>
          <h2>Inne rzeczy z lasu</h2>
        </div>
        <div class="mgrid">
          <article v-for="other in others" :key="other.id" class="mcard io">
            <div class="mcard__media">
              <DrwaImg v-if="other.image" :src="other.image" :alt="other.title" preset="card" img-class="mcard__img" />
              <div v-else class="mcard__placeholder">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
                </svg>
                <span>Merch DRWA</span>
              </div>
              <NuxtLink class="mcard__cover" :to="`/sklep/${other.slug}`" :aria-label="'Zobacz: ' + other.title" />
            </div>
            <div class="mcard__body">
              <span class="mcard__eyebrow">Merch DRWA</span>
              <h3 class="mcard__title">
                <NuxtLink class="mcard__link" :to="`/sklep/${other.slug}`">{{ other.title }}</NuxtLink>
              </h3>
              <div class="mcard__foot">
                <span class="mcard__price">{{ formatPrice(other.price) }}</span>
                <span class="mcard__go">
                  Zobacz
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>

    <DrwaFooter />

    <!-- Toast -->
    <div class="toast" :class="{ 'is-on': toast.on }" role="status" aria-live="polite">
      <svg class="toast__check" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <span>{{ toast.msg }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { formatPrice, stripHtml } from '~/utils/format'
import type { ProductVariant } from '~/types/directus'

const route = useRoute()
const { data } = await useProducts('merch')

const product = (data.value?.products ?? []).find((p) => p.slug === route.params.slug)
if (!product) {
  throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono produktu' })
}

useHead({
  title: `${product.title} — Sklep DRWA`,
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const SIZE_ORDER = ['s', 'm', 'l', 'xl']
const sizes = computed(() =>
  (data.value?.variants ?? [])
    .filter((v) => v.product_id === product!.id && v.size)
    .sort((a, b) => SIZE_ORDER.indexOf(a.size ?? '') - SIZE_ORDER.indexOf(b.size ?? '')),
)
const others = computed(() => (data.value?.products ?? []).filter((p) => p.id !== product!.id).slice(0, 3))

const selectedVariant = ref<ProductVariant | null>(null)
function selectVariant(v: ProductVariant): void {
  selectedVariant.value = selectedVariant.value?.id === v.id ? null : v
}

const toast = reactive({ on: false, msg: '' })
let toastTimer: ReturnType<typeof setTimeout> | null = null
function onAdded(): void {
  const tag = selectedVariant.value?.size ? ` (rozm. ${selectedVariant.value.size.toUpperCase()})` : ''
  toast.msg = `Dodano: ${product!.title}${tag}`
  toast.on = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.on = false }, 2600)
}

let observer: IntersectionObserver | null = null
onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.io').forEach((el) => el.classList.add('io--in'))
    return
  }
  observer = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('io--in'); observer!.unobserve(en.target) }
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
  document.querySelectorAll('.io:not(.io--in)').forEach((el) => observer!.observe(el))
})
onUnmounted(() => {
  if (observer) observer.disconnect()
  if (toastTimer) clearTimeout(toastTimer)
})
</script>
