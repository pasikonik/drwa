import { readonly, nextTick } from 'vue'

export interface CartToastProduct {
  title: string
  price: number      // PLN, already resolved charge price
  image: string | null  // Directus file ID or null
  size?: string | null  // selected variant size, if any
}

let _timer: ReturnType<typeof setTimeout> | null = null
let _bumpTimer: ReturnType<typeof setTimeout> | null = null

export const useCartToast = () => {
  const product = useState<CartToastProduct | null>('drwa-toast-product', () => null)
  const visible = useState<boolean>('drwa-toast-visible', () => false)
  const bumped = useState<boolean>('drwa-toast-bumped', () => false)

  function showToast(p: CartToastProduct) {
    if (_timer) clearTimeout(_timer)
    if (_bumpTimer) clearTimeout(_bumpTimer)
    product.value = p
    visible.value = true
    // Restart the bump animation even on rapid consecutive adds: drop the class
    // for a tick so the re-added class re-triggers the CSS keyframes.
    bumped.value = false
    nextTick(() => { bumped.value = true })
    _timer = setTimeout(() => { visible.value = false }, 4000)
    _bumpTimer = setTimeout(() => { bumped.value = false }, 600)
  }

  function hideToast() {
    if (_timer) clearTimeout(_timer)
    if (_bumpTimer) clearTimeout(_bumpTimer)
    visible.value = false
  }

  return { product: readonly(product), visible: readonly(visible), bumped: readonly(bumped), showToast, hideToast }
}
