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
  { name: 'Leśna Manufaktura', kind: 'Tartak', href: '#' },
  { name: 'Sosna & Spółka', kind: 'Drewno', href: '#' },
  { name: 'Naturalny Dom', kind: 'Budownictwo', href: '#' },
  { name: 'Stowarzyszenie Cieśli', kind: 'Rzemiosło', href: '#' },
  { name: 'EkoOsada', kind: 'Społeczność', href: '#' },
]
</script>
