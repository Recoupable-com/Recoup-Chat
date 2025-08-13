import { SearchResult } from "./searchWeb";
import generateSearchQueries from "./generateSearchQueries";
import searchAndProcess from "./searchAndProcess";
import generateLearnings from "./generateLearnings";

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

export default deepResearch;
