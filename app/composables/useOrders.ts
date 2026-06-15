import type { OrderWithItems } from '~/types/directus'

/** Read access to orders — single order (confirmation) and the user's history. */
export const useOrders = () => {
  /** Fetch one order with its line items (guest by UUID, or own order). */
  function fetchOne(id: string) {
    return useAsyncData<OrderWithItems>(`order-${id}`, () =>
      $fetch<OrderWithItems>(`/api/orders/${id}`),
    )
  }

  /** Fetch the logged-in user's orders (newest first). 401 for guests. */
  function fetchMine() {
    return useAsyncData<OrderWithItems[]>('orders-mine', () =>
      $fetch<OrderWithItems[]>('/api/orders/mine'),
    )
  }

  return { fetchOne, fetchMine }
}
