import { createServerFn } from '@tanstack/react-start';

import { getPreviewData } from '@/sanity/session';

export const checkSanityPreview = createServerFn({ method: 'GET' }).handler(async ({ context }) => {
  const { preview } = await getPreviewData(context.req);
  return { isPreview: preview };
});
