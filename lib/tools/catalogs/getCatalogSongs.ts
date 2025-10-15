import { z } from "zod";
import { Tool, generateObject } from "ai";
import { getCatalogSongs } from "@/lib/catalog/getCatalogSongs";
import { DEFAULT_MODEL } from "@/lib/consts";

const BATCH_SIZE = 100;

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
    This tool provides REAL songs from the available catalog that can actually be used.
    
    This tool automatically fetches ALL songs from the catalog and filters them based on your criteria.`,
  inputSchema: z.object({
    catalog_id: z
      .string()
      .describe(
        "The unique identifier of the catalog to query songs for. Get this from the select_catalogs tool."
      ),
    criteria: z
      .string()
      .describe(
        "The search criteria or theme to filter songs by (e.g., 'Halloween party songs', 'workout music', 'romantic ballads')"
      ),
  }),
  execute: async ({ catalog_id, criteria }) => {
    try {
      // Fetch first page to get total count
      const firstPage = await getCatalogSongs(catalog_id, BATCH_SIZE, 1);
      const totalPages = firstPage.pagination.total_pages;

      // Create array of page numbers to fetch
      const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

      // Fetch and filter all pages in parallel
      const batchPromises = pageNumbers.map(async (pageNum) => {
        const pageData =
          pageNum === 1
            ? firstPage
            : await getCatalogSongs(catalog_id, BATCH_SIZE, pageNum);

        // Use AI to select relevant songs from this batch
        const { object } = await generateObject({
          model: DEFAULT_MODEL,
          schema: z.object({
            selected_song_isrcs: z
              .array(z.string())
              .describe("Array of song ISRCs that match the criteria"),
          }),
          prompt: `Given these songs and the criteria: "${criteria}", select the song ISRCs that are most relevant.
          
Songs:
${JSON.stringify(
  pageData.songs.map((s) => ({
    isrc: s.isrc,
    name: s.name,
    artist: s.artists.map((a) => a.name).join(", "),
  })),
  null,
  2
)}

Return only the ISRCs of songs that match the criteria.`,
        });

        // Filter songs based on AI selection
        return pageData.songs.filter((song) =>
          object.selected_song_isrcs.includes(song.isrc)
        );
      });

      // Wait for all batches to complete
      const batchResults = await Promise.all(batchPromises);
      const selectedSongs = batchResults.flat();

      return {
        success: true,
        songs: selectedSongs,
        catalog_id,
        total_songs: firstPage.pagination.total_count,
        selected_songs: selectedSongs.length,
        criteria,
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
        catalog_id,
        total_songs: 0,
        selected_songs: 0,
        criteria,
      };
    }
  },
};

export default getCatalogSongsTool;
