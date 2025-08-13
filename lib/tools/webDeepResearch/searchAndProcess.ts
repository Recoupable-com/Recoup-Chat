import { generateText } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";
import { tool } from "ai";
import { z } from "zod";
import { generateObject } from "ai";
import searchWeb, { SearchResult, PerplexitySearchResults } from "./searchWeb";

const searchAndProcess = async (
  query: string,
  accumulatedSources: SearchResult[]
) => {
  const finalSearchResults: PerplexitySearchResults[] = [];
  await generateText({
    model: DEFAULT_MODEL,
    prompt: `Search the web for information about ${query}`,
    system:
      "You are a researcher. For each query, search the web and then evaluate if the results are relevant and will help answer the following query",
    tools: {
      searchWebAndEvaluate: tool({
        description: "Search the web for information about a given query",
        inputSchema: z.object({
          query: z.string().min(1),
        }),
        execute: async ({ query }) => {
          const results = await searchWeb(query);
          console.log("SEARCH WEB RESULTS", results.search_results);
          const { object: evaluation } = await generateObject({
            model: DEFAULT_MODEL,
            prompt: `Evaluate whether the search results are relevant and will help answer the following query: ${query}. If the page already exists in the existing results, mark it as irrelevant.
  
              <search_results>
              Main content:
              ${results.choices[0].message.content}
  
              Citations:
              ${JSON.stringify(results.search_results)}
              </search_results>
  
              <existing_results>
              ${JSON.stringify(accumulatedSources.map((result) => result.url))}
              </existing_results>
  
              `,
            output: "enum",
            enum: ["relevant", "irrelevant"],
          });
          console.log("EVALUATION", evaluation);
          if (evaluation === "relevant") {
            finalSearchResults.push(results);
          }
          console.log("Found:", results.search_results);
          console.log("Evaluation completed:", evaluation);
          return evaluation === "irrelevant"
            ? `Search results are irrelevant. Please search again with a more specific query.
              <search_results>
              ${JSON.stringify(results.search_results)}
              </search_results>
              `
            : `Search results are relevant. End research for this query.
              <search_results>
              ${JSON.stringify(results.search_results)}
              </search_results>
              `;
        },
      }),
    },
  });
  return finalSearchResults;
};

export default searchAndProcess;
