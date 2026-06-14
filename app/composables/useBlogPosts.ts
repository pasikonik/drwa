import { readItems } from '@directus/sdk'
import type { BlogPost } from '~/types/directus'

/**
 * Fetch all published blog posts ordered by publish_date descending.
 * The first post in the returned array is treated as "featured" by the blog page.
 *
 * @example const { data: posts } = await useBlogPosts()
 */
export const useBlogPosts = () => {
  const { directus } = useDirectus()

  return useAsyncData<BlogPost[]>(
    'blog-posts-published',
    () =>
      directus.request(
        readItems('blog_posts', {
          filter: { status: { _eq: 'published' } },
          sort: ['-publish_date'],
          fields: ['id', 'title', 'slug', 'content', 'featured_image', 'publish_date'],
        })
      ) as Promise<BlogPost[]>,
    { default: () => [] as BlogPost[] }
  )
}
