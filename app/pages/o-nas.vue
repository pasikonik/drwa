<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <section class="phero">
      <div class="phero__bg"><img src="/assets/forest-1.avif" alt="Las świerkowy we mgle" /></div>
      <div class="phero__scrim" />
      <div class="container phero__inner">
        <span class="eyebrow eyebrow--ondark">O nas · Ludzie · Drewno · Las</span>
        <h1>Pracujemy z drewnem i z ludźmi.</h1>
        <p class="phero__lead">Drwa to pracownia rzemiosła drzewnego i społeczność, która wokół niej rośnie. Uczymy pracy z drewnem, budujemy naturalne domy i zdrowe relacje z ludźmi, z naturą i z samymi sobą. I nie zapominamy chodzić do lasu!</p>
      </div>
    </section>

    <main id="main-content">
      <!-- ===== Historia ===== -->
      <section class="section container">
        <div class="story">
          <div class="story__text io">
            <span class="eyebrow">Skąd wyrosły Drwa</span>
            <h2>Na początku był las.</h2>
            <p>A tam zapach sosnowej żywicy i butwienia, ściółka z mchu, bezpieczne schronienie pod koronami niebosiężnych drzew. I dużo patyków — szałasów i ognisk. Czas wolności i eksploracji, leśnych przygód i poznawania świata.</p>
            <p>Z tych nauk wyrosła szkoła Drew, w której do dziś budujemy schronienia (choć z trochę innych patyków) i uczymy się od świerków i brzóz. Spotykamy się przy stole warsztatowym, by wspólnie tworzyć w drewnie, poznawać świat i siebie nawzajem. Siadamy przy ogniu, by dzielić historie i pieśni.</p>
            <p>Cenimy piękno i siłę natury, która daje nam materiał do obróbki i nieskończoną inspirację form i kształtów. Cenimy też pracę ludzkich rąk i dzieła ludzkiego umysłu — czerpiemy z wielowiekowej tradycji pracy z drewnem oraz ze współczesnych narzędzi i metod.</p>
            <p>W efekcie tworzymy drewniane obiekty — solidne konstrukcje, naturalne domy, meble i przedmioty codziennego użytku, rzeźby i ozdoby. Uczymy innych, jak to robić dobrze, czyli skutecznie i z przyjemnością.</p>
            <p>Kochamy smak lipowych wiórów o poranku, dźwięk ostrego hebla na suchym drewnie i zapach lasu po deszczu.</p>
          </div>
          <figure class="story__img io">
            <img src="/assets/tile-o-nas.avif" alt="Znak DRWA na tle lasu w Górach Izerskich" />
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
              <p class="founder__role">Cieśla · instruktor · gospodarz · twórca Drew</p>
              <p>Po studiach literaturoznawczych odbył podróż formacyjną do Kanady, gdzie odkrył poezję zapisaną w słojach czerwonych cedrów. Od tamtego czasu interpretuje kolejne bale, kantówki i konary rozmaitych gatunków, składając je w użyteczne całości.</p>
              <p>Przez lata prowadził działalność rzemieślniczą, wykonując zlecenia dla klientów indywidualnych — naturalne domy, altany, tarasy, zabudowy lokali usługowych, meble i rzeźby na zamówienie.</p>
              <p>Dziś uczy innych, jak to robić. Stworzył autorską formułę warsztatów, w której uczniowie, instruktorzy i inwestor współpracują w celu uzyskania wspólnej korzyści. Uwielbia budowanie z ludźmi i naukę, która z tego płynie.</p>
              <p>Od lat dzieli się wiedzą w internecie, tworząc darmowe artykuły, filmy i tutoriale oraz płatne kursy online. Na co dzień współprowadzi rodzinne siedlisko agroturystyczne, gdzie buduje nowe rzeczy i remontuje stare, uprawia ogród, hoduje owce i sadzi drzewa.</p>
              <p class="founder__closing">Z domu góral, z wyboru Izerianin, z serca mieszkaniec Ziemi i sługa życia — w poszukiwaniu głębokiego rozumienia jego ewolucji.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Kadra ===== -->
      <section class="section container" id="kadra">
        <div class="sec-head io">
          <span class="eyebrow">Zespół</span>
          <h2>Kadra Drew</h2>
          <p>Za Jędrzejem stoi grono instruktorów i pomocników, którzy razem tworzą warsztaty i stolarnię Drew.</p>
        </div>

        <div class="crew-grid">
          <div v-for="c in CREW" :key="c.name" class="crew-card io">
            <div class="crew-card__avatar">{{ initials(c.name) }}</div>
            <div>
              <h3 class="crew-card__name">{{ c.name }}</h3>
              <p class="crew-card__role">{{ c.role }}</p>
              <p class="crew-card__bio">{{ c.bio }}</p>
            </div>
          </div>
        </div>

        <div class="crew-more io">
          <div v-for="n in CREW_NAMES" :key="n" class="crew-chip">
            <span class="crew-chip__avatar">{{ initials(n) }}</span>
            <span class="crew-chip__name">{{ n }}</span>
          </div>
        </div>
        <p class="crew-more__note io">Profile w przygotowaniu — już niedługo więcej o każdej z tych osób.</p>
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
            <h3>Blog · Zapiski drzewne</h3>
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
          <div class="about-cta__bg"><img src="/assets/forest-3.avif" alt="Korony świerków we mgle" /></div>
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
    <DrwaFooter />
  </div>
</template>

<script setup>
useHead({
  title: 'O nas — DRWA',
})

// Bio dopisane dla osób, dla których mamy realny tekst źródłowy; reszta
// kadry czeka na materiały — na razie tylko lista nazwisk (patrz CREW_NAMES).
const CREW = [
  {
    name: 'Gregory Paszyński',
    role: 'Instruktor · nauczyciel pracy z drewnem',
    bio: 'Nauczyciel pracy z drewnem, muzyki i języka angielskiego — współprowadzi warsztaty Drew od samego początku. Miłośnik tradycyjnych metod i ostrych narzędzi, absolwent studiów agroleśniczych i Permaculture Design Course. Sam wytwarza przedmioty z drewna, od konstrukcji po snycerskie majstersztyki, i pomaga planować funkcjonalne, estetyczne siedliska.',
  },
  {
    name: 'Michał „Igła" Kiełbik',
    role: 'Instruktor · złota rączka',
    bio: 'Fachowiec, złota rączka. Po warsztatach Drew rzucił pracę biurową i zaczął pracować rękami — dachówka na stolarni Drew to jedno z jego arcydzieł. Po kilku latach pracy na budowach otworzył własną działalność we Wrocławiu. Czasami zasila kadrę instruktorską Drew, szczególnie kiedy trzeba zbudować coś dużego.',
  },
]

const CREW_NAMES = [
  'Karol Sprawka',
  'Michał „Olej" Olejniczak',
  'Grzegorz „Saper" Wieczorek',
  'Paweł Dulak',
]

function initials(name) {
  return name
    .replace(/„[^"]*"/g, '')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

useScrollReveal()
</script>
