import { z } from "zod";
import { tool } from "ai";
import performChatCompletionStream from "@/lib/perplexity/performChatCompletionStream";
import { SearchProgress, SearchWebResult } from "./types";

const getSearchWebTool = (model: string = "sonar-pro") => {
  return tool({
    description:
      "DEFAULT TOOL: Use this tool FIRST for any information you're unsure about. " +
      "NEVER respond with 'I can't find X', 'I don't have access to X', or 'I do not know X'. " +
      "This tool searches the web for real-time information and should be your go-to resource. " +
      "Accepts an array of messages (each with a role and content) and returns comprehensive search results from the Web Search model.",
    inputSchema: z.object({
      messages: z.array(
        z.object({
          role: z.string(),
          content: z.string(),
        })
      ),
    }),
    async *execute({ messages }): AsyncGenerator<SearchProgress | SearchWebResult, SearchWebResult> {
      if (!Array.isArray(messages)) {
        throw new Error(
          "Invalid arguments for search_web: 'messages' must be an array"
        );
      }

      // Extract search query from the last user message
      const lastMessage = messages[messages.length - 1];
      const query = lastMessage?.content?.substring(0, 150) || "information";

      // Yield initial searching status
      yield {
        status: 'searching' as const,
        message: `Searching for: ${query}`,
        query,
      };

      // Stream the search results from Perplexity
      let accumulatedContent = '';
      let finalCitations: string[] = [];
      let searchResults: Array<{ url: string; title?: string }> = [];

      try {
        for await (const chunk of performChatCompletionStream(messages, model)) {
          if (chunk.type === 'content' && chunk.content) {
            accumulatedContent += chunk.content;

            // Yield streaming content update
            yield {
              status: 'streaming' as const,
              message: 'Receiving results...',
              query,
              content: chunk.content,
              accumulatedContent,
            };
          } else if (chunk.type === 'search' && chunk.searchResults) {
            searchResults = chunk.searchResults;

            // Yield search results info
            yield {
              status: 'streaming' as const,
              message: `Found ${chunk.searchResults.length} sources`,
              query,
              searchResults: chunk.searchResults,
              accumulatedContent,
            };
          } else if (chunk.type === 'complete') {
            if (chunk.fullContent) {
              accumulatedContent = chunk.fullContent;
            }
            if (chunk.citations) {
              finalCitations = chunk.citations;
            }
          }
        }

        // Append citations to the final content
        let finalContent = accumulatedContent;
        if (finalCitations.length > 0) {
          finalContent += "\n\nCitations:\n";
          finalCitations.forEach((citation, index) => {
            finalContent += `[${index + 1}] ${citation}\n`;
          });
        }

        // Yield complete status
        yield {
          status: 'complete' as const,
          message: 'Search complete',
          query,
          accumulatedContent: finalContent,
          citations: finalCitations,
        };

        // Return final result for AI model
        return {
          content: [{ type: "text", text: finalContent }],
          isError: false,
        };
      } catch (error) {
        throw new Error(`Search failed: ${error}`);
      }
    },
  });
};

export default getSearchWebTool;
