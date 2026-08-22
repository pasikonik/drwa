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
          <div class="io" style="text-align: center; padding: 10vh 0; max-width: 640px; margin: 0 auto;">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-bottom: 1.5rem; opacity: 0.8;">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <h2 style="font-size: 2rem; margin-bottom: 1rem;">Produkty wkrótce dostępne</h2>
            <p style="color: var(--color-text-mut, #666); font-size: 1.125rem;">
              Pracujemy nad przygotowaniem naszej kolekcji. Bluzy, koszulki i inne leśne gadżety już niedługo trafią na wirtualne półki naszego sklepu.
            </p>
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
