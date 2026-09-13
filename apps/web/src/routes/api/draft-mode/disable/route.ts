import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/draft-mode/disable')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const redirectTo = url.searchParams.get('redirect') || '/';

        return new Response(null, {
          status: 307,
          headers: {
            Location: redirectTo,
            'Set-Cookie': `sanity-preview=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
          },
        });
      },
    },
  },
});
