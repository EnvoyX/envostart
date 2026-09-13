import { getPreviewData } from "@/sanity/session";
import { createServerFn } from "@tanstack/react-start";

export const checkSanityPreview = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const { preview } = await getPreviewData(context.req);
  return { isPreview: preview };
});
