import { createServerFn } from '@tanstack/react-start';

import { sanityClient } from '@/lib/sanity/client/sanity';
import { POSTS_QUERY, POST_SLUG_QUERY } from '@/lib/sanity/queries';
import { getPreviewData } from '@/sanity/session';
interface PostSummary {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  readingTime?: number;
  mainImage?: {
    asset: { _ref: string };
    alt?: string;
  };
  visibility: 'public' | 'private';
  author?: {
    name: string;
    avatar?: { asset: { _ref: string } };
  };
  categories?: Array<{
    title: string;
  }>;
}

export const fetchAllPosts = createServerFn({ method: 'GET' }).handler(async ({ context }) => {
  const { options } = await getPreviewData(context.req);
  return await sanityClient.fetch<PostSummary[]>(POSTS_QUERY, {}, options);
});

export const fetchPostBySlug = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug, context }) => {
    const { options } = await getPreviewData(context.req);
    const post = await sanityClient.fetch(POST_SLUG_QUERY, { slug }, options);
    return post;
  });
