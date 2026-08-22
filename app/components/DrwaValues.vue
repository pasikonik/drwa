<template>
  <section class="section container">
    <div class="sec-head io">
      <span class="eyebrow">Nasze zajęcia</span>
      <h2>Co rąbią Drwa?</h2>
    </div>
    <div class="values-grid">
      <div v-for="v in VALUES" :key="v.title" class="value-card io">
        <div class="value-card__icon value-card__icon--art">
          <!-- alt="" — rysunek jest dekoracyjny, treść nazywa nagłówek obok. -->
          <img :src="v.icon" alt="" width="56" height="56" loading="lazy" decoding="async" />
        </div>
        <h3 class="value-card__title">{{ v.title }}</h3>
        <p class="value-card__desc">{{ v.desc }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
// Ikony to rysunki tuszem (AVIF z alfą), nie glify UI — stąd brak zielonego
// kafelka pod nimi i większy rozmiar; szczegół kreski ginie przy 24px.
const VALUES = [
  {
    icon: '/assets/ikona-drewno.avif',
    title: 'Robimy rzeczy z drewna',
    desc: 'Od łyżek po domy szkieletowe, najchętniej ręcznymi narzędziami.',
  },
  {
    icon: '/assets/ikona-konstrukcje.avif',
    title: 'Stawiamy solidne konstrukcje',
    desc: 'Ciesielstwo to nasza specjalność — projektujemy i budujemy domy, dachy, tarasy, altany, wiaty i kurniki.',
  },
  {
    icon: '/assets/ikona-naturalnie.avif',
    title: 'Budujemy naturalnie',
    desc: 'Z szacunku i miłości do życia na Ziemi — z naturalnych materiałów, lokalnego drewna, gliny i kamienia.',
  },
  {
    icon: '/assets/ikona-uczymy.avif',
    title: 'Uczymy tego innych',
    desc: 'Podczas tygodniowych warsztatów na żywo i przez internet. Tworzymy społeczność, w której uczymy się od siebie nawzajem.',
  },
]
</script>
