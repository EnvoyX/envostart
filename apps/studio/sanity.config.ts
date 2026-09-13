import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { codeInput } from "@sanity/code-input";
import { media } from "sanity-plugin-media";
import { presentationTool, defineLocations } from "sanity/presentation";
export default defineConfig({
  name: "default",
  title: "Envostart",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID as string,
  dataset: process.env.SANITY_STUDIO_DATASET as string,

  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        initial: process.env.SANITY_STUDIO_PREVIEW_URL || "https://envostart.vercel.app/",
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      resolve: {
        locations: {
          post: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                { title: doc?.title, href: `/envologs/${doc?.slug ?? ""}` },
                { title: "Envologs", href: "/envologs" },
              ],
            }),
          }),
        },
      },
    }),
    visionTool(),
    codeInput(),
    media(),
  ],

  schema: {
    types: schemaTypes,
  },
});
