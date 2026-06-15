<template>
  <header class="nav">
    <div class="container nav__row">
      <NuxtLink class="brand" to="/">
        <img src="/assets/drwa-mark-ink.png" alt="DRWA" />
        <span class="brand__wm">DRWA</span>
      </NuxtLink>
      <nav class="nav__links" aria-label="Główne">
        <NuxtLink class="nav__link nav__item" to="/warsztaty">Warsztaty stacjonarne</NuxtLink>
        <NuxtLink class="nav__link nav__item" to="/sklep">Sklep</NuxtLink>
        <NuxtLink class="nav__link nav__item" to="/blog">Blog</NuxtLink>
        <NuxtLink class="nav__link nav__item" to="/o-nas">O nas</NuxtLink>
        <NuxtLink class="nav__link nav__item" to="/kontakt">Kontakt</NuxtLink>
      </nav>
      <div class="nav__spacer" />
      <div class="nav__actions">
        <NuxtLink class="nav__link nav__item" :to="isLoggedIn ? '/konto' : '/logowanie'">
          {{ isLoggedIn ? 'Konto' : 'Zaloguj' }}
        </NuxtLink>
        <CartLink />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { isLoggedIn } = useAuth()
</script>
