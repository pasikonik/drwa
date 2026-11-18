import { describe, expect, it } from 'vitest'
import { youtubeId } from '~/utils/youtube'

describe('youtubeId', () => {
  it.each([
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtube.com/watch?feature=share&v=dQw4w9WgXcQ&t=42', 'dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ?si=abc', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://m.youtube.com/live/dQw4w9WgXcQ?feature=share', 'dQw4w9WgXcQ'],
  ])('%s', (url, id) => {
    expect(youtubeId(url)).toBe(id)
  })

  it.each([null, undefined, '', 'https://vimeo.com/123456', 'https://www.youtube.com/@Drwa-Kopaniec', 'javascript:alert(1)'])(
    'returns null for %s',
    (url) => {
      expect(youtubeId(url)).toBeNull()
    },
  )
})
