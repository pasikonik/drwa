<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <section class="dhero" id="top">
      <div class="dhero__bg">
        <img src="/assets/forest-1.png" alt="" />
      </div>
      <div class="dhero__scrim" />
      <div class="container dhero__inner">
        <div class="dhero__crumb">
          <NuxtLink to="/warsztaty">Warsztaty 2026</NuxtLink>
          <span class="sep">·</span>
          <span class="cur">Budowanie altany</span>
        </div>
        <h1>Budowanie altany</h1>
        <p class="dhero__lead">Od pierwszego cięcia po gotowy dach. Przez trzy dni wspólnie stawiamy altanę ogrodową na tradycyjnych łączeniach ciesielskich — bez gwoździ i wkrętów.</p>
        <div class="dhero__meta">
          <span class="dhero__fact">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            15–17 maja 2026
          </span>
          <span class="dhero__fact">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M14 12 3 23"/><path d="M18 2 8 12l4 4L22 6a2.83 2.83 0 0 0-4-4Z"/>
            </svg>
            poziom podstawowy
          </span>
          <span class="dhero__fact">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            Stolarnia pod lasem · Beskid Niski
          </span>
        </div>
        <div class="dhero__cta">
          <button class="btn btn--on-dark btn--lg" @click="jump('zapisy')">Zapisz się — 1 450 zł</button>
          <button class="btn btn--accent btn--lg" @click="jump('program')">Zobacz program</button>
        </div>
      </div>
    </section>

    <main id="main-content">
      <!-- ===== Treść + panel ===== -->
      <div class="section container detail">
        <div class="detail__main">

          <!-- O warsztacie -->
          <section class="dsec io" id="o-warsztacie">
            <span class="eyebrow">O warsztacie</span>
            <h2>Jedna altana, dziesięć par rąk</h2>
            <p>Altana to najlepszy pierwszy projekt: na tyle mała, żeby stanąć w trzy dni, i na tyle prawdziwa, żeby nauczyć wszystkiego, co najważniejsze — od trasowania łączeń po więźbę dachową.</p>
            <p>Pracujemy na świerku z pobliskiego tartaku, wyłącznie narzędziami ręcznymi. Konstrukcja, którą postawimy, zostaje na miejscu — a ty wyjeżdżasz z planem, jak powtórzyć ją u siebie.</p>
            <ul class="learn">
              <li v-for="item in LEARN" :key="item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- Program -->
          <section class="dsec io" id="program">
            <span class="eyebrow">Program</span>
            <h2>Dzień po dniu</h2>
            <div class="prog">
              <article v-for="day in PROGRAM" :key="day.num" class="pday">
                <div class="pday__label">
                  <span class="pday__num">{{ day.num }}</span>
                  <span class="pday__sub">{{ day.sub }}</span>
                  <span class="pday__hours">{{ day.hours }}</span>
                </div>
                <div>
                  <h3 class="pday__title">{{ day.title }}</h3>
                  <ul>
                    <li v-for="it in day.items" :key="it">{{ it }}</li>
                  </ul>
                </div>
              </article>
            </div>
          </section>

          <!-- Prowadzący -->
          <section class="dsec io" id="prowadzacy">
            <span class="eyebrow">Prowadzący</span>
            <h2>Kto cię poprowadzi</h2>
            <div class="tutor">
              <div class="avatar avatar--ring" aria-hidden="true">TG</div>
              <div class="tutor__body">
                <h3 class="tutor__name">Tomasz Gajda</h3>
                <p class="tutor__role">Cieśla · 15 lat przy drewnie</p>
                <p>Cieśla i stolarz, od piętnastu lat przy drewnie — od więźb dachowych w Beskidach po domy szkieletowe. Założyciel DRWA i pomysłodawca warsztatów.</p>
                <p>Uczy spokojnie i konkretnie: najpierw pokazuje, potem oddaje narzędzie. Na jego warsztatach każdy uczestnik wykonuje każde łączenie własnymi rękami.</p>
              </div>
            </div>
          </section>

          <!-- Galeria -->
          <section class="dsec io" id="galeria">
            <span class="eyebrow">Galeria</span>
            <h2>Z poprzednich edycji</h2>
            <div class="gal">
              <div class="gal__slot gal__big">
                <img src="/assets/forest-1.png" alt="Zdjęcie z budowy" />
              </div>
              <div class="gal__slot">
                <img src="/assets/timber-2.png" alt="Praca przy łączeniach" />
              </div>
              <div class="gal__slot">
                <img src="/assets/forest-3.png" alt="Stawianie więźby" />
              </div>
              <div class="gal__slot gal__placeholder">
                <span>Ognisko wieczorem</span>
              </div>
              <div class="gal__slot gal__placeholder">
                <span>Gotowa altana</span>
              </div>
            </div>
          </section>

        </div>

        <!-- Panel rezerwacji -->
        <aside class="book">
          <div class="card card--padded">
            <div class="eyebrow book__eyebrow">Najbliższy termin</div>
            <div class="book__date">15–17 maja 2026</div>
            <div class="book__rule" />
            <div class="book__facts">
              <span class="book__fact">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                3 dni · piątek–niedziela, 9:00–17:00
              </span>
              <span class="book__fact">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Stolarnia pod lasem · Beskid Niski
              </span>
              <span class="book__fact">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                grupa maks. 10 osób
              </span>
              <span class="book__fact">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M14 12 3 23"/><path d="M18 2 8 12l4 4L22 6a2.83 2.83 0 0 0-4-4Z"/>
                </svg>
                poziom podstawowy — zaczynamy od zera
              </span>
            </div>
            <div class="book__rule" />
            <div class="book__pricerow">
              <span class="book__price">1 450 zł</span>
              <span class="book__per">od osoby</span>
            </div>
            <div class="book__cta">
              <div class="badge badge--success">
                <span class="badge__dot" />
                4 wolne miejsca
              </div>
              <button class="btn btn--primary btn--lg" @click="jump('zapisy')">Zapisz się</button>
            </div>
            <p class="book__note">zaliczka 400 zł rezerwuje miejsce · pytania: <a href="mailto:czesc@drwa.pl">czesc@drwa.pl</a></p>
          </div>
        </aside>
      </div>

      <!-- ===== Zapisy ===== -->
      <section class="signup-sec" id="zapisy">
        <div class="signup">
          <div class="signup__intro io">
            <span class="eyebrow">Zapisy</span>
            <h2 class="signup__heading">Zajmij miejsce przy drewnie</h2>
            <p>Wyślij zgłoszenie, a w ciągu dwóch dni odezwiemy się z potwierdzeniem miejsca i szczegółami dojazdu. Zaliczka 400 zł rezerwuje miejsce.</p>
            <div class="signup__contact">
              <a href="mailto:czesc@drwa.pl">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                czesc@drwa.pl
              </a>
            </div>
          </div>
          <div class="io">
            <div class="card card--padded">
              <div v-if="sent" class="signup__sent">
                <h3>Dziękujemy za zgłoszenie.</h3>
                <p>Odezwiemy się w ciągu dwóch dni roboczych z potwierdzeniem miejsca i szczegółami. Do zobaczenia w stolarni.</p>
              </div>
              <form v-else class="signup__form" @submit.prevent="submit">
                <div class="eyebrow">Budowanie altany · 15–17 maja 2026</div>
                <div class="field">
                  <label class="field__label" for="f-name">Imię i nazwisko</label>
                  <input
                    id="f-name"
                    v-model="form.name"
                    class="field__input"
                    :class="{ 'field__input--error': errors.name }"
                    type="text"
                    autocomplete="name"
                  />
                  <span v-if="errors.name" class="field__error" role="alert">{{ errors.name }}</span>
                </div>
                <div class="field">
                  <label class="field__label" for="f-email">E-mail</label>
                  <input
                    id="f-email"
                    v-model="form.email"
                    class="field__input"
                    :class="{ 'field__input--error': errors.email }"
                    type="email"
                    autocomplete="email"
                  />
                  <span v-if="errors.email" class="field__error" role="alert">{{ errors.email }}</span>
                  <span class="field__hint">Tu wyślemy potwierdzenie.</span>
                </div>
                <div class="field">
                  <label class="field__label" for="f-msg">Wiadomość (opcjonalnie)</label>
                  <textarea
                    id="f-msg"
                    v-model="form.message"
                    class="field__textarea"
                    rows="3"
                    placeholder="Pytania, doświadczenie, dieta…"
                  />
                </div>
                <label class="field__check">
                  <input v-model="form.newsletter" type="checkbox" />
                  <span class="field__check-label">Zapisz mnie też do newslettera „Listy z lasu"</span>
                </label>
                <div class="signup__actions">
                  <button type="submit" class="btn btn--primary btn--lg">Wyślij zgłoszenie</button>
                </div>
              </form>
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
            <h4>Ten warsztat</h4>
            <ul>
              <li><a @click.prevent="jump('program')">Program dzień po dniu</a></li>
              <li><a @click.prevent="jump('prowadzacy')">Prowadzący</a></li>
              <li><a @click.prevent="jump('galeria')">Galeria</a></li>
              <li><a @click.prevent="jump('zapisy')">Zapisy</a></li>
            </ul>
          </div>
          <div>
            <h4>DRWA</h4>
            <ul>
              <li><NuxtLink to="/">Strona główna</NuxtLink></li>
              <li><NuxtLink to="/warsztaty">Warsztaty 2026</NuxtLink></li>
              <li><NuxtLink to="/o-nas">O nas</NuxtLink></li>
              <li><NuxtLink to="/blog">Blog</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li><a href="mailto:czesc@drwa.pl">czesc@drwa.pl</a></li>
              <li><span>Stolarnia pod lasem</span></li>
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
import { ref, reactive } from 'vue'

useHead({
  title: 'Budowanie altany — Warsztaty DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const LEARN = [
  'Trasowanie i wykonywanie łączeń czopowych — dłutem i piłą',
  'Czytanie drewna: słoje, sęki i praca materiału w konstrukcji',
  'Składanie ram i wspólne stawianie więźby dachowej',
  'Plan konstrukcji, który zabierzesz do domu i powtórzysz u siebie',
]

const PROGRAM = [
  {
    num: 'Dzień 1', sub: 'piątek', hours: '9:00–17:00', title: 'Drewno i trasowanie',
    items: [
      'Poznajemy materiał: wybór i przygotowanie drewna na konstrukcję',
      'Trasowanie łączeń — ołówek, węgielnica, znacznik',
      'Podstawy pracy dłutem i piłą ciesielską',
      'Pierwsze czopy i gniazda na próbnych klockach',
    ],
  },
  {
    num: 'Dzień 2', sub: 'sobota', hours: '9:00–17:00', title: 'Łączenia i ściany',
    items: [
      'Ciosanie czopów w elementach docelowych',
      'Składanie ram słupów — miecze i rygle',
      'Próbny montaż ścian na placu',
      'Wieczorem: ognisko i rozmowy o naturalnym budowaniu',
    ],
  },
  {
    num: 'Dzień 3', sub: 'niedziela', hours: '9:00–16:00', title: 'Więźba i dach',
    items: [
      'Krokwie i jętki — przygotowanie więźby',
      'Wspólne stawianie konstrukcji altany',
      'Deskowanie połaci dachu',
      'Finał: gotowa altana i wspólne zdjęcie przy ognisku',
    ],
  },
]

const form = reactive({ name: '', email: '', message: '', newsletter: false })
const errors = reactive({ name: '', email: '' })
const sent = ref(false)

function jump(id) {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' })
}

function submit() {
  errors.name = form.name.trim() ? '' : 'Podaj imię i nazwisko.'
  errors.email = form.email.trim() && form.email.includes('@') ? '' : 'Podaj poprawny adres e-mail.'
  if (!errors.name && !errors.email) sent.value = true
}

useScrollReveal()
</script>
