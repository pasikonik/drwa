<template>
  <!-- Directus image — AVIF → WebP → JPEG source chain. -->
  <picture v-if="sources.avif">
    <source :srcset="sources.avif" type="image/avif" />
    <source v-if="sources.webp" :srcset="sources.webp" type="image/webp" />
    <img
      :src="sources.jpg || sources.webp || ''"
      :alt="alt"
      :class="imgClass"
      :style="imgStyle"
      :loading="priority ? 'eager' : 'lazy'"
      :decoding="priority ? 'sync' : 'async'"
      :fetchpriority="priority ? 'high' : 'auto'"
      :width="resolvedWidth"
      :height="resolvedHeight"
    />
  </picture>
  <!-- Fallback when no Directus file is set -->
  <img
    v-else-if="fallback"
    :src="fallback"
    :alt="alt"
    :class="imgClass"
    :style="imgStyle"
    :loading="priority ? 'eager' : 'lazy'"
    :decoding="priority ? 'sync' : 'async'"
    :fetchpriority="priority ? 'high' : 'auto'"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DirectusFile } from '~/types/directus'
import type { ImagePreset } from '~/composables/useDirectus'
import { IMAGE_PRESETS } from '~/composables/useDirectus'

const props = withDefaults(defineProps<{
  /** Directus file UUID string or expanded DirectusFile object. */
  src: string | DirectusFile | null | undefined
  alt: string
  /** Named size preset — sets width and quality optimised for the context. */
  preset?: ImagePreset
  /** Class forwarded to the inner <img>. */
  imgClass?: string
  /** Style forwarded to the inner <img> (e.g. objectPosition). */
  imgStyle?: string | Record<string, string>
  /** Override width in pixels (ignored when preset is set). */
  width?: number
  /** Override height in pixels. */
  height?: number
  /**
   * Mark this image as the LCP candidate.
   * Sets loading="eager", decoding="sync", fetchpriority="high".
   */
  priority?: boolean
  /** URL shown when src resolves to null (e.g. a local fallback image). */
  fallback?: string
}>(), {
  priority: false,
})

const { assetSources } = useDirectus()

const sources = computed(() => assetSources(props.src, props.preset))

const resolvedWidth = computed(() =>
  props.width ?? (props.preset ? IMAGE_PRESETS[props.preset].width : undefined)
)
const resolvedHeight = computed(() => props.height)
</script>
