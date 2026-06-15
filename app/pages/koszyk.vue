<template>
  <div class="site">
    <ShopNav />

    <div class="pagehead">
      <div class="container">
        <span class="eyebrow eyebrow--ondark">Koszyk</span>
        <h1>Twój koszyk</h1>
        <p>Sprawdź wybrane produkty, zanim przejdziesz do kasy.</p>
      </div>
    </div>

    <main class="container section">
      <!-- Pusty koszyk -->
      <div v-if="isEmpty" class="shop-empty">
        <p>Twój koszyk jest pusty.</p>
        <NuxtLink class="btn btn--primary btn--md" to="/sklep">Przejdź do sklepu</NuxtLink>
      </div>

      <div v-else class="cart">
        <!-- Lewa kolumna: pozycje -->
        <div class="cart__list">
          <CartLineItem
            v-for="it in items"
            :key="it.key"
            :item="it"
            @remove="remove"
            @set-qty="setQty"
          />
        </div>

        <!-- Prawa kolumna: podsumowanie -->
        <aside class="cart__aside">
          <div class="card card--padded">
            <h2 class="cart__h">Podsumowanie</h2>
            <OrderSummary :subtotal="subtotal" :total="subtotal" :show-shipping="false" />
            <p class="cart__hint">Koszt dostawy policzymy przy płatności.</p>
            <NuxtLink class="btn btn--primary btn--lg" to="/zamowienie">Przejdź do kasy</NuxtLink>
            <NuxtLink class="cart__continue" to="/sklep">Kontynuuj zakupy</NuxtLink>
          </div>
        </aside>
      </div>
    </main>

    <DrwaFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Koszyk — DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const { items, isEmpty, subtotal, setQty, remove } = useCart()
</script>
