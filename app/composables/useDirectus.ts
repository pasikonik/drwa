// Base composable — exposes the typed Directus client and an asset URL helper.

import type { Schema, DirectusFile } from '~/types/directus'
import type { DirectusClient, RestClient } from '@directus/sdk'

export const useDirectus = () => {
  const { $directus } = useNuxtApp()
  const config = useRuntimeConfig()

  /**
   * Build a full URL to a Directus-managed file.
   * Accepts a raw UUID string or an expanded DirectusFile object.
   * Optional `transforms` map becomes query-string key/transform params.
   *
   * @example assetUrl(product.image)
   * @example assetUrl(post.featured_image, { width: 800, quality: 80 })
   */
  const assetUrl = (
    file: string | DirectusFile | null | undefined,
    transforms?: Record<string, string | number>
  ): string | null => {
    const id = !file ? null : typeof file === 'object' ? file.id : file
    if (!id) return null
    const base = config.public.directusUrl.replace(/\/$/, '')
    const url = new URL(`${base}/assets/${id}`)
    if (transforms) {
      Object.entries(transforms).forEach(([k, v]) => url.searchParams.set(k, String(v)))
    }
    return url.toString()
  }

  return {
    directus: $directus as DirectusClient<Schema> & RestClient<Schema>,
    assetUrl,
  }
}
