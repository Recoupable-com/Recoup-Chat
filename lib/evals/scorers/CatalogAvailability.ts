import { DEFAULT_MODEL } from "@/lib/consts";
import { generateObject } from "ai";
import { getCatalogDataAsCSV } from "@/lib/catalog/getCatalogDataAsCSV";
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
    const catalogId = "325a0fa0-401e-4968-ae43-e9ce469b31f0";
    const catalog = await getCatalogDataAsCSV(catalogId);

    const result = await generateObject({
      model: DEFAULT_MODEL,
      system: `You are a music catalog analyst. Your job is to analyze song recommendations and determine which ones are available in the provided music catalog.

Instructions:
1. Extract all song recommendations from the output text
2. For each song, check if it exists in the catalog (exact match or close match)
3. Consider variations in artist names, song titles, and formatting
4. Return detailed analysis with scores and reasoning
5. CRITICAL: Use only double quotes in JSON strings. Escape any internal quotes with backslashes.
6. CRITICAL: Ensure all strings are properly escaped for valid JSON format

Catalog format: ISRC,Track Name,Release Name,Artist Name`,
      prompt: `Analyze this song recommendation output against the music catalog and return ONLY valid JSON:

OUTPUT TO ANALYZE:
${output}

MUSIC CATALOG:
${catalog}

IMPORTANT: Return ONLY valid JSON. Use double quotes for all strings. Escape any quotes within strings with backslashes. Example: "reasoning": "This is a test with \\"quotes\\" inside"`,
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

    if (!result.object) {
      throw new Error("No response object received from AI model");
    }

    const score =
      typeof result.object.score === "number"
        ? Math.max(0, Math.min(1, result.object.score))
        : 0;

    return {
      name: "catalog_availability",
      score,
      metadata: result.object,
    };
  } catch (error) {
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
