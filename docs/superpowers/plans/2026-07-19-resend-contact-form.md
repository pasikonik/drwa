# Resend Contact Form Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the `/kontakt` contact form to send a real e-mail to `kontakt@drwa.pl` via Resend, replacing the current `sent = true` stub with an actual server round-trip.

**Architecture:** A new Nitro endpoint `POST /api/contact` validates the submitted form (including a honeypot spam check) and sends an e-mail through the Resend SDK, using a lazily-constructed singleton client (mirroring the existing `getStripe()` pattern). The `kontakt.vue` form is updated to call this endpoint and show sending/error states instead of flipping `sent` synchronously.

**Tech Stack:** Nuxt 4 / Nitro server routes, `resend` npm package, existing `useRuntimeConfig()` pattern.

## Global Constraints

- No test framework exists in this repo — verification is `pnpm build` (TypeScript/template compile check) plus manual testing via `pnpm dev`. Do not add a test runner.
- Env var for the API key is `RESEND_API_KEY` (already set in the user's `.env`, not committed).
- Sender/notification address: `kontakt@drwa.pl` (domain already verified in Resend).
- Do not hardcode colours — use CSS custom properties from `app/assets/css/drwa-tokens.css` (`--rust` is the existing "status" token to use for error text/borders).
- Do not wire the newsletter checkbox to MailerLite in this feature — out of scope per spec.
- Do not add an auto-reply e-mail to the submitter — out of scope per spec.

---

### Task 1: Add the `resend` dependency and runtime config entry

**Files:**
- Modify: `package.json`
- Modify: `nuxt.config.ts`

**Interfaces:**
- Produces: `useRuntimeConfig().resendApiKey` (string, server-only) — consumed by Task 2's `getResend()`.

- [ ] **Step 1: Add the `resend` package to `package.json` dependencies**

In `package.json`, add to the `dependencies` object (keep alphabetical order with existing entries):

```json
    "resend": "^6.17.2",
```

The full `dependencies` block should read:

```json
  "dependencies": {
    "@directus/sdk": "^23.0.0",
    "@stripe/stripe-js": "^9.10.0",
    "nuxt": "^4.4.8",
    "resend": "^6.17.2",
    "stripe": "^22.3.2",
    "vue": "^3.5.40",
    "vue-router": "^5.2.0"
  },
```

- [ ] **Step 2: Install the dependency**

Run: `pnpm install`
Expected: lockfile updates, `resend` appears under `node_modules/resend`, no errors.

- [ ] **Step 3: Add `resendApiKey` to `nuxt.config.ts` runtimeConfig**

In `nuxt.config.ts`, inside the server-only part of `runtimeConfig` (alongside `mailerLiteApiKey`), add:

```ts
    resendApiKey: process.env.RESEND_API_KEY || '',
```

So the `runtimeConfig` block becomes:

```ts
  runtimeConfig: {
    // Server-only — never exposed to the client.
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    directusServiceToken: process.env.DIRECTUS_SERVICE_TOKEN || '',
    directusUrl: process.env.DIRECTUS_URL || 'http://localhost:8055',
    mailerLiteApiKey: process.env.MAILERLITE_API_KEY || '',
    mailerLiteGroupId: process.env.MAILERLITE_GROUP_ID || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    public: {
      directusUrl: process.env.NUXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || 'http://localhost:8055',
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      gtmId: process.env.NUXT_PUBLIC_GTM_ID || ''
    }
  },
```

- [ ] **Step 4: Verify the build picks up the new config**

Run: `pnpm build`
Expected: build completes with no TypeScript/config errors.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml nuxt.config.ts
git commit -m "Add resend dependency and runtime config"
```

---

### Task 2: Create the Resend client singleton util

**Files:**
- Create: `server/utils/resend.ts`

**Interfaces:**
- Consumes: `useRuntimeConfig().resendApiKey` (from Task 1)
- Produces: `getResend(): Resend` — a function returning a configured `Resend` client instance. Consumed by Task 3's `server/api/contact.post.ts` as `getResend().emails.send(...)`.

- [ ] **Step 1: Write `server/utils/resend.ts`**

```ts
import { Resend } from 'resend'

let _resend: Resend | null = null

/**
 * Lazily-constructed Resend client.
 * Throws a 500 if the API key is not configured.
 */
export function getResend(): Resend {
  if (_resend) return _resend
  const { resendApiKey } = useRuntimeConfig()
  if (!resendApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Wysyłka wiadomości nie jest skonfigurowana (brak RESEND_API_KEY).' })
  }
  _resend = new Resend(resendApiKey)
  return _resend
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `pnpm build`
Expected: build completes with no errors (this file has no callers yet, so it just needs to typecheck — `Resend` import must resolve since Task 1 installed the package).

- [ ] **Step 3: Commit**

```bash
git add server/utils/resend.ts
git commit -m "Add Resend client singleton util"
```

---

### Task 3: Create the `/api/contact` endpoint

**Files:**
- Create: `server/api/contact.post.ts`

**Interfaces:**
- Consumes: `getResend()` from Task 2 (`server/utils/resend.ts`)
- Produces: `POST /api/contact` accepting JSON body `{ name: string, email: string, topic?: string, message: string, website?: string }` and returning `{ ok: true }` on success. Consumed by Task 4's `kontakt.vue` via `$fetch('/api/contact', { method: 'POST', body })`.
- Topic labels map (used for the e-mail subject): `{ warsztaty: 'Warsztaty stacjonarne', kursy: 'Kursy online', sklep: 'Sklep · zamówienia', wspolpraca: 'Współpraca', inne: 'Inne' }` — matches the `<option>` values already in `kontakt.vue`'s `<select id="kf-topic">`.

- [ ] **Step 1: Write `server/api/contact.post.ts`**

```ts
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
```

- [ ] **Step 2: Verify the build compiles**

Run: `pnpm build`
Expected: build completes, no TypeScript errors.

- [ ] **Step 3: Manual test against the dev server**

Run: `pnpm dev` (leave running), then in another terminal:

```bash
curl -i -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","topic":"inne","message":"Testowa wiadomość z curl."}'
```

Expected: `HTTP/1.1 200 OK` with body `{"ok":true}`, and an e-mail arrives at `kontakt@drwa.pl` with subject "Formularz kontaktowy — Inne" and Reply-To `test@example.com`.

- [ ] **Step 4: Manual test — validation error**

```bash
curl -i -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"not-an-email","message":"Test"}'
```

Expected: `HTTP/1.1 400` with a JSON error body containing `"Nieprawidłowy adres e-mail."`.

- [ ] **Step 5: Manual test — honeypot**

```bash
curl -i -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Bot","email":"bot@example.com","message":"spam","website":"http://spam.example"}'
```

Expected: `HTTP/1.1 200 OK` with body `{"ok":true}`, and **no** e-mail arrives at `kontakt@drwa.pl`.

- [ ] **Step 6: Commit**

```bash
git add server/api/contact.post.ts
git commit -m "Add POST /api/contact endpoint with Resend send + honeypot"
```

---

### Task 4: Wire up the contact form in `kontakt.vue`

**Files:**
- Modify: `app/pages/kontakt.vue`
- Modify: `app/assets/css/kontakt.css`

**Interfaces:**
- Consumes: `POST /api/contact` from Task 3 (request/response shape as above).

- [ ] **Step 1: Add a honeypot field to the form template**

In `app/pages/kontakt.vue`, inside `<form v-else class="cform io" @submit.prevent="sent = true">` (the form that currently just sets `sent = true`), add a hidden honeypot input right after the opening `<form>` tag, before `<h2>Formularz</h2>`:

```html
<input
  v-model="honeypot"
  type="text"
  name="website"
  tabindex="-1"
  autocomplete="off"
  class="cform__hp"
  aria-hidden="true"
/>
```

- [ ] **Step 2: Add name/email/message `v-model` bindings**

The existing inputs (`#kf-name`, `#kf-email`, `#kf-msg`) currently have no `v-model`. Add them so the submit handler can read their values:

Change:
```html
<input id="kf-name" class="field__input" type="text" name="name" required placeholder="Jan Kowalski" autocomplete="name" />
```
to:
```html
<input id="kf-name" v-model="name" class="field__input" type="text" name="name" required placeholder="Jan Kowalski" autocomplete="name" />
```

Change:
```html
<input id="kf-email" class="field__input" type="email" name="email" required placeholder="twój@email.pl" autocomplete="email" />
```
to:
```html
<input id="kf-email" v-model="email" class="field__input" type="email" name="email" required placeholder="twój@email.pl" autocomplete="email" />
```

Change:
```html
<textarea id="kf-msg" class="field__textarea" name="message" rows="6" required placeholder="Napisz do nas…" />
```
to:
```html
<textarea id="kf-msg" v-model="message" class="field__textarea" name="message" rows="6" required placeholder="Napisz do nas…" />
```

- [ ] **Step 3: Replace the submit handler and add error/sending UI**

Change the form's submit binding from:
```html
<form v-else class="cform io" @submit.prevent="sent = true">
```
to:
```html
<form v-else class="cform io" @submit.prevent="submitForm">
```

Add an error message block right before `<div class="cform__foot">`:

```html
<p v-if="errorMessage" class="cform__error">{{ errorMessage }}</p>
```

Update the submit button to disable while sending and reflect state:

Change:
```html
<button class="btn btn--primary btn--md" type="submit">
  Wyślij wiadomość
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
</button>
```
to:
```html
<button class="btn btn--primary btn--md" type="submit" :disabled="sending">
  {{ sending ? 'Wysyłanie…' : 'Wyślij wiadomość' }}
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
</button>
```

- [ ] **Step 4: Update the `<script setup>` block**

Change:
```html
<script setup>
import { ref } from 'vue'

useHead({
  title: 'Kontakt — DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

useScrollReveal()

const sent = ref(false)
const topic = ref('warsztaty')
const openFaq = ref(null)
```
to:
```html
<script setup>
import { ref } from 'vue'

useHead({
  title: 'Kontakt — DRWA',
  link: [{ rel: 'icon', href: '/assets/drwa-mark-ink.png' }],
})

useScrollReveal()

const sent = ref(false)
const topic = ref('warsztaty')
const openFaq = ref(null)

const name = ref('')
const email = ref('')
const message = ref('')
const honeypot = ref('')
const sending = ref(false)
const errorMessage = ref('')

async function submitForm() {
  errorMessage.value = ''
  sending.value = true
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        topic: topic.value,
        message: message.value,
        website: honeypot.value,
      },
    })
    sent.value = true
  } catch (err) {
    errorMessage.value = err?.data?.statusMessage || 'Nie udało się wysłać, spróbuj ponownie lub napisz na kontakt@drwa.pl.'
  } finally {
    sending.value = false
  }
}
```

- [ ] **Step 5: Add CSS for the honeypot and error message in `app/assets/css/kontakt.css`**

Read the file first to find the `.cform__sent` block (around line 60-67), then add right after it:

```css
.cform__hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.cform__error { font-size: var(--text-sm); color: var(--rust); margin: var(--space-4) 0 0; }
```

- [ ] **Step 6: Verify the build compiles**

Run: `pnpm build`
Expected: build completes, no template/type errors.

- [ ] **Step 7: Manual browser test — happy path**

Run: `pnpm dev`, open `http://localhost:3000/kontakt`, fill in name/e-mail/message, submit.
Expected: button shows "Wysyłanie…" briefly, then the "Wiadomość poszła w las" success screen appears, and the e-mail arrives at `kontakt@drwa.pl`.

- [ ] **Step 8: Manual browser test — server error surfaced**

Temporarily set `RESEND_API_KEY=invalid` in `.env`, restart `pnpm dev`, submit the form again.
Expected: an error message appears under the form (not a silent failure and not the success screen), the form stays filled in. Restore the correct `RESEND_API_KEY` afterward and restart the dev server.

- [ ] **Step 9: Commit**

```bash
git add app/pages/kontakt.vue app/assets/css/kontakt.css
git commit -m "Wire kontakt.vue form to POST /api/contact"
```

---

## Post-plan verification

- [ ] Run `pnpm build` once more from a clean state to confirm the full app builds after all four tasks.
- [ ] Add `RESEND_API_KEY=twoj_tajny_klucz_api` to `.env.example` (after the `MAILERLITE_GROUP_ID` line) so the required env var is documented for other developers, then `git add .env.example && git commit -m "Document RESEND_API_KEY in .env.example"`.
