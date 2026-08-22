<template>
  <div class="site">
    <DrwaNav />

    <!-- ===== Hero ===== -->
    <section class="phero" id="top">
      <div class="phero__bg">
        <img src="/assets/kursy-band.avif" alt="Cieśla przed samodzielnie zbudowaną chatą z gontowym dachem" />
      </div>
      <div class="phero__scrim" />
      <div class="container phero__inner">
        <span class="eyebrow eyebrow--ondark">ONLINE · W SWOIM TEMPIE</span>
        <h1>Kursy online</h1>
        <p class="phero__lead">Ciesielstwo krok po kroku — ucz się z instrukcji wideo, kiedy chcesz i gdzie chcesz. Dostęp od razu po zakupie.</p>
      </div>
    </section>

    <main id="main-content">
      <!-- ===== O naszych kursach ===== -->
      <section class="section container" id="o-kursach">
        <div class="sec-head io">
          <span class="eyebrow">O naszych kursach</span>
          <h2>Drwa online</h2>
        </div>
        <div class="course-intro">
          <div class="course-intro__text io">
            <p>Kursy online to rozwijająca się gałąź pracy edukacyjnej Drew. Wyrosła z myślą o osobach, które nie mają możliwości przyjazdu na warsztat, albo po prostu wolą pracować w pojedynkę i uczyć się na własnych błędach — ale też ograniczać ich ilość.</p>
            <p>W oparciu o kilkanaście lat doświadczeń budowania z drewna i nauczania tego fachu przygotowujemy programy kursów, które w przystępny i kompleksowy sposób wprowadzają w tematy ciesielstwa i pracy z drewnem.</p>
          </div>
          <ul class="course-intro__list io">
            <li>Nagrania i objaśnienia każdego etapu, krok po kroku</li>
            <li>Wykłady i prezentacje o teorii ciesielstwa i drewna</li>
            <li>Projekty i rysunki wykonawcze</li>
            <li>Tabele materiałów i listy narzędzi</li>
            <li>Wskazówki dotyczące wyboru materiałów, narzędzi itp.</li>
            <li>Możliwość konsultacji online w zamkniętej grupie kursantów</li>
            <li>Dodatki edukacyjne, rabaty na narzędzia i zniżki na warsztaty</li>
          </ul>
        </div>
        <p class="course-intro__more io">
          Oprócz tego tworzymy inne kursy, które rozwijają konkretne aspekty ciesielstwa (np. „Projektowanie konstrukcji drewnianych na własny użytek") lub przedstawiają projekt i wykonanie konkretnego obiektu (np. „Ośmiokątna altana z wieżyczką"). Zapisz się na
          <NuxtLink to="/#newsletter">Kurier Ciesielski</NuxtLink>, by dostawać informacje o nowych kursach.
        </p>
      </section>

      <!-- ===== Do wyboru ===== -->
      <section class="section container" id="lista">
        <div class="sec-head io">
          <span class="eyebrow">Do wyboru</span>
          <h2>Wybierz swój kurs</h2>
          <p>Każdy kurs to komplet instrukcji wideo i materiałów — od podstaw pracy z drewnem po całe konstrukcje.</p>
        </div>

        <div v-if="courses.length" class="builds io">
          <article v-for="c in courses" :key="c.id" class="build build--course">
            <div class="build__img">
              <DrwaImg :src="c.image" :alt="c.title" preset="card" :fallback="c.fallback" />
            </div>
            <div class="build__body">
              <span v-if="c.subtitle" class="build__eyebrow">{{ c.subtitle }}</span>
              <h3 class="build__title"><NuxtLink :to="c.route">{{ c.title }}</NuxtLink></h3>
              <p class="build__desc">{{ c.desc }}</p>
              <div class="build__pricerow">
                <span class="build__price">{{ c.price }}</span>
                <NuxtLink :to="c.route" class="btn btn--secondary btn--md">Zobacz kurs</NuxtLink>
              </div>
            </div>
          </article>
        </div>
        <p v-else class="klist-empty io">Wkrótce nowe kursy — zajrzyj niebawem.</p>
      </section>

      <!-- ===== FAQ ===== -->
      <section class="section container" id="faq">
        <div class="sec-head io">
          <span class="eyebrow">Pytania i odpowiedzi</span>
          <h2>Zanim się zapiszesz</h2>
        </div>
        <div class="faq__wrap io">
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
      </section>
    </main>

    <DrwaFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatPrice, stripHtml } from '~/utils/format'

useHead({
  title: 'Kursy online — DRWA',
  meta: [{ name: 'description', content: 'Kursy online DRWA — ciesielstwo i praca z drewnem krok po kroku, w swoim tempie.' }],
})

const { data } = await useProducts('course')

const FALLBACK_IMGS = ['/assets/kurs-wiata.png', '/assets/kurs-altana.png', '/assets/kurs-domek.png']

const courses = computed(() =>
  (data.value?.products ?? []).map((p, i) => ({
    id: p.id,
    title: p.title,
    subtitle: p.course?.subtitle ?? null,
    route: `/kursy/${p.slug ?? p.id}`,
    desc: p.short_description ?? stripHtml(p.description, 180),
    // Directus wysyła decimal jako string — Number() przed formatowaniem.
    price: formatPrice(Number(p.price)),
    image: p.image,
    fallback: FALLBACK_IMGS[i % FALLBACK_IMGS.length]!,
  }))
)

const FAQ = [
  {
    q: 'Czym kurs „Od Wiaty do Chaty" różni się od innych kursów?',
    a: 'Na polskim rynku znajdziesz dobre kursy ciesielskie skierowane do profesjonalistów. Brakowało jednak kursu, który od podstaw i kompleksowo wprowadzałby amatora w temat samodzielnego budowania drewnianych konstrukcji użytkowych — od fundamentów aż po wykończenie. Pokazujemy różne rozwiązania i uczymy podejmowania świadomych decyzji: od fundamentów na kamieniu polnym i słupkach betonowych, przez konstrukcje ścian i dachu, po materiały, pracę z narzędziami i różne metody wykończenia. Nasza specjalność to praca ręczna i tradycyjne połączenia ciesielskie — tego nie znajdziesz w żadnym innym kursie.',
  },
  {
    q: 'Dlaczego warto uczyć się z kursu, skoro w internecie jest tak dużo darmowej wiedzy?',
    a: 'W internecie można znaleźć ogromną ilość wiedzy, ale jest ona rozproszona, często wyrywkowa i pozbawiona kontekstu. Nasza wiedza jest oparta o kilkanaście lat pracy z drewnem, setki wybudowanych obiektów i naukę w dwóch państwowych szkołach rzemiosła. W kursach przekazujemy ją uporządkowaną w jeden proces realizacji projektu od A do Z. Dodatkowo dołączasz do ogólnopolskiej społeczności adeptów drewna, w której możesz zadawać pytania i poznać ludzi mieszkających blisko Ciebie.',
  },
  {
    q: 'Czy inwestycja w kurs może mi się zwrócić?',
    a: 'Robocizna to często ponad połowa budżetu budowy. Budując samodzielnie oszczędzasz te pieniądze, a zyskujesz dużo więcej niż sam obiekt — satysfakcję z własnej pracy i wiele lat przyjemności z korzystania z samodzielnie wybudowanej konstrukcji. Oszczędzasz też na własnych, często kosztownych błędach — pomagamy Ci ich uniknąć.',
  },
  {
    q: 'Czy razem z kursem zrealizuję projekt budowlany własnego pomysłu?',
    a: 'Kurs opiera się na projekcie niewielkiego domku o wymiarach 3,5×5 m — możesz przejść przez cały proces krok po kroku i odtworzyć go przy budowie własnego obiektu. Jednocześnie wiedza z kursu jest uniwersalna i przyda się przy wielu innych projektach: jak uzyskać stabilność konstrukcji, dobierać przekroje i rozpiętości, tworzyć rysunki i modele 3D. Zawsze możesz też skonsultować swój projekt na forum kursantów.',
  },
  {
    q: 'Czy mogę zrezygnować z kursu, jeśli okaże się, że to nie dla mnie?',
    a: 'Tak. Po zakupie kursu masz 14 dni na odstąpienie od zakupu i zwrot pieniędzy bez podawania przyczyny.',
  },
  {
    q: 'Jak długo będę mieć dostęp do kursu?',
    a: 'Dostęp do kursu otrzymujesz na 3 lata od momentu zakupu i możesz w tym czasie wracać do materiałów, kiedy potrzebujesz. Po upływie trzech lat możesz przedłużyć dostęp na kolejny rok za symboliczną opłatą.',
  },
  {
    q: 'Czy będę mieć wsparcie podczas kursu?',
    a: 'Tak. Po dołączeniu do kursu „Od Wiaty do Chaty" otrzymujesz dostęp do społeczności kursantów na Discordzie, gdzie możesz konsultować wątpliwości, zadawać pytania i wymieniać się doświadczeniami z innymi osobami — także w sprawie własnego projektu.',
  },
  {
    q: 'Czy otrzymam certyfikat ukończenia kursu?',
    a: 'Tak, ale zależy nam, żeby oznaczał coś więcej niż samo obejrzenie materiałów. Dyplom ukończenia otrzymują osoby, które wykorzystają zdobytą wiedzę w praktyce — po zrealizowaniu własnego projektu, jego weryfikacji i krótkim sprawdzianie wiedzy.',
  },
  {
    q: 'Czy mogę zapłacić za kurs w ratach?',
    a: 'Tak, dostępna jest możliwość płatności ratalnej za pośrednictwem PayU.',
  },
  {
    q: 'Czy otrzymam fakturę?',
    a: 'Tak. Wystawiamy faktury, ale nie jesteśmy czynnym podatnikiem VAT.',
  },
  {
    q: 'Czy kurs jest dla początkujących?',
    a: '„Od Wiaty do Chaty" powstał przede wszystkim z myślą o osobach, które chcą rozpocząć swoją przygodę z samodzielnym budowaniem z drewna — nie musisz być cieślą ani mieć wcześniejszego doświadczenia. Jeśli już je masz, potraktuj kurs jako uporządkowanie i rozszerzenie swojej wiedzy.',
  },
  {
    q: 'Czy muszę mieć własną działkę lub plac, żeby rozpocząć kurs?',
    a: 'Nie musisz mieć własnej działki ani wyposażonego warsztatu. Żeby jednak samodzielnie budować z drewna, potrzebujesz miejsca do pracy — może to być garaż, podwórko, kawałek działki albo społeczny warsztat w Twoim mieście, zależnie od tego, co i jak chcesz zbudować.',
  },
  {
    q: 'Jakich narzędzi potrzebuję, żeby zacząć?',
    a: 'Do sprawnego i bezpiecznego budowania potrzebujesz zestawu podstawowych narzędzi ręcznych i elektronarzędzi. Jeśli dopiero zaczynasz budować swój warsztat, zacznij od kursu Podstawy pracy z drewnem — jego projekt, solidne kozły robocze, możesz zbudować korzystając z podstawowych narzędzi ręcznych i wkrętarki.',
  },
  {
    q: 'Czy w kursie uczę się obliczeń konstrukcyjnych i nośności?',
    a: 'Nie uczymy skomplikowanych obliczeń wytrzymałościowych — to nie jest domena pracy cieśli. Bazujemy na sprawdzonych rozwiązaniach wypracowanych przez setki lat tradycji ciesielstwa oraz na współczesnych normach budownictwa, podanych w przystępny i konkretny sposób.',
  },
  {
    q: 'Czy dostęp do kursu obejmuje aktualizacje materiałów?',
    a: 'Tak. Nasze kursy są aktualizowane i rozwijane, a kupując dostęp, otrzymujesz również dostęp do wprowadzanych aktualizacji.',
  },
]

const openFaq = ref<number | null>(0)

useScrollReveal()
</script>

<style scoped>
.course-intro {
  display: grid;
  grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
  gap: var(--space-8);
  align-items: start;
}
.course-intro__text p {
  font-family: var(--font-serif);
  font-size: var(--text-base);
  line-height: 1.75;
  color: var(--text-body);
  margin: 0 0 var(--space-5);
  max-width: 58ch;
}
.course-intro__list {
  list-style: none;
  margin: 0;
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--surface-card);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
.course-intro__list li {
  position: relative;
  padding-left: 26px;
  font-size: var(--text-sm);
  line-height: 1.5;
  color: var(--text-body);
}
.course-intro__list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}
.course-intro__more {
  margin: var(--space-6) 0 0;
  font-size: var(--text-sm);
  color: var(--text-muted);
  max-width: 72ch;
}
.course-intro__more a { color: var(--text-brand); font-weight: 600; }
@media (max-width: 880px) {
  .course-intro { grid-template-columns: 1fr; }
}
</style>
