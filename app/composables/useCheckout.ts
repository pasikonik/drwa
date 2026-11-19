import { ref } from 'vue'
import type { CreateIntentPayload, CreateIntentResponse, QuotePayload, QuoteResponse } from '~/types/shop'

const messageOf = (e: unknown, fallback: string): string => {
  const err = e as { data?: { statusMessage?: string }; statusMessage?: string }
  return err?.data?.statusMessage || err?.statusMessage || fallback
}

/** Drives the quote (discount preview) and create-intent server calls from the checkout page. */
export const useCheckout = () => {
  const creating = ref(false)
  const error = ref<string | null>(null)
  const quoting = ref(false)
  const quoteError = ref<string | null>(null)

  async function quote(payload: QuotePayload): Promise<QuoteResponse | null> {
    quoting.value = true
    quoteError.value = null
    try {
      return await $fetch<QuoteResponse>('/api/checkout/quote', { method: 'POST', body: payload })
    } catch (e: unknown) {
      quoteError.value = messageOf(e, 'Nie udało się sprawdzić kodu.')
      return null
    } finally {
      quoting.value = false
    }
  }

  async function createIntent(payload: CreateIntentPayload): Promise<CreateIntentResponse | null> {
    creating.value = true
    error.value = null
    try {
      return await $fetch<CreateIntentResponse>('/api/checkout/create-intent', {
        method: 'POST',
        body: payload,
      })
    } catch (e: unknown) {
      error.value = messageOf(e, 'Nie udało się rozpocząć płatności.')
      return null
    } finally {
      creating.value = false
    }
  }

  return { createIntent, creating, error, quote, quoting, quoteError }
}
