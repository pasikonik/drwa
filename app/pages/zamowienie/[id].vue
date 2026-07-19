<template>
  <div class="site">
    <DrwaNav />

    <div class="pagehead">
      <div class="container">
        <span class="eyebrow eyebrow--ondark">Zamówienie</span>
        <h1>{{ banner.title }}</h1>
        <p>{{ banner.subtitle }}</p>
      </div>
    </div>

    <main id="main-content" class="container section">
      <!-- Nie znaleziono zamówienia -->
      <div v-if="!order" class="shop-empty">
        <p>Nie znaleziono zamówienia.</p>
        <NuxtLink class="btn btn--primary btn--md" to="/sklep">Wróć do sklepu</NuxtLink>
      </div>

      <div v-else class="account">
        <!-- Status zamówienia -->
        <div class="account__head">
          <div class="account__meta">
            <span class="badge" :class="banner.badgeClass">{{ banner.badge }}</span>
            <p>Numer zamówienia: <strong>{{ shortId }}</strong></p>
            <p>Złożono {{ formatDate(order.date_created) }}</p>
          </div>
        </div>

        <p v-if="banner.note" class="account__note">{{ banner.note }}</p>

        <!-- Pozycje zamówienia -->
        <div class="ordercard">
          <div class="ordercard__head">
            <h2>Twoje pozycje</h2>
          </div>
          <ul class="ordercard__items">
            <li v-for="item in order.items" :key="item.id" class="ordercard__item">
              <span class="ordercard__item-q">{{ item.quantity }} ×</span>
              <span class="ordercard__item-t">{{ item.product?.title || 'Produkt' }}</span>
              <span class="ordercard__item-p">{{ formatPrice(item.price_at_purchase * item.quantity) }}</span>
              <a
                v-if="item.product?.type === 'course' && item.product?.course_access_url"
                class="btn btn--accent btn--sm"
                :href="item.product.course_access_url || ''"
                target="_blank"
                rel="noopener"
              >Przejdź do kursu</a>
            </li>
          </ul>

          <OrderSummary
            :subtotal="Number(order.subtotal) || 0"
            :shipping-cost="Number(order.shipping_cost) || 0"
            :total="Number(order.total_price)"
            :show-shipping="!!order.shipping_method"
          />
        </div>

        <!-- Adres dostawy -->
        <div v-if="shippingAddress" class="ordercard">
          <div class="ordercard__head">
            <h2>Adres dostawy</h2>
          </div>
          <div class="account__meta">
            <p v-if="shippingAddress.name"><strong>{{ shippingAddress.name }}</strong></p>
            <p v-if="shippingAddress.street">{{ shippingAddress.street }}</p>
            <p v-if="shippingAddress.postalCode || shippingAddress.city">
              {{ shippingAddress.postalCode }} {{ shippingAddress.city }}
            </p>
            <p v-if="shippingAddress.phone">tel. {{ shippingAddress.phone }}</p>
          </div>
        </div>

        <!-- Stopka akcji -->
        <div class="account__alt">
          <NuxtLink class="btn btn--secondary btn--md" to="/konto">Moje konto</NuxtLink>
          <NuxtLink class="btn btn--primary btn--md" to="/sklep">Wróć do sklepu</NuxtLink>
        </div>
      </div>
    </main>

    <DrwaFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { formatPrice, formatDate } from '~/utils/format'
import type { OrderWithItems } from '~/types/directus'

const route = useRoute()
const id = route.params.id as string
const redirectStatus = route.query.redirect_status as string | undefined

const { fetchOne } = useOrders()
const { data: order } = await fetchOne(id)

const { clear } = useCart()

useHead({
  title: 'Zamówienie - DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const shortId = computed(() => id.slice(0, 8))

interface Banner {
  title: string
  subtitle: string
  badge: string
  badgeClass: string
  note: string
}

const banner = computed<Banner>(() => {
  const o = order.value
  if (!o) {
    return {
      title: 'Nie znaleziono zamówienia',
      subtitle: 'Nie udało się odnaleźć tego zamówienia.',
      badge: '',
      badgeClass: '',
      note: '',
    }
  }
  if (o.status === 'paid') {
    return {
      title: 'Dziękujemy za zamówienie!',
      subtitle: 'Twoja płatność została przyjęta.',
      badge: 'Opłacone',
      badgeClass: 'badge--success',
      note: 'Potwierdzenie wraz ze szczegółami wysłaliśmy na Twój adres e-mail.',
    }
  }
  if (o.status === 'pending' && redirectStatus === 'succeeded') {
    return {
      title: 'Potwierdzamy płatność...',
      subtitle: 'Jeszcze chwila - księgujemy Twoją transakcję.',
      badge: 'W trakcie',
      badgeClass: 'badge--warning',
      note: 'Potwierdzenie płatności może zająć kilka sekund. Odśwież stronę za moment, aby zobaczyć aktualny status.',
    }
  }
  if (o.status === 'pending') {
    return {
      title: 'Zamówienie oczekuje na płatność.',
      subtitle: 'Twoje zamówienie czeka na opłacenie.',
      badge: 'Oczekuje',
      badgeClass: 'badge--warning',
      note: 'Zamówienie nie zostało jeszcze opłacone.',
    }
  }
  if (o.status === 'cancelled') {
    return {
      title: 'Płatność nie powiodła się.',
      subtitle: 'Nie udało się przetworzyć płatności za to zamówienie.',
      badge: 'Anulowane',
      badgeClass: 'badge--warning',
      note: 'Możesz spróbować ponownie, składając nowe zamówienie w sklepie.',
    }
  }
  return {
    title: 'Zamówienie',
    subtitle: 'Szczegóły Twojego zamówienia.',
    badge: '',
    badgeClass: '',
    note: '',
  }
})

interface ShippingAddress {
  name?: string
  street?: string
  postalCode?: string
  city?: string
  phone?: string
}

const shippingAddress = computed<ShippingAddress | null>(() => {
  const raw = order.value?.shpping_address
  if (!raw) return null
  try {
    return JSON.parse(raw) as ShippingAddress
  } catch {
    return null
  }
})

onMounted(() => {
  if (order.value && (order.value.status === 'paid' || redirectStatus === 'succeeded')) clear()
})
</script>
