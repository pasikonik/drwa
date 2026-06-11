<template>
  <header class="nav">
    <div class="container nav__row">
      <a class="brand" href="#top" @click.prevent="jumpTo('top')">
        <img src="/assets/drwa-mark-ink.png" alt="DRWA" />
        <span class="brand__wm">DRWA</span>
      </a>
      <nav class="nav__links" aria-label="Główne">
        <template v-for="item in NAV" :key="item.id">
          <div
            v-if="item.children"
            class="nav__item"
            :class="{ 'is-open': openId === item.id }"
            @mouseenter="open(item.id)"
            @mouseleave="scheduleClose"
          >
            <button
              class="nav__link nav__link--has-menu"
              :aria-expanded="openId === item.id"
              aria-haspopup="true"
              @click="toggleOpen(item.id)"
            >
              {{ item.label }}
              <svg class="nav__chev" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <div
              class="nav__dropdown"
              role="menu"
              :aria-label="item.label"
              @mouseenter="open(item.id)"
              @mouseleave="scheduleClose"
            >
              <button
                v-for="child in item.children"
                :key="child.label"
                class="nav__sub"
                role="menuitem"
                @click="go(child.to, child.route)"
              >
                <span class="nav__sub-title">{{ child.label }}</span>
                <span class="nav__sub-desc">{{ child.desc }}</span>
              </button>
            </div>
          </div>
          <NuxtLink v-else-if="item.route" :to="item.route" class="nav__link nav__item">
            {{ item.label }}
          </NuxtLink>
          <button v-else class="nav__link nav__item" @click="jumpTo(item.id)">
            {{ item.label }}
          </button>
        </template>
      </nav>
      <div class="nav__spacer" />
      <div class="nav__actions">
        <button class="btn btn--primary btn--sm" @click="jumpTo('warsztaty')">Zapisz się</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const NAV = [
  { id: 'warsztaty', label: 'Warsztaty stacjonarne', route: '/warsztaty' },
  { id: 'kursy', label: 'Kursy online', children: [
    { to: 'kursy', label: 'Od wiaty do chaty', desc: 'Pełny kurs wideo' },
    { to: 'kursy', label: 'Minikurs podstaw', desc: 'Praca z drewnem od zera' },
  ] },
  { id: 'onas', label: 'O nas' },
  { id: 'sklep', label: 'Sklep', route: '/sklep' },
  { id: 'blog', label: 'Blog', route: '/blog' },
  { id: 'kontakt', label: 'Kontakt' },
]

const openId = ref(null)
let closeTimer = null

function jumpTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function open(id) {
  clearTimeout(closeTimer)
  openId.value = id
}

function scheduleClose() {
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => { openId.value = null }, 120)
}

function toggleOpen(id) {
  openId.value = openId.value === id ? null : id
}

const router = useRouter()

function go(id, route) {
  openId.value = null
  if (route) { router.push(route) } else { jumpTo(id) }
}

function onKey(e) {
  if (e.key === 'Escape') openId.value = null
}

function onOutsideClick(e) {
  if (!e.target.closest('.nav__item')) openId.value = null
}

onMounted(() => {
  document.addEventListener('keydown', onKey)
  document.addEventListener('click', onOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('click', onOutsideClick)
  clearTimeout(closeTimer)
})
</script>
