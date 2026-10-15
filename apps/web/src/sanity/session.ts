import type { loadQuery } from '@sanity/react-loader';
import { getCookie, setCookie } from '@tanstack/react-start/server';
import { getIronSession } from 'iron-session';

import { env } from '@/env';

type SanitySessionData = {
  previewMode?: boolean;
  perspective?: string;
};

export function getSanitySession() {
  return getIronSession<SanitySessionData>(
    { read: getCookie, write: setCookie },
    {
      cookieName: '__sanity_preview',
      password: env.SANITY_SESSION_SECRET,
      cookieOptions: {
        httpOnly: true,
        path: '/',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: env.NODE_ENV === 'production',
      },
    },
  );
}

export async function getPreviewData(_request: Request): Promise<{
  preview: boolean;
  options: Parameters<typeof loadQuery>[2];
}> {
  const session = await getSanitySession();
  const preview = session.previewMode || false;

  const rawPerspective = session.perspective;
  return {
    preview,
    options: preview
      ? {
          perspective: rawPerspective ? rawPerspective.split(',') : 'drafts',
          stega: true,
        }
      : {
          perspective: 'published',
          stega: false,
        },
  };
}
