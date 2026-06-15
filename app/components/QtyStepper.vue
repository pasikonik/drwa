<template>
  <div class="qty">
    <button type="button" class="qty__btn" :disabled="value <= min" aria-label="Zmniejsz ilość" @click="set(value - 1)">−</button>
    <span class="qty__val" aria-live="polite">{{ value }}</span>
    <button type="button" class="qty__btn" :disabled="value >= max" aria-label="Zwiększ ilość" @click="set(value + 1)">+</button>
  </div>
</template>

<script setup lang="ts">
const value = defineModel<number>({ required: true })

const props = withDefaults(defineProps<{ min?: number; max?: number }>(), {
  min: 1,
  max: 99,
})

function set(n: number): void {
  value.value = Math.max(props.min, Math.min(props.max, n))
}
</script>
