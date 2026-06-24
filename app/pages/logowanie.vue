<template>
  <div class="site">
    <DrwaNav />

    <div class="pagehead">
      <div class="container">
        <span class="eyebrow eyebrow--ondark">Konto</span>
        <h1>Zaloguj się</h1>
        <p>Wróć do swoich zamówień i kursów.</p>
      </div>
    </div>

    <main id="main-content" class="container section">
      <div class="authwrap">
        <div class="card card--padded">
          <AuthForm mode="login" @success="onSuccess" />
        </div>
        <p class="authwrap__alt">Nie masz konta? <NuxtLink to="/rejestracja">Załóż konto</NuxtLink></p>
      </div>
    </main>

    <DrwaFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Logowanie — DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

const route = useRoute()

function onSuccess(): void {
  const r = route.query.redirect
  navigateTo(typeof r === 'string' && r ? r : '/konto')
}
</script>
