<template>
  <template v-if="colors.length">
    <p v-if="labelled" class="pdp__label">Kolor <span class="picked">{{ model?.color }}</span></p>
    <div class="sizes" role="group" :aria-label="groupLabel('Kolor')">
      <button
        v-for="c in colors"
        :key="c"
        type="button"
        class="size"
        :class="{ 'is-on': model?.color === c }"
        :aria-pressed="model?.color === c"
        @click="model = variantForColor(variants, model, c)"
      >{{ c }}</button>
    </div>
  </template>

  <template v-if="sizes.length">
    <p v-if="labelled" class="pdp__label">Rozmiar <span class="picked">{{ model?.size?.toUpperCase() }}</span></p>
    <div class="sizes" role="group" :aria-label="groupLabel('Rozmiar')">
      <button
        v-for="v in sizes"
        :key="v.id"
        type="button"
        class="size"
        :class="{ 'is-on': model?.id === v.id, 'is-off': v.stock <= 0 }"
        :disabled="v.stock <= 0"
        :aria-pressed="model?.id === v.id"
        @click="model = v"
      >{{ v.size?.toUpperCase() }}</button>
    </div>
  </template>
</template>

<script setup lang="ts">
// Colour + size buttons for a merch product. Stateless: the selected variant
// lives in the parent (v-model), so SSR and hydration render the same choice.
import { computed } from 'vue'
import type { ProductVariant } from '~/types/directus'
import { variantColors, variantSizes, variantForColor } from '~/utils/product'

const props = defineProps<{
  variants: ProductVariant[]
  /** Product title, appended to the button groups' aria-labels. */
  title?: string
  /** Show "Kolor / Rozmiar" headings (product page). */
  labelled?: boolean
}>()

const model = defineModel<ProductVariant | null>({ default: null })

const colors = computed(() => variantColors(props.variants))
const sizes = computed(() => variantSizes(props.variants, model.value?.color ?? null))

const groupLabel = (what: string) => (props.title ? `${what} · ${props.title}` : what)
</script>
