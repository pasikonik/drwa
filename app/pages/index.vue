<template>
  <div class="site">
    <DrwaNav />
    <DrwaHero />
    <main>
      <DrwaTiles />
      <DrwaAbout />
      <DrwaValues />
      <DrwaOpinie />
      <DrwaPartnerzy />
      <DrwaNewsletter />
    </main>
    <DrwaFooter />
  </div>
</template>

<script setup>
useHead({
  title: 'DRWA — Drewno · Rzemiosło · Szkolenia',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})
</script>
