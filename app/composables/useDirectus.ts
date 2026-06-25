// Base composable — exposes the typed Directus client and asset URL helpers.

import type { Schema, DirectusFile } from '~/types/directus'
import type { DirectusClient, RestClient } from '@directus/sdk'
import { fileId } from '~/utils/directus'

// Size/quality presets keyed by context.
export type ImagePreset = 'thumb' | 'card' | 'portrait' | 'hero'

export const IMAGE_PRESETS: Record<ImagePreset, { width: number; quality: number }> = {
  thumb:    { width: 400,  quality: 75 },
  card:     { width: 800,  quality: 80 },
  portrait: { width: 600,  quality: 82 },
  hero:     { width: 1600, quality: 85 },
}

export const useDirectus = () => {
  const { $directus } = useNuxtApp()
  const config = useRuntimeConfig()

  const _base = () => config.public.directusUrl.replace(/\/$/, '')

  /**
   * Build a Directus asset URL.
   * Defaults: format=avif, quality=80. Pass `transforms` to override.
   *
   * @example assetUrl(product.image)
   * @example assetUrl(post.featured_image, { width: 800 })
   */
  const assetUrl = (
    file: string | DirectusFile | null | undefined,
    transforms?: Record<string, string | number>
  ): string | null => {
    const id = fileId(file)
    if (!id) return null
    const url = new URL(`${_base()}/assets/${id}`)
    const params: Record<string, string | number> = { format: 'avif', quality: 80, ...transforms }
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
    return url.toString()
  }

  /**
   * Build the three source URLs (avif / webp / jpg) used by <DrwaImg>.
   * Pass a preset name or a custom width/quality object.
   */
  const assetSources = (
    file: string | DirectusFile | null | undefined,
    preset?: ImagePreset | { width?: number; quality?: number }
  ): { avif: string | null; webp: string | null; jpg: string | null } => {
    const id = fileId(file)
    if (!id) return { avif: null, webp: null, jpg: null }

    const base = _base()
    const { width, quality = 80 } =
      typeof preset === 'string' ? IMAGE_PRESETS[preset] : (preset ?? {})

    const make = (format: string) => {
      const url = new URL(`${base}/assets/${id}`)
      url.searchParams.set('format', format)
      url.searchParams.set('quality', String(quality))
      if (width) url.searchParams.set('width', String(width))
      return url.toString()
    }

    return { avif: make('avif'), webp: make('webp'), jpg: make('jpg') }
  }

  return {
    directus: $directus as DirectusClient<Schema> & RestClient<Schema>,
    assetUrl,
    assetSources,
  }
}
