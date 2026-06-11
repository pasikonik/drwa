<template>
  <div class="site">
    <!-- ===== Nawigacja ===== -->
    <header class="nav">
      <div class="container nav__row">
        <NuxtLink class="brand" to="/">
          <img src="/assets/drwa-mark-ink.png" alt="DRWA" />
          <span class="brand__wm">DRWA</span>
        </NuxtLink>
        <nav class="nav__links" aria-label="Główne">
          <NuxtLink class="nav__link nav__item" to="/warsztaty">Warsztaty stacjonarne</NuxtLink>
          <a class="nav__link nav__item" href="/#kursy">Kursy online</a>
          <NuxtLink class="nav__link nav__item" to="/o-nas">O nas</NuxtLink>
          <NuxtLink class="nav__link nav__item" to="/sklep">Sklep</NuxtLink>
          <NuxtLink class="nav__link nav__item nav__link--current" to="/blog">Blog</NuxtLink>
          <NuxtLink class="nav__link nav__item" to="/kontakt">Kontakt</NuxtLink>
        </nav>
        <div class="nav__spacer" />
        <div class="nav__actions">
          <NuxtLink class="btn btn--primary btn--sm" to="/warsztaty">Zapisz się</NuxtLink>
        </div>
      </div>
    </header>

    <main class="container section" style="padding-top: var(--space-6)">
      <!-- Okruszki -->
      <nav class="drwa-crumb" aria-label="Breadcrumb">
        <NuxtLink to="/blog">Blog</NuxtLink>
        <span class="drwa-crumb__sep">·</span>
        <NuxtLink to="/blog">Eko-budownictwo</NuxtLink>
        <span class="drwa-crumb__sep">·</span>
        <span class="drwa-crumb__current" aria-current="page">Dlaczego budujemy z drewna</span>
      </nav>

      <!-- Nagłówek artykułu -->
      <header class="article-head io">
        <span class="eyebrow">Eko-budownictwo · 6 min czytania</span>
        <h1>Dlaczego budujemy z drewna</h1>
        <div class="byline">
          <span class="byline__author">
            <span class="drwa-avatar" style="width: 32px; height: 32px; font-size: 13px" title="Tomasz Las"><span>TL</span></span>
            Tomasz Las
          </span>
          <span class="dot">·</span>
          <span>2 czerwca 2026</span>
          <span class="dot">·</span>
          <span>6 min czytania</span>
        </div>
      </header>

      <!-- Zdjęcie hero -->
      <figure class="article-hero io">
        <img src="/assets/mist-hero.png" alt="Świerkowy las we mgle o świcie" />
      </figure>

      <!-- Treść -->
      <div class="prose io">
        <p class="lede">Drewno towarzyszy nam od zawsze — to pierwszy materiał, po który sięgnął człowiek, gdy chciał zbudować dach nad głową. Dziś, w czasach betonu i stali, wracamy do niego nie z sentymentu, lecz z rozsądku.</p>
        <p>Każda deska, którą bierzemy do ręki, przechowuje historię drzewa: suche lata zapisane w wąskich słojach, mokre w szerokich. Praca z takim materiałem uczy pokory i uważności — czego nie da żaden ekran.</p>
        <h2>Ślad węglowy, który maleje</h2>
        <p>W przeciwieństwie do betonu, drewno wiąże węgiel zamiast go uwalniać. Dobrze zaprojektowany dom z drewna potrafi być magazynem CO₂ na dekady — a po latach wraca do obiegu natury, zamiast zalegać na wysypisku.</p>
        <p>Do tego dochodzi energia. Wyprodukowanie metra sześciennego betonu pochłania jej wielokrotnie więcej niż pozyskanie i obróbka tej samej objętości drewna z lokalnego tartaku. Krótszy transport, mniej przetwarzania, mniej odpadu.</p>
        <blockquote>„Buduj tak, jakby materiał miał Ci przetrwać sto lat — i jakby ziemia miała go potem odzyskać.”</blockquote>
        <figure>
          <div class="img"><img src="/assets/timber-2.png" alt="Świeżo ciosane belki w warsztacie" /></div>
          <figcaption>Warsztat DRWA · belki na więźbę altany</figcaption>
        </figure>
        <h2>Rzemiosło, które łączy</h2>
        <p>Tradycyjne łączenia ciesielskie — czopy, jaskółcze ogony, zamki — trzymają konstrukcje od stuleci bez ani jednego gwoździa. Uczymy ich na naszych warsztatach, bo wierzymy, że wiedza rośnie najlepiej, gdy dzielimy się nią przy wspólnym stole.</p>
        <p>Dom z drewna nie jest gotowym produktem z katalogu. Jest procesem: od wyboru drzewa, przez suszenie, po pierwsze wbicie dłuta. Kto raz przeszedł tę drogę, patrzy na każdy budynek inaczej.</p>
      </div>

      <!-- Tagi -->
      <div class="article-tags io">
        <span class="drwa-tag">Drewno</span>
        <span class="drwa-tag">Eko-budownictwo</span>
        <span class="drwa-tag">Rzemiosło</span>
        <span class="drwa-tag">Natura</span>
      </div>

      <!-- Karta autora -->
      <div class="author-card io">
        <span class="drwa-avatar drwa-avatar--ring" style="width: 56px; height: 56px; font-size: 22px" title="Tomasz Las"><span>TL</span></span>
        <div style="flex: 1; min-width: 220px">
          <h4>Tomasz Las</h4>
          <p>Cieśla, założyciel DRWA. Uczy pracy z drewnem i pisze o naturalnym budownictwie.</p>
        </div>
        <NuxtLink class="btn btn--secondary btn--md" to="/blog">Więcej wpisów</NuxtLink>
      </div>

      <!-- Czytaj dalej -->
      <section class="more">
        <div class="sec-head io">
          <span class="eyebrow">Czytaj dalej</span>
          <h2>Więcej z lasu</h2>
        </div>
        <div class="bgrid" style="margin-top: 0">
          <article v-for="a in RELATED" :key="a.id" class="drwa-pcard io">
            <div class="drwa-pcard__media">
              <img :src="a.img" :alt="a.title" />
            </div>
            <div class="drwa-pcard__body">
              <span class="drwa-pcard__eyebrow">{{ a.cat }} · {{ a.read }}</span>
              <h3 class="drwa-pcard__title">{{ a.title }}</h3>
              <p class="drwa-pcard__desc">{{ a.excerpt }}</p>
              <div class="drwa-pcard__foot">
                <span class="drwa-pcard__meta">{{ a.date }}</span>
                <span class="bcard__go">
                  Czytaj
                  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </div>
          </article>
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
            <h4>Blog</h4>
            <ul>
              <li><NuxtLink to="/blog">Wszystkie wpisy</NuxtLink></li>
              <li><NuxtLink to="/blog/dlaczego-budujemy-z-drewna">Dlaczego budujemy z drewna</NuxtLink></li>
              <li><NuxtLink to="/kontakt">Napisz do nas</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4>DRWA</h4>
            <ul>
              <li><NuxtLink to="/warsztaty">Warsztaty 2026</NuxtLink></li>
              <li><a href="/#kursy">Kursy online</a></li>
              <li><NuxtLink to="/o-nas">O nas</NuxtLink></li>
              <li><NuxtLink to="/sklep">Sklep · Merch</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li><a href="mailto:czesc@drwa.pl">czesc@drwa.pl</a></li>
              <li><a href="tel:+48600100200">+48 600 100 200</a></li>
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
import { onMounted, onUnmounted } from 'vue'

useHead({
  title: 'Dlaczego budujemy z drewna — Blog DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const RELATED = [
  {
    id: 'dluto', cat: 'Rzemiosło', read: '4 min', date: '18 maja 2026',
    title: 'Czego uczy pierwsze dłuto',
    excerpt: 'Pierwsze cięcie zawsze idzie krzywo. I dobrze — o początkach, błędach i ostrzeniu.',
    img: '/assets/timber-2.png',
  },
  {
    id: 'sloje', cat: 'Z lasu', read: '5 min', date: '4 maja 2026',
    title: 'Słoje, czyli pamięć suchych lat',
    excerpt: 'Jak czytać przekrój pnia: wąskie słoje suszy, szerokie lata deszczu i blizny po wiatrach.',
    img: '/assets/forest-1.png',
  },
  {
    id: 'glina', cat: 'Eko-budownictwo', read: '7 min', date: '21 kwietnia 2026',
    title: 'Glina, słoma i drewno',
    excerpt: 'Trzy materiały, które budowały polskie wsie przez wieki — i wracają w nowych domach.',
    img: '/assets/forest-3.png',
  },
]

let observer = null

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.io').forEach(el => el.classList.add('io--in'))
    return
  }
  observer = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('io--in'); observer.unobserve(en.target) }
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
  document.querySelectorAll('.io:not(.io--in)').forEach(el => observer.observe(el))
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>
