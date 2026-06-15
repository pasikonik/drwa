import { computed } from 'vue'
import { login as directusLogin, registerUser, readMe, withToken } from '@directus/sdk'

export interface AuthUser {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
}

export interface RegisterPayload {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

/** Cookie name shared with the server (see server/utils/sessionUser.ts). */
const AUTH_COOKIE = 'drwa_auth'

/**
 * Customer auth backed by Directus Users. The access token lives in a cookie
 * (`drwa_auth`) so the server can read it for order ownership. Login is optional
 * — guests can still check out.
 */
export const useAuth = () => {
  const { directus } = useDirectus()
  const token = useCookie<string | null>(AUTH_COOKIE, {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    path: '/',
  })
  const user = useState<AuthUser | null>('auth-user', () => null)
  const isLoggedIn = computed(() => !!user.value)

  async function fetchMe(): Promise<AuthUser | null> {
    if (!token.value) {
      user.value = null
      return null
    }
    try {
      const me = (await directus.request(
        withToken(token.value, readMe({ fields: ['id', 'email', 'first_name', 'last_name'] })),
      )) as AuthUser
      user.value = me
      return me
    } catch {
      user.value = null
      token.value = null
      return null
    }
  }

  async function login(email: string, password: string): Promise<void> {
    const res = (await directus.request(
      directusLogin({ email, password }, { mode: 'json' }),
    )) as { access_token: string | null }
    if (!res.access_token) throw new Error('Logowanie nie powiodło się.')
    token.value = res.access_token
    await fetchMe()
  }

  async function register(payload: RegisterPayload): Promise<void> {
    await directus.request(
      registerUser(payload.email, payload.password, {
        first_name: payload.firstName,
        last_name: payload.lastName,
      }),
    )
    // Auto-login. If Directus requires e-mail verification this will throw and
    // the caller should surface a "sprawdź skrzynkę" message.
    await login(payload.email, payload.password)
  }

  function logout(): void {
    token.value = null
    user.value = null
  }

  return { user, isLoggedIn, login, register, logout, fetchMe }
}
