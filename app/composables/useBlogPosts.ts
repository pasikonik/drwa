import { readItems } from '@directus/sdk'
import type { BlogPost } from '~/types/directus'
import { withRetry } from '~/utils/directus'

/**
 * Fetch all published blog posts ordered by publish_date descending.
 * The first post in the returned array is treated as "featured" by the blog page.
 *
 * @example const { data: posts } = await useBlogPosts()
 */
export const useBlogPosts = () => {
  const { directus } = useDirectus()

  return recoverOnClient(useAsyncData<BlogPost[]>(
    'blog-posts-published',
    () => withRetry(() =>
      directus.request(
        readItems('blog_posts', {
          filter: { status: { _eq: 'published' } },
          sort: ['-publish_date'],
          fields: ['id', 'title', 'slug', 'content', 'category', 'featured_image', 'publish_date'],
        })
      ) as Promise<BlogPost[]>),
    { default: () => [] as BlogPost[] }
  ))
}
