import { z } from "zod";
import { Tool } from "ai";
import { getCatalogSongs } from "@/lib/catalog/getCatalogSongs";

const getCatalogSongsTool: Tool = {
  description: `CRITICAL: Use this tool to find ACTUAL SONGS from the available catalog for any playlist or music recommendation request.
    
    IMPORTANT: Call select_catalogs first to get the catalog_id parameter.
    
    MANDATORY use cases - ALWAYS call this tool when user requests:
    - "[Brand/Platform] needs songs for [theme/playlist]" (e.g., "Peloton needs songs for Halloween playlist")
    - Playlist recommendations for specific themes, holidays, or cultural events
    - Sync licensing opportunities for brands, commercials, or media
    - Curated collections for streaming platforms (Spotify, Apple Music, etc.)
    - Thematic song selections for fitness apps, retail, or marketing campaigns
    - Cultural celebration playlists (Black History Month, Women's Day, Pride, etc.)
    - Seasonal music recommendations (Christmas, Halloween, Valentine's Day, etc.)
    - Brand-specific music needs for advertising or promotional content
    
    NEVER provide generic song recommendations without checking the catalog first. 
    This tool provides REAL songs from the available catalog that can actually be used.`,
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
      const response = await getCatalogSongs(catalog_id, limit, page);

      return {
        success: true,
        songs: response.songs,
        pagination: response.pagination,
        catalog_id,
        total_songs: response.pagination.total_count,
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
