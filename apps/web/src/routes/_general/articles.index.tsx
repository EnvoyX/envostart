import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchBlogPosts } from "../../server/storyblok";

export const Route = createFileRoute("/_general/articles/")({
  component: ArticleIndex,
  loader: () => fetchBlogPosts(),
  head: () => ({
    meta: [
      { title: `Article | Envostart` },
      {
        name: "Envostart",
        content: "Welcome to my TanStack Start playground!",
      },
      { property: "og:title", content: "Article | Envostart" },
      {
        property: "og:description",
        content: "Create your own article and write your thoughts!",
      },
      {
        property: "og:image",
        content: "https://tanstack.com/assets/og-C0HGjoLl.png",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

function ArticleIndex() {
  const posts = Route.useLoaderData();
  return (
    <div className="container min-h-screen max-w-6xl mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Articles</h1>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No articles available yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              to="/articles/$slug"
              params={{ slug: post.slug }}
              className="block rounded-lg border bg-card p-6 transition-colors hover:bg-accent"
            >
              {post.content?.image?.filename && (
                <img
                  src={post.content.image.filename}
                  alt={post.content.title || post.name}
                  className="mb-4 h-48 w-full rounded-lg object-cover"
                />
              )}
              <h2 className="mb-2 text-xl font-semibold">{post.content?.title || post.name}</h2>
              {post.content?.description && (
                <p className="mb-4 text-muted-foreground line-clamp-3">
                  {post.content.description}
                </p>
              )}
              {post.content?.author && (
                <div className="mb-4 flex items-center gap-2">
                  {(post.content.author.content?.avatar?.filename ||
                    post.content.author.avatar?.filename) && (
                    <img
                      src={
                        post.content.author.content?.avatar?.filename ||
                        post.content.author.avatar?.filename
                      }
                      alt={post.content.author.content?.name || post.content.author.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {post.content.author.content?.name || post.content.author.name}
                  </span>
                </div>
              )}
              {post.tag_list && post.tag_list.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.tag_list.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 bg-zinc-800
                      text-secondary-foreground rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <span className="text-sm text-primary">Read more →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
