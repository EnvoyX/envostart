import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID as string,
    dataset: process.env.SANITY_STUDIO_DATASET as string,
  },
  deployment: {
    /**
     * Get the appId for a previously deployed Studio under the "Studio" tab for your project in sanity.io/manage
     * Note: this is required for fine-grained version selection
     */
    appId: "ho1r9rhrir2c387z1c3yr9pf",
    /**
     * Enable auto-updates.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity
     */
    autoUpdates: true,
  },
  typegen: {
    path: "./**/*.{ts,tsx,js,jsx}",
    schema: "./sanity/extract.json",
    generates: "../web/src/types/sanity/type.ts",
  },
});
