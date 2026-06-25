<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <section class="about-hero">
      <div class="about-hero__bg"><img src="/assets/forest-1.png" alt="Las świerkowy we mgle" /></div>
      <div class="about-hero__scrim" />
      <div class="container">
        <div class="about-hero__inner">
          <span class="eyebrow eyebrow--ondark">O nas · Drewno · Rzemiosło · Szkolenia</span>
          <h1>Pracujemy z drewnem. I z ludźmi.</h1>
          <p>DRWA to mała pracownia ciesielska i społeczność, która wokół niej rośnie. Uczymy pracy z drewnem, budujemy naturalnie i piszemy o tym, czego las uczy nas po drodze.</p>
        </div>
      </div>
    </section>

    <main id="main-content">
      <!-- ===== Historia ===== -->
      <section class="section container">
        <div class="story">
          <div class="story__text io">
            <span class="eyebrow">Skąd się wzięło DRWA</span>
            <h2>Od jednego dłuta do wspólnego stołu</h2>
            <p>DRWA zaczęło się od warsztatu — dosłownie: od stołu, paru dłut i przekonania, że praca z drewnem jest zbyt dobra, żeby zatrzymywać ją dla siebie. Pierwsze warsztaty odbyły się dla znajomych. Potem znajomi przyprowadzili znajomych.</p>
            <p>Dziś DRWA to trzy nurty jednej rzeki: stacjonarne warsztaty ciesielskie, mały sklep z rzeczami, które sami nosimy, i blog o naturalnym budownictwie. Wszystko w tym samym duchu — powoli, uczciwie, blisko lasu.</p>
          </div>
          <figure class="story__img io">
            <img src="/assets/timber-2.png" alt="Belki drewniane w pracowni DRWA" />
          </figure>
        </div>
      </section>

      <!-- ===== Założyciel ===== -->
      <section class="founder-wrap">
        <div class="section container">
          <div class="founder">
            <figure class="founder__photo io">
              <img class="founder__img" src="/Jedrzej.avif" alt="Jędrzej Cyganik — założyciel DRWA" />
            </figure>
            <div class="founder__body io">
              <span class="eyebrow">Założyciel</span>
              <h2>Jędrzej Cyganik</h2>
              <p class="founder__role">Cieśla · prowadzący warsztaty · autor bloga</p>
              <p>Jędrzej założył DRWA, żeby połączyć dwie rzeczy, bez których nie umie żyć: pracę z drewnem i ludzi. Jest entuzjastą naturalnego budownictwa i ekologii — wierzy, że dom można postawić z tego, co rośnie obok, i że najlepsza wiedza przechodzi z rąk do rąk, przy wspólnym stole.</p>
              <p>Na warsztatach uczy od pierwszego cięcia: jak czytać słoje, jak ostrzyć, jak łączyć drewno bez gwoździ. A wieczorami, przy ognisku, najchętniej słucha.</p>
              <blockquote class="founder__quote">
                „Drewno pamięta. Każda deska przechowuje swoje suche i mokre lata — naszą robotą jest to uszanować.”
                <cite>Jędrzej Cyganik · DRWA</cite>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Trzy nurty ===== -->
      <section class="section--tight container">
        <div class="sec-head sec-head--center io">
          <span class="eyebrow">Co robimy</span>
          <h2>Trzy nurty jednej rzeki</h2>
        </div>
        <div class="strands">
          <NuxtLink class="strand io" to="/warsztaty">
            <div class="strand__ic">
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M14 12 3 23"/><path d="M18 2 8 12l4 4L22 6a2.83 2.83 0 0 0-4-4Z"/>
              </svg>
            </div>
            <h3>Warsztaty stacjonarne</h3>
            <p>Ciesielstwo od podstaw — w pracowni i w terenie, w małych grupach.</p>
            <span class="strand__go">
              Zobacz terminy
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </NuxtLink>
          <NuxtLink class="strand io" to="/sklep">
            <div class="strand__ic">
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <h3>Sklep · Merch</h3>
            <p>Bluzy i koszulki z bawełny organicznej, ze znakiem DRWA.</p>
            <span class="strand__go">
              Do sklepu
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </NuxtLink>
          <NuxtLink class="strand io" to="/blog">
            <div class="strand__ic">
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>
              </svg>
            </div>
            <h3>Blog · Z lasu</h3>
            <p>Notatki o drewnie, naturalnym budownictwie i ekologii.</p>
            <span class="strand__go">
              Poczytaj
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </NuxtLink>
        </div>
      </section>

      <!-- ===== Zaproszenie ===== -->
      <section class="section container">
        <div class="about-cta io">
          <div class="about-cta__bg"><img src="/assets/forest-3.png" alt="Korony świerków we mgle" /></div>
          <div class="about-cta__scrim" />
          <div class="about-cta__inner">
            <span class="eyebrow eyebrow--ondark">Poznajmy się</span>
            <h2>Najlepiej poznać nas przy pracy</h2>
            <p>Przyjedź na warsztat — dzień przy stole z dłutem powie o DRWA więcej niż każda strona „o nas”.</p>
            <div class="about-cta__actions">
              <NuxtLink class="btn btn--on-dark btn--md" to="/warsztaty">
                Zobacz warsztaty
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- ===== Stopka ===== -->
    <footer class="foot">
      <div class="container">
        <div class="foot__top">
          <div class="foot__brand">
            <div class="brandrow">
              <img src="/assets/drwa-mark.png" alt="DRWA" />
              <span class="wm">DRWA</span>
            </div>
            <p>Drewno, rzemiosło i szkolenia. Pracujemy z drewnem i budujemy wokół niego społeczność — w duchu natury i ekologii.</p>
          </div>
          <div>
            <h4>DRWA</h4>
            <ul>
              <li><NuxtLink to="/warsztaty">Warsztaty 2026</NuxtLink></li>
              <li><NuxtLink to="/kursy/od-wiaty-do-chaty">Kursy online</NuxtLink></li>
              <li><NuxtLink to="/sklep">Sklep · Merch</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4>Czytaj</h4>
            <ul>
              <li><NuxtLink to="/blog">Blog · Z lasu</NuxtLink></li>
              <li><NuxtLink to="/blog/dlaczego-budujemy-z-drewna">Dlaczego budujemy z drewna</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li><a href="mailto:czesc@drwa.pl">czesc@drwa.pl</a></li>
              <li><NuxtLink to="/">Strona główna</NuxtLink></li>
            </ul>
          </div>
        </div>
        <div class="foot__bottom">
          <span>© 2026 DRWA · Drewno · Rzemiosło · Szkolenia</span>
          <div class="foot__social">
            <a aria-label="Instagram" href="#">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>
              </svg>
            </a>
            <a aria-label="Facebook" href="#">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a aria-label="YouTube" href="#">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                <path d="m9.75 15.02 5.75-3.27-5.75-3.27v6.54z"/>
              </svg>
            </a>
            <a aria-label="E-mail" href="mailto:czesc@drwa.pl">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
useHead({
  title: 'O nas — DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

useScrollReveal()
</script>
