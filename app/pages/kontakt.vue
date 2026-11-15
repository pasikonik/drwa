<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <DrwaPageHero>
      <template #bg><img src="/assets/kontakt-band.avif" alt="Drewniane drzwi stolarni Drew z rzeźbionym szyldem" /></template>
      <template #eyebrow>Kontakt · DRWA</template>
      <template #title>Powiedz, co tam potrzebujesz.</template>
      <template #lead>Pytania o warsztaty, zamówienia ze sklepu, współprace — odpisujemy zwykle do trzech dni roboczych. Prosimy o kontakt bezpośrednio na e-mail lub przez formularz.</template>
    </DrwaPageHero>

    <main id="main-content">
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
                <p class="cinfo__d"><a href="mailto:kontakt@drwa.pl">kontakt@drwa.pl</a> — najpewniejsza droga.</p>
              </div>
            </div>
            <div class="cinfo__item">
              <div class="cinfo__ic">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p class="cinfo__t">Dolina Harmonii</p>
                <p class="cinfo__d"><a href="https://maps.app.goo.gl/TDNCoqz3i1zLxRHr6" target="_blank" rel="noopener noreferrer">Pokaż na mapie Google</a></p>
              </div>
            </div>
            <div class="cinfo__social" aria-label="Media społecznościowe">
              <a aria-label="Instagram" href="https://www.instagram.com/drwa_yen/" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>
                </svg>
              </a>
              <a aria-label="Facebook" href="https://www.facebook.com/drwacyganik" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a aria-label="YouTube" href="https://www.youtube.com/@Drwa-Kopaniec" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <path d="m9.75 15.02 5.75-3.27-5.75-3.27v6.54z"/>
                </svg>
              </a>
            </div>
            <div class="cinfo__note">
              <p>„Jeśli nie odpisuję od razu, to pewnie dlatego, że robię coś innego. Proszę o cierpliwość, a w pilnych sprawach — o przypomnienia. Dzięki 🙏” — Jędrzej</p>
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
              <p>Dziękujemy! Odpiszemy zwykle do trzech dni roboczych — na adres, który podałeś.</p>
              <button class="btn btn--secondary btn--sm" @click="sendAnother">Wyślij kolejną</button>
            </div>
          </div>
          <form v-else class="cform io" @submit.prevent="submitForm">
            <input
              v-model="honeypot"
              type="text"
              name="website"
              tabindex="-1"
              autocomplete="off"
              class="cform__hp"
              aria-hidden="true"
            />
            <h2>Formularz</h2>
            <p>Wszystkie pola poza tematem są wymagane.</p>
            <div class="cform__grid">
              <div class="field">
                <label class="field__label" for="kf-name">Imię i nazwisko</label>
                <input id="kf-name" v-model="name" class="field__input" type="text" name="name" required placeholder="Jan Kowalski" autocomplete="name" />
              </div>
              <div class="field">
                <label class="field__label" for="kf-email">E-mail</label>
                <input id="kf-email" v-model="email" class="field__input" type="email" name="email" required placeholder="twój@email.pl" autocomplete="email" />
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
                <textarea id="kf-msg" v-model="message" class="field__textarea" name="message" rows="6" required placeholder="Napisz do nas…" />
              </div>
            </div>
            <p v-if="errorMessage" class="cform__error">{{ errorMessage }}</p>
            <div class="cform__foot">
              <label class="field__check">
                <input type="checkbox" name="newsletter" />
                <span class="field__check-label">Zapisz mnie też na newsletter „Listy z lasu”</span>
              </label>
              <button class="btn btn--primary btn--md" type="submit" :disabled="sending">
                {{ sending ? 'Wysyłanie…' : 'Wyślij wiadomość' }}
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      <DrwaNewsletter />

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
              <p v-show="openFaq === i" class="faq__a" style="white-space: pre-line">{{ item.a }}</p>
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
import { ref, nextTick } from 'vue'

useHead({
  title: 'Kontakt — DRWA',
})

const { reobserve } = useScrollReveal()

const sent = ref(false)
const topic = ref('warsztaty')
const openFaq = ref(null)

const name = ref('')
const email = ref('')
const message = ref('')
const honeypot = ref('')
const sending = ref(false)
const errorMessage = ref('')

function sendAnother() {
  sent.value = false
  nextTick(reobserve)
}

async function submitForm() {
  errorMessage.value = ''
  sending.value = true
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        topic: topic.value,
        message: message.value,
        website: honeypot.value,
      },
    })
    sent.value = true
  } catch (err) {
    errorMessage.value = err?.data?.statusMessage || 'Nie udało się wysłać, spróbuj ponownie lub napisz na kontakt@drwa.pl.'
  } finally {
    sending.value = false
  }
}

const FAQ = [
  { q: 'Czy można zlecić Wam wykonanie drewnianej konstrukcji lub innego projektu?', a: 'Obecnie nie przyjmujemy prywatnych zleceń wykonawczych. Jeśli planujesz własną budowę i potrzebujesz wsparcia, możemy pomóc w formie indywidualnych konsultacji dotyczących projektu, konstrukcji, doboru materiałów i rozwiązań ciesielskich.' },
  { q: 'Czy podejmujecie współpracę z firmami, szkołami i organizacjami?', a: 'Tak! Jesteśmy otwarci na współpracę przy projektach edukacyjnych, wydarzeniach, warsztatach i inicjatywach społecznych. Możemy przygotować program zajęć dla grupy, wesprzeć wydarzenie lub wspólnie zrealizować projekt związany z drewnem i tradycyjnym rzemiosłem.\n\nNie organizujemy natomiast warsztatów dla osób prywatnych. Ta forma współpracy jest zarezerwowana dla organizacji społecznych oraz absolwentów i członków społeczności Drew.' },
  { q: 'Gdzie znajduje się pracownia Drew?', a: 'Nasza pracownia i baza warsztatowa mieszczą się w Dolinie Harmonii, w Górach Izerskich, w okolicach Jeleniej Góry na Dolnym Śląsku. Możesz znaleźć nas na Google Maps. Nie przyjmujemy jednak odwiedzin bez wcześniejszego umówienia wizyty.' },
  { q: 'Czy mogę zwrócić produkt kupiony w sklepie?', a: 'Tak. Jeśli kupujesz jako konsument, masz prawo odstąpić od umowy zawartej na odległość w ciągu 14 dni od otrzymania produktu, bez podawania przyczyny. Koszt odesłania produktu ponosi kupujący. Wystarczy napisać do nas na adres kontakt@drwa.pl, a prześlemy informacje dotyczące zwrotu.' },
  { q: 'Jak szybko odpowiadacie na wiadomości?', a: 'Staramy się odpowiadać na wiadomości w ciągu 2–3 dni roboczych. Zdarza nam się jednak znikać na kilka dni w lesie i w projektach. Prosimy o wyrozumiałość, a w pilnych sprawach — o podkreślenie tego w temacie wiadomości i/lub przypomnienie.' },
  { q: 'Czy mogę dołączyć do społeczności Drew?', a: 'Tak! Społeczność Drwa tworzą osoby, które uczestniczyły w naszych warsztatach stacjonarnych lub w kursach. To przestrzeń do utrzymywania kontaktu, wymiany doświadczeń, dzielenia się pomysłami i dalszego rozwijania ciesielskich umiejętności. Przyjedź, poznajmy się i zbudujmy coś razem.' },
]
</script>
