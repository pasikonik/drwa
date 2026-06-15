<template>
  <div class="site">
    <ShopNav />

    <div class="pagehead">
      <div class="container">
        <span class="eyebrow eyebrow--ondark">Twoje konto</span>
        <h1>Cześć, {{ displayName }}</h1>
        <p>Tu znajdziesz historię zamówień oraz dostęp do zakupionych kursów.</p>
      </div>
    </div>

    <main class="container section">
      <div class="account">
        <!-- Nagłówek konta -->
        <div class="account__head card card--padded">
          <div class="account__meta">
            <span class="eyebrow">Zalogowano jako</span>
            <strong>{{ user?.email || '' }}</strong>
          </div>
          <button class="btn btn--secondary btn--md" @click="onLogout">Wyloguj</button>
        </div>

        <!-- Brak zamówień -->
        <div v-if="!orders?.length" class="shop-empty">
          <p>Nie masz jeszcze zamówień.</p>
          <NuxtLink class="btn btn--primary btn--md" to="/sklep">Przejdź do sklepu</NuxtLink>
        </div>

        <!-- Lista zamówień -->
        <div v-else class="orderlist">
          <article v-for="order in orders" :key="order.id" class="ordercard">
            <div class="ordercard__head">
              <span class="ordercard__date">{{ formatDate(order.date_created) }}</span>
              <span class="badge" :class="statusTone(order.status)">{{ statusLabel(order.status) }}</span>
              <span class="ordercard__total">{{ formatPrice(order.total_price) }}</span>
            </div>

            <ul class="ordercard__items">
              <li v-for="it in order.items" :key="it.id">
                <span class="ordercard__item-q">{{ it.quantity }}×</span>
                <span class="ordercard__item-t">{{ it.product?.title || 'Produkt' }}</span>
                <a
                  v-if="it.product?.type === 'course' && it.product?.course_access_url"
                  class="ordercard__course"
                  :href="it.product.course_access_url"
                  target="_blank"
                  rel="noopener"
                >
                  Przejdź do kursu
                </a>
              </li>
            </ul>

            <NuxtLink class="ordercard__link" :to="`/zamowienie/${order.id}`">Szczegóły zamówienia</NuxtLink>
          </article>
        </div>
      </div>
    </main>

    <DrwaFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatPrice, formatDate } from '~/utils/format'
import type { OrderWithItems } from '~/types/directus'

definePageMeta({ middleware: 'auth' })

useHead({
  title: 'Moje konto — DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const { user, logout } = useAuth()
const { fetchMine } = useOrders()
const { data: orders } = await fetchMine()

const displayName = computed(() => user.value?.first_name || user.value?.email || 'Witaj')

type OrderStatus = OrderWithItems['status']

function statusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    paid: 'Opłacone',
    pending: 'Oczekuje na płatność',
    shipped: 'Wysłane',
    cancelled: 'Anulowane',
  }
  return map[status] ?? status
}

function statusTone(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    paid: 'badge--success',
    pending: 'badge--warning',
    shipped: 'badge--success',
    cancelled: '',
  }
  return map[status] ?? ''
}

async function onLogout(): Promise<void> {
  logout()
  await navigateTo('/')
}
</script>
