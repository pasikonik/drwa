// Route middleware guarding logged-in-only pages (e.g. /konto).
// Apply per-page with: definePageMeta({ middleware: 'auth' }).
export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn.value) {
    return navigateTo(`/logowanie?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
