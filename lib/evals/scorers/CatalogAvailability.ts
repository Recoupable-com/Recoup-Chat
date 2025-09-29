import { DEFAULT_MODEL } from "@/lib/consts";
import { generateObject } from "ai";
import { getCatalogData } from "@/lib/evals/scorers/getCatalogData";
import { z } from "zod";

/**
 * Custom scorer that uses AI to check if recommended songs are actually in the catalog
 */
export const CatalogAvailability = async ({
  output,
}: {
  output: string;
  expected: string;
  input: string;
}) => {
  try {
    // Load catalog data dynamically
    const catalog = await getCatalogData();

    // Use AI to analyze the output against the catalog
    const result = await generateObject({
      model: DEFAULT_MODEL,
      system: `You are a music catalog analyst. Your job is to analyze song recommendations and determine which ones are available in the provided music catalog.
  
  Instructions:
  1. Extract all song recommendations from the output text
  2. For each song, check if it exists in the catalog (exact match or close match)
  3. Consider variations in artist names, song titles, and formatting
  4. Return detailed analysis with scores and reasoning
  
  Catalog format: ISRC,Track Name,Release Name,Artist Name`,
      prompt: `Analyze this song recommendation output against the music catalog:
  
  OUTPUT TO ANALYZE:
  ${output}
  
  MUSIC CATALOG:
  ${catalog}
  
  Please analyze which recommended songs are available in the catalog and provide a detailed assessment.`,
      schema: z.object({
        analysis: z
          .string()
          .describe("Detailed analysis of the song recommendations"),
        totalSongs: z.number().describe("Total number of songs recommended"),
        songsInCatalog: z
          .number()
          .describe("Number of songs that are in the catalog"),
        matchedSongs: z
          .array(
            z.object({
              recommended: z.string().describe("The song as recommended"),
              catalogMatch: z.string().describe("The matching song in catalog"),
              confidence: z
                .number()
                .min(0)
                .max(1)
                .describe("Confidence in the match (0-1)"),
            })
          )
          .describe("Songs that were matched to the catalog"),
        unmatchedSongs: z
          .array(z.string())
          .describe("Songs that were not found in the catalog"),
        score: z
          .number()
          .min(0)
          .max(1)
          .describe("Overall score (0-1) based on catalog availability"),
        reasoning: z.string().describe("Explanation of the scoring logic"),
      }),
    });

    console.log("result.object", result.object);
    return {
      name: "catalog_availability",
      score: result.object.score,
      metadata: {
        analysis: result.object.analysis,
        total_songs: result.object.totalSongs,
        songs_in_catalog: result.object.songsInCatalog,
        matched_songs: result.object.matchedSongs,
        unmatched_songs: result.object.unmatchedSongs,
        catalog_coverage: `${result.object.songsInCatalog}/${result.object.totalSongs}`,
        catalog_coverage_percentage: `${Math.round(result.object.score * 100)}%`,
        reasoning: result.object.reasoning,
      },
    };
  } catch (error) {
    // Fallback to a basic score if AI analysis fails
    console.error("Error in CatalogAvailability scorer:", error);
    return {
      name: "catalog_availability",
      score: 0,
      metadata: {
        error: "Failed to analyze catalog availability",
        error_message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
};
