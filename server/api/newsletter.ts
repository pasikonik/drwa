export default defineEventHandler(async (event) => {
  const { mailerLiteApiKey, mailerLiteGroupId } = useRuntimeConfig()
  const { email } = await readBody(event)

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, message: 'Nieprawidłowy adres e-mail.' })
  }

  const response = await $fetch<{ data?: { id: string } }>(
    'https://connect.mailerlite.com/api/subscribers',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mailerLiteApiKey}`,
      },
      body: { email, groups: [mailerLiteGroupId] },
    }
  )

  return { ok: true, id: response.data?.id }
})
