<template>
  <section class="section container" id="opinie">
    <div class="sec-head io">
      <span class="eyebrow">Opinie</span>
      <h2>Co mówią kursanci</h2>
    </div>
    <div class="quotes">
      <figure v-for="q in QUOTES" :key="q.name" class="quote io">
        <div class="quote__stars">
          <svg v-for="i in q.stars" :key="i" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
            <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/>
          </svg>
        </div>
        <blockquote class="quote__text">„{{ q.text }}"</blockquote>
        <figcaption class="quote__by">
          <div class="quote__avatar">{{ initials(q.name) }}</div>
          <div>
            <div class="quote__name">{{ q.name }}</div>
            <div class="quote__role">{{ q.role }}</div>
          </div>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup>
// Prawdziwe opinie z Google i komentarzy kursantów — zastępują wcześniejsze
// przykładowe cytaty, które nie pochodziły od realnych osób.
// Warsztatowe i kursowe przeplatane, żeby w każdym rzędzie były oba rodzaje.
const QUOTES = [
  { text: 'Warsztaty Drew to fachowa i konkretna wiedza o pracy z drewnem oraz efektywna i miła współpraca ze wspaniałymi ludźmi.', name: 'Ewa Krecik', role: 'Warsztaty stacjonarne', stars: 5 },
  { text: 'Kurs „Od wiaty do chaty” pozwolił mi zrozumieć, że praca z drewnem nie dość, że nie jest trudna, to do tego jest wybitnie satysfakcjonująca. Dzięki kursowi dowiedziałem się też, że nie trzeba posiadać warsztatu oraz profesjonalnych narzędzi, żeby zrobić coś profesjonalnie z zachowaniem wysokich walorów estetycznych. Jędrzej prowadzi nas „za rękę” przez wszystkie etapy i robi to w sposób bardzo przejrzysty, a jego miłe usposobienie jedynie upewnia Cię w przekonaniu, że nie mogłeś trafić na bardziej kompletnego prowadzącego. Szczerze polecam. :)', name: 'Łukasz Muzyczka', role: 'Kurs online · Od wiaty do chaty', stars: 5 },
  { text: 'Cudowne miejsce, cudowni ludzie, wspaniałe warsztaty. Merytorycznie mistrzostwo. Wiele ambitnych i pięknych projektów ciesielskich. Bardzo polecam DRWA.', name: 'Wojciech Snoch', role: 'Warsztaty stacjonarne', stars: 5 },
  { text: 'Za co przede wszystkim polecam kursy i Twoją pracę, to profesjonalne podejście (…) i niepodchodzenie do tego jak do biznesu, tylko wychodzenie z poziomu prawdziwej chęci przekazania szlachetnej pracy w drewnie. To naprawdę czuć (…) Poza tym samo posiadanie Twojego kursu w swojej „skrzynce narzędziowej” daje mi też dużo spokoju, bo wiem, że zawsze mam tę wiedzę w zasadzie na wyciągnięcie ręki, poukładaną i podaną w bardzo przyjaznym formacie. Jestem jeszcze przed budową swojej pierwszej konstrukcji, ale kurs od początku traktuję jak bardzo dobrą inwestycję.', name: 'Michał Tyburski', role: 'Kurs online', stars: 5 },
  { text: 'Udział w tygodniowych Warsztatach Drewnianej Samodzielności był jedną z najlepszych rzeczy, jakie zrobiłem dla siebie w ostatnim czasie. Kadra prowadząca na najwyższym poziomie, a ja nabrałem pewności siebie, by stawiać pierwsze kroki z własnymi projektami.', name: 'Jacek Domagalski', role: 'Warsztaty stacjonarne', stars: 5 },
  { text: 'Jędrzej jest bardzo dobrym nauczycielem, a kurs jest solidnie skonstruowany — wszystko w prosty, przystępny, ale i wyczerpujący sposób. Dzięki lekcjom poczułem, że budowa własnego domku jest w moim zasięgu.', name: '@Thotep', role: 'Kurs online · Od wiaty do chaty', stars: 5 },
  { text: 'Byłem na tygodniowych warsztatach i bardzo mi się podobało! Umiejętności pracy z drewnem to jedno, ale klimat samego miejsca i „slow life", którego tam doświadczyłem, to drugie. Polecam ;)', name: 'Sebastian Ścisłowski', role: 'Warsztaty stacjonarne', stars: 5 },
  { text: 'Kurs jest mega ciekawy i zdecydowanie bardzo treściwy. Sądzę, że nawet mało rozgarnięty facet dzięki wskazówkom, objaśnieniom i poradom w kursie jest w stanie zbudować swoje wymarzone 4 kąty. Ja niestety z przyczyn niezależnych ode mnie musiałem przerwać swój projekt, ale na wiosnę mam głęboką nadzieję na powrót do mojego dzieła. Bardzo się cieszę, że trafiłem na Twój kurs.', name: 'Marcin Dworak', role: 'Kurs online', stars: 5 },
]

function initials(name) {
  return name.replace('@', '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}
</script>
