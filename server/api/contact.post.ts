import { getResend } from '../utils/resend'

interface ContactPayload {
  name?: string
  email?: string
  topic?: string
  message?: string
  website?: string // honeypot — must stay empty
}

const TOPIC_LABELS: Record<string, string> = {
  warsztaty: 'Warsztaty stacjonarne',
  kursy: 'Kursy online',
  sklep: 'Sklep · zamówienia',
  wspolpraca: 'Współpraca',
  inne: 'Inne',
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactPayload>(event)
  const { name, email, topic, message, website } = body ?? {}

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
  if (!message || !message.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Wiadomość nie może być pusta.' })
  }

  const topicLabel = (topic && TOPIC_LABELS[topic]) || 'Inne'
  const resend = getResend()

  const { error } = await resend.emails.send({
    from: 'DRWA · Formularz kontaktowy <kontakt@drwa.pl>',
    to: 'kontakt@drwa.pl',
    replyTo: email,
    subject: `Formularz kontaktowy — ${topicLabel}`,
    text: `Imię i nazwisko: ${name}\nE-mail: ${email}\nTemat: ${topicLabel}\n\nWiadomość:\n${message}`,
  })

  if (error) {
    throw createError({ statusCode: 502, statusMessage: 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.' })
  }

  return { ok: true }
})
