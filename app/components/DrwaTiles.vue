<template>
  <section class="section container" id="warsztaty">
    <div class="sec-head io">
      <span class="eyebrow">Trzy drogi do rzemiosła</span>
      <h2>CHCESZ BUDOWAĆ Z DREWNA?</h2>
      <p>Naucz się ciesielstwa, stolarki i snycerstwa na warsztatach stacjonarnych, buduj sam na podstawie lekcji online lub dowiedz się więcej o działalności Drew.</p>
    </div>
    <div class="tiles">
      <NuxtLink
        v-for="tile in TILES"
        :key="tile.title"
        :to="tile.to"
        class="tile io"
      >
        <div class="tile__img">
          <img :src="tile.img" :alt="tile.title" :style="{ objectPosition: tile.pos }" />
        </div>
        <div class="tile__scrim" />
        <div class="tile__body">
          <span class="tile__eyebrow">{{ tile.eyebrow }}</span>
          <h3 class="tile__title">{{ tile.title }}</h3>
          <p class="tile__desc">{{ tile.desc }}</p>
          <span class="tile__go">
            {{ tile.go }}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
const currentYear = new Date().getFullYear()

const TILES = [
  // Kadrowane do 3/4 — dokładnie proporcja `.tile`. `pos` działa dopiero
  // poniżej 900px, gdzie kafelek przechodzi na 16/10 i przycina w pionie.
  {
    to: '/warsztaty', img: '/assets/tile-warsztaty.avif', pos: '50% 45%',
    eyebrow: `Stacjonarnie · ${currentYear}`, title: 'Przyjedź na warsztat',
    desc: 'Wspólna nauka przy prawdziwej konstrukcji, w małej grupie, blisko natury.', go: 'Warsztaty',
  },
  {
    to: '/kursy', img: '/assets/tile-kursy.avif', pos: '50% 40%',
    eyebrow: 'Online · w swoim tempie', title: 'Ucz się online',
    desc: 'Kurs online — budowanie z drewna od A do Z, we własnym tempie.', go: 'Kursy',
  },
  {
    to: '/o-nas', img: '/assets/tile-o-nas.avif', pos: '50% 35%',
    eyebrow: 'Ludzie · społeczność', title: 'Poznaj Drwa',
    desc: 'Kim jesteśmy, dlaczego budujemy naturalnie i co zbudowaliśmy razem.', go: 'O nas',
  },
]

useScrollReveal()
</script>
