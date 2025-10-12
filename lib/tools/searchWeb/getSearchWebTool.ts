import { z } from "zod";
import { tool } from "ai";
import { searchPerplexity, formatSearchResults } from "@/lib/perplexity/searchApi";
import type { SearchProgress } from "./types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSearchWebTool = (_model?: string) => {
  return tool({
    description:
      "DEFAULT TOOL: Use this tool FIRST for any information you're unsure about. " +
      "NEVER respond with 'I can't find X', 'I don't have access to X', or 'I do not know X'. " +
      "This tool searches the web for real-time information and should be your go-to resource. " +
      "Returns ranked web search results with titles, URLs, and content snippets.",
    inputSchema: z.object({
      query: z.string().describe("The search query"),
      max_results: z.number().optional().describe("Maximum number of results (1-20, default: 10)"),
      country: z.string().optional().describe("ISO country code for regional results (e.g., 'US', 'GB')"),
    }),
    execute: async function* ({ query, max_results, country }) {
      if (!query) {
        throw new Error("Search query is required");
      }

      // Initial searching status
      yield {
        status: 'searching' as const,
        message: 'Searching the web...',
        query,
      } satisfies SearchProgress;

      // Small delay to ensure UI renders the searching state
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        // Use Perplexity Search API
        const searchResponse = await searchPerplexity({
          query,
          max_results: max_results || 10,
          max_tokens_per_page: 1024,
          ...(country && { country }),
        });

        // Yield reviewing status with search results for UI display
        yield {
          status: 'reviewing' as const,
          message: `Reviewing sources · ${searchResponse.results.length}`,
          query,
          searchResults: searchResponse.results,
        } satisfies SearchProgress;

        // Format results for the AI to read
        const formattedResults = formatSearchResults(searchResponse);

        // Return final result for AI model
        return {
          content: [{ type: "text", text: formattedResults }],
          isError: false,
        };
      } catch (error) {
        throw new Error(`Search failed: ${error}`);
      }
    },
  });
};

export default getSearchWebTool;
