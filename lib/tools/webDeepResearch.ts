import { generateObject, generateText, tool } from "ai";
import { z } from "zod";
import fetchPerplexityApi from "../perplexity/fetchPerplexityApi";
import { DEFAULT_MODEL } from "../consts";

type SearchResult = {
  title: string;
  url: string;
  date: string;
  last_updated: string;
};

type PerplexitySearchResults = {
  citations: string[];
  choices: {
    message: {
      content: string;
    };
  }[];
  search_results: SearchResult[];
};

const generateSearchQueries = async (query: string, n: number = 3) => {
  const {
    object: { queries },
  } = await generateObject({
    model: DEFAULT_MODEL,
    prompt: `Generate ${n} search queries for the following query: ${query}`,
    schema: z.object({
      queries: z.array(z.string()).min(1).max(5),
    }),
  });
  return queries;
};

const searchWeb = async (query: string): Promise<PerplexitySearchResults> => {
  const messages = [
    {
      role: "user",
      content: query,
    },
  ];
  const result = await fetchPerplexityApi(messages, "sonar-deep-research");
  const data = (await result.json()) as PerplexitySearchResults;
  return data;
};

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

const generateLearnings = async (
  query: string,
  searchResult: PerplexitySearchResults
) => {
  const { object } = await generateObject({
    model: DEFAULT_MODEL,
    prompt: `The user is researching "${query}". The following search result were deemed relevant.
    Generate a learning and a follow-up question from the following search result:

    <search_result>
    ${searchResult.choices[0].message.content}
    </search_result>
      `,
    schema: z.object({
      learning: z.string(),
      followUpQuestions: z.array(z.string()),
    }),
  });
  return object;
};

type Learning = {
  learning: string;
  followUpQuestions: string[];
};

type Research = {
  query: string | undefined;
  queries: string[];
  searchResults: SearchResult[];
  learnings: Learning[];
  completedQueries: string[];
};

const accumulatedResearch: Research = {
  query: undefined,
  queries: [],
  searchResults: [],
  learnings: [],
  completedQueries: [],
};

const deepResearch = async ({
  prompt,
  depth = 2,
  breadth = 2,
}: {
  prompt: string;
  depth?: number;
  breadth?: number;
}): Promise<Research> => {
  console.log("deepResearch starting", prompt, depth, breadth);
  if (!accumulatedResearch.query) {
    accumulatedResearch.query = prompt;
  }

  if (depth === 0) {
    return accumulatedResearch;
  }

  const queries = await generateSearchQueries(prompt, breadth);
  accumulatedResearch.queries = queries;

  for (const query of queries) {
    console.log(`Searching the web for: ${query}`);
    const perplexitySearchResults = await searchAndProcess(
      query,
      accumulatedResearch.searchResults
    );
    const searchResults = perplexitySearchResults.flatMap(
      (r) => r.search_results
    );
    accumulatedResearch.searchResults.push(...searchResults);
    for (const searchResult of perplexitySearchResults) {
      console.log(
        `Processing search result: ${JSON.stringify(searchResult.search_results)}`
      );
      const learnings = await generateLearnings(query, searchResult);
      console.log("NEW LEARNINGS", learnings);
      accumulatedResearch.learnings.push(learnings);
      accumulatedResearch.completedQueries.push(query);

      const newQuery = `Overall research goal: ${prompt}
            Previous search queries: ${accumulatedResearch.completedQueries.join(", ")}
    
            Follow-up questions: ${learnings.followUpQuestions.join(", ")}
            `;
      await deepResearch({
        prompt: newQuery,
        depth: depth - 1,
        breadth: Math.ceil(breadth / 2),
      });
    }
  }
  return accumulatedResearch;
};

const webDeepResearch = tool({
  description: "Deep research on a given query",
  inputSchema: z.object({
    prompt: z.string().min(1),
  }),
  execute: async ({ prompt }) => {
    const response = await deepResearch({ prompt });
    console.log("DEEP RESEARCH RESPONSE", response);
    return response;
  },
});
export default webDeepResearch;
