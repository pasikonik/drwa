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
  { name: 'Dłuta.pl', kind: 'Sklep narzędziowy', href: 'https://dluta.pl/' },
  { name: 'Festool', kind: 'Narzędzia', href: 'https://www.festool.pl/' },
  { name: 'Iseris', kind: 'Stowarzyszenie', href: 'https://iseris.pl/' },
  { name: 'Dolina Harmonii', kind: 'Siedlisko · warsztaty', href: 'http://www.dolinaharmonii.pl/' },
  { name: 'Osada Earth', kind: 'Prosinko · partnerska osada', href: 'https://www.osada.earth/' },
]
</script>
