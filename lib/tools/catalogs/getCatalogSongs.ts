import { z } from "zod";
import { Tool } from "ai";

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
      const params = new URLSearchParams({
        catalog_id,
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(
        `https://api.recoupable.com/api/catalogs/songs?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.status === "error") {
        throw new Error(data.error || "Unknown error occurred");
      }

      return {
        success: true,
        songs: data.songs,
        pagination: data.pagination,
        catalog_id,
        total_songs: data.pagination?.total_count || data.songs?.length || 0,
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
