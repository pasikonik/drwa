# Integracja Resend z formularzem kontaktowym

Data: 2026-07-19

## Cel

Podpięcie formularza kontaktowego na `/kontakt` pod realną wysyłkę e-mail przez Resend, tak aby wiadomości trafiały na `kontakt@drwa.pl`. Obecnie formularz w [app/pages/kontakt.vue](../../../app/pages/kontakt.vue) jedynie ustawia `sent = true` (`@submit.prevent="sent = true"`) — nic nie jest wysyłane.

## Zakres

- Nowy endpoint Nitro `POST /api/contact`, wzorowany na istniejącym `server/api/newsletter.ts`.
- Nowy util `server/utils/resend.ts` — leniwie tworzony singleton klienta Resend, analogicznie do `server/utils/stripe.ts` (`getStripe()`).
- Dodanie `resendApiKey` do `runtimeConfig` w `nuxt.config.ts`, czytane z `process.env.RESEND_API_KEY` (zmienna już istnieje w env użytkownika).
- Dodanie zależności `resend` do `package.json`.
- Podpięcie formularza w `kontakt.vue` pod `$fetch('/api/contact')` ze stanami `sending` / `error`.
- Honeypot jako ochrona antyspamowa (ukryte pole, boty je wypełniają, ludzie nie widzą).

## Poza zakresem (świadomie pominięte)

- Zapis do MailerLite z checkboxa newslettera w tym formularzu — checkbox zostaje w UI jako wizualny placeholder, logika podłączona zostanie osobno.
- Automatyczna wiadomość potwierdzająca do osoby wypełniającej formularz — wysyłamy tylko powiadomienie do `kontakt@drwa.pl`.
- Zapis zgłoszeń do Directusa / bazy danych — e-mail jest jedynym kanałem dostarczenia.
- Captcha / reCAPTCHA / rate-limiting po IP — tylko honeypot na start.

## Komponenty

| Plik | Rola |
|---|---|
| `server/utils/resend.ts` | `getResend()` — leniwy singleton klienta Resend; rzuca 500 (`createError`) jeśli brak `RESEND_API_KEY` |
| `server/api/contact.post.ts` | Waliduje body, sprawdza honeypot, wysyła e-mail przez Resend |
| `nuxt.config.ts` | `resendApiKey: process.env.RESEND_API_KEY \|\| ''` w server-only części `runtimeConfig` |
| `app/pages/kontakt.vue` | Handler submit wywołujący `$fetch('/api/contact')`, stany `sending`/`error`, ukryte pole honeypot |
| `package.json` | `resend` (najnowsza stabilna wersja z npm) w `dependencies` |

## Przepływ danych

1. Użytkownik wypełnia formularz (imię, e-mail, temat, wiadomość) i klika „Wyślij wiadomość”.
2. Front wywołuje `$fetch('/api/contact', { method: 'POST', body: { name, email, topic, message, website } })` (`website` = honeypot, zawsze puste dla człowieka).
3. Endpoint:
   - Jeśli `website` niepuste → cicho zwraca `{ ok: true }` bez wysyłki (nie zdradzamy botowi wykrycia).
   - Waliduje `name`, `email` (regex jak w `newsletter.ts`), `message` — wymagane; brak/niepoprawność → `400` z komunikatem PL.
   - Wywołuje `getResend().emails.send(...)`:
     - `from: 'DRWA · Formularz kontaktowy <kontakt@drwa.pl>'`
     - `to: 'kontakt@drwa.pl'`
     - `replyTo: <email z formularza>`
     - `subject`: zależny od `topic` (np. „Formularz kontaktowy — Warsztaty stacjonarne”)
     - treść: imię, e-mail, temat, wiadomość
   - Błąd wysyłki Resend → `502` z komunikatem PL.
4. Front:
   - Sukces → pokazuje istniejący ekran „Wiadomość poszła w las” (`sent = true`).
   - Błąd → pokazuje komunikat błędu pod formularzem, formularz zostaje wypełniony (nie czyścimy pól), użytkownik może spróbować ponownie.

## Obsługa błędów

| Sytuacja | Zachowanie |
|---|---|
| Brak `RESEND_API_KEY` w env | `500`, komunikat „Wysyłka wiadomości nie jest skonfigurowana” |
| Niepoprawny e-mail / brak wymaganych pól | `400`, komunikat PL wskazujący problem |
| Honeypot wypełniony | `200 { ok: true }` bez faktycznej wysyłki |
| Błąd API Resend | `502`, front pokazuje „Nie udało się wysłać, spróbuj ponownie lub napisz na kontakt@drwa.pl” |

## Testowanie

Brak testów jednostkowych w projekcie (zgodnie z `CLAUDE.md`). Weryfikacja:
1. `pnpm build` — sprawdza typy i kompilację.
2. Ręczny test w `pnpm dev`: wysłanie formularza z poprawnymi danymi → mail dociera na `kontakt@drwa.pl`.
3. Ręczny test walidacji: pusty e-mail / niepoprawny format → błąd 400 widoczny w UI.
4. Ręczny test honeypota: wypełnienie ukrytego pola (np. przez devtools) → brak maila, ale `{ ok: true }`.
