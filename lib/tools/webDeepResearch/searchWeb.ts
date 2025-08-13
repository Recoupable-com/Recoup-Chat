import fetchPerplexityApi from "@/lib/perplexity/fetchPerplexityApi";

export type SearchResult = {
  title: string;
  url: string;
  date: string;
  last_updated: string;
};

export type PerplexitySearchResults = {
  citations: string[];
  choices: {
    message: {
      content: string;
    };
  }[];
  search_results: SearchResult[];
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

export default searchWeb;
