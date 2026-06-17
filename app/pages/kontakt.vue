<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Pagehead ===== -->
    <div class="contact-head">
      <div class="container">
        <span class="eyebrow eyebrow--ondark">Kontakt · DRWA</span>
        <h1>Napisz, zadzwoń albo wpadnij.</h1>
        <p>Pytania o warsztaty, zamówienia ze sklepu, współpraca — odpisujemy zwykle w dwa dni robocze. Telefon odbieramy, kiedy nie trzymamy dłuta.</p>
      </div>
    </div>

    <main>
      <!-- ===== Dane kontaktowe + formularz ===== -->
      <section class="section container">
        <div class="contact">
          <div class="cinfo io">
            <div class="cinfo__item">
              <div class="cinfo__ic">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <div>
                <p class="cinfo__t">E-mail</p>
                <p class="cinfo__d"><a href="mailto:czesc@drwa.pl">czesc@drwa.pl</a> — najpewniejsza droga.</p>
              </div>
            </div>
            <div class="cinfo__item">
              <div class="cinfo__ic">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>
                </svg>
              </div>
              <div>
                <p class="cinfo__t">Telefon</p>
                <p class="cinfo__d"><span class="mono">+48 600 100 200</span> · pn–pt, 9:00–16:00</p>
              </div>
            </div>
            <div class="cinfo__item">
              <div class="cinfo__ic">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p class="cinfo__t">Pracownia</p>
                <p class="cinfo__d">Małopolska, okolice Krakowa. Dokładny adres wysyłamy w potwierdzeniu zapisu na warsztat.</p>
              </div>
            </div>
            <div class="cinfo__social" aria-label="Media społecznościowe">
              <a aria-label="Instagram" href="#">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>
                </svg>
              </a>
              <a aria-label="Facebook" href="#">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a aria-label="YouTube" href="#">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <path d="m9.75 15.02 5.75-3.27-5.75-3.27v6.54z"/>
                </svg>
              </a>
            </div>
            <div class="cinfo__note">
              <p>„Jeśli nie odpisujemy od razu, pewnie coś heblujemy. Odezwiemy się — obiecane.” — Jędrzej</p>
            </div>
          </div>

          <div v-if="sent" class="cform io io--in">
            <div class="cform__sent">
              <div class="cform__sent-ic">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              </div>
              <h3>Wiadomość poszła w las.</h3>
              <p>Dziękujemy! Odpiszemy zwykle w ciągu dwóch dni roboczych — na adres, który podałeś.</p>
              <button class="btn btn--secondary btn--sm" @click="sent = false">Wyślij kolejną</button>
            </div>
          </div>
          <form v-else class="cform io" @submit.prevent="sent = true">
            <h2>Formularz</h2>
            <p>Wszystkie pola poza tematem są wymagane.</p>
            <div class="cform__grid">
              <div class="field">
                <label class="field__label" for="kf-name">Imię i nazwisko</label>
                <input id="kf-name" class="field__input" type="text" name="name" required placeholder="Jan Kowalski" autocomplete="name" />
              </div>
              <div class="field">
                <label class="field__label" for="kf-email">E-mail</label>
                <input id="kf-email" class="field__input" type="email" name="email" required placeholder="twój@email.pl" autocomplete="email" />
              </div>
              <div class="field full">
                <label class="field__label" for="kf-topic">Temat</label>
                <select id="kf-topic" class="field__select" name="topic" v-model="topic">
                  <option value="warsztaty">Warsztaty stacjonarne</option>
                  <option value="kursy">Kursy online</option>
                  <option value="sklep">Sklep · zamówienia</option>
                  <option value="wspolpraca">Współpraca</option>
                  <option value="inne">Inne</option>
                </select>
              </div>
              <div class="field full">
                <label class="field__label" for="kf-msg">Wiadomość</label>
                <textarea id="kf-msg" class="field__textarea" name="message" rows="6" required placeholder="Napisz do nas…" />
              </div>
            </div>
            <div class="cform__foot">
              <label class="field__check">
                <input type="checkbox" name="newsletter" />
                <span class="field__check-label">Zapisz mnie też na newsletter „Listy z lasu”</span>
              </label>
              <button class="btn btn--primary btn--md" type="submit">
                Wyślij wiadomość
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- ===== Częste pytania ===== -->
      <section class="section--tight container">
        <div class="contact-faq">
          <div class="sec-head sec-head--center io">
            <span class="eyebrow">Zanim napiszesz</span>
            <h2>Częste pytania</h2>
          </div>
          <div class="io">
            <div
              v-for="(item, i) in FAQ"
              :key="i"
              class="faq__item"
              :class="{ 'faq__item--open': openFaq === i }"
            >
              <button class="faq__q" :aria-expanded="openFaq === i" @click="openFaq = openFaq === i ? null : i">
                {{ item.q }}
                <svg class="faq__chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              <p v-show="openFaq === i" class="faq__a">{{ item.a }}</p>
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
              <li><a href="/#kursy">Kursy online</a></li>
              <li><NuxtLink to="/o-nas">O nas</NuxtLink></li>
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
import { ref, onMounted, onUnmounted } from 'vue'

useHead({
  title: 'Kontakt — DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const sent = ref(false)
const topic = ref('warsztaty')
const openFaq = ref(null)

const FAQ = [
  { q: 'Jak zapisać się na warsztat?', a: 'Wybierz termin na stronie Warsztaty 2026 i kliknij „Zapisz się”. Po zapisie dostaniesz e-mail z potwierdzeniem, dokładnym adresem pracowni i listą rzeczy do zabrania.' },
  { q: 'Czy mogę zwrócić rzeczy ze sklepu?', a: 'Tak — masz 30 dni na zwrot bez podania przyczyny. Napisz na czesc@drwa.pl, a odeślemy instrukcję i pokryjemy koszt pierwszej wysyłki zwrotnej.' },
  { q: 'Robicie warsztaty na zamówienie?', a: 'Robimy — dla firm, szkół i grup znajomych od 6 osób. Opisz w formularzu, co chcecie zbudować, a przygotujemy program i wycenę.' },
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
