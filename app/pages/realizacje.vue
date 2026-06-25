<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <section class="real-hero" id="top">
      <div class="real-hero__bg">
        <img src="/assets/forest-band.png" alt="Las we mgle" />
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
    <footer class="foot">
      <div class="container">
        <div class="foot__top">
          <div class="foot__brand">
            <div class="brandrow">
              <img src="/assets/drwa-mark.png" alt="DRWA" />
              <span class="wm">DRWA</span>
            </div>
            <p>Drewno, rzemiosło i szkolenia. Pracujemy z drewnem i budujemy wokół niego społeczność — w duchu natury i ekologii.</p>
          </div>
          <div>
            <h4>DRWA</h4>
            <ul>
              <li><NuxtLink to="/warsztaty">Warsztaty 2026</NuxtLink></li>
              <li><NuxtLink to="/kursy/od-wiaty-do-chaty">Kursy online</NuxtLink></li>
              <li><NuxtLink to="/sklep">Sklep · Merch</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4>Poznaj nas</h4>
            <ul>
              <li><NuxtLink to="/o-nas">O nas</NuxtLink></li>
              <li><NuxtLink to="/realizacje">Realizacje</NuxtLink></li>
              <li><NuxtLink to="/blog">Blog · Z lasu</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li><a href="mailto:czesc@drwa.pl">czesc@drwa.pl</a></li>
              <li><NuxtLink to="/">Strona główna</NuxtLink></li>
            </ul>
          </div>
        </div>
        <div class="foot__bottom">
          <span>© 2026 DRWA · Drewno · Rzemiosło · Szkolenia</span>
          <div class="foot__social">
            <a aria-label="Instagram" href="https://www.instagram.com/drwa_yen/" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>
              </svg>
            </a>
            <a aria-label="YouTube" href="https://www.youtube.com/@Drwa-Kopaniec" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                <path d="m9.75 15.02 5.75-3.27-5.75-3.27v6.54z"/>
              </svg>
            </a>
            <a aria-label="E-mail" href="mailto:czesc@drwa.pl">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
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
