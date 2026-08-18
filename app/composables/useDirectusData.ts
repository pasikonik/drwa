// DRWA — recovery for Directus reads that failed during SSR.

import { onMounted } from 'vue'

interface Recoverable {
  error: { value: unknown }
  refresh: () => Promise<unknown>
}

/**
 * Refetch once on mount when the SSR fetch failed.
 *
 * When a Directus request throws during SSR, `useAsyncData` keeps the `default`
 * value (an empty list) and records the error in the payload. Nuxt does **not**
 * retry a failed SSR fetch on the client, so the page stays stuck rendering
 * "no items" until the visitor manually reloads — which is exactly the bug this
 * exists to kill. Retrying after hydration lets a transient blip heal itself.
 *
 * Wraps and returns the same `useAsyncData` handle, so call sites keep their
 * types (including the promise-like `await` behaviour pages rely on).
 *
 * Pages rendering `.io` scroll-reveal elements from this data must re-run
 * `reobserve()` when it lands — nodes added after mount are not observed yet.
 */
export const recoverOnClient = <T extends Recoverable>(res: T): T => {
  if (import.meta.client) {
    onMounted(() => {
      if (res.error.value) res.refresh()
    })
  }
  return res
}
