<template>
  <form class="authform" @submit.prevent="submit">
    <div v-if="mode === 'register'" class="addr__row">
      <div class="field">
        <label class="field__label" for="af-first">Imię</label>
        <input id="af-first" v-model="form.firstName" class="field__input" type="text" autocomplete="given-name" />
      </div>
      <div class="field">
        <label class="field__label" for="af-last">Nazwisko</label>
        <input id="af-last" v-model="form.lastName" class="field__input" type="text" autocomplete="family-name" />
      </div>
    </div>
    <div class="field">
      <label class="field__label" for="af-email">E-mail</label>
      <input id="af-email" v-model="form.email" class="field__input" :class="{ 'field__input--error': error }" type="email" autocomplete="email" required />
    </div>
    <div class="field">
      <label class="field__label" for="af-pass">Hasło</label>
      <input id="af-pass" v-model="form.password" class="field__input" :class="{ 'field__input--error': error }" type="password" :autocomplete="mode === 'login' ? 'current-password' : 'new-password'" required />
    </div>
    <p v-if="error" class="field__error" role="alert">{{ error }}</p>
    <button type="submit" class="btn btn--primary btn--lg" :disabled="loading">
      {{ loading ? 'Chwila…' : (mode === 'login' ? 'Zaloguj się' : 'Załóż konto') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const props = defineProps<{ mode: 'login' | 'register' }>()
const emit = defineEmits<{ success: [] }>()

const { login, register } = useAuth()

const form = reactive({ email: '', password: '', firstName: '', lastName: '' })
const error = ref<string | null>(null)
const loading = ref(false)

async function submit(): Promise<void> {
  error.value = null
  loading.value = true
  try {
    if (props.mode === 'login') {
      await login(form.email, form.password)
    } else {
      await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      })
    }
    emit('success')
  } catch {
    error.value = props.mode === 'register'
      ? 'Nie udało się utworzyć konta. Możliwe, że konto wymaga potwierdzenia e-mailem lub rejestracja jest wyłączona w Directusie.'
      : 'Nieprawidłowy e-mail lub hasło.'
  } finally {
    loading.value = false
  }
}
</script>
