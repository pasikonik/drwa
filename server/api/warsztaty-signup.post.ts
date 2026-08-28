import { getResend } from '../utils/resend'

interface WorkshopSignupPayload {
  name?: string
  email?: string
  message?: string
  workshopTitle?: string
  workshopSlug?: string
  website?: string // honeypot — must stay empty
}

export default defineEventHandler(async (event) => {
  const body = await readBody<WorkshopSignupPayload>(event)
  const { name, email, message, workshopTitle, workshopSlug, website } = body ?? {}

  // Honeypot: bots fill hidden fields. Pretend success, skip the send.
  if (website) {
    return { ok: true }
  }

  if (!name || !name.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Podaj imię i nazwisko.' })
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Nieprawidłowy adres e-mail.' })
  }

  const workshopLabel = workshopTitle?.trim() || workshopSlug?.trim() || 'nieznany warsztat'
  const resend = getResend()

  const { error } = await resend.emails.send({
    from: 'DRWA · Zapisy na warsztaty <warsztaty@drwa.pl>',
    to: 'warsztatydrwa@gmail.com',
    replyTo: email,
    subject: `Zgłoszenie na warsztat — ${workshopLabel}`,
    text: `Warsztat: ${workshopLabel}\nImię i nazwisko: ${name}\nE-mail: ${email}\n\nWiadomość:\n${message?.trim() || '(brak)'}`,
  })

  if (error) {
    throw createError({ statusCode: 502, statusMessage: 'Nie udało się wysłać zgłoszenia. Spróbuj ponownie później.' })
  }

  return { ok: true }
})
