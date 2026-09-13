import { createFileRoute } from "@tanstack/react-router";

import { BlogDashboardEditor } from "@/components/web/dashboard/BlogDashboardEditor";

export const Route = createFileRoute("/dashboard/blog/create-blog/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: `Create Blog | Envostart` },
      {
        name: "Envostart",
        content: "Welcome to my TanStack Start playground!",
      },
      {
        property: "og:title",
        content: `Create Blog | Envostart`,
      },
      {
        property: "og:description",
        content: `Create a new blog post on Envostart.`,
      },
      {
        property: "og:image",
        content: `https://tanstack.com/assets/og-C0HGjoLl.png`,
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

function RouteComponent() {
  return <BlogDashboardEditor />;
}
