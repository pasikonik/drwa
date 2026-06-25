<template>
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div
        v-if="open && images.length"
        ref="rootRef"
        class="lbox"
        role="dialog"
        aria-modal="true"
        :aria-label="caption || 'Galeria zdjęć'"
        @click.self="emit('close')"
      >
        <button class="lbox__close" aria-label="Zamknij" @click="emit('close')">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        <button
          v-if="images.length > 1"
          class="lbox__nav lbox__nav--prev"
          aria-label="Poprzednie zdjęcie"
          @click="prev"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <figure class="lbox__stage">
          <img :src="currentSrc" :alt="caption ? `${caption} — zdjęcie ${current + 1}` : `Zdjęcie ${current + 1}`" class="lbox__img" />
          <figcaption v-if="caption || images.length > 1" class="lbox__caption">
            <span v-if="caption">{{ caption }}</span>
            <span v-if="images.length > 1" class="lbox__counter">{{ current + 1 }} / {{ images.length }}</span>
          </figcaption>
        </figure>

        <button
          v-if="images.length > 1"
          class="lbox__nav lbox__nav--next"
          aria-label="Następne zdjęcie"
          @click="next"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  /** Whether the lightbox is shown. */
  open: boolean
  /** Directus file IDs to page through. */
  images: string[]
  /** Index to open on. */
  startIndex?: number
  /** Caption shown under the image (e.g. project title). */
  caption?: string
}>(), {
  startIndex: 0,
  caption: '',
})

const emit = defineEmits<{ close: [] }>()

const { assetUrl } = useDirectus()

const current = ref(0)
const rootRef = ref<HTMLElement | null>(null)
let lastFocused: HTMLElement | null = null

const currentSrc = computed(() => assetUrl(props.images[current.value] ?? null, { width: 1600, quality: 85 }) ?? '')

function next() {
  current.value = (current.value + 1) % props.images.length
}
function prev() {
  current.value = (current.value - 1 + props.images.length) % props.images.length
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') { emit('close'); return }
  if (e.key === 'ArrowRight') { next(); return }
  if (e.key === 'ArrowLeft') { prev(); return }
  if (e.key !== 'Tab' || !rootRef.value) return
  const els = Array.from(rootRef.value.querySelectorAll<HTMLElement>(FOCUSABLE))
  if (!els.length) return
  const first = els[0]!
  const last = els[els.length - 1]!
  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus() }
  } else {
    if (document.activeElement === last) { e.preventDefault(); first.focus() }
  }
}

watch(() => props.open, async (isOpen) => {
  if (!import.meta.client) return
  if (isOpen) {
    current.value = Math.min(Math.max(0, props.startIndex), Math.max(0, props.images.length - 1))
    lastFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    await nextTick()
    rootRef.value?.querySelector<HTMLElement>('.lbox__close')?.focus()
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKey)
    lastFocused?.focus()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>
