// Populate the auth user state from the cookie token on every load (SSR + client),
// so route middleware and the header see a consistent logged-in state.
export default defineNuxtPlugin(async () => {
  const token = useCookie<string | null>('drwa_auth')
  if (!token.value) return
  const { fetchMe } = useAuth()
  await fetchMe()
})
