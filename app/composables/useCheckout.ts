import { ref } from 'vue'
import type { CreateIntentPayload, CreateIntentResponse } from '~/types/shop'

/** Drives the create-intent server call from the checkout page. */
export const useCheckout = () => {
  const creating = ref(false)
  const error = ref<string | null>(null)

  async function createIntent(payload: CreateIntentPayload): Promise<CreateIntentResponse | null> {
    creating.value = true
    error.value = null
    try {
      return await $fetch<CreateIntentResponse>('/api/checkout/create-intent', {
        method: 'POST',
        body: payload,
      })
    } catch (e: unknown) {
      const err = e as { data?: { statusMessage?: string }; statusMessage?: string }
      error.value = err?.data?.statusMessage || err?.statusMessage || 'Nie udało się rozpocząć płatności.'
      return null
    } finally {
      creating.value = false
    }
  }

  return { createIntent, creating, error }
}
