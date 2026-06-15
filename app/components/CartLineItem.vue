<template>
  <article class="cartline">
    <div class="cartline__media">
      <DrwaImg v-if="item.image" :src="item.image" :alt="item.title" preset="thumb" img-class="cartline__img" />
      <div v-else class="cartline__ph" aria-hidden="true" />
    </div>
    <div class="cartline__body">
      <h3 class="cartline__title">{{ item.title }}</h3>
      <p class="cartline__meta">
        <span>{{ typeLabel }}</span>
        <span v-if="item.size"> · rozmiar {{ item.size }}</span>
      </p>
      <button type="button" class="cartline__remove" @click="emit('remove', item.key)">Usuń</button>
    </div>
    <div class="cartline__controls">
      <QtyStepper
        v-if="item.type !== 'course'"
        :model-value="item.qty"
        :max="item.maxQty || 99"
        @update:model-value="(v) => emit('setQty', item.key, v)"
      />
      <span v-else class="cartline__single">1 szt.</span>
      <span class="cartline__price">{{ formatPrice(item.price * item.qty) }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CartItem } from '~/types/shop'
import { formatPrice } from '~/utils/format'

const props = defineProps<{ item: CartItem }>()
const emit = defineEmits<{ remove: [key: string]; setQty: [key: string, qty: number] }>()

const typeLabel = computed(() => {
  switch (props.item.type) {
    case 'course': return 'Kurs online'
    case 'workshop': return 'Warsztat'
    default: return 'Merch'
  }
})
</script>
