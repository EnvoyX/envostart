import { createClient } from '@sanity/client';
import { createImageUrlBuilder, SanityImageSource } from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: true,
  apiVersion: '2026-07-01',
  stega: {
    enabled: true,
    studioUrl: import.meta.env.VITE_SANITY_STUDIO_URL,
  },
});

const builder = createImageUrlBuilder(sanityClient);
export const urlFor = (source: SanityImageSource) => builder.image(source);
