import type { OrderWithItems } from '~/types/directus'

/** Read access to orders — single order (confirmation) and the user's history. */
export const useOrders = () => {
  // Plain `$fetch` drops the visitor's cookies during SSR, so the server API
  // would see a guest (401 on /mine). `useRequestFetch` forwards them.
  const requestFetch = useRequestFetch()

  /** Fetch one order with its line items (guest by UUID, or own order). */
  function fetchOne(id: string) {
    return useAsyncData<OrderWithItems>(`order-${id}`, () =>
      requestFetch<OrderWithItems>(`/api/orders/${id}`),
    )
  }

  /** Fetch the logged-in user's orders (newest first). 401 for guests. */
  function fetchMine() {
    return useAsyncData<OrderWithItems[]>('orders-mine', () =>
      requestFetch<OrderWithItems[]>('/api/orders/mine'),
    )
  }

  return { fetchOne, fetchMine }
}
