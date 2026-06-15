<template>
  <div class="summary">
    <div class="summary__row">
      <span>Produkty</span>
      <span>{{ formatPrice(subtotal) }}</span>
    </div>
    <div v-if="showShipping" class="summary__row">
      <span>Dostawa</span>
      <span>{{ (shippingCost ?? 0) > 0 ? formatPrice(shippingCost ?? 0) : 'gratis' }}</span>
    </div>
    <div class="summary__row summary__total">
      <span>Razem</span>
      <span>{{ formatPrice(total) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPrice } from '~/utils/format'

defineProps<{
  subtotal: number
  shippingCost?: number
  total: number
  showShipping?: boolean
}>()
</script>
