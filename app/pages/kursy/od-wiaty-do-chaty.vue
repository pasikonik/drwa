<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero (wariant: Podział) ===== -->
    <section class="khero khero--paper" id="top">
      <div class="container khero__inner">
        <div>
          <div class="khero__crumb">
            <NuxtLink to="/">DRWA</NuxtLink>
            <span class="sep">·</span>
            <span>Kurs online</span>
            <span class="sep">·</span>
            <span class="cur">Od wiaty do chaty</span>
          </div>
          <p class="khero__kicker">Chcesz samodzielnie tworzyć drewniane konstrukcje?</p>
          <h1>Od wiaty do chaty</h1>
          <p class="khero__lead">Kurs online, w którym krok po kroku nauczę cię, jak zbudować małą drewnianą konstrukcję — od fundamentu po dach.</p>
          <div class="khero__meta">
            <span class="khero__fact">
              <!-- Clock -->
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              24 h lekcji wideo
            </span>
            <span class="khero__fact">
              <!-- Compass -->
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>
              </svg>
              własne tempo
            </span>
            <span class="khero__fact">
              <!-- Calendar -->
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              dostęp przez 3 lata
            </span>
          </div>
          <p class="khero__by">Prowadzi Jędrzej Cyganik <span class="sep">·</span> DRWA</p>
          <div class="khero__cta">
            <button class="btn btn--primary btn--lg" @click="scrollTo('cena')">Dołącz do kursu — 1 200 zł</button>
            <button class="btn btn--secondary btn--lg" @click="scrollTo('program')">Zobacz program</button>
          </div>
        </div>
        <figure class="khero__media" style="margin:0">
          <img src="/assets/kurs-hero.png" alt="Jędrzej przy szkielecie domku kursowego" />
        </figure>
      </div>
    </section>

    <!-- ===== Pas liczb ===== -->
    <section class="kstats" aria-label="Kurs w liczbach">
      <div class="container">
        <div class="kstats__row">
          <div v-for="s in STATS" :key="s.label" class="kstat">
            <div class="kstat__num">{{ s.num }}</div>
            <div class="kstat__label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <main id="main-content">
      <!-- ===== Co zbudujesz ===== -->
      <section class="section container" id="zbudujesz">
        <div class="sec-head io">
          <span class="eyebrow">Co zbudujesz</span>
          <h2>Jedna budowa, trzy przystanki</h2>
          <p>W kursie zobaczysz, jak buduję domek 3,5 × 5 m krok po kroku — „od wiaty do chaty". Możesz budować ze mną i sam zdecydować, na którym etapie kończysz. Albo wykorzystać tę wiedzę do konstrukcji własnego pomysłu.</p>
        </div>
        <div class="builds io">
          <article v-for="b in BUILDS" :key="b.name" class="build">
            <div class="build__img">
              <img :src="b.img" :alt="'Wizualizacja: ' + b.name" />
            </div>
            <div class="build__body">
              <span class="build__eyebrow">{{ b.stage }}</span>
              <h3 class="build__title">{{ b.name }}</h3>
              <p class="build__desc">{{ b.desc }}</p>
            </div>
          </article>
        </div>
      </section>

      <!-- ===== Specyfikacja + narzędziownik ===== -->
      <section class="section container" id="specyfikacja" style="padding-top:0">
        <div class="spectools io">
          <div class="drwa-card drwa-card--pad">
            <h3 class="panel-title">Kursowy domek — chata</h3>
            <p class="panel-sub">Specyfikacja konstrukcji, którą prowadzę przez cały kurs.</p>
            <dl class="spec">
              <div v-for="r in SPEC" :key="r.t" class="spec__row">
                <dt>{{ r.t }}</dt>
                <dd>{{ r.d }}</dd>
              </div>
            </dl>
          </div>
          <div class="drwa-card drwa-card--pad">
            <h3 class="panel-title">Narzędziownik</h3>
            <p class="panel-sub">Nie musisz mieć wielu drogich elektronarzędzi. W kursie stawiam na pracę narzędziami ręcznymi — elektronarzędzia tylko tam, gdzie naprawdę usprawniają robotę.</p>
            <div v-for="g in TOOLS" :key="g.g" class="toolgroup">
              <h4>{{ g.g }}</h4>
              <ul>
                <li v-for="it in g.items" :key="Array.isArray(it) ? it[0] : it">
                  {{ Array.isArray(it) ? it[0] : it }}
                  <small v-if="Array.isArray(it)">({{ it[1] }})</small>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Program — 12 modułów ===== -->
      <section class="section container" id="program" style="padding-top:0">
        <div class="sec-head io">
          <span class="eyebrow">Program</span>
          <h2>Dwanaście modułów, jeden domek</h2>
          <p>Od wprowadzenia i projektu, przez fundamenty i więźbę, po okna i drzwi. Każdy moduł to instrukcje wideo i materiały opisowe.</p>
        </div>
        <div class="mods io">
          <article
            v-for="(m, i) in MODULES_DISPLAY"
            :key="m.key"
            class="mod"
            :class="{ 'is-open': openMod === i }"
          >
            <button
              class="mod__head"
              :aria-expanded="openMod === i"
              @click="openMod = openMod === i ? -1 : i"
            >
              <span class="mod__num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="mod__title">{{ m.title }}</span>
              <span class="mod__chev">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </span>
            </button>
            <div class="mod__body">
              <div class="mod__copy" v-html="m.descHtml" />
            </div>
          </article>
        </div>
        <div class="extras io">
          <div class="extra">
            <!-- Box icon -->
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
              <path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>
            </svg>
            <div>
              <div class="extra__name">Plik SketchUp</div>
              <div class="extra__desc">Model 3D · trzy wersje projektu</div>
            </div>
          </div>
          <div class="extra">
            <!-- Sheet icon -->
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
              <path d="M14 2v4a2 2 0 0 0 2 2h4M9 13h6M9 17h6"/>
            </svg>
            <div>
              <div class="extra__name">Rysunki techniczne</div>
              <div class="extra__desc">2D · pliki PDF do wydruku</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Historia absolwenta ===== -->
      <section class="story-sec section" id="historia">
        <div class="container story io">
          <figure class="story__photo" style="margin:0">
            <img src="/assets/kurs-chata.png" alt="Gotowy domek kursowy Przemka — drewniana chata na trawniku" />
          </figure>
          <div>
            <span class="eyebrow eyebrow--ondark">Historia absolwenta</span>
            <h2>Domek z kursu naprawdę stoi</h2>
            <blockquote style="margin:0">
              <p>„Jędrzej jest bardzo dobrym nauczycielem, a kurs jest solidnie skonstruowany. Nigdy nie zajmowałem się ciesielstwem i nie miałem pojęcia, czym się różni miecz od jętki. Obejrzenie wszystkiego «na sucho» sprawiło, że postanowiłem zbudować domek z projektu.</p>
              <p>W praktyce wszystko okazało się trudniejsze, ale nie trafiłem na żadną rzecz, którą musiałbym osobno googlować. Wystarczyło powtórzyć niektóre lekcje i potrenować na drewnie odpadowym. Nowe umiejętności już się przydają — a bez kursu na pewno bym się za to nie zabrał!"</p>
            </blockquote>
            <div class="story__by">
              <div class="story__avatar" aria-hidden="true">PM</div>
              <div>
                <div class="story__name">Przemek Müller</div>
                <div class="story__role">@thotep · absolwent kursu</div>
              </div>
            </div>
            <p class="story__note">Ta opinia to dla mnie najlepsza nagroda za ogrom pracy, jaką włożyłem w ten kurs. — Jędrzej</p>
          </div>
        </div>
      </section>

      <!-- ===== Bonusy ===== -->
      <section class="section container" id="bonusy">
        <div class="sec-head io">
          <span class="eyebrow">Bonusy</span>
          <h2>Trzy rzeczy ekstra</h2>
        </div>
        <div class="bonuses io">
          <article v-for="b in BONUSES" :key="b.num" class="bonus">
            <div class="bonus__top">
              <span class="bonus__num">{{ b.num }}</span>
              <component :is="b.icon" />
            </div>
            <h3 class="bonus__title">{{ b.title }}</h3>
            <p class="bonus__desc">{{ b.desc }}</p>
          </article>
        </div>
      </section>

      <!-- ===== Opinie uczestników ===== -->
      <section class="section container" id="opinie" style="padding-top:0">
        <div class="sec-head io">
          <span class="eyebrow">Opinie</span>
          <h2>Listy od budujących</h2>
          <p>Fragmenty maili od uczestników kursu.</p>
        </div>
        <div class="quotes io">
          <figure v-for="q in QUOTES" :key="q.name" class="quote" style="margin:0">
            <div class="quote__mark">„</div>
            <blockquote class="quote__text" style="margin:0">{{ q.text }}</blockquote>
            <figcaption class="quote__by">
              <div class="quote__avatar" aria-hidden="true">{{ initials(q.name) }}</div>
              <div>
                <div class="quote__name">{{ q.name }}</div>
                <div class="quote__role">uczestnik kursu</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      <!-- ===== Oferta / cena ===== -->
      <section class="offer-sec section" id="cena">
        <div class="container">
          <div class="sec-head sec-head--center io">
            <span class="eyebrow eyebrow--ondark">Dołącz do kursu</span>
            <h2>Oto wszystko, co otrzymasz</h2>
          </div>
          <div class="offer io">
            <div class="drwa-card drwa-card--pad">
              <div class="offer__head">
                <span class="eyebrow">Kurs online</span>
                <h3 class="offer__title">Od wiaty do chaty</h3>
              </div>
              <ul class="offer__list">
                <li v-for="o in OFFER" :key="o.b" :class="o.bonus ? 'is-bonus' : ''">
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span><b>{{ o.b }}</b>{{ o.rest }}</span>
                </li>
              </ul>
              <div class="offer__pricerow">
                <span class="offer__price">1 200 zł</span>
                <span class="offer__per">jednorazowo · dostęp 3 lata</span>
              </div>
              <div class="offer__cta">
                <button class="btn btn--primary btn--lg" @click="scrollTo('top')">Dołącz do kursu</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- ===== Stopka ===== -->
    <footer class="foot" id="kontakt">
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
            <h4>Ten kurs</h4>
            <ul>
              <li><a href="#zbudujesz" @click.prevent="scrollTo('zbudujesz')">Co zbudujesz</a></li>
              <li><a href="#program" @click.prevent="scrollTo('program')">Program — 12 modułów</a></li>
              <li><a href="#opinie" @click.prevent="scrollTo('opinie')">Opinie uczestników</a></li>
              <li><a href="#cena" @click.prevent="scrollTo('cena')">Oferta i cena</a></li>
            </ul>
          </div>
          <div>
            <h4>DRWA</h4>
            <ul>
              <li><NuxtLink to="/">Strona główna</NuxtLink></li>
              <li><NuxtLink to="/warsztaty">Warsztaty 2026</NuxtLink></li>
              <li><NuxtLink to="/sklep">Sklep · Merch</NuxtLink></li>
              <li><NuxtLink to="/blog">Blog · Z lasu</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li><a href="mailto:czesc@drwa.pl">czesc@drwa.pl</a></li>
              <li><NuxtLink to="/kontakt">Stolarnia pod lasem</NuxtLink></li>
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

<script setup lang="ts">
import { ref, computed, defineComponent, h } from 'vue'

useHead({
  title: 'Kurs „Od wiaty do chaty" — DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

// Course product in Directus (products.id) backing this page — its modules
// drive the program below. Course products have no slug, so we address by id.
const COURSE_PRODUCT_ID = 2
const { data: course } = await useCourse(COURSE_PRODUCT_ID)

// ---- ikony inline ----
const IconFilm = defineComponent({ render: () => h('svg', { viewBox: '0 0 24 24', width: 21, height: 21, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [h('rect', { width: 18, height: 18, x: 3, y: 3, rx: 2 }), h('path', { d: 'M7 3v18M17 3v18M3 7.5h4M3 16.5h4M17 7.5h4M17 16.5h4' })]) })
const IconUsers = defineComponent({ render: () => h('svg', { viewBox: '0 0 24 24', width: 21, height: 21, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [h('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }), h('circle', { cx: 9, cy: 7, r: 4 }), h('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' })]) })
const IconTag = defineComponent({ render: () => h('svg', { viewBox: '0 0 24 24', width: 21, height: 21, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [h('path', { d: 'M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z' }), h('circle', { cx: 7.5, cy: 7.5, r: 0.5, fill: 'currentColor' })]) })

// ---- dane ----
const STATS = [
  { num: '24', label: 'godziny lekcji wideo' },
  { num: '12', label: 'modułów wiedzy' },
  { num: '122', label: 'lekcje tematyczne' },
  { num: '3', label: 'bonusy' },
  { num: '+380', label: 'budujących z kursem' },
]

const BUILDS = [
  { img: '/assets/kurs-wiata.png', stage: 'Etap 01', name: 'Wiata', desc: 'Słupy, miecze i pełna więźba dachowa. Zadaszenie, pod którym zaparkujesz auto albo wysuszysz drewno.' },
  { img: '/assets/kurs-altana.png', stage: 'Etap 02', name: 'Altana', desc: 'Dochodzi podłoga i balustrady. Miejsce na stół, ławę i długie letnie wieczory.' },
  { img: '/assets/kurs-domek.png', stage: 'Etap 03', name: 'Domek', desc: 'Ściany, okna, drzwi i elewacja z desek. Tytułowa chata — od fundamentu po dach.' },
]

const SPEC = [
  { t: 'Wymiary', d: 'podstawa 3,5 × 5,0 m · wysokość stropu 2,5 m · wysokość szczytu dachu 4 m' },
  { t: 'Fundamenty', d: 'punktowe — na słupkach betonowych, bloczkach lub kamieniach polnych' },
  { t: 'Dach', d: 'konstrukcja krokwiowo-jętkowa, dwuspadowa; pokrycie gontem drewnianym, obróbki blachą' },
  { t: 'Złącza', d: 'tradycyjne ciesielskie (drewno-drewno) i współczesne (drewno-metal)' },
  { t: 'Wykończenie', d: 'okna, drzwi, drewniana podłoga, elewacja z desek, artystyczna obróbka drewna' },
]

const TOOLS = [
  { g: 'Narzędzia ręczne', items: ['miara zwijana', 'kątownik', 'liniał', 'nóż', 'poziomnica', 'piły', 'dłuta', 'pobijak', 'strug', 'młotki', 'łom', 'taker', 'mieszadło', ['ośnik', 'opcja'], ['siekierka', 'opcja'], ['pasy transportowe', 'opcja']] },
  { g: 'Elektronarzędzia', items: ['wkrętarka', 'pilarka tarczowa', 'szlifierka kątowa', ['wiertarka udarowa', 'opcja'], ['poziomnica laserowa', 'opcja']] },
  { g: 'Plac budowy', items: ['drabina', 'rusztowanie warszawskie'] },
]

const MODULES: [string, string][] = [
  ['Wprowadzenie', 'Jak zorganizowany jest kurs i jak z niego korzystać, żeby dojść od projektu do gotowej chaty.'],
  ['Przygotowanie projektu', 'Praca z modelem 3D i rysunkami technicznymi — czytanie projektu i dopasowanie go do własnych potrzeb.'],
  ['Podstawy teorii ciesielstwa', 'Słownik konstrukcji: słupy, miecze, krokwie i jętki — oraz to, jak pracuje drewno.'],
  ['Przygotowanie do pracy', 'Materiał, narzędzia i stanowisko pracy. Co naprawdę jest potrzebne na start.'],
  ['Wycinanie elementów konstrukcji', 'Trasowanie i przycinanie wszystkich elementów według rysunków.'],
  ['Wycinanie połączeń', 'Tradycyjne złącza ciesielskie: czopy, gniazda i zamki — dłutem i piłą.'],
  ['Budowa fundamentów', 'Fundamenty punktowe: słupki betonowe, bloczki lub kamienie polne.'],
  ['Kotwienie i wznoszenie konstrukcji', 'Stawiamy szkielet: kotwienie, montaż ram i kontrola pionów.'],
  ['Budowa i pokrycie dachu', 'Więźba krokwiowo-jętkowa, deskowanie i gont drewniany z obróbkami.'],
  ['Instalacja podłogi', 'Legary i drewniana podłoga — etap, na którym wiata staje się altaną.'],
  ['Wykończenie ścian', 'Elewacja z desek i artystyczna obróbka drewna.'],
  ['Wykonanie oraz instalacja okien i drzwi', 'Stolarka od podstaw: wykonanie, osadzenie i regulacja. Finał budowy.'],
]

// Program modules — from Directus (published, sorted) when available, otherwise
// the hardcoded list above. `descHtml` is rich text from Directus / plain text
// from the fallback (both safe to render with v-html).
const MODULES_DISPLAY = computed(() => {
  const fromCms = (course.value?.course?.modules ?? []).filter((m) => m.status === 'published')
  if (fromCms.length) {
    return fromCms.map((m) => ({ key: m.id, title: m.title, descHtml: m.description ?? '' }))
  }
  return MODULES.map(([title, desc], i) => ({ key: `static-${i}`, title, descHtml: `<p>${desc}</p>` }))
})

const BONUSES = [
  { num: 'Bonus 01', icon: IconFilm, title: 'Minikurs „Podstawy ciesielstwa i pracy z drewnem"', desc: 'Idealny start dla totalnie początkujących. Techniki, narzędzia i zasady bezpieczeństwa — solidne podstawy, zanim ruszysz z modułami kursu.' },
  { num: 'Bonus 02', icon: IconUsers, title: 'Zamknięta grupa kursantów online', desc: 'Nasz wspólny warsztat: poznasz innych pasjonatów ciesielstwa, zadasz pytania i znajdziesz pomocną radę. Budowniczowie z całej Polski.' },
  { num: 'Bonus 03', icon: IconTag, title: 'Rabat na narzędzia ręczne w dluta.pl', desc: 'Zniżka na zakup narzędzi ręcznych potrzebnych każdemu cieśli. Na dobry start — sprzęt wysokiej jakości w dobrej cenie.' },
]

const QUOTES = [
  { name: 'Grzegorz K.', text: 'Do tej pory wszystko związane z ciesielstwem robiłem na szybko, byle osiągnąć cel — przez co wiele czasu straciłem na projekty, które upadły lub się rozpadły. Natknąłem się na ten kurs w momencie kryzysu, bo w styczniu złamałem nogę. Dzięki temu miałem czas zainteresować się minikursem. Bardzo mi się spodobał i uznałem, że wchodzę w to dalej.' },
  { name: 'Łukasz M.', text: 'Postawiłem wiatę na samochód i kurnik na 5 kur — jakżesz mi wstyd za te projekty. YouTube jako inspiracja, ale bez zasad ciesielstwa: wszystko na łącznikach metalowych. Forma kursu była dla mnie bardzo dobrze wyważona — trochę teorii do poczytania i świetnie zrealizowane filmy z powstającym, konkretnym efektem.' },
  { name: 'Andrzej L.', text: 'Od momentu, kiedy przeprowadziłem się z bloku do nowego domu, miałem chęć robienia w domu jak najwięcej sam. Trafiłem na twoją stronę i okazało się, że zaraziłem się twoją pasją do pracy w drewnie. Tak to się zaczęło.' },
]

const OFFER = [
  { b: '12 praktycznych modułów wiedzy', rest: ' — instrukcje wideo omawiające każdy element budowy + materiały opisowe', bonus: false },
  { b: '3 wersje projektu', rest: ' (wiata, altana i domek): model 3D SketchUp i rysunki techniczne PDF', bonus: false },
  { b: 'Dostęp do platformy kursowej przez 3 lata', rest: '', bonus: false },
  { b: 'Wszystkie przyszłe aktualizacje kursu', rest: '', bonus: false },
  { b: 'Spotkania LIVE', rest: ' tylko dla kursantów', bonus: false },
  { b: 'Minikurs „Podstawy ciesielstwa i pracy z drewnem"', rest: '', bonus: true },
  { b: 'Zamknięta grupa kursantów online', rest: '', bonus: true },
  { b: 'Rabat na narzędzia ręczne w dluta.pl', rest: '', bonus: true },
]

// ---- stan ----
const openMod = ref(0)

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' })
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

// ---- scroll-reveal ----
useScrollReveal()
</script>
