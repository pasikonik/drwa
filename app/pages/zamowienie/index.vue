<template>
  <div class="site">
    <DrwaNav />

    <div class="pagehead">
      <div class="container">
        <span class="eyebrow eyebrow--ondark">Zamówienie</span>
        <h1>Podsumowanie i płatność</h1>
        <p>Jeszcze tylko kilka szczegółów i przechodzimy do bezpiecznej płatności.</p>
      </div>
    </div>

    <main id="main-content" class="container section">
      <!-- Pusty koszyk -->
      <div v-if="isEmpty" class="shop-empty">
        <p>Twój koszyk jest pusty.</p>
        <NuxtLink class="btn btn--primary btn--md" to="/sklep">Przejdź do sklepu</NuxtLink>
      </div>

      <div v-else class="checkout">
        <!-- Lewa kolumna: dane / płatność -->
        <div class="checkout__main">
          <!-- KROK 1 — dane -->
          <section v-if="!clientSecret" class="card card--padded">
            <h2 class="checkout__h">Dane do zamówienia</h2>

            <div class="field">
              <label class="field__label" for="co-email">E-mail</label>
              <input id="co-email" v-model="email" class="field__input" :class="{ 'field__input--error': errors.email }" type="email" autocomplete="email" />
              <span v-if="errors.email" class="field__error" role="alert">{{ errors.email }}</span>
              <span class="field__hint">Na ten adres wyślemy potwierdzenie{{ hasPhysical ? '' : ' i dostęp do kursów' }}.</span>
            </div>

            <template v-if="hasCourse">
              <div class="field">
                <label class="field__label" for="co-first-name">Imię</label>
                <input id="co-first-name" v-model="firstName" class="field__input" :class="{ 'field__input--error': errors.firstName }" type="text" autocomplete="given-name" />
                <span v-if="errors.firstName" class="field__error" role="alert">{{ errors.firstName }}</span>
              </div>
              <div class="field">
                <label class="field__label" for="co-last-name">Nazwisko</label>
                <input id="co-last-name" v-model="lastName" class="field__input" :class="{ 'field__input--error': errors.lastName }" type="text" autocomplete="family-name" />
                <span v-if="errors.lastName" class="field__error" role="alert">{{ errors.lastName }}</span>
                <span class="field__hint">Potrzebne do nadania dostępu do kursu online.</span>
              </div>
            </template>

            <template v-if="hasPhysical">
              <h3 class="checkout__sub">Dostawa</h3>
              <div class="ship">
                <label
                  v-for="opt in shipOptions"
                  :key="opt.method"
                  class="ship__opt"
                  :class="{ 'ship__opt--on': shippingMethod === opt.method }"
                >
                  <input v-model="shippingMethod" type="radio" name="ship" :value="opt.method" />
                  <span class="ship__label">{{ opt.label }}</span>
                  <span class="ship__cost">{{ opt.cost > 0 ? formatPrice(opt.cost) : 'gratis' }}</span>
                </label>
              </div>

              <h3 class="checkout__sub">Adres dostawy</h3>
              <AddressForm :address="address" :errors="errors" :show-point="shippingMethod === 'paczkomat'" />
            </template>

            <p v-if="checkoutError" class="field__error checkout__err" role="alert">{{ checkoutError }}</p>

            <button class="btn btn--primary btn--lg" :disabled="creating" @click="startPayment">
              {{ creating ? 'Przygotowuję płatność…' : 'Przejdź do płatności' }}
            </button>
          </section>

          <!-- KROK 2 — płatność -->
          <section v-else class="card card--padded">
            <h2 class="checkout__h">Płatność</h2>
            <ClientOnly>
              <StripePaymentForm
                :client-secret="clientSecret"
                :publishable-key="publishableKey"
                :return-url="returnUrl"
                :amount-label="formatPrice(total)"
              />
            </ClientOnly>
            <button class="checkout__back" @click="resetPayment">← Wróć do danych</button>
          </section>
        </div>

        <!-- Prawa kolumna: podsumowanie -->
        <aside class="checkout__aside">
          <div class="card card--padded">
            <h2 class="checkout__h">Twoje zamówienie</h2>
            <ul class="checkout__items">
              <li v-for="it in items" :key="it.key" class="checkout__item">
                <span class="checkout__item-q">{{ it.qty }}×</span>
                <span class="checkout__item-t">{{ it.title }}<template v-if="it.size"> · {{ it.size }}</template></span>
                <span class="checkout__item-p">{{ formatPrice(it.price * it.qty) }}</span>
              </li>
            </ul>
            <OrderSummary :subtotal="subtotal" :shipping-cost="shippingCost" :total="total" :show-shipping="hasPhysical" />
            <p v-if="hasPhysical && subtotal < FREE_SHIPPING_THRESHOLD" class="checkout__hint">
              Do darmowej dostawy brakuje {{ formatPrice(FREE_SHIPPING_THRESHOLD - subtotal) }}.
            </p>
          </div>
        </aside>
      </div>
    </main>

    <DrwaFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { formatPrice } from '~/utils/format'
import { shippingOptions, FREE_SHIPPING_THRESHOLD } from '~/utils/shipping'
import type { ShippingAddress, ShippingMethod } from '~/types/shop'

useHead({
  title: 'Zamówienie — DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const { items, subtotal, hasPhysical, hasCourse, isEmpty, toCheckoutItems } = useCart()
const { user } = useAuth()
const { createIntent, creating, error: createError } = useCheckout()

const email = ref(user.value?.email ?? '')
const firstName = ref(user.value?.first_name ?? '')
const lastName = ref(user.value?.last_name ?? '')
const shippingMethod = ref<ShippingMethod>('paczkomat')
const address = reactive<ShippingAddress>({ name: '', street: '', postalCode: '', city: '', phone: '', pointCode: '' })
const errors = reactive<Record<string, string>>({})
const checkoutError = ref<string | null>(null)

// Payment step state
const clientSecret = ref<string | null>(null)
const publishableKey = ref('')
const orderId = ref<string | null>(null)
const returnUrl = ref('')

const shipOptions = computed(() => shippingOptions(subtotal.value))
const shippingCost = computed(() => {
  if (!hasPhysical.value) return 0
  return shipOptions.value.find((o) => o.method === shippingMethod.value)?.cost ?? 0
})
const total = computed(() => subtotal.value + shippingCost.value)

onMounted(() => {
  if (!email.value && user.value?.email) email.value = user.value.email
})

function validate(): boolean {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!email.value.includes('@')) errors.email = 'Podaj poprawny adres e-mail.'
  if (hasCourse.value) {
    if (!firstName.value.trim()) errors.firstName = 'Podaj imię.'
    if (!lastName.value.trim()) errors.lastName = 'Podaj nazwisko.'
  }
  if (hasPhysical.value) {
    if (!address.name.trim()) errors.name = 'Podaj imię i nazwisko.'
    if (!address.street.trim()) errors.street = 'Podaj ulicę i numer.'
    if (!/^\d{2}-\d{3}$/.test(address.postalCode.trim())) errors.postalCode = 'Format: 00-000.'
    if (!address.city.trim()) errors.city = 'Podaj miasto.'
    if (!address.phone.trim()) errors.phone = 'Podaj telefon.'
  }
  return Object.keys(errors).length === 0
}

async function startPayment(): Promise<void> {
  checkoutError.value = null
  if (!validate()) return

  const res = await createIntent({
    items: toCheckoutItems(),
    email: email.value,
    firstName: hasCourse.value ? firstName.value.trim() : null,
    lastName: hasCourse.value ? lastName.value.trim() : null,
    shippingMethod: hasPhysical.value ? shippingMethod.value : null,
    address: hasPhysical.value ? { ...address } : null,
  })

  if (!res) {
    checkoutError.value = createError.value ?? 'Nie udało się rozpocząć płatności.'
    return
  }

  clientSecret.value = res.clientSecret
  publishableKey.value = res.publishableKey
  orderId.value = res.orderId
  returnUrl.value = `${window.location.origin}/zamowienie/${res.orderId}`
}

function resetPayment(): void {
  clientSecret.value = null
  orderId.value = null
}
</script>
