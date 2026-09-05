<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <section class="phero">
      <div class="phero__bg">
        <img src="/assets/forest-band.avif" alt="Las świerkowy we mgle" />
      </div>
      <div class="phero__scrim" />
      <div class="container phero__inner">
        <span class="eyebrow eyebrow--ondark">Sklep · Merch DRWA</span>
        <h1>Noś las ze sobą.</h1>
        <p class="phero__lead">Bluzy, koszulki i koszule robocze z naszej stolarni — bawełna organiczna, spokojne kolory lasu i znak DRWA. Garść rzeczy, które naprawdę nosimy na warsztatach.</p>
      </div>
    </section>

    <main id="main-content">
      <section class="shop">
        <div class="container">
          <div class="list-empty io">
            <svg class="list-empty__icon" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <h2 class="list-empty__title">Produkty wkrótce dostępne</h2>
            <p class="list-empty__text">Pracujemy nad przygotowaniem naszej kolekcji. Bluzy, koszulki i inne leśne gadżety już niedługo trafią na wirtualne półki naszego sklepu.</p>
          </div>
        </div>
      </section>
    </main>

    <!-- ===== Stopka ===== -->
    <DrwaFooter />

  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Sklep DRWA — Merch z lasu',
})

useScrollReveal()
</script>
