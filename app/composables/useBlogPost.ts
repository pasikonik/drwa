import { readItems } from '@directus/sdk'
import type { BlogPost } from '~/types/directus'
import { withRetry } from '~/utils/directus'

/**
 * Fetch a single published blog post by slug. Returns null when no published
 * post matches, so the page can `createError(404)`.
 *
 * @example const { data: post } = await useBlogPost('post1')
 */
export const useBlogPost = (slug: string) => {
  const { directus } = useDirectus()

  return recoverOnClient(useAsyncData<BlogPost | null>(
    `blog-post-${slug}`,
    () => withRetry(async () => {
      const rows = (await directus.request(
        readItems('blog_posts', {
          filter: { status: { _eq: 'published' }, slug: { _eq: slug } },
          limit: 1,
          fields: ['id', 'title', 'slug', 'content', 'category', 'featured_image', 'publish_date'],
        })
      )) as BlogPost[]
      return rows[0] ?? null
    }),
    { default: () => null }
  ))
}
