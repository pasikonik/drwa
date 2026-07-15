<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <section class="phero" id="top">
      <div class="phero__bg">
        <img src="/assets/forest-band.png" alt="Las we mgle" />
      </div>
      <div class="phero__scrim" />
      <div class="container phero__inner">
        <span class="eyebrow eyebrow--ondark">ONLINE · W SWOIM TEMPIE</span>
        <h1>Kursy online</h1>
        <p class="phero__lead">Ciesielstwo krok po kroku — ucz się z instrukcji wideo, kiedy chcesz i gdzie chcesz. Dostęp od razu po zakupie.</p>
      </div>
    </section>

    <main id="main-content">
      <section class="section container" id="lista">
        <div class="sec-head io">
          <span class="eyebrow">Do wyboru</span>
          <h2>Wybierz swój kurs</h2>
          <p>Każdy kurs to komplet instrukcji wideo i materiałów — od podstaw pracy z drewnem po całe konstrukcje.</p>
        </div>

        <div v-if="courses.length" class="builds io">
          <article v-for="c in courses" :key="c.id" class="build build--course">
            <div class="build__img">
              <DrwaImg :src="c.image" :alt="c.title" preset="card" :fallback="c.fallback" />
            </div>
            <div class="build__body">
              <span class="build__eyebrow">Kurs online</span>
              <h3 class="build__title"><NuxtLink :to="c.route">{{ c.title }}</NuxtLink></h3>
              <p class="build__desc">{{ c.desc }}</p>
              <div class="build__pricerow">
                <span class="build__price">{{ c.price }}</span>
                <NuxtLink :to="c.route" class="btn btn--secondary btn--md">Zobacz kurs</NuxtLink>
              </div>
            </div>
          </article>
        </div>
        <p v-else class="klist-empty io">Wkrótce nowe kursy — zajrzyj niebawem.</p>
      </section>
    </main>

    <DrwaFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatPrice, stripHtml } from '~/utils/format'

useHead({
  title: 'Kursy online — DRWA',
  meta: [{ name: 'description', content: 'Kursy online DRWA — ciesielstwo i praca z drewnem krok po kroku, w swoim tempie.' }],
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const { data } = await useProducts('course')

const FALLBACK_IMGS = ['/assets/kurs-wiata.png', '/assets/kurs-altana.png', '/assets/kurs-domek.png']

const courses = computed(() =>
  (data.value?.products ?? []).map((p, i) => ({
    id: p.id,
    title: p.title,
    route: `/kursy/${p.slug ?? p.id}`,
    desc: p.short_description ?? stripHtml(p.description, 180),
    // Directus wysyła decimal jako string — Number() przed formatowaniem.
    price: formatPrice(Number(p.price)),
    image: p.image,
    fallback: FALLBACK_IMGS[i % FALLBACK_IMGS.length]!,
  }))
)

useScrollReveal()
</script>
