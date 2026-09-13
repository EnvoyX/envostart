import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const checkSanityPreview = createServerFn({ method: 'GET' }).handler(async () => {
  const headers = getRequestHeaders();
  const cookieHeader = headers.get('Cookie') || '';
  const isPreview = cookieHeader.includes('sanity-preview=true');
  return { isPreview };
});
