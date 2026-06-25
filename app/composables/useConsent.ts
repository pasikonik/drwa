// Consent Mode v2 helper — wire these to a future cookie banner. The GTM plugin
// (plugins/gtm.client.ts) defaults all consent to 'denied'; call grantConsent()
// once the user accepts, denyConsent() if they decline or withdraw.
/* eslint-disable @typescript-eslint/no-explicit-any */

export const useConsent = () => {
  function update(granted: boolean) {
    if (!import.meta.client) return
    const w = window as any
    w.dataLayer = w.dataLayer || []
    function gtag() { w.dataLayer.push(arguments) }
    const v = granted ? 'granted' : 'denied'
    gtag('consent', 'update', {
      ad_storage: v,
      analytics_storage: v,
      ad_user_data: v,
      ad_personalization: v,
    })
  }

  return {
    grantConsent: () => update(true),
    denyConsent: () => update(false),
  }
}
