<template>
  <button type="button" class="btn btn--primary btn--lg addcart" :disabled="disabled" @click="onClick">
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
    {{ label ?? 'Do koszyka' }}
  </button>
</template>

<script setup lang="ts">
import type { Product, ProductVariant } from '~/types/directus'

const props = defineProps<{
  product: Product
  variant?: ProductVariant | null
  size?: string | null
  qty?: number
  label?: string
  disabled?: boolean
}>()

const emit = defineEmits<{ added: [] }>()

const { addProduct } = useCart()
const { showToast } = useCartToast()

function onClick(): void {
  addProduct(props.product, {
    variant: props.variant ?? null,
    size: props.size ?? null,
    qty: props.qty ?? 1,
  })

  const chargePrice = props.product.type === 'workshop' && props.product.workshop?.advance != null
    ? Number(props.product.workshop.advance)
    : Number(props.product.price)

  const imageId = (f: typeof props.product.image): string | null =>
    !f ? null : typeof f === 'object' ? f.id : f

  showToast({
    title: props.product.title ?? '',
    price: chargePrice,
    image: imageId(props.product.image),
  })

  emit('added')
}
</script>
