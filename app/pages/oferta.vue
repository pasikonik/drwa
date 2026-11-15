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

        <!-- ===== Formy współpracy: przyklejony spis po lewej + karty ===== -->
        <div class="oferta-layout">
          <nav class="oferta-index" aria-label="Formy współpracy">
            <span class="eyebrow">Formy współpracy</span>
            <ol>
              <li v-for="(o, i) in OFFERS" :key="o.id">
                <a :href="`#${o.id}`" :class="{ 'is-active': active === o.id }" :aria-current="active === o.id ? 'true' : undefined">
                  <span class="oferta-index__num">{{ num(i) }}</span>
                  <span>{{ o.title }}</span>
                </a>
              </li>
            </ol>
            <p class="oferta-index__more">Masz pomysł spoza listy? <a href="mailto:kontakt@drwa.pl">Napisz do nas</a>.</p>
          </nav>

          <div class="oferta-list">
            <article
              v-for="(o, i) in OFFERS"
              :id="o.id"
              :key="o.id"
              class="oferta-item io"
              :data-active="active === o.id || undefined"
            >
              <span class="oferta-item__num" aria-hidden="true">{{ num(i) }}</span>
              <div class="oferta-item__body">
                <header class="oferta-item__head">
                  <h2 class="oferta-item__title">{{ o.title }}</h2>
                  <span class="oferta-item__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" v-html="o.icon" />
                  </span>
                </header>
                <ul class="oferta-item__tags">
                  <li v-for="t in o.tags" :key="t">{{ t }}</li>
                </ul>
                <p v-for="t in o.text" :key="t">{{ t }}</p>
                <footer class="oferta-item__foot">
                  <a class="oferta-item__cta" :href="mailto(o.title)">
                    Zapytaj o ten format
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </footer>
              </div>
            </article>
          </div>
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
        <div class="about-cta about-cta--oferta io">
          <div class="about-cta__bg"><img src="/assets/oferta-cta.avif" alt="Cieśle Drew z psem w stolarni" /></div>
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
    id: 'firmy',
    title: 'Warsztaty dla firm',
    tags: ['Integracja zespołu', 'Program na miarę'],
    icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    text: [
      'Twórczy i przyjemny pomysł na integrację Twojego zespołu — organizujemy warsztaty stolarskie i ciesielskie w duchu pracy zespołowej. Wspólne budowanie z drewna w naturalnym otoczeniu to okazja zarówno do rozwoju, jak i do odpoczynku.',
      'Program, czas trwania i zakres wydarzenia dostosowujemy do potrzeb grupy.',
    ],
  },
  {
    id: 'dzieci-rodziny-grupy',
    title: 'Warsztaty dla dzieci, rodzin i grup',
    tags: ['Dzieci i rodziny', 'Grupy międzypokoleniowe', 'Bez doświadczenia'],
    icon: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
    text: [
      'Prowadzimy zajęcia dla dzieci, rodzin, par i grup międzypokoleniowych. Program dostosowujemy do wieku, możliwości i umiejętności uczestników.',
      'Pokazujemy, że praca własnymi rękami jest źródłem radości, samodzielności i satysfakcji — niezależnie od doświadczenia.',
    ],
  },
  {
    id: 'wspolpraca',
    title: 'Współpraca i projekty specjalne',
    tags: ['Organizacje społeczne', 'Kultura i edukacja', 'Inicjatywy lokalne'],
    icon: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
    text: [
      'Jesteśmy otwarci na współpracę z organizacjami społecznymi, fundacjami, stowarzyszeniami, instytucjami kultury i edukacji oraz inicjatywami lokalnymi.',
      'Możemy wspólnie przygotować warsztaty, wydarzenia edukacyjne, projekty związane z tradycyjnym rzemiosłem i lokalnym dziedzictwem, a także wspólne realizacje drewnianych obiektów.',
    ],
  },
  {
    id: 'wydarzenia-z-noclegiem',
    title: 'Wydarzenia z noclegiem i wyżywieniem',
    tags: ['Kilka dni', 'Nocleg i wyżywienie', 'Góry Izerskie'],
    icon: '<path d="M3.5 21 14 3"/><path d="M20.5 21 10 3"/><path d="M15.5 21 12 15l-3.5 6"/><path d="M2 21h20"/>',
    text: [
      'Możemy zorganizować kilkudniowe spotkania i warsztaty połączone z zakwaterowaniem i wyżywieniem.',
      'To propozycja dla firm, grup i organizacji, które chcą połączyć edukację, wspólne działanie i odpoczynek w otoczeniu przyrody. Nasza baza — Dolina Harmonii w Górach Izerskich — to magiczne miejsce, które idealnie nadaje się do tego celu.',
      'Zakres i możliwości organizacyjne ustalamy indywidualnie.',
    ],
  },
  {
    id: 'konsultacje',
    title: 'Konsultacje i wsparcie projektowe',
    tags: ['Telefon lub e-mail', 'Wycena indywidualna'],
    icon: '<path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"/><path d="m8 6 2-2"/><path d="m18 16 2-2"/><path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"/><path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/><path d="m15 5 4 4"/>',
    text: [
      'Planujesz własną konstrukcję z drewna i potrzebujesz wsparcia doświadczonego cieśli?',
      'Oferuję konsultacje dotyczące projektowania, rozwiązań konstrukcyjnych, tradycyjnych połączeń ciesielskich, doboru materiałów i organizacji budowy.',
      'Możemy porozmawiać telefonicznie lub mailowo, na podstawie potrzeb oraz przesłanych szkiców, zdjęć i projektów. Zakres i koszt konsultacji ustalamy indywidualnie.',
    ],
  },
]

const num = (i) => String(i + 1).padStart(2, '0')
const mailto = (title) => `mailto:kontakt@drwa.pl?subject=${encodeURIComponent(`Zapytanie: ${title}`)}`

// Scroll-spy: podświetla w spisie formę, której karta przecina pasek ~35–40% wysokości okna.
const active = ref(OFFERS[0].id)
let spy
onMounted(() => {
  spy = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) active.value = e.target.id
  }, { rootMargin: '-35% 0px -60% 0px' })
  for (const o of OFFERS) {
    const el = document.getElementById(o.id)
    if (el) spy.observe(el)
  }
})
onBeforeUnmount(() => spy?.disconnect())

useScrollReveal()
</script>
