<template>
  <div v-if="sent" class="signup__sent">
    <h3>Dziękujemy za zgłoszenie.</h3>
    <p>Odezwiemy się w ciągu dwóch dni roboczych z potwierdzeniem miejsca i szczegółami. Do zobaczenia w stolarni.</p>
  </div>
  <form v-else class="signup__form" @submit.prevent="submit">
    <input
      v-model="form.website"
      type="text"
      name="website"
      tabindex="-1"
      autocomplete="off"
      class="signup__hp"
      aria-hidden="true"
    />
    <div v-if="eyebrow" class="eyebrow">{{ eyebrow }}</div>
    <div v-if="workshops" class="field">
      <label class="field__label" :for="`${uid}-workshop`">Warsztat</label>
      <select :id="`${uid}-workshop`" v-model="form.workshopId" class="field__select">
        <option v-for="w in workshops" :key="w.id" :value="w.id">{{ w.label }}</option>
      </select>
    </div>
    <div class="field">
      <label class="field__label" :for="`${uid}-name`">Imię i nazwisko</label>
      <input :id="`${uid}-name`" v-model="form.name" class="field__input" :class="{ 'field__input--error': errors.name }" type="text" autocomplete="name" />
      <span v-if="errors.name" class="field__error" role="alert">{{ errors.name }}</span>
    </div>
    <div class="field">
      <label class="field__label" :for="`${uid}-email`">E-mail</label>
      <input :id="`${uid}-email`" v-model="form.email" class="field__input" :class="{ 'field__input--error': errors.email }" type="email" autocomplete="email" />
      <span v-if="errors.email" class="field__error" role="alert">{{ errors.email }}</span>
      <span class="field__hint">Tu wyślemy potwierdzenie.</span>
    </div>
    <div class="field">
      <label class="field__label" :for="`${uid}-msg`">Wiadomość (opcjonalnie)</label>
      <textarea :id="`${uid}-msg`" v-model="form.message" class="field__textarea" rows="3" placeholder="Pytania, doświadczenie, dieta…" />
    </div>
    <label class="field__check">
      <input v-model="form.newsletter" type="checkbox" />
      <span class="field__check-label">Zapisz mnie też do newslettera „Listy z lasu"</span>
    </label>
    <p v-if="errorMessage" class="signup__error">{{ errorMessage }}</p>
    <div class="signup__actions">
      <button type="submit" class="btn btn--primary btn--lg" :disabled="sending">
        {{ sending ? 'Wysyłanie…' : 'Wyślij zgłoszenie' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, useId } from 'vue'

interface SignupWorkshop { id: number; title: string; slug: string; label: string }

/**
 * Workshop signup (mailed to the organisers). Two modes: pass `workshops` to
 * show a picker (the /warsztaty list), or `title` + `slug` for a fixed workshop
 * (its own page).
 */
const props = defineProps<{
  workshops?: SignupWorkshop[]
  title?: string
  slug?: string
  eyebrow?: string
  /** Shown in the error message when sending fails. */
  contactEmail: string
}>()

const uid = useId()

const form = reactive({
  workshopId: props.workshops?.[0]?.id ?? (null as number | null),
  name: '', email: '', message: '', newsletter: false, website: '',
})
const errors = reactive({ name: '', email: '' })
const sent = ref(false)
const sending = ref(false)
const errorMessage = ref('')

// The list can land after setup (client-side recovery from a failed SSR fetch),
// so the select would otherwise stay on its initial empty value.
watch(() => props.workshops, (list) => {
  if (form.workshopId == null) form.workshopId = list?.[0]?.id ?? null
})

const selected = computed(() =>
  props.workshops
    ? props.workshops.find((w) => w.id === form.workshopId)
    : { title: props.title, slug: props.slug },
)

async function submit() {
  const email = form.email.trim()
  errors.name = form.name.trim() ? '' : 'Podaj imię i nazwisko.'
  errors.email = email.includes('@') ? '' : 'Podaj poprawny adres e-mail.'
  if (errors.name || errors.email) return

  errorMessage.value = ''
  sending.value = true
  try {
    await $fetch('/api/warsztaty-signup', {
      method: 'POST',
      body: {
        name: form.name,
        email,
        message: form.message,
        workshopTitle: selected.value?.title,
        workshopSlug: selected.value?.slug,
        website: form.website,
      },
    })
    if (form.newsletter) {
      $fetch('/api/newsletter', { method: 'POST', body: { email } }).catch(() => {})
    }
    sent.value = true
  } catch (err) {
    const message = (err as { data?: { statusMessage?: string } })?.data?.statusMessage
    errorMessage.value = message || `Nie udało się wysłać zgłoszenia, spróbuj ponownie lub napisz na ${props.contactEmail}.`
  } finally {
    sending.value = false
  }
}
</script>
