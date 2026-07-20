<template>
  <section class="hero" data-anim :class="{ 'is-in': isIn }" id="top">
    <div class="hero__bg">
      <img src="/assets/mist-hero.avif" alt="Świerkowy las we mgle o świcie" />
    </div>
    <div class="hero__scrim" />
    <div class="container">
      <div class="hero__inner">
        <img class="hero__mark reveal-up" src="/assets/logo-no-bg-white.avif" alt="DRWA" />
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
          <NuxtLink class="btn btn--on-dark btn--lg" to="/warsztaty">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="8 8 84 84"
              fill="currentColor"
            >
              <path d="M82.133 8.032c-.493-.163-.964-.304-1.457-.396-2.587-.453-5.091.188-7.04 2.355l-.04-.012-.08.104-27 26.708a1.434 1.434 0 0 0-.02 2.01l.957 1.002-3.956 3.93a1.434 1.434 0 0 0 .02 2.023l1.836 1.849-13.713 7.105a1.434 1.434 0 0 0-.347.272L7.67 78.342a1.434 1.434 0 0 0 .02 2.023l11.583 11.714a1.434 1.434 0 0 0 2.01.019l23.621-23.36a1.434 1.434 0 0 0 .256-.387l7.133-13.694 1.939 1.926a1.434 1.434 0 0 0 2.049.033l3.943-3.891.97.963a1.434 1.434 0 0 0 2.061-.011l27.075-26.811c6.226-6.212-.79-16.44-8.204-18.837zm-1.447 2.569c5.679 1.374 12.119 9.671 7.622 14.226-.02.011-.01.026-.01.038L62.25 50.642 49.53 37.824l26.06-25.816a1.434 1.434 0 0 0 .102-.052c1.28-1.478 3.098-1.815 4.995-1.356zM49.489 41.845l8.725 8.798-2.941 2.935-8.726-8.798 2.942-2.935zm-2.011 7.918l2.702 2.736-7.427 14.326-22.426 22.209-9.605-9.646 22.542-22.299.06-.064 14.15-7.262z"/>
            </svg>
            Warsztaty 2026
          </NuxtLink>
          <NuxtLink class="btn btn--accent btn--lg" to="/kursy">Kursy online</NuxtLink>
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
