<template>
  <Teleport to="body">
    <Transition name="cart-toast">
      <div v-if="visible" class="cart-toast" role="status" aria-live="polite">
        <button type="button" class="cart-toast__close" aria-label="Zamknij" @click="hideToast">×</button>
        <div class="cart-toast__body">
          <div class="cart-toast__thumb">
            <img v-if="imgUrl" :src="imgUrl" alt="" width="56" height="56" />
            <svg v-else viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <div class="cart-toast__info">
            <span class="cart-toast__label">Dodano do koszyka</span>
            <p class="cart-toast__title">{{ product?.title }}</p>
            <p v-if="product?.size" class="cart-toast__variant">rozm. {{ product.size.toUpperCase() }}</p>
            <p v-if="priceText" class="cart-toast__price">{{ priceText }}</p>
          </div>
        </div>
        <NuxtLink to="/koszyk" class="btn btn--primary btn--sm cart-toast__cta" @click="hideToast">
          Przejdź do koszyka
        </NuxtLink>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, computed } from 'vue'
import { formatPrice } from '~/utils/format'

const { product, visible, hideToast } = useCartToast()
const { assetUrl } = useDirectus()
const route = useRoute()

const imgUrl = computed(() => {
  if (!product.value?.image) return null
  return assetUrl(product.value.image, { width: 112, height: 112, fit: 'cover' })
})

const priceText = computed(() =>
  Number.isFinite(product.value?.price) ? formatPrice(product.value!.price) : '',
)

// Hide toast when navigating to the cart page
function checkRoute() {
  if (route.path === '/koszyk') hideToast()
}

onMounted(checkRoute)
watch(() => route.path, checkRoute)
</script>

<style>
.cart-toast {
  position: fixed;
  bottom: 24px; right: 24px; z-index: 9000;
  width: 280px;
  background: var(--surface-card);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 14px 14px 12px;
  display: flex; flex-direction: column; gap: 10px;
}
.cart-toast__close {
  position: absolute; top: 10px; right: 12px;
  background: none; border: none; cursor: pointer; padding: 4px;
  font-size: 18px; line-height: 1; color: var(--text-muted);
  border-radius: var(--radius-sm);
}
.cart-toast__close:hover { color: var(--text-body); }
.cart-toast__close:focus-visible { outline: 2px solid var(--ring-color); outline-offset: 2px; }
.cart-toast__body { display: flex; gap: 12px; align-items: flex-start; }
.cart-toast__thumb {
  width: 56px; height: 56px; flex-shrink: 0;
  border-radius: var(--radius-sm); overflow: hidden;
  background: var(--surface-sunken);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-faint);
}
.cart-toast__thumb img { width: 100%; height: 100%; object-fit: cover; }
.cart-toast__info { flex: 1; min-width: 0; padding-right: 20px; }
.cart-toast__label {
  font-family: var(--font-mono); font-size: var(--text-2xs);
  letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted);
  display: block; margin-bottom: 4px;
}
.cart-toast__title {
  font-family: var(--font-display); font-size: var(--text-base);
  font-weight: 500; color: var(--text-strong);
  margin: 0 0 4px; line-height: 1.3;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.cart-toast__variant {
  font-family: var(--font-mono); font-size: var(--text-2xs);
  letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-faint);
  margin: 0 0 4px;
}
.cart-toast__price {
  font-family: var(--font-sans); font-size: var(--text-sm);
  color: var(--timber-500); margin: 0;
}
.cart-toast__cta { width: 100%; text-align: center; }

/* Transition */
.cart-toast-enter-from { transform: translateX(110%); opacity: 0; }
.cart-toast-enter-active { transition: transform var(--dur-slow) var(--ease-out), opacity var(--dur-slow) var(--ease-out); }
.cart-toast-enter-to { transform: translateX(0); opacity: 1; }
.cart-toast-leave-from { transform: translateX(0); opacity: 1; }
.cart-toast-leave-active { transition: transform var(--dur-base) var(--ease-in), opacity var(--dur-base) var(--ease-in); }
.cart-toast-leave-to { transform: translateX(110%); opacity: 0; }

/* Mobile */
@media (max-width: 480px) {
  .cart-toast { left: 16px; right: 16px; bottom: 16px; width: auto; }
}
@media (max-width: 360px) {
  .cart-toast__thumb { display: none; }
}

/* prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .cart-toast-enter-active, .cart-toast-leave-active { transition: opacity 150ms; }
  .cart-toast-enter-from, .cart-toast-leave-to { transform: none; }
}
</style>
