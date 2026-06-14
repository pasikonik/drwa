// DRWA — formatting helpers shared across pages.

const PL = 'pl-PL'

/** 1450 → '1 450 zł' */
export const formatPrice = (price: number): string =>
  new Intl.NumberFormat(PL).format(price) + ' zł'

/** ISO datetime → '4 maja 2026' */
export const formatDate = (dateStr: string): string =>
  new Intl.DateTimeFormat(PL, { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(dateStr)
  )

/**
 * Two ISO datetimes → { day: '15–17', month: 'maja', year: '2026' }
 * Used for multi-day workshop date display.
 */
export const formatDateRange = (
  startStr: string,
  endStr: string
): { day: string; month: string; year: string } => {
  const start = new Date(startStr)
  const end = new Date(endStr)
  const dayStart = start.getDate()
  const dayEnd = end.getDate()
  const day = dayStart === dayEnd ? String(dayStart) : `${dayStart}–${dayEnd}`
  const month = new Intl.DateTimeFormat(PL, { month: 'long' }).format(start)
  const year = String(start.getFullYear())
  return { day, month, year }
}

/** Strip HTML tags and truncate to maxLen chars with ellipsis. */
export const stripHtml = (html: string, maxLen = 160): string => {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (text.length <= maxLen) return text
  const cut = text.lastIndexOf(' ', maxLen)
  return text.slice(0, cut > 0 ? cut : maxLen) + '…'
}

/** Rough reading-time estimate — ~200 wpm. Pass short=true for "4 min" (no suffix). */
export const readTime = (html: string, short = false): string => {
  const words = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length
  const mins = Math.max(1, Math.round(words / 200))
  return short ? `${mins} min` : `${mins} min czytania`
}

/** Derive spots label and tone from capacity/booked fields. */
export const workshopSpots = (
  capacity: number | null,
  booked: number | null
): { label: string; tone: 'success' | 'warning' | 'danger' } => {
  if (!capacity) return { label: 'Dostępne miejsca', tone: 'success' }
  const free = capacity - (booked ?? 0)
  if (free <= 0) return { label: 'Brak miejsc', tone: 'danger' }
  if (free <= 2) return { label: `Ostatnie ${free} ${free === 1 ? 'miejsce' : 'miejsca'}`, tone: 'warning' }
  return { label: `${free} wolnych miejsc`, tone: 'success' }
}
