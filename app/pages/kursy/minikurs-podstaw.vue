<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero (wariant: podział papierowy) ===== -->
    <section class="khero khero--paper" id="top">
      <div class="container khero__inner">
        <div>
          <div class="khero__crumb">
            <NuxtLink to="/">DRWA</NuxtLink>
            <span class="sep">·</span>
            <span>Kurs online</span>
            <span class="sep">·</span>
            <span class="cur">Minikurs podstaw</span>
          </div>
          <p class="khero__kicker">Nie wiesz, od czego zacząć z drewnem?</p>
          <h1>Podstawy ciesielstwa i pracy z drewnem</h1>
          <p class="khero__lead">Bezpłatny minikurs online — techniki, narzędzia i zasady bezpieczeństwa. Solidne podstawy przed pierwszą budową.</p>
          <div class="khero__meta">
            <span class="khero__fact">
              <!-- Clock -->
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              3 h lekcji wideo
            </span>
            <span class="khero__fact">
              <!-- Compass -->
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>
              </svg>
              własne tempo
            </span>
            <span class="khero__fact">
              <!-- Tag / free -->
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r="0.5" fill="currentColor"/>
              </svg>
              bezpłatnie
            </span>
          </div>
          <p class="khero__by">Prowadzi Jędrzej Cyganik <span class="sep">·</span> DRWA</p>
          <div class="khero__cta">
            <button class="btn btn--primary btn--lg" @click="scrollTo('dostep')">Zarejestruj się bezpłatnie</button>
            <button class="btn btn--secondary btn--lg" @click="scrollTo('program')">Zobacz program</button>
          </div>
        </div>
        <figure class="khero__media" style="margin:0">
          <img src="/assets/kurs-minikurs.png" alt="Praca z drewnem — narzędzia i materiał" />
        </figure>
      </div>
    </section>

    <!-- ===== Pas liczb ===== -->
    <section class="kstats" aria-label="Minikurs w liczbach">
      <div class="container">
        <div class="kstats__row" style="grid-template-columns: repeat(4, 1fr)">
          <div v-for="s in STATS" :key="s.label" class="kstat">
            <div class="kstat__num">{{ s.num }}</div>
            <div class="kstat__label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <main id="main-content">
      <!-- ===== Co nauczysz się ===== -->
      <section class="section container" id="nauczysz">
        <div class="sec-head io">
          <span class="eyebrow">Co nauczysz się</span>
          <h2>Sześć obszarów, solidna baza</h2>
          <p>Minikurs daje ci wszystko, czego potrzebujesz na start — zanim weźmiesz się za pierwszą prawdziwą budowę.</p>
        </div>
        <div class="mskills io">
          <article v-for="sk in SKILLS" :key="sk.title" class="mskill">
            <div class="mskill__icon">
              <component :is="sk.icon" />
            </div>
            <h3 class="mskill__title">{{ sk.title }}</h3>
            <p class="mskill__desc">{{ sk.desc }}</p>
          </article>
        </div>
      </section>

      <!-- ===== Program — 6 modułów ===== -->
      <section class="section container" id="program" style="padding-top:0">
        <div class="sec-head io">
          <span class="eyebrow">Program</span>
          <h2>Sześć modułów, od zera</h2>
          <p>Każdy moduł to instrukcje wideo i materiały do pobrania. Zaczynasz kiedy chcesz, uczysz się we własnym tempie.</p>
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
      </section>

      <!-- ===== Dla kogo ===== -->
      <section class="section container" id="dlakogo" style="padding-top:0">
        <div class="sec-head io">
          <span class="eyebrow">Dla kogo</span>
          <h2>Trzech typowych kursantów</h2>
        </div>
        <div class="builds io">
          <article v-for="p in PERSONAS" :key="p.title" class="build build--noimg">
            <div class="build__body">
              <span class="build__eyebrow">{{ p.tag }}</span>
              <h3 class="build__title">{{ p.title }}</h3>
              <p class="build__desc">{{ p.desc }}</p>
            </div>
          </article>
        </div>
      </section>

      <!-- ===== Dostęp / oferta ===== -->
      <section class="offer-sec section" id="dostep">
        <div class="container">
          <div class="sec-head sec-head--center io">
            <span class="eyebrow eyebrow--ondark">Dołącz do minikursu</span>
            <h2>Zarejestruj się bezpłatnie</h2>
          </div>
          <div class="offer io">
            <div class="drwa-card drwa-card--pad">
              <div class="offer__head">
                <span class="eyebrow">Minikurs online</span>
                <h3 class="offer__title">Podstawy ciesielstwa i pracy z drewnem</h3>
              </div>
              <ul class="offer__list">
                <li v-for="o in OFFER" :key="o.b">
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span><b>{{ o.b }}</b>{{ o.rest }}</span>
                </li>
              </ul>
              <div class="offer__pricerow">
                <span class="offer__price">0 zł</span>
                <span class="offer__per">bezpłatnie · dostęp natychmiastowy</span>
              </div>
              <div class="offer__cta">
                <span class="drwa-badge drwa-badge--success">
                  <span class="dot" aria-hidden="true"></span>
                  Dostęp otwarty
                </span>
                <button class="btn btn--primary btn--lg" @click="scrollTo('top')">Zarejestruj się</button>
              </div>
              <p class="offer__note">Masz kurs „Od wiaty do chaty"? Minikurs jest już dołączony — <NuxtLink to="/kursy/od-wiaty-do-chaty">sprawdź kurs</NuxtLink>.</p>
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
            <h4>Ten minikurs</h4>
            <ul>
              <li><a href="#nauczysz" @click.prevent="scrollTo('nauczysz')">Co nauczysz się</a></li>
              <li><a href="#program" @click.prevent="scrollTo('program')">Program — 6 modułów</a></li>
              <li><a href="#dostep" @click.prevent="scrollTo('dostep')">Dołącz bezpłatnie</a></li>
            </ul>
          </div>
          <div>
            <h4>DRWA</h4>
            <ul>
              <li><NuxtLink to="/">Strona główna</NuxtLink></li>
              <li><NuxtLink to="/kursy/od-wiaty-do-chaty">Kurs „Od wiaty do chaty"</NuxtLink></li>
              <li><NuxtLink to="/warsztaty">Warsztaty 2026</NuxtLink></li>
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
  title: 'Minikurs podstaw — Podstawy ciesielstwa i pracy z drewnem · DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

// Course product in Directus (products.id) backing this page — drives the
// modules program below; falls back to the hardcoded list when unavailable.
const COURSE_PRODUCT_ID = 7
const { data: course } = await useCourse(COURSE_PRODUCT_ID)

// ---- ikony inline ----
const IconLayers = defineComponent({ render: () => h('svg', { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [h('path', { d: 'm12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z' }), h('path', { d: 'm6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59' }), h('path', { d: 'm6.08 14.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59' })]) })
const IconWrench = defineComponent({ render: () => h('svg', { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [h('path', { d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' })]) })
const IconFileText = defineComponent({ render: () => h('svg', { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [h('path', { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' }), h('path', { d: 'M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8' })]) })
const IconScissors = defineComponent({ render: () => h('svg', { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [h('circle', { cx: 6, cy: 6, r: 3 }), h('path', { d: 'M8.12 8.12 12 12' }), h('path', { d: 'M20 4 8.12 15.88' }), h('circle', { cx: 6, cy: 18, r: 3 }), h('path', { d: 'M14.8 14.8 20 20' })]) })
const IconLink = defineComponent({ render: () => h('svg', { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [h('path', { d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' }), h('path', { d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' })]) })
const IconShield = defineComponent({ render: () => h('svg', { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [h('path', { d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z' })]) })

// ---- dane ----
const STATS = [
  { num: '3', label: 'godziny lekcji wideo' },
  { num: '6', label: 'modułów wiedzy' },
  { num: '26', label: 'lekcje tematyczne' },
  { num: '0 zł', label: 'dostęp bezpłatny' },
]

const SKILLS = [
  { icon: IconLayers, title: 'Drewno jako materiał', desc: 'Gatunki, przekroje, sęki i inne wady — i jak z nimi pracować, nie przeciw nim.' },
  { icon: IconWrench, title: 'Narzędzia ręczne', desc: 'Które narzędzia kupić na start, jak je konserwować i jak nimi pracować bezpiecznie.' },
  { icon: IconFileText, title: 'Czytanie rysunków', desc: 'Rzuty, wymiary i jak przełożyć projekt na realne elementy drewniane.' },
  { icon: IconScissors, title: 'Trasowanie i cięcie', desc: 'Dokładne odmierzanie i przycinanie elementów — podstawa każdej budowy.' },
  { icon: IconLink, title: 'Złącza ciesielskie', desc: 'Pierwsze wręby, czopy i gniazda — tradycyjne połączenia drewno-drewno.' },
  { icon: IconShield, title: 'BHP i plac budowy', desc: 'Zasady pracy bezpiecznej, organizacja stanowiska i co zabrać ze sobą na pierwszą budowę.' },
]

const MODULES: [string, string][] = [
  ['Drewno — co trzeba wiedzieć przed pierwszym cięciem', 'Gatunki użytkowe, budowa drewna, sęki, pęknięcia i inne wady. Jak drewno pracuje — i jak to wykorzystać w praktyce.'],
  ['Narzędzia ręczne — dobór i techniki podstawowe', 'Jakie narzędzia wybrać na start i czego potrzebujesz od pierwszego dnia. Pielęgnacja, ostrzenie i techniki cięcia, dłutowania i heblowania.'],
  ['Czytanie rysunku technicznego i projektu', 'Rzuty, przekroje i wymiary na rysunku. Jak przełożyć projekt na listę elementów i kolejność robót — bez pomyłek.'],
  ['Trasowanie i wycinanie elementów', 'Dokładne przenoszenie wymiarów na drewno. Praca piłą ręczną, wykańczanie i sprawdzanie prostopadłości.'],
  ['Pierwsze złącza ciesielskie — wręby i czopy', 'Jak wycinać wręby połówkowe, czopy i gniazda dłutem i piłą. Ćwiczenia na odpadach drewnianych przed właściwą robotą.'],
  ['BHP i organizacja stanowiska pracy', 'Zasady bezpiecznej pracy z drewnem. Jak urządzić stanowisko, co mieć zawsze pod ręką — i co zrobić przed pierwszym wejściem na budowę.'],
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

const PERSONAS = [
  { tag: 'Totalny początkujący', title: 'Zaczynasz od zera', desc: 'Nigdy wcześniej nie trzymałeś dłuta w ręku. Chcesz wiedzieć, czy budownictwo drewniane jest dla ciebie — zanim zainwestujesz czas i pieniądze w pełny kurs.' },
  { tag: 'Kursant', title: 'Masz kurs „Od wiaty do chaty"', desc: 'Minikurs jest dołączony do kursu jako Bonus 01. Zrób go przed pierwszym modułem głównym, żeby mieć solidne podstawy ciesielskie od samego początku.' },
  { tag: 'Hobbysta', title: 'Interesujesz się rzemiosłem', desc: 'Masz za sobą kilka projektów DIY i chcesz zrozumieć, jak naprawdę pracuje drewno — i co wyróżnia ciesielnię od zwykłego montażu.' },
]

const OFFER = [
  { b: '6 modułów wideo', rest: ' — techniki, narzędzia, złącza i BHP' },
  { b: 'Materiały do pobrania', rest: ' — notatki i checklisty do każdego modułu' },
  { b: 'Dostęp natychmiastowy', rest: ' — bez czekania i bez karty płatniczej' },
  { b: 'Bez limitu czasu', rest: ' — wracaj do minikursu kiedy chcesz' },
]

// ---- stan ----
const openMod = ref(0)

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' })
}

// ---- scroll-reveal ----
useScrollReveal()
</script>
