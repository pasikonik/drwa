<template>
  <section class="section--tight container" id="blog">
    <div class="sec-head sec-head--center io">
      <span class="eyebrow">Partnerzy</span>
      <h2>Z kim współpracujemy</h2>
    </div>
    <div class="partners io">
      <a v-for="p in PARTNERS" :key="p.name" class="partner" :href="p.href" target="_blank" rel="noreferrer">
        <span>{{ p.name }}<small>{{ p.kind }}</small></span>
      </a>
    </div>
  </section>
</template>

<script setup>
const PARTNERS = [
  { name: 'Iseris', kind: 'Stwowarzyszenie', href: 'https://iseris.pl/' },
  { name: 'Dobry Dom', kind: 'Naturalne Budownictwo', href: 'http://www.stankowice64.com/index_right.html' },
  { name: 'Festool', kind: 'Narzędzia', href: 'https://www.festool.pl/' },
]
</script>
