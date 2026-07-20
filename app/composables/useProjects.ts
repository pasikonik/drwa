import { readItems } from '@directus/sdk'
import type { Project } from '~/types/directus'

/**
 * Fetch all published projects (realizacje) with their M2M images.
 * Ordered by manual `sort`, then newest first by `date`.
 *
 * NOTE: requires Public read permission in Directus on BOTH `projects` and the
 * junction `projects_files` — otherwise `images` comes back empty.
 *
 * @example const { data: projects } = await useProjects()
 */
export const useProjects = () => {
  const { directus } = useDirectus()

  return useAsyncData<Project[]>(
    'projects-published',
    () =>
      directus.request(
        readItems('projects', {
          filter: { status: { _eq: 'published' } },
          sort: ['sort', '-date'],
          fields: [
            'id', 'status', 'title', 'date', 'description', 'sort',
            { images: [{ directus_files_id: ['id'] }] },
          ],
        })
      ) as Promise<Project[]>,
    { default: () => [] as Project[] }
  )
}
