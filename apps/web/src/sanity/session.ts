import type { loadQuery } from '@sanity/react-loader';
import { useSession } from '@tanstack/react-start/server';

import { env } from '@/env';

type SanitySessionData = {
  previewMode?: boolean;
  perspective?: string;
};

export function getSanitySession() {
  return useSession<SanitySessionData>({
    name: '__sanity_preview',
    password: env.SANITY_SESSION_SECRET,
    cookie: {
      httpOnly: true,
      path: '/',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: env.NODE_ENV === 'production',
    },
  });
}

export async function getPreviewData(_request: Request): Promise<{
  preview: boolean;
  options: Parameters<typeof loadQuery>[2];
}> {
  const session = await getSanitySession();
  const preview = session.data.previewMode || false;

  const rawPerspective = session.data.perspective;
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
