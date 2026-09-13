import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { createFileRoute } from '@tanstack/react-router';

import { env } from '@/env';
import { sanityClient } from '@/lib/sanity';

export const Route = createFileRoute('/api/draft-mode/enable')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const token = env.SANITY_API_READ_TOKEN;

        if (!token) {
          return new Response('SANITY_API_READ_TOKEN is not set', { status: 500 });
        }

        const clientWithToken = sanityClient.withConfig({ token });
        const { isValid, redirectTo = '/' } = await validatePreviewUrl(
          clientWithToken,
          request.url,
        );

        if (!isValid) {
          return new Response('Invalid preview URL', { status: 401 });
        }

        return new Response(null, {
          status: 307,
          headers: {
            Location: redirectTo,
            'Set-Cookie': `sanity-preview=true; Path=/; HttpOnly; SameSite=Lax`,
          },
        });
      },
    },
  },
});
