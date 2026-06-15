<template>
  <form class="stripe-form" @submit.prevent="pay">
    <div ref="elRef" class="stripe-form__element" />
    <p v-if="message" class="stripe-form__error" role="alert">{{ message }}</p>
    <button type="submit" class="btn btn--primary btn--lg stripe-form__submit" :disabled="loading || !ready">
      <span v-if="loading">Przetwarzanie płatności…</span>
      <span v-else>{{ payLabel }}</span>
    </button>
    <p class="stripe-form__note">Płatność obsługuje Stripe — karty, BLIK i Przelewy24. Dane karty nie trafiają na nasz serwer.</p>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { loadStripe, type Stripe, type StripeElements, type StripePaymentElement } from '@stripe/stripe-js'

const props = defineProps<{
  clientSecret: string
  publishableKey: string
  returnUrl: string
  amountLabel?: string
}>()

const payLabel = computed(() => (props.amountLabel ? `Zapłać ${props.amountLabel}` : 'Zapłać'))

const elRef = ref<HTMLElement | null>(null)
const loading = ref(false)
const ready = ref(false)
const message = ref<string | null>(null)

let stripe: Stripe | null = null
let elements: StripeElements | null = null
let paymentEl: StripePaymentElement | null = null

onMounted(async () => {
  try {
    stripe = await loadStripe(props.publishableKey)
    if (!stripe) {
      message.value = 'Nie udało się załadować Stripe. Odśwież stronę.'
      return
    }
    elements = stripe.elements({
      clientSecret: props.clientSecret,
      appearance: { theme: 'flat', variables: { colorPrimary: '#a3743f', fontFamily: 'inherit' } },
    })
    paymentEl = elements.create('payment')
    if (elRef.value) {
      paymentEl.mount(elRef.value)
      ready.value = true
    }
  } catch {
    message.value = 'Nie udało się zainicjować płatności.'
  }
})

onBeforeUnmount(() => {
  paymentEl?.unmount()
})

async function pay(): Promise<void> {
  if (!stripe || !elements) return
  loading.value = true
  message.value = null

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: { return_url: props.returnUrl },
  })

  // Reached only when there's an immediate error (otherwise Stripe redirects).
  if (error) {
    message.value = error.message ?? 'Płatność nie powiodła się. Spróbuj ponownie.'
    loading.value = false
  }
}
</script>
