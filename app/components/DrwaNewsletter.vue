<template>
  <section class="section container">
    <div class="news io">
      <span class="eyebrow eyebrow--ondark">Newsletter</span>
      <h2>Listy z lasu</h2>
      <p>Raz w miesiącu: nowe terminy warsztatów, materiały z kursów online i krótkie historie zza warsztatu.</p>
      <p v-if="sent" class="news__sent">Dziękujemy — do zobaczenia w lesie.</p>
      <form v-else class="news__form" @submit.prevent="submit">
        <input
          v-model="email"
          type="email"
          required
          placeholder="twój@email.pl"
          aria-label="E-mail"
        />
        <button type="submit" class="btn btn--accent btn--md">Zapisz się</button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const sent = ref(false)

function submit() {
  if (email.value.trim()) sent.value = true
}
</script>
