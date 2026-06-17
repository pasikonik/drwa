<template>
  <div class="site">
    <DrwaNav />

    <div class="pagehead">
      <div class="container">
        <span class="eyebrow eyebrow--ondark">Konto</span>
        <h1>Załóż konto</h1>
        <p>Konto nie jest wymagane do zakupów — ułatwia jednak śledzenie zamówień i dostęp do kursów.</p>
      </div>
    </div>

    <main class="container section">
      <div class="authwrap">
        <div class="card card--padded">
          <AuthForm mode="register" @success="onSuccess" />
        </div>
        <p class="authwrap__alt">Masz już konto? <NuxtLink to="/logowanie">Zaloguj się</NuxtLink></p>
        <p class="authwrap__alt">Konto nie jest wymagane — możesz też kupić jako gość.</p>
      </div>
    </main>

    <DrwaFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Rejestracja — DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

function onSuccess(): void {
  navigateTo('/konto')
}
</script>
