import { z } from "zod";
import { Tool } from "ai";
import { postCatalogSongs } from "@/lib/catalog/postCatalogSongs";

const insertCatalogSongsTool: Tool = {
  description: `Add songs to a catalog by ISRC in batch.
    
    IMPORTANT: Call select_catalogs first to get available catalog_id values.
    
    Use this tool when you need to:
    - Add songs to an existing catalog
    - Bulk import songs into a catalog
    - Associate songs with a catalog using their ISRC codes
    
    Requirements: 
    - Each song requires both catalog_id and isrc
    - Songs are added in batch (multiple songs in one request)
    - catalog_id must be obtained from select_catalogs tool
    - ISRC is the International Standard Recording Code for the song`,
  inputSchema: z.object({
    songs: z
      .array(
        z.object({
          catalog_id: z
            .string()
            .describe(
              "Catalog ID to which the song will be added. Get this from the select_catalogs tool."
            ),
          isrc: z.string().describe("Song ISRC to associate to the catalog"),
        })
      )
      .describe("Array of songs to add to catalog(s)"),
  }),
  execute: async ({ songs }) => {
    try {
      const response = await postCatalogSongs(songs);

      return {
        success: true,
        songs: response.songs,
        pagination: response.pagination,
        total_added: songs.length,
        message: `Successfully added ${songs.length} song(s) to catalog(s)`,
      };
    } catch (error) {
      console.error("Error inserting catalog songs:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to insert catalog songs",
        songs: [],
        total_added: 0,
      };
    }
  },
};

export default insertCatalogSongsTool;
