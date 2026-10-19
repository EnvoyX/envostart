import { createFileRoute } from '@tanstack/react-router';

import { getSanitySession } from '@/sanity/session';

export const Route = createFileRoute('/api/draft-mode/disable')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const redirectTo = url.searchParams.get('redirect') || '/';

        const session = await getSanitySession();
        session.destroy();

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
