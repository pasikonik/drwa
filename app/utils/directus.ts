// DRWA — Directus helpers shared across composables and components.

import type { DirectusFile } from '~/types/directus'

/**
 * Extract a Directus file ID from a file reference, which may be a bare ID
 * string, an expanded `DirectusFile` object, or null/undefined.
 */
export const fileId = (
  file: string | DirectusFile | null | undefined,
): string | null => (!file ? null : typeof file === 'object' ? file.id : file)
