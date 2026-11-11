<template>
  <div class="site">
    <DrwaNav />
    <DrwaHero />
    <main id="main-content">
      <DrwaTiles />
      <DrwaAbout />
      <DrwaSpolecznosc />
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
})
</script>
