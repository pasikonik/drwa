<template>
  <NuxtLink class="cartbtn nav__link" to="/koszyk" aria-label="Koszyk">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
    Koszyk
    <ClientOnly>
      <span v-if="count > 0" class="cartbtn__count">{{ count }}</span>
    </ClientOnly>
  </NuxtLink>
</template>

<script setup lang="ts">
const { count } = useCart()
</script>
