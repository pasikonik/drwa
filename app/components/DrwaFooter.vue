<template>
  <footer class="foot" id="kontakt">
    <div class="container">
      <div class="foot__top">
        <div class="foot__brand">
          <div class="brandrow">
            <img src="/assets/logo-no-bg-white.avif" alt="DRWA" />
          </div>
          <p>Drewno, rzemiosło i szkolenia. Pracujemy z drewnem i budujemy wokół niego społeczność — w duchu natury i ekologii.</p>
        </div>
        <div>
          <h4>Warsztaty</h4>
          <ul>
            <li><NuxtLink to="/warsztaty">Warsztaty 2026</NuxtLink></li>
            <li><NuxtLink to="/warsztaty">Informacje i oferta</NuxtLink></li>
            <li><a @click="jump('opinie')">Relacje i opinie</a></li>
            <li><NuxtLink to="/blog">Blog · Z lasu</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4>Kursy online</h4>
          <ul>
            <li><NuxtLink to="/kursy/od-wiaty-do-chaty">Od wiaty do chaty</NuxtLink></li>
            <li><NuxtLink to="/kursy/minikurs-podstaw">Minikurs podstaw</NuxtLink></li>
            <li><NuxtLink to="/o-nas">O nas</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4>Kontakt</h4>
          <ul>
            <li><a href="mailto:kontakt@drwa.pl">kontakt@drwa.pl</a></li>
            <li><a>Stolarnia pod lasem</a></li>
          </ul>
        </div>
      </div>
      <div class="foot__bottom">
        <span>© 2026 DRWA · Drewno · Rzemiosło · Szkolenia</span>
        <div class="foot__social">
          <a aria-label="Instagram" href="https://www.instagram.com/drwa_yen/" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>
            </svg>
          </a>
          <a aria-label="Facebook" href="https://www.facebook.com/drwacyganik" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
          <a aria-label="YouTube" href="https://www.youtube.com/@Drwa-Kopaniec" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
              <path d="m9.75 15.02 5.75-3.27-5.75-3.27v6.54z"/>
            </svg>
          </a>
          <a aria-label="E-mail" href="mailto:kontakt@drwa.pl">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
function jump(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>
