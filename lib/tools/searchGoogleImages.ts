import { z } from "zod";
import { tool } from "ai";
import { searchGoogleImages } from "@/lib/serpapi/searchImages";
import type { SearchProgress } from "./searchWeb/types";

const getSearchGoogleImagesTool = () => {
  return tool({
    description:
      "Search for images using Google Images. Use this when the user asks for photos, images, or visual content of artists, album covers, concert photos, or any other visual content. " +
      "Returns a list of images with thumbnails and full-resolution URLs that can be displayed in chat or used in emails. " +
      "Prefer real images over AI-generated ones when appropriate.",
    inputSchema: z.object({
      query: z.string().describe("The search query (e.g., 'Mac Miller concert', 'Wiz Khalifa album cover')"),
      limit: z.number().optional().describe("Number of images to return (1-100, default: 8)"),
      imageSize: z.enum(["l", "m", "i"]).optional().describe("Image size: 'l' (large), 'm' (medium), 'i' (icon/small). Default: 'l'"),
      imageType: z.enum(["photo", "clipart", "lineart", "animated"]).optional().describe("Type of image. Default: 'photo'"),
      aspectRatio: z.enum(["square", "wide", "tall", "panoramic"]).optional().describe("Aspect ratio of images"),
    }),
    execute: async function* ({
      query,
      limit = 8,
      imageSize = "l",
      imageType = "photo",
      aspectRatio,
    }) {
      if (!query) {
        throw new Error("Search query is required");
      }

      // Initial searching status (streaming progress to UI)
      yield {
        status: 'searching' as const,
        message: 'Searching Google Images...',
        query,
      } satisfies SearchProgress;

      // Small delay to ensure UI renders the searching state
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        // Perform the search
        const response = await searchGoogleImages({
          query,
          limit,
          imageSize,
          imageType,
          aspectRatio,
        });

        const finalResult = {
          success: true,
          query,
          total_results: response.images_results.length,
          images: response.images_results.map((img) => ({
            position: img.position,
            thumbnail: img.thumbnail,
            original: img.original,
            width: img.original_width,
            height: img.original_height,
            title: img.title,
            source: img.source,
            link: img.link,
          })),
          message: `Found ${response.images_results.length} images for "${query}"`,
        };
        
        // Yield final result to UI
        yield finalResult;
        
        // Return simplified result for AI
        return {
          success: true,
          message: `Found ${response.images_results.length} images for "${query}"`,
        };
      } catch (error) {
        throw new Error(`Google Images search failed: ${error}`);
      }
    },
  });
};

export default getSearchGoogleImagesTool();

