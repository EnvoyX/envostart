import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import groq from 'groq';
import { ArrowLeft } from 'lucide-react';

import { SanityPortableText } from '@/components/web/SanityPortableText';
import { sanityClient, urlFor } from '@/lib/sanity';
import { getPreviewData } from '@/sanity/session';

const fetchPostBySlug = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug, context }) => {
    const query = groq`*[_type == "post" && slug.current == $slug][0]{
          _id,
          title,
          slug,
          publishedAt,
          excerpt,
          mainImage,
          body,
          visibility,
          author->{
            name,
            avatar
          },
          categories[]->{
            title
          },
          tags
        }`;
    const { options } = await getPreviewData(context.req);
    const post = await sanityClient.fetch(query, { slug }, options);
    return post;
  });

export const Route = createFileRoute('/blogposts/$slug/')({
  loader: async ({ params }) => {
    const post = await fetchPostBySlug({ data: params.slug });
    if (!post) throw notFound();
    return { post };
  },
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-bold">404 - Post Not Found</h1>
    </div>
  ),
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return {};
    return {
      meta: [
        { title: `${post.title} | Blogposts` },
        { name: 'description', content: post.excerpt || post.title },
      ],
    };
  },
  component: PostDetailPage,
});

function PostDetailPage() {
  const { post } = Route.useLoaderData();

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {post.categories?.length > 0 && (
        <div className="flex gap-2 mb-3">
          <Link to="/blogposts">
            <p className="text-xs font-medium px-2.5 py-1 bg-neutral-400 text-white dark:bg-white dark:text-black rounded-full hover:bg-neutral-500 dark:hover:bg-neutral-200 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Blogposts</span>
            </p>
          </Link>
          {post.categories.map((cat: { title: string }) => (
            <span
              key={cat.title}
              className="text-xs font-medium px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-400"
            >
              {cat.title}
            </span>
          ))}
        </div>
      )}

      <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-neutral-900 dark:text-neutral-50">
        {post.title}
      </h1>

      <div className="flex items-center gap-3 mb-8 text-sm text-neutral-600 dark:text-neutral-400 border-b pb-6">
        {post.author?.avatar && (
          <img
            src={urlFor(post.author.avatar).width(64).height(64).url()}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div>
          {post.author && (
            <p className="font-medium text-neutral-900 dark:text-neutral-200">{post.author.name}</p>
          )}
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
        </div>
      </div>

      {post.mainImage && (
        <div className="mb-10 overflow-hidden rounded-xl">
          <img
            src={urlFor(post.mainImage).width(1200).height(675).fit('crop').url()}
            alt={post.mainImage.alt || post.title}
            className="w-full h-auto aspect-video object-cover"
          />
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none">
        <SanityPortableText value={post.body} />
      </div>
    </article>
  );
}
