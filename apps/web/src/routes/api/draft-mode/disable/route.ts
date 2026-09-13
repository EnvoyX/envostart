import { getSanitySession } from "@/sanity/session";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/draft-mode/disable")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const redirectTo = url.searchParams.get("redirect") || "/";

        // Get the session and destroy it
        const session = await getSanitySession();
        await session.clear();

        return new Response(null, {
          status: 307,
          headers: {
            Location: redirectTo,
          },
        });
      },
    },
  },
});
