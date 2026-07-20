<template>
  <section
    class="section"
    id="onas"
    style="background: var(--surface-raised); border-top: 1px solid var(--border-soft); border-bottom: 1px solid var(--border-soft);"
  >
    <div class="container about">
      <div class="io">
        <span class="eyebrow">O DRWA</span>
        <p class="about__lead">Drewno było z człowiekiem <em>od zawsze</em>. Dawało schronienie, ciepło, narzędzia i miejsce spotkania.</p>
      </div>
      <div class="about__body io">
        <div class="about__rule" />
        <p>W jego słojach zapisana jest pamięć lasu i pracy ludzkich rąk.</p>
        <p>W DRWACH uczymy, jak budować z drewna — solidnie, naturalnie i z szacunkiem dla materiału. Tworzymy przestrzeń wspólnej pracy i nauki, w której dawne rzemiosło spotyka się z poszukiwaniem prostszego, bardziej zakorzenionego sposobu życia we współczesnym świecie.</p>
        <NuxtLink to="/o-nas" class="btn btn--secondary btn--md">
          Poznaj nas
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
