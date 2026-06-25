<template>
  <section class="hero" data-anim :class="{ 'is-in': isIn }" id="top">
    <div class="hero__bg">
      <img src="/assets/mist-hero.png" alt="Świerkowy las we mgle o świcie" />
    </div>
    <div class="hero__scrim" />
    <div class="container">
      <div class="hero__inner">
        <img class="hero__mark reveal-up" src="/assets/drwa-mark.png" alt="DRWA" />
        <span class="eyebrow hero__eyebrow reveal-up">Drewno · Rzemiosło · Szkolenia</span>
        <h1 class="manifest">
          <span class="manifest__line reveal-up">Robimy rzeczy z drewna.</span>
          <span class="manifest__line reveal-up">Stawiamy solidne konstrukcje.</span>
          <span class="manifest__line reveal-up">Budujemy naturalnie.</span>
          <span class="manifest__line manifest__line--accent reveal-up">
            <span class="arrow">→</span> Uczymy tego innych.
          </span>
        </h1>
        <div class="hero__cta reveal-up">
          <button class="btn btn--on-dark btn--lg" @click="scrollTo('warsztaty')">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 12 3 23"/><path d="M18 2 8 12l4 4L22 6a2.83 2.83 0 0 0-4-4Z"/>
            </svg>
            Warsztaty 2026
          </button>
          <NuxtLink class="btn btn--accent btn--lg" to="/kursy/od-wiaty-do-chaty">Kurs online</NuxtLink>
        </div>
      </div>
    </div>
    <div class="hero__cue">
      <span>Przewiń</span>
      <span class="line" />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isIn = ref(false)

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  requestAnimationFrame(() => { isIn.value = true })
})
</script>

<style scoped>
.hero__inner {
  text-align: center;
  margin: 0 auto;
}

.hero__mark {
  margin-left: auto;
  margin-right: auto;
}

.manifest__line--accent {
  justify-content: center;
}

.hero__cta {
  justify-content: center;
}
</style>
