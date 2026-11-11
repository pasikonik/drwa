<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <DrwaPageHero>
      <template #bg><img src="/assets/oferta-band.avif" alt="Narzędzia i elementy drewniane na stole warsztatowym" /></template>
      <template #eyebrow>Drwa · Współpraca</template>
      <template #title>Oferta</template>
      <template #lead>W Drwach łączymy tradycyjne rzemiosło drzewne z edukacją, samodzielnym budowaniem i działaniem zespołowym.</template>
    </DrwaPageHero>

    <main id="main-content">
      <!-- ===== Wstęp ===== -->
      <section class="section container">
        <div class="oferta-intro io">
          <p>Naszą stałą ofertę stanowią <NuxtLink to="/warsztaty">warsztaty stacjonarne</NuxtLink> oraz <NuxtLink to="/kursy">kursy online</NuxtLink>, których szczegółowe opisy, terminy i informacje o zapisach znajdziesz w odpowiednich zakładkach strony.</p>
          <p>Oprócz tego oferujemy różne formy współpracy — od warsztatów dla firm i grup, przez projekty edukacyjne i wydarzenia, po indywidualne konsultacje.</p>
          <p>Zapytania prosimy kierować drogą mailową na adres <a href="mailto:kontakt@drwa.pl">kontakt@drwa.pl</a>.</p>
        </div>

        <!-- ===== Formy współpracy ===== -->
        <div class="oferta-list">
          <article v-for="(o, i) in OFFERS" :key="o.title" class="oferta-item io">
            <span class="oferta-item__num">{{ String(i + 1).padStart(2, '0') }}</span>
            <div>
              <h2 class="oferta-item__title">{{ o.title }}</h2>
              <p v-for="t in o.text" :key="t">{{ t }}</p>
            </div>
          </article>
        </div>

        <!-- ===== Ważne informacje ===== -->
        <div class="oferta-note io">
          <span class="eyebrow">Ważne informacje</span>
          <h3>Zlecenia wykonawcze</h3>
          <p>Na ten moment nie przyjmuję prywatnych zleceń wykonawczych.</p>
          <h3>Organizacja warsztatów ciesielskich i stolarskich</h3>
          <p>Warsztaty stacjonarne wyjazdowe organizuję wyłącznie dla absolwentów Drew oraz organizacji społecznych i podmiotów działających na rzecz pożytku publicznego.</p>
        </div>
      </section>

      <!-- ===== Kontakt ===== -->
      <section class="section container" style="padding-top: 0">
        <div class="about-cta io">
          <div class="about-cta__bg"><img src="/assets/forest-3.avif" alt="Korony świerków we mgle" /></div>
          <div class="about-cta__scrim" />
          <div class="about-cta__inner">
            <span class="eyebrow eyebrow--ondark">Kontakt</span>
            <h2>Chcesz coś postrugać? Napisz.</h2>
            <div class="about-cta__actions">
              <a class="btn btn--on-dark btn--md" href="mailto:kontakt@drwa.pl">
                kontakt@drwa.pl
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <DrwaFooter />
  </div>
</template>

<script setup>
useHead({
  title: 'Oferta — DRWA',
})

const OFFERS = [
  {
    title: 'Warsztaty dla firm',
    text: [
      'Twórczy i przyjemny pomysł na integrację Twojego zespołu — organizujemy warsztaty stolarskie i ciesielskie w duchu pracy zespołowej. Wspólne budowanie z drewna w naturalnym otoczeniu to okazja zarówno do rozwoju, jak i do odpoczynku.',
      'Program, czas trwania i zakres wydarzenia dostosowujemy do potrzeb grupy.',
    ],
  },
  {
    title: 'Warsztaty dla dzieci, rodzin i grup',
    text: [
      'Prowadzimy zajęcia dla dzieci, rodzin, par i grup międzypokoleniowych. Program dostosowujemy do wieku, możliwości i umiejętności uczestników.',
      'Pokazujemy, że praca własnymi rękami jest źródłem radości, samodzielności i satysfakcji — niezależnie od doświadczenia.',
    ],
  },
  {
    title: 'Współpraca i projekty specjalne',
    text: [
      'Jesteśmy otwarci na współpracę z organizacjami społecznymi, fundacjami, stowarzyszeniami, instytucjami kultury i edukacji oraz inicjatywami lokalnymi.',
      'Możemy wspólnie przygotować warsztaty, wydarzenia edukacyjne, projekty związane z tradycyjnym rzemiosłem i lokalnym dziedzictwem, a także wspólne realizacje drewnianych obiektów.',
    ],
  },
  {
    title: 'Wydarzenia z noclegiem i wyżywieniem',
    text: [
      'Możemy zorganizować kilkudniowe spotkania i warsztaty połączone z zakwaterowaniem i wyżywieniem.',
      'To propozycja dla firm, grup i organizacji, które chcą połączyć edukację, wspólne działanie i odpoczynek w otoczeniu przyrody. Nasza baza — Dolina Harmonii w Górach Izerskich — to magiczne miejsce, które idealnie nadaje się do tego celu.',
      'Zakres i możliwości organizacyjne ustalamy indywidualnie.',
    ],
  },
  {
    title: 'Konsultacje i wsparcie projektowe',
    text: [
      'Planujesz własną konstrukcję z drewna i potrzebujesz wsparcia doświadczonego cieśli?',
      'Oferuję konsultacje dotyczące projektowania, rozwiązań konstrukcyjnych, tradycyjnych połączeń ciesielskich, doboru materiałów i organizacji budowy.',
      'Możemy porozmawiać telefonicznie lub mailowo, na podstawie potrzeb oraz przesłanych szkiców, zdjęć i projektów. Zakres i koszt konsultacji ustalamy indywidualnie.',
    ],
  },
]

useScrollReveal()
</script>
