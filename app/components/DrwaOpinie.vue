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
const QUOTES = [
  { text: 'Warsztaty Drew to fachowa i konkretna wiedza o pracy z drewnem oraz efektywna i miła współpraca ze wspaniałymi ludźmi.', name: 'Ewa Krecik', role: 'Warsztaty stacjonarne', stars: 5 },
  { text: 'Cudowne miejsce, cudowni ludzie, wspaniałe warsztaty. Merytorycznie mistrzostwo. Wiele ambitnych i pięknych projektów ciesielskich. Bardzo polecam DRWA.', name: 'Wojciech Snoch', role: 'Warsztaty stacjonarne', stars: 5 },
  { text: 'Jędrzej jest bardzo dobrym nauczycielem, a kurs jest solidnie skonstruowany — wszystko w prosty, przystępny, ale i wyczerpujący sposób. Dzięki lekcjom poczułem, że budowa własnego domku jest w moim zasięgu.', name: '@Thotep', role: 'Kurs online · Od wiaty do chaty', stars: 5 },
  { text: 'Udział w tygodniowych Warsztatach Drewnianej Samodzielności był jedną z najlepszych rzeczy, jakie zrobiłem dla siebie w ostatnim czasie. Kadra prowadząca na najwyższym poziomie, a ja nabrałem pewności siebie, by stawiać pierwsze kroki z własnymi projektami.', name: 'Jacek Domagalski', role: 'Warsztaty stacjonarne', stars: 5 },
  { text: 'Byłem na tygodniowych warsztatach i bardzo mi się podobało! Umiejętności pracy z drewnem to jedno, ale klimat samego miejsca i „slow life", którego tam doświadczyłem, to drugie. Polecam ;)', name: 'Sebastian Ścisłowski', role: 'Warsztaty stacjonarne', stars: 5 },
]

function initials(name) {
  return name.replace('@', '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}
</script>
