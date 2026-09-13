import { createFileRoute, Link } from "@tanstack/react-router";
import { renderRichText } from "@storyblok/react";
import { fetchStory } from "@/server/storyblok";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_general/articles/$slug/")({
  component: BlogPost,
  loader: ({ params }) =>
    fetchStory({
      data: {
        slug: `articles/${params.slug}`,
      },
    }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.content?.title || loaderData?.name} | Envostart` },
      {
        name: "description",
        content: loaderData?.content?.description || "Welcome to my TanStack Start playground!",
      },
      {
        property: "og:title",
        content: loaderData?.content?.title || loaderData?.name || "Article | Envostart",
      },
      {
        property: "og:description",
        content:
          loaderData?.content?.description || "Create your own article and write your thoughts!",
      },
      {
        property: "og:image",
        content:
          loaderData?.content?.image?.filename || "https://tanstack.com/assets/og-C0HGjoLl.png",
      },
      { property: "og:type", content: "article" },
    ],
  }),
});

function BlogPost() {
  const story = Route.useLoaderData();

  if (!story) {
    return <div className="container min-h-screen mx-auto px-4 py-8">Post not found</div>;
  }

  const renderedContent = story.content?.content ? renderRichText(story.content.content) : "";

  return (
    <article className="container min-h-screen max-w-5xl mx-auto px-4 py-8">
      <Link
        to="/articles"
        className="inline-flex items-center gap-2 mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Articles</span>
      </Link>
      {story.content?.image?.filename && (
        <div className="mb-10 overflow-hidden rounded-xl">
          <img
            src={story.content.image.filename}
            alt={story.content.title || story.name}
            className="w-full h-auto aspect-video object-cover"
          />
        </div>
      )}
      <h1 className="mb-4 text-4xl font-bold">{story.content?.title || story.name}</h1>
      {story.content?.description && (
        <p className="mb-6 text-xl text-muted-foreground">{story.content.description}</p>
      )}
      <div className="mb-4 flex items-center gap-4">
        {story.content?.published_at && (
          <p className="text-sm text-muted-foreground">
            Published: {new Date(story.content.published_at).toLocaleDateString()}
          </p>
        )}
        {story.content?.author && (
          <div className="flex items-center gap-2">
            {(story.content.author.content?.avatar?.filename ||
              story.content.author.avatar?.filename) && (
              <img
                src={
                  story.content.author.content?.avatar?.filename ||
                  story.content.author.avatar?.filename
                }
                alt={story.content.author.content?.name || story.content.author.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
            <span className="text-sm text-muted-foreground">
              By {story.content.author.content?.name || story.content.author.name}
            </span>
          </div>
        )}
      </div>
      {story.tag_list && story.tag_list.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2 border-b pb-8">
          {story.tag_list.map((tag: string) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 bg-zinc-800 text-secondary-foreground rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
    </article>
  );
}
