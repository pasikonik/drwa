<template>
  <section class="section container" id="warsztaty">
    <div class="sec-head io" ref="headRef">
      <span class="eyebrow">Trzy drogi do drewna</span>
      <h2>Od czego zaczniesz?</h2>
      <p>Przyjdź na warsztat, ucz się online albo poznaj nas bliżej. Każda droga prowadzi do tego samego — robienia rzeczy z drewna własnymi rękami.</p>
    </div>
    <div class="tiles">
      <component
        :is="tile.to ? 'NuxtLink' : 'a'"
        v-for="tile in TILES"
        :key="tile.title"
        :id="tile.anchor"
        class="tile io"
        v-bind="tile.to ? { to: tile.to } : { href: '#' }"
        :ref="el => tileRefs.push(el)"
        @click="tile.to ? null : ($event.preventDefault(), scrollTo(tile.href))"
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
            Zobacz
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </component>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const TILES = [
  {
    to: '/warsztaty', img: '/assets/forest-1.png', pos: '50% 50%',
    eyebrow: 'Stacjonarnie · 2026', title: 'Warsztaty 2026',
    desc: 'Łączenia ciesielskie, więźby i konstrukcje — przy realnym drewnie i ognisku.',
  },
  {
    to: '/kursy/od-wiaty-do-chaty', img: '/assets/forest-3.png', pos: '50% 60%',
    eyebrow: 'Online · w swoim tempie', title: 'Kurs online',
    desc: '„Od wiaty do chaty" oraz minikurs podstaw pracy z drewnem — kiedy chcesz.',
  },
  {
    to: '/o-nas', img: '/assets/timber-2.png', pos: '50% 45%',
    eyebrow: 'Ludzie · społeczność', title: 'O nas (DRWA)',
    desc: 'Kim jesteśmy, dlaczego budujemy naturalnie i co dotąd zbudowaliśmy razem.',
  },
]

const headRef = ref(null)
const tileRefs = []

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.io').forEach(el => el.classList.add('io--in'))
    return
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('io--in'); obs.unobserve(en.target) }
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
  document.querySelectorAll('.io').forEach(el => obs.observe(el))
})
</script>
