<template>
  <div class="site">
    <DrwaNav />

    <main id="main-content">
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
              <button
                v-if="images.length"
                type="button"
                class="pdp__zoom"
                :aria-label="`Powiększ zdjęcie ${active + 1} z ${images.length}`"
                @click="lightboxOpen = true"
              >
                <DrwaImg :key="images[active]" :src="images[active]" :alt="product.title" preset="card" img-class="pdp__img" priority />
              </button>
              <div v-else class="mcard__placeholder">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
                </svg>
                <span>{{ product.title }}</span>
              </div>
            </div>
            <div v-if="images.length > 1" class="pdp__thumbs">
              <button
                v-for="(img, i) in images"
                :key="img"
                type="button"
                class="pdp__thumb"
                :class="{ 'is-on': i === active }"
                :aria-label="`Pokaż zdjęcie ${i + 1} z ${images.length}`"
                :aria-pressed="i === active"
                @click="active = i"
              >
                <DrwaImg :src="img" alt="" preset="thumb" img-class="pdp__thumb-img" />
              </button>
            </div>
          </div>

          <!-- Panel zakupu -->
          <div class="pdp__buy io">
            <span class="eyebrow">Merch DRWA</span>
            <h1 class="pdp__title">{{ product.title }}</h1>
            <p class="pdp__price">{{ formatPrice(product.price) }}</p>
            <p class="pdp__desc">{{ stripHtml(product.description, 240) }}</p>

            <VariantPicker
              :variants="variants"
              labelled
              :model-value="selectedVariant"
              @update:model-value="(v) => (picked = v)"
            />

            <div class="pdp__cta">
              <AddToCartButton
                :product="product"
                :variant="selectedVariant"
                :label="`Do koszyka · ${formatPrice(product.price)}`"
              />
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

    <DrwaLightbox
      :open="lightboxOpen"
      :images="images"
      :start-index="active"
      :caption="product.title"
      @close="lightboxOpen = false"
    />

    <DrwaFooter />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatPrice, stripHtml } from '~/utils/format'
import { fileId } from '~/utils/directus'
import { defaultVariant } from '~/utils/product'
import type { ProductVariant } from '~/types/directus'

const route = useRoute()
const { data, error: loadError } = await useProducts('merch')

failIfLoadError(loadError)
const product =(data.value?.products ?? []).find((p) => p.slug === route.params.slug)
if (!product) {
  throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono produktu' })
}

useHead({
  title: `${product.title} — Sklep DRWA`,
})

const variants = computed(() => (data.value?.variants ?? []).filter((v) => v.product_id === product!.id))
const others = computed(() => (data.value?.products ?? []).filter((p) => p.id !== product!.id).slice(0, 3))

// Variant the visitor clicked; until then the default pick.
const picked = ref<ProductVariant | null>(null)
const selectedVariant = computed(() => picked.value ?? defaultVariant(variants.value))

// Main photo first, then the merch gallery (deduped in case the cover is in it too).
const images = computed(() => [...new Set(
  [product!.image, ...(product!.merch?.gallery ?? []).map((g) => g.directus_files_id)]
    .map(fileId)
    .filter((id): id is string => !!id),
)])
const active = ref(0)
const lightboxOpen = ref(false)

useScrollReveal()
</script>
