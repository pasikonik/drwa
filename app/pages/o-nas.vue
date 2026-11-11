<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <DrwaPageHero>
      <template #bg><img src="/assets/forest-1.avif" alt="Las świerkowy we mgle" /></template>
      <template #eyebrow>O nas · Ludzie · Drewno · Las</template>
      <template #title>Pracujemy z drewnem i z ludźmi.</template>
      <template #lead>Drwa to pracownia rzemiosła drzewnego i społeczność, która wokół niej rośnie. Uczymy pracy z drewnem, budujemy naturalne domy i zdrowe relacje z ludźmi, z naturą i z samymi sobą. I nie zapominamy chodzić do lasu!</template>
    </DrwaPageHero>

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
            <img src="/assets/onas-story.avif" alt="Cieśle Drew przy pracy w stolarni" />
          </figure>
        </div>
      </section>

      <!-- ===== Założyciel ===== -->
      <section class="founder-wrap">
        <div class="section container">
          <div class="founder">
            <figure class="founder__photo io">
              <img class="founder__img" src="/Jedrzej.avif" alt="Jędrzej „Pan Skrzat” Cyganik — założyciel DRWA" />
            </figure>
            <div class="founder__body io">
              <span class="eyebrow">Założyciel</span>
              <h2>Jędrzej „Pan Skrzat” Cyganik</h2>
              <p class="founder__role">Cieśla · instruktor · gospodarz · twórca Drew</p>
              <p>Po studiach literaturoznawczych odbył podróż formacyjną do Kanady, gdzie odkrył poezję zapisaną w słojach czerwonych cedrów. Od tamtego czasu interpretuje kolejne bale, kantówki i konary rozmaitych gatunków, składając je w użyteczne całości.</p>
              <p>Przez lata prowadził działalność rzemieślniczą, wykonując zlecenia dla klientów indywidualnych — naturalne domy, altany, tarasy, zabudowy lokali usługowych, meble i rzeźby na zamówienie.</p>
              <p>Dziś uczy innych, jak to robić. Stworzył autorską formułę warsztatów, w której uczniowie, instruktorzy i inwestor współpracują w celu uzyskania wspólnej korzyści. Uwielbia budowanie z ludźmi i naukę, która z tego płynie.</p>
              <p>Od lat dzieli się wiedzą w internecie, tworząc darmowe artykuły, filmy i tutoriale oraz płatne kursy online. Na co dzień współprowadzi rodzinne siedlisko agroturystyczne, gdzie buduje nowe rzeczy i remontuje stare, uprawia ogród, hoduje owce i sadzi drzewa.</p>
              <p class="founder__closing">Z domu góral, z wyboru Izerianin, z serca Ziemianin, miłośnik Życia w każdej formie.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Gregory Paszyński ===== -->
      <section class="founder-wrap founder-wrap--alt">
        <div class="section container">
          <div class="founder">
            <figure class="founder__photo io">
              <img class="founder__img" src="/Gregory.avif" alt="Gregory Paszyński — instruktor DRWA" />
            </figure>
            <div class="founder__body io">
              <h2>Gregory Paszyński</h2>
              <p class="founder__role">Instruktor · nauczyciel pracy z drewnem · gospodarz</p>
              <p>Nauczyciel pracy z drewnem, muzyki i języka angielskiego — współprowadzi warsztaty Drew od samego początku tej działalności. Miłośnik tradycyjnych metod, ostrych narzędzi i piękna w każdej postaci — najbardziej lubi je znajdować w harmonijnym krajobrazie, w rysunkach słojów i w swoim najbliższym otoczeniu. Sam wytwarza piękne przedmioty z drewna, od tradycyjnych konstrukcji, przez solidne, lite meble, po snycerskie majstersztyki.</p>
              <p>Oprócz tego rzeźbi w terenie i obsadza krawędzie leśnymi ogrodami. Absolwent studiów agroleśniczych i Permaculture Design Course, dzieli się tą wiedzą podczas warsztatów i pomaga innym planować funkcjonalne i estetyczne siedliska. Sam od lat remontuje stary poniemiecki dom i rozwija swoje gospodarstwo.</p>
              <p>Urodzony w Anglii native speaker, piewca polskiej mowy i nosiciel nietuzinkowego poczucia humoru. Głowa rodziny i gospodarz, członek dwóch zespołów muzycznych i lokalnych inicjatyw społecznych. Lubi pogadać — i dobrze gada!</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Michał „Igła" Kiełbik ===== -->
      <section class="founder-wrap" id="kadra">
        <div class="section container">
          <div class="founder founder--compact">
            <figure class="founder__photo io">
              <img class="founder__img" src="/Igla.avif" alt="Michał „Igła” Kiełbik" />
            </figure>
            <div class="founder__body io">
              <h3 class="founder__compact-name">Michał „Igła" Kiełbik</h3>
              <p class="founder__role">Instruktor · złota rączka</p>
              <p>Fachowiec, złota rączka. Po warsztatach Drew rzucił pracę biurową i zaczął pracować rękami. Drewno to tylko jeden z obszarów jego zainteresowań — dachówka na stolarni Drew to jedno z jego arcydzieł. Po kilku latach pracy na budowach otworzył we Wrocławiu własną działalność — Złota Rączka — pomaga naprawiać usterki i gasi pożary. Czasami zasila kadrę instruktorską Drew i współpracuje przy warsztatach, szczególnie kiedy trzeba zbudować coś dużego.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Michał „Olej" Olejniczak ===== -->
      <section class="founder-wrap founder-wrap--alt">
        <div class="section container">
          <div class="founder founder--compact">
            <figure class="founder__photo io">
              <img class="founder__img" src="/olej.avif" alt="Michał &quot;Olej&quot; Olejniczak" />
            </figure>
            <div class="founder__body io">
              <h3 class="founder__compact-name">Michał „Olej" Olejniczak</h3>
              <p class="founder__role">Instruktor · Web Master · Rzeźbiarz</p>
              <p>Postprogramista i twórca tej strony, który zamienił cyfrowy świat na zapach żywicy i pracę z naturalnym surowcem. Każda nowa próba w stolarstwie szybko przeradzała się u niego w prawdziwą pasję — od precyzyjnego rzeźbienia i małych form, po ambitne konstrukcje.</p>
              <p>Fascynuje go koncepcja małych przestrzeni, dlatego obecnie własnoręcznie buduje swój domek na kółkach. Wierzy, że powrót do rzemiosła i dokładanie swojej „beleczki” do wspólnego dobra to jedyny słuszny kierunek dla naszej planety. Na co dzień wybiera minimalizm, żyjąc blisko natury i w zgodzie z jej naturalnym rytmem.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Paweł „dulare" Dulak ===== -->
      <section class="founder-wrap">
        <div class="section container">
          <div class="founder founder--compact">
            <figure class="founder__photo io">
              <img class="founder__img" src="/Pawel.avif" alt="Paweł „dulare” Dulak" />
            </figure>
            <div class="founder__body io">
              <h3 class="founder__compact-name">Paweł „dulare" Dulak</h3>
              <p class="founder__role">Programista · stolarz z zamiłowania</p>
              <p>Programista, stolarz z zamiłowania. Programowaniem zajmował sie jeszcze w ubiegłym stuleciu i do dziś siedzi po uszy w dziwnych znaczkach na ciemnym tle. Drewno stało się jego sposobem na oderwanie od technologii – piła zamiast klawiatury, hebel zamiast terminala. Robi meble i inne drewniane przydasie na własne potrzeby, ucząc się rzemiosła, bo uczenie się nowych rzeczy to jego druga natura.</p>
              <p>Poza pracą i drewnem – człowiek wielu równoległych zainteresowań: góry, fotografia, książki, podróże i pytania, na które nie ma łatwych odpowiedzi. Mąż i ojciec, dla którego bycie ciągle w ruchu (fizycznie i intelektualnie) jest naturalnym stanem.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Karol Sprawka ===== -->
      <section class="founder-wrap founder-wrap--alt">
        <div class="section container">
          <div class="founder founder--compact">
            <figure class="founder__photo io">
              <!-- shortcut: brak zdjęcia — podmienić na <img class="founder__img"> jak u reszty, gdy przyjdzie -->
              <div class="founder__placeholder" aria-hidden="true">KS</div>
            </figure>
            <div class="founder__body io">
              <h3 class="founder__compact-name">Karol Sprawka</h3>
              <p class="founder__role">Budowniczy · facylitator · łącznik światów</p>
              <p>Wędrowny budowniczy, łącznik światów i skrzat o wielkim sercu. Od lat buduje z Drwami i wspiera prowadzenie warsztatów ciesielskich. Sam uczy pracy z emocjami i współtworzy leśne wyprawy męskie jako facylitator i wuefista, trzyma kręgi i przestrzeń dla procesów.</p>
              <p>Przez wiele lat związany ze szkołą Possibility Management, obecnie czerpie z różnych nurtów, które wspierają rozwój osobisty, szczególnie z mądrości ludów rdzennych i z wielkiej księgi Natury. Uważny słuchacz dający oparcie w trudnych momentach, ale też psotnik i pląsacz, z którym można bawić się do rana. Do tańca, do różańca i do roboty. He-Hej!</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Kadra — reszta ===== -->
      <section class="section container">
        <div class="crew-more io">
          <div v-for="n in CREW_NAMES" :key="n" class="crew-chip">
            <span class="crew-chip__avatar">{{ initials(n) }}</span>
            <span class="crew-chip__name">{{ n }}</span>
          </div>
        </div>
        <p class="crew-more__note io">Profile w przygotowaniu — już niedługo więcej o każdej z tych osób.</p>
      </section>

      <!-- ===== Zaproszenie ===== -->
      <section class="section container">
        <div class="about-cta io">
          <div class="about-cta__bg"><img src="/assets/poznaj-band.avif" alt="Cieśle Drew przy pracy w stolarni" /></div>
          <div class="about-cta__scrim" />
          <div class="about-cta__inner">
            <span class="eyebrow eyebrow--ondark">Poznajmy się</span>
            <h2>Najlepiej poznać nas przy pracy</h2>
            <p>Przyjedź na warsztat — dzień ze strugiem i dłutem powie o Drwach więcej niż wszystkie strony „o nas”.</p>
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

// Profile Jędrzeja, Gregory'ego, Michałów, Pawła i Karola są wpisane wprost w szablonie
// (jak founder) — reszta kadry czeka na materiały, na razie tylko lista
// nazwisk (patrz CREW_NAMES).
const CREW_NAMES = [
  'Grzegorz „Saper" Wieczorek',
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
