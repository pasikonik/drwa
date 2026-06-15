import { watch } from 'vue'
import type { CartItem } from '~/types/shop'
import { CART_STATE_KEY } from '~/composables/useCart'

// Hydrate the cart from localStorage on the client and persist on every change.
export default defineNuxtPlugin(() => {
  const items = useState<CartItem[]>(CART_STATE_KEY, () => [])

  try {
    const raw = localStorage.getItem(CART_STATE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) items.value = parsed
    }
  } catch {
    // corrupt storage — start fresh
  }

  watch(
    items,
    (val) => {
      try {
        localStorage.setItem(CART_STATE_KEY, JSON.stringify(val))
      } catch {
        // quota / privacy mode — ignore
      }
    },
    { deep: true },
  )
})
