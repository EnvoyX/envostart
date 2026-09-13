import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { createFileRoute } from "@tanstack/react-router";

import { env } from "@/env";
import { sanityClient } from "@/lib/sanity";
import { getSanitySession } from "@/sanity/session";
import { ClientPerspective } from "@sanity/client";

export const Route = createFileRoute("/api/draft-mode/enable")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const token = env.SANITY_API_READ_TOKEN;

        if (!token) {
          return new Response("SANITY_API_READ_TOKEN is not set", { status: 500 });
        }

        // The preview-url-secret library lets you confirm
        // that the preview command is coming from Studio.
        const clientWithToken = sanityClient.withConfig({ token });
        const { isValid, redirectTo = "/" } = await validatePreviewUrl(
          clientWithToken,
          request.url,
        );

        if (!isValid) {
          return new Response("Invalid preview URL", { status: 401 });
        }

        // Get or create session
        const session = await getSanitySession();

        // Get perspective from URL query params
        const url = new URL(request.url);
        const perspectiveParam = url.searchParams.get("sanity-preview-perspective");
        const perspective = (perspectiveParam as ClientPerspective) || "drafts";

        // Enable preview mode
        await session.update({
          previewMode: true,
          perspective: perspective as string,
        });

        return new Response(null, {
          status: 307,
          headers: {
            Location: redirectTo,
            // "Set-Cookie": `sanity-preview=true; Path=/; HttpOnly; SameSite=Lax`,
          },
        });
      },
    },
  },
});
