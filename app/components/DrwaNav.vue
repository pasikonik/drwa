<template>
  <header class="nav">
    <div class="container nav__row">
      <NuxtLink class="brand" to="/" @click="closeMobile">
        <img src="/assets/drwa-mark-ink.png" alt="DRWA" />
        <span class="brand__wm">DRWA</span>
      </NuxtLink>

      <!-- ===== Linki (desktop) ===== -->
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
              :class="{ 'nav__link--current': isGroupActive(item) }"
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
              <NuxtLink
                v-for="child in item.children"
                :key="child.route"
                class="nav__sub"
                role="menuitem"
                :to="child.route"
                @click="openId = null"
              >
                <span class="nav__sub-title">{{ child.label }}</span>
                <span class="nav__sub-desc">{{ child.desc }}</span>
              </NuxtLink>
            </div>
          </div>
          <NuxtLink v-else :to="item.route" class="nav__link nav__item">
            {{ item.label }}
          </NuxtLink>
        </template>
      </nav>

      <div class="nav__spacer" />

      <!-- ===== Akcje ===== -->
      <div class="nav__actions">
        <NuxtLink class="nav__link nav__item nav__account" :to="isLoggedIn ? '/konto' : '/logowanie'">
          {{ isLoggedIn ? 'Konto' : 'Zaloguj' }}
        </NuxtLink>
        <CartLink />
        <button
          ref="burgerRef"
          class="nav__burger"
          :class="{ 'is-open': mobileOpen }"
          :aria-expanded="mobileOpen"
          aria-label="Menu"
          aria-controls="drwa-drawer"
          @click="toggleMobile"
        >
          <span /><span /><span />
        </button>
      </div>
    </div>

    <!-- ===== Menu mobilne ===== -->
    <Teleport to="body">
      <Transition name="nav-fade">
        <div v-if="mobileOpen" class="nav__backdrop" @click="closeMobile" />
      </Transition>
      <Transition name="nav-drawer">
        <aside
          v-if="mobileOpen"
          id="drwa-drawer"
          ref="drawerRef"
          class="nav__drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Nawigacja — menu"
        >
          <div class="nav__drawer-head">
            <span class="brand__wm">DRWA</span>
            <button class="nav__drawer-close" aria-label="Zamknij menu" @click="closeMobile">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <nav class="nav__drawer-links" aria-label="Główne — mobilne">
            <template v-for="item in NAV" :key="item.id">
              <template v-if="item.children">
                <button
                  class="nav__drawer-link nav__drawer-link--group"
                  :aria-expanded="mobileGroup === item.id"
                  @click="mobileGroup = mobileGroup === item.id ? null : item.id"
                >
                  {{ item.label }}
                  <svg class="nav__chev" :class="{ 'is-flip': mobileGroup === item.id }" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                <div v-show="mobileGroup === item.id" class="nav__drawer-sub">
                  <NuxtLink
                    v-for="child in item.children"
                    :key="child.route"
                    :to="child.route"
                    class="nav__drawer-sublink"
                    @click="closeMobile"
                  >
                    {{ child.label }}
                  </NuxtLink>
                </div>
              </template>
              <NuxtLink v-else :to="item.route" class="nav__drawer-link" @click="closeMobile">
                {{ item.label }}
              </NuxtLink>
            </template>
          </nav>
          <div class="nav__drawer-foot">
            <NuxtLink class="btn btn--secondary btn--md" :to="isLoggedIn ? '/konto' : '/logowanie'" @click="closeMobile">
              {{ isLoggedIn ? 'Moje konto' : 'Zaloguj się' }}
            </NuxtLink>
          </div>
        </aside>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

interface NavChild { route: string; label: string; desc: string }
interface NavItem { id: string; label: string; route?: string; children?: NavChild[] }

const NAV: NavItem[] = [
  { id: 'warsztaty', label: 'Warsztaty stacjonarne', route: '/warsztaty' },
  { id: 'kursy', label: 'Kursy', route: '/kursy' },
  {
    id: 'kursy-online', label: 'Kursy online', children: [
      { route: '/kursy/od-wiaty-do-chaty', label: 'Od wiaty do chaty', desc: 'Pełny kurs wideo' },
      { route: '/kursy/minikurs-podstaw', label: 'Minikurs podstaw', desc: 'Praca z drewnem od zera' },
    ],
  },
  { id: 'sklep', label: 'Sklep', route: '/sklep' },
  { id: 'blog', label: 'Blog', route: '/blog' },
  {
    id: 'onas', label: 'O nas', children: [
      { route: '/o-nas', label: 'O nas', desc: 'Kim jesteśmy i skąd DRWA' },
      { route: '/realizacje', label: 'Realizacje', desc: 'Galeria tego, co zbudowaliśmy' },
    ],
  },
  { id: 'kontakt', label: 'Kontakt', route: '/kontakt' },
]

const { isLoggedIn } = useAuth()
const route = useRoute()

function isGroupActive(item: NavItem): boolean {
  return item.children?.some((c) => route.path.startsWith(c.route)) ?? false
}

// ─── Dropdown (desktop) ─────────────────────────────────────────────────────
const openId = ref<string | null>(null)
let closeTimer: ReturnType<typeof setTimeout> | null = null

function open(id: string) {
  if (closeTimer) clearTimeout(closeTimer)
  openId.value = id
}
function scheduleClose() {
  if (closeTimer) clearTimeout(closeTimer)
  closeTimer = setTimeout(() => { openId.value = null }, 120)
}
function toggleOpen(id: string) {
  openId.value = openId.value === id ? null : id
}

// ─── Drawer (mobile) ────────────────────────────────────────────────────────
const mobileOpen = ref(false)
const mobileGroup = ref<string | null>(null)

// ─── Focus trap (mobile drawer) ─────────────────────────────────────────────
const drawerRef = ref<HTMLElement | null>(null)
const burgerRef = ref<HTMLButtonElement | null>(null)

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function trapFocus(e: KeyboardEvent) {
  if (e.key !== 'Tab' || !drawerRef.value) return
  const els = Array.from(drawerRef.value.querySelectorAll<HTMLElement>(FOCUSABLE))
  if (!els.length) return
  const first = els[0]!
  const last = els[els.length - 1]!
  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus() }
  } else {
    if (document.activeElement === last) { e.preventDefault(); first.focus() }
  }
}

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}
function closeMobile() {
  mobileOpen.value = false
}

// Lock body scroll while the drawer is open; manage focus trap.
watch(mobileOpen, async (isOpen) => {
  if (!import.meta.client) return
  document.body.style.overflow = isOpen ? 'hidden' : ''
  if (isOpen) {
    await nextTick()
    const closeBtn = drawerRef.value?.querySelector<HTMLElement>('.nav__drawer-close')
    closeBtn?.focus()
    document.addEventListener('keydown', trapFocus)
  } else {
    document.removeEventListener('keydown', trapFocus)
    burgerRef.value?.focus()
  }
})

// Close menus on navigation.
watch(() => route.fullPath, () => {
  openId.value = null
  closeMobile()
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') { openId.value = null; closeMobile() }
}
function onOutsideClick(e: MouseEvent) {
  const t = e.target as HTMLElement
  if (!t.closest('.nav__item')) openId.value = null
}

onMounted(() => {
  document.addEventListener('keydown', onKey)
  document.addEventListener('click', onOutsideClick)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('keydown', trapFocus)
  document.removeEventListener('click', onOutsideClick)
  if (closeTimer) clearTimeout(closeTimer)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>
