import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

import { env } from '@/env';

export const sanityClient = createClient({
  projectId: env.SANITY_PROJECT_ID,
  dataset: env.SANITY_DATASET,
  useCdn: true,
  apiVersion: '2026-07-01',
  stega: {
    enabled: true,
    studioUrl: env.SANITY_STUDIO_URL,
  },
});

const builder = createImageUrlBuilder(sanityClient);
export const urlFor = (source: any) => builder.image(source);
