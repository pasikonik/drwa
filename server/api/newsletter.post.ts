export default defineEventHandler(async (event) => {
  const { mailerLiteApiKey, mailerLiteGroupId } = useRuntimeConfig()
  const { email } = await readBody(event)

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, message: 'Nieprawidłowy adres e-mail.' })
  }

  if (!mailerLiteApiKey) {
    throw createError({ statusCode: 500, message: 'Newsletter nie jest skonfigurowany (brak MAILERLITE_API_KEY).' })
  }

  try {
    const response = await $fetch<{ data?: { id: string } }>(
      'https://connect.mailerlite.com/api/subscribers',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mailerLiteApiKey}`,
        },
        body: { email: String(email).trim(), groups: [mailerLiteGroupId] },
      }
    )
    return { ok: true, id: response.data?.id }
  } catch (err) {
    // MailerLite answers 4xx for already-subscribed / rejected addresses, which
    // previously surfaced as an unhandled 500. Log the detail server-side and
    // return a generic message rather than proxying their response body.
    console.error('[DRWA] MailerLite subscribe failed:', err)
    throw createError({
      statusCode: 502,
      message: 'Nie udało się zapisać do newslettera. Spróbuj ponownie później.',
    })
  }
})
