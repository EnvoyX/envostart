import { getStoryblokApi } from "@storyblok/react";
import { createServerFn } from "@tanstack/react-start";
import * as z from "zod";

export const fetchStory = createServerFn({ method: "GET" })
  .validator(
    z.object({
      slug: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const storyblokApi = getStoryblokApi();

    // In dev mode, fetch draft version for real-time visual editing
    const version = process.env.NODE_ENV === "development" ? "draft" : "published";

    try {
      const response = await storyblokApi.get(`cdn/stories/${data.slug}`, {
        version,
        resolve_relations: "blogPost.author",
      });
      return response.data.story;
    } catch (error) {
      throw new Error(`Storyblok fetch error: ${error}`);
    }
  });

export const fetchBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  const storyblokApi = getStoryblokApi();
  const version = process.env.NODE_ENV === "development" ? "draft" : "published";

  try {
    const response = await storyblokApi.get("cdn/stories", {
      version,
      starts_with: "articles",
      content_type: "blogPost",
      resolve_relations: "blogPost.author",
    });
    return response.data.stories;
  } catch (error) {
    throw new Error(`Storyblok fetch error: ${error}`);
  }
});
