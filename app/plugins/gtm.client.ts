// Google Tag Manager — loaded lazily (on browser idle, production only) so it
// stays off the critical render path. Consent Mode v2 defaults everything to
// 'denied' (EU/RODO); wire a cookie banner to useConsent().grantConsent() to
// enable analytics/ads cookies once the user accepts.
/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineNuxtPlugin(() => {
  const id = useRuntimeConfig().public.gtmId as string
  // No container configured, or local dev — don't load anything.
  if (!id || import.meta.dev) return

  const w = window as any
  w.dataLayer = w.dataLayer || []
  function gtag() { w.dataLayer.push(arguments) }

  // 1) Consent Mode v2 — MUST be pushed before the container loads so tags
  //    respect it. Denied by default; GTM runs in cookieless "modeled" mode.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  })

  // 2) Inject the GTM container only when the browser is idle — keeps it off
  //    the critical path and out of the initial bundle.
  const loadGtm = () => {
    w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`
    document.head.appendChild(s)
  }
  if (typeof w.requestIdleCallback === 'function') {
    w.requestIdleCallback(loadGtm, { timeout: 5000 })
  } else {
    setTimeout(loadGtm, 3000)
  }

  // 3) SPA pageviews — push a route-change event for client-side navigations
  //    (the initial load is covered by the container's own gtm.js event).
  useRouter().afterEach((to) => {
    w.dataLayer.push({ event: 'pageview', page_path: to.fullPath })
  })
})
