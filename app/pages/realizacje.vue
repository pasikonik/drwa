<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <section class="real-hero" id="top">
      <div class="real-hero__bg">
        <img src="/assets/forest-band.avif" alt="Las we mgle" />
      </div>
      <div class="real-hero__scrim" />
      <div class="container real-hero__inner">
        <span class="eyebrow eyebrow--ondark">Realizacje · DRWA</span>
        <h1>To, co udało nam się zbudować</h1>
        <p class="real-hero__lead">Wiaty, sauny, altany, domki — konstrukcje z drewna, które stanęły na warsztatach i zleceniach. Kliknij zdjęcie, żeby powiększyć.</p>
      </div>
    </section>

    <main id="main-content">
      <section class="section container">
        <div v-if="!list.length" class="real-empty io">
          <p>Galeria realizacji pojawi się już wkrótce.</p>
        </div>

        <div v-else class="real-list">
          <article v-for="p in list" :key="p.id" class="real-row io">
            <div class="real-row__head">
              <h2 class="real-row__title">{{ p.title }}</h2>
              <span v-if="p.dateLabel" class="real-row__date">{{ p.dateLabel }}</span>
              <p v-if="p.description" class="real-row__desc">{{ p.description }}</p>
            </div>
            <ul class="real-strip" :aria-label="'Zdjęcia: ' + p.title">
              <li v-for="(img, i) in p.images" :key="img">
                <button
                  type="button"
                  class="real-thumb"
                  :aria-label="`Powiększ zdjęcie ${i + 1} z ${p.images.length} — ${p.title}`"
                  @click="openLightbox(p.images, i, p.title)"
                >
                  <DrwaImg :src="img" :alt="`${p.title} — zdjęcie ${i + 1}`" preset="card" img-class="real-thumb__img" />
                </button>
              </li>
            </ul>
          </article>
        </div>
      </section>
    </main>

    <DrwaLightbox
      :open="lb.open"
      :images="lb.images"
      :start-index="lb.index"
      :caption="lb.caption"
      @close="lb.open = false"
    />

    <!-- ===== Stopka ===== -->
    <DrwaFooter />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { formatDate } from '~/utils/format'
import { fileId } from '~/utils/directus'

useHead({
  title: 'Realizacje — DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const { data: projects } = await useProjects()

const list = computed(() =>
  (projects.value ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    dateLabel: p.date ? formatDate(p.date) : '',
    description: p.description ?? '',
    images: p.images
      .map((j) => fileId(j.directus_files_id))
      .filter((s): s is string => !!s),
  })),
)

const lb = reactive({ open: false, images: [] as string[], index: 0, caption: '' })

function openLightbox(images: string[], index: number, caption: string) {
  lb.images = images
  lb.index = index
  lb.caption = caption
  lb.open = true
}

useScrollReveal()
</script>
