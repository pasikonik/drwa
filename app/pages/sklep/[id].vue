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
          <NuxtLink class="nav__link nav__item" to="/">Strona główna</NuxtLink>
          <NuxtLink class="nav__link nav__item" to="/warsztaty">Warsztaty 2026</NuxtLink>
          <a class="nav__link nav__item" href="/#kursy">Kursy online</a>
          <NuxtLink class="nav__link nav__item" to="/o-nas">O nas</NuxtLink>
          <NuxtLink class="nav__link nav__item nav__link--current" to="/sklep">Sklep</NuxtLink>
          <NuxtLink class="nav__link nav__item" to="/blog">Blog</NuxtLink>
          <NuxtLink class="nav__link nav__item" to="/kontakt">Kontakt</NuxtLink>
        </nav>
        <div class="nav__spacer" />
        <div class="nav__actions">
          <button class="cartbtn nav__link" aria-label="Koszyk">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Koszyk
            <span v-if="cartCount > 0" class="cartbtn__count">{{ cartCount }}</span>
          </button>
        </div>
      </div>
    </header>

    <main>
      <!-- ===== Galeria + panel zakupu ===== -->
      <div class="container section" style="padding-top: var(--space-6)">
        <nav class="drwa-crumb" aria-label="Breadcrumb">
          <NuxtLink to="/sklep">Sklep</NuxtLink>
          <span class="drwa-crumb__sep">·</span>
          <NuxtLink to="/sklep">{{ catLabel }}</NuxtLink>
          <span class="drwa-crumb__sep">·</span>
          <span class="drwa-crumb__current" aria-current="page">{{ p.title }}</span>
        </nav>

        <div class="pdp" style="margin-top: var(--space-6)">
          <!-- Galeria -->
          <div class="pdp__gallery io">
            <div class="pdp__main">
              <span v-if="p.badge" class="mcard__badge" :class="p.badgeTone === 'ember' ? 'mcard__badge--ember' : ''">
                {{ p.badge }}
              </span>
              <div class="mcard__placeholder">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="m21 15-5-5L5 21"/>
                </svg>
                <span>Zdjęcie główne · {{ p.title }}</span>
              </div>
            </div>
            <div class="pdp__thumbs">
              <div class="pdp__thumb">
                <div class="mcard__placeholder">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="m21 15-5-5L5 21"/>
                  </svg>
                  <span>Detal · zdobienie</span>
                </div>
              </div>
              <div class="pdp__thumb">
                <div class="mcard__placeholder">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="m21 15-5-5L5 21"/>
                  </svg>
                  <span>Na sylwetce</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Panel zakupu -->
          <div class="pdp__buy io">
            <span class="eyebrow">{{ p.eyebrow }} · Merch DRWA</span>
            <h1 class="pdp__title">{{ p.title }}</h1>
            <p class="pdp__price">{{ p.price }}</p>
            <p class="pdp__desc">{{ p.desc }}</p>

            <p class="pdp__label">
              Rozmiar
              <span v-if="size" class="picked">{{ size }}</span>
              <span v-else>wybierz</span>
            </p>
            <div class="sizes" role="group" aria-label="Rozmiar">
              <button
                v-for="s in SIZES"
                :key="s"
                class="size"
                :class="{ 'is-on': size === s }"
                @click="size = size === s ? null : s"
              >{{ s }}</button>
            </div>

            <div class="pdp__cta">
              <button class="btn btn--primary btn--lg" @click="addToCart(p)">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                  <path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Do koszyka · {{ p.price }}
              </button>
            </div>

            <div class="pdp__perks">
              <span class="pdp__perk">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/>
                  <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
                </svg>
                Wysyłka w 48 h · kurier lub paczkomat
              </span>
              <span class="pdp__perk">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6"/>
                </svg>
                30 dni na zwrot, bez pytań
              </span>
              <span class="pdp__perk">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M7 20h10"/><path d="M12 20c0-7 0-9 0-9"/>
                  <path d="M12 11c0-3-2-5-6-5 0 4 2 6 6 6Z"/><path d="M12 11c0-2.5 1.7-4.5 5-4.5 0 3.5-1.7 5-5 5Z"/>
                </svg>
                Bawełna organiczna · druk wodny · szyte w Polsce
              </span>
            </div>

            <ul class="pdp__specs">
              <li v-for="[k, v] in p.specs" :key="k">
                <span class="k">{{ k }}</span><span class="v">{{ v }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- ===== Szczegóły ===== -->
      <section class="section--tight container">
        <div class="pdp__story io">
          <div class="sec-head">
            <span class="eyebrow">O tej rzeczy</span>
          </div>
          <p v-for="(par, i) in p.long" :key="i">{{ par }}</p>

          <div>
            <div class="faq__item" :class="{ 'faq__item--open': openAcc === 0 }">
              <button class="faq__q" :aria-expanded="openAcc === 0" @click="openAcc = openAcc === 0 ? null : 0">
                Tabela rozmiarów
                <svg class="faq__chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              <div v-show="openAcc === 0" class="faq__a">
                <table class="size-table">
                  <thead><tr><th>Rozmiar</th><th>Pierś (cm)</th><th>Długość (cm)</th></tr></thead>
                  <tbody>
                    <tr><td>S</td><td>52</td><td>68</td></tr>
                    <tr><td>M</td><td>55</td><td>70</td></tr>
                    <tr><td>L</td><td>58</td><td>72</td></tr>
                    <tr><td>XL</td><td>61</td><td>74</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="faq__item" :class="{ 'faq__item--open': openAcc === 1 }">
              <button class="faq__q" :aria-expanded="openAcc === 1" @click="openAcc = openAcc === 1 ? null : 1">
                Pielęgnacja
                <svg class="faq__chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              <p v-show="openAcc === 1" class="faq__a">Pierz na lewej stronie, w 30°C, bez suszarki bębnowej. Druk wodny lubi spokój — tak jak my.</p>
            </div>
            <div class="faq__item" :class="{ 'faq__item--open': openAcc === 2 }">
              <button class="faq__q" :aria-expanded="openAcc === 2" @click="openAcc = openAcc === 2 ? null : 2">
                Wysyłka i zwroty
                <svg class="faq__chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              <p v-show="openAcc === 2" class="faq__a">Pakujemy w papier, bez plastiku. Wysyłka w 48 h kurierem lub do paczkomatu. Masz 30 dni na zwrot — napisz na czesc@drwa.pl.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Inne produkty ===== -->
      <section class="section--tight container pdp-more">
        <div class="sec-head io">
          <span class="eyebrow">Sklep · Merch</span>
          <h2>Inne rzeczy z lasu</h2>
        </div>
        <div class="mgrid">
          <article v-for="other in others" :key="other.id" class="mcard io">
            <div class="mcard__media">
              <span v-if="other.badge" class="mcard__badge" :class="other.badgeTone === 'ember' ? 'mcard__badge--ember' : ''">
                {{ other.badge }}
              </span>
              <div class="mcard__placeholder">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="m21 15-5-5L5 21"/>
                </svg>
                <span>{{ other.eyebrow }}</span>
              </div>
              <NuxtLink class="mcard__cover" :to="`/sklep/${other.id}`" :aria-label="'Zobacz: ' + other.title" />
            </div>
            <div class="mcard__body">
              <span class="mcard__eyebrow">{{ other.eyebrow }}</span>
              <h3 class="mcard__title">
                <NuxtLink class="mcard__link" :to="`/sklep/${other.id}`">{{ other.title }}</NuxtLink>
              </h3>
              <div class="mcard__foot">
                <span class="mcard__price">{{ other.price }}</span>
                <span class="mcard__go">
                  Zobacz
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
            <h4>Sklep</h4>
            <ul>
              <li><NuxtLink to="/sklep">Wszystkie produkty</NuxtLink></li>
              <li><NuxtLink to="/kontakt">Wysyłka i zwroty</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4>DRWA</h4>
            <ul>
              <li><NuxtLink to="/warsztaty">Warsztaty 2026</NuxtLink></li>
              <li><NuxtLink to="/o-nas">O nas</NuxtLink></li>
              <li><NuxtLink to="/blog">Blog · Z lasu</NuxtLink></li>
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

    <!-- ===== Toast ===== -->
    <div class="toast" :class="{ 'is-on': toast.on }" role="status" aria-live="polite">
      <svg class="toast__check" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5"/>
      </svg>
      <span>{{ toast.msg }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { PRODUCTS, SIZES, type Produkt } from '~/data/produkty'

const route = useRoute()

const p = PRODUCTS.find(x => x.id === route.params.id)
if (!p) {
  throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono produktu' })
}

useHead({
  title: `${p.title} — Sklep DRWA`,
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const catLabel = computed(() => (p.cat === 'bluza' ? 'Bluzy' : 'Koszulki'))
const others = computed(() => PRODUCTS.filter(x => x.id !== p.id).slice(0, 3))

const size = ref<string | null>(null)
const openAcc = ref<number | null>(0)
const cartCount = ref(0)
const toast = reactive({ on: false, msg: '' })
let toastTimer: ReturnType<typeof setTimeout> | null = null

function addToCart(prod: Produkt) {
  cartCount.value++
  const tag = size.value ? ` (rozm. ${size.value})` : ''
  toast.msg = `Dodano: ${prod.title}${tag}`
  toast.on = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.on = false }, 2600)
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.io').forEach(el => el.classList.add('io--in'))
    return
  }
  observer = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('io--in'); observer!.unobserve(en.target) }
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
  document.querySelectorAll('.io:not(.io--in)').forEach(el => observer!.observe(el))
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  if (toastTimer) clearTimeout(toastTimer)
})
</script>
