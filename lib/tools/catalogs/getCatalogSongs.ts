import { z } from "zod";
import { Tool } from "ai";
import { getCatalogSongs } from "@/lib/catalog/getCatalogSongs";

const getCatalogSongsTool: Tool = {
  description: `Retrieve songs within a specific catalog with pagination. 
    Returns comprehensive song information including artist details. 
    IMPORTANT: Call select_catalogs first to get the catalog_id parameter.
    Call this for any catalog-related operations.
    Example prompts to trigger this tool:
    - Peloton needs songs for a Halloween playlist`,
  inputSchema: z.object({
    catalog_id: z
      .string()
      .describe(
        "The unique identifier of the catalog to query songs for. Get this from the select_catalogs tool."
      ),
    page: z
      .number()
      .optional()
      .describe("Page number for pagination (default: 1)"),
    limit: z
      .number()
      .optional()
      .describe("Number of songs per page (default: 20, max: 100)"),
  }),
  execute: async ({ catalog_id, page = 1, limit = 20 }) => {
    try {
      // Use the library function to get all songs
      const allSongs = await getCatalogSongs(catalog_id, limit);

      // Calculate pagination manually
      const totalCount = allSongs.length;
      const totalPages = Math.ceil(totalCount / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedSongs = allSongs.slice(startIndex, endIndex);

      return {
        success: true,
        songs: paginatedSongs,
        pagination: {
          total_count: totalCount,
          page: page,
          limit: limit,
          total_pages: totalPages,
        },
        catalog_id,
        total_songs: totalCount,
      };
    } catch (error) {
      console.error("Error fetching catalog songs:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch catalog songs",
        songs: [],
        pagination: null,
        catalog_id,
        total_songs: 0,
      };
    }
  },
};

export default getCatalogSongsTool;
