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
const QUOTES = [
  { text: 'Trzy dni, których nie zapomnę. Wyszedłem z własnoręcznie zbudowaną ławą i głową pełną pomysłów.', name: 'Michał Zaremba', role: 'Warsztat · Altana', stars: 5 },
  { text: 'Spokojnie, konkretnie, bez ściemy. Po raz pierwszy poczułem drewno „od środka".', name: 'Anna Lewandowska', role: 'Kurs · Od wiaty do chaty', stars: 5 },
  { text: 'Ognisko, las i ludzie, którzy naprawdę kochają to, co robią. Wrócę po więcej.', name: 'Piotr Mazur', role: 'Warsztat · Łączenia', stars: 5 },
]

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}
</script>
