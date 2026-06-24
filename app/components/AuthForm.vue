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
      <div class="field__wrap">
        <input id="af-pass" v-model="form.password" class="field__input" :class="{ 'field__input--error': error }" :type="showPassword ? 'text' : 'password'" :autocomplete="mode === 'login' ? 'current-password' : 'new-password'" required />
        <button type="button" class="field__eye" :aria-label="showPassword ? 'Ukryj hasło' : 'Pokaż hasło'" @click="showPassword = !showPassword">
          <svg v-if="!showPassword" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        </button>
      </div>
    </div>
    <p v-if="error" class="field__error" role="alert">{{ error }}</p>
    <button type="submit" class="btn btn--primary btn--lg" :disabled="loading">
      {{ loading ? 'Chwila…' : (mode === 'login' ? 'Zaloguj się' : 'Załóż konto') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const showPassword = ref(false)

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
