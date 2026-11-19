<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <DrwaPageHero>
      <template #bg>
        <img src="/assets/sklep-band.avif" alt="Bluza i koszulka z haftem DRWA" />
      </template>
      <template #eyebrow>Sklep · Merch DRWA</template>
      <template #title>Noś Drwa do lasu (i wszędzie!)</template>
      <template #lead>Bluzy, koszulki i koszule robocze z haftem Drwa – dla tych, którzy lubią drewno, rzemiosło i życie blisko natury. A od czasu do czasu także inne skarby z drewna i lasu.</template>
    </DrwaPageHero>

    <main id="main-content">
      <section class="shop">
        <div class="container">
          <template v-if="products.length">
            <div class="shop__bar io">
              <span class="shop__count">{{ products.length }} {{ products.length === 1 ? 'produkt' : 'produktów' }}</span>
            </div>

            <div class="mgrid">
              <article v-for="p in products" :key="p.id" class="mcard io">
                <div class="mcard__media">
                  <DrwaImg v-if="p.image" :src="p.image" :alt="p.title" preset="card" img-class="mcard__img" />
                  <div v-else class="mcard__placeholder">
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
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

                  <VariantPicker
                    :variants="variantsOf(p.id)"
                    :title="p.title"
                    :model-value="selected(p.id)"
                    @update:model-value="(v) => (picked[p.id] = v)"
                  />

                  <div class="mcard__foot">
                    <span class="mcard__price">{{ formatPrice(p.price) }}</span>
                    <button
                      v-if="variantsOf(p.id).length"
                      type="button"
                      class="btn btn--secondary btn--sm"
                      :disabled="!selected(p.id)"
                      @click="addToCart(p)"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                      </svg>
                      Do koszyka
                    </button>
                    <NuxtLink v-else class="btn btn--secondary btn--sm" :to="`/sklep/${p.slug}`">Zobacz</NuxtLink>
                  </div>
                </div>
              </article>
            </div>
          </template>

          <div v-else class="list-empty io">
            <svg class="list-empty__icon" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <h2 class="list-empty__title">Produkty wkrótce dostępne</h2>
            <p class="list-empty__text">Pracujemy nad przygotowaniem naszej kolekcji. Bluzy, koszulki i inne leśne gadżety już niedługo trafią na wirtualne półki naszego sklepu.</p>
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
import { chargePriceFor, defaultVariant } from '~/utils/product'
import type { Product, ProductVariant } from '~/types/directus'

useHead({
  title: 'Sklep DRWA — Merch z lasu',
})

const { data, error: loadError } = await useProducts('merch')
failIfLoadError(loadError)

const products = computed(() => data.value?.products ?? [])

const variantsOf = (id: number): ProductVariant[] =>
  (data.value?.variants ?? []).filter((v) => v.product_id === id)

// Variant the visitor clicked, per product id; until then the default pick.
const picked = reactive<Record<number, ProductVariant | null>>({})
const selected = (id: number): ProductVariant | null => picked[id] ?? defaultVariant(variantsOf(id))

function productEyebrow(title: string): string {
  if (/bluza/i.test(title)) return 'Bluza'
  if (/koszulka/i.test(title)) return 'Koszulka'
  return 'Merch DRWA'
}

const { addProduct } = useCart()
const { showToast } = useCartToast()

function addToCart(p: Product): void {
  const variant = selected(p.id)
  if (!variant) return
  addProduct(p, { variant })
  showToast({ title: p.title ?? '', price: chargePriceFor(p), image: fileId(p.image), size: variant.size })
}

useScrollReveal()
</script>
