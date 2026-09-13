import { createFileRoute } from "@tanstack/react-router";
import { useStoryblokState, StoryblokComponent } from "@storyblok/react";
import { fetchStory } from "@/server/storyblok";

// this is the catch-all route for all pages in Storyblok
export const Route = createFileRoute("/$")({
  loader: async ({ params }) => {
    const slug = params["_splat"] || "home";
    const initialStory = await fetchStory({
      data: {
        slug,
      },
    });
    return { initialStory };
  },
  component: CMSPage,
});

function CMSPage() {
  const { initialStory } = Route.useLoaderData();

  // enable live visual editing preview inside the Storyblok Editor
  const story = useStoryblokState(initialStory);

  if (!story?.content) {
    return <div>Story not found</div>;
  }

  return <StoryblokComponent blok={story.content} />;
}
