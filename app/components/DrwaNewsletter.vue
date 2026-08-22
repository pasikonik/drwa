<template>
  <section class="section container">
    <div class="news io" id="newsletter">
      <span class="eyebrow eyebrow--ondark">Newsletter</span>
      <h2>Kurier Ciesielski</h2>
      <p>Raz na dwa tygodnie: aktualności ciesielskie i materiały edukacyjne, inspiracje i historie z naszej stolarni.</p>
      <p v-if="sent" class="news__sent">Dziękujemy — do zobaczenia w lesie.</p>
      <form v-else class="news__form" @submit.prevent="submit">
        <input
          v-model="email"
          type="email"
          required
          placeholder="twój@email.pl"
          aria-label="E-mail"
          :disabled="loading"
        />
        <button type="submit" class="btn btn--accent btn--md" :disabled="loading">
          {{ loading ? 'Zapisuję…' : 'Zapisz się' }}
        </button>
      </form>
      <p v-if="error" class="news__error">{{ error }}</p>
    </div>
  </section>
</template>

<script setup>
const email = ref('')
const sent = ref(false)
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/newsletter', { method: 'POST', body: { email: email.value } })
    sent.value = true
  } catch (e) {
    error.value = e?.data?.message ?? 'Coś poszło nie tak. Spróbuj ponownie.'
  } finally {
    loading.value = false
  }
}
</script>
