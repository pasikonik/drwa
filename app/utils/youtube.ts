/**
 * YouTube video id from a pasted link (watch, youtu.be, embed, shorts, live), or null.
 * The embed URL is built from this id only, so arbitrary CMS input never reaches an iframe src.
 */
export function youtubeId(url: string | null | undefined): string | null {
  const m = url?.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/)
  return m?.[1] ?? null
}
