/**
 * Perplexity Search API client
 * Uses the /search endpoint for ranked web search results
 */

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  date?: string;
  last_updated?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  id: string;
}

export interface SearchParams {
  query: string;
  max_results?: number;
  max_tokens_per_page?: number;
  country?: string;
  search_domain_filter?: string[];
}

/**
 * Performs a web search using Perplexity's Search API
 * Returns ranked search results with snippets
 */
export async function searchPerplexity(
  params: SearchParams
): Promise<SearchResponse> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      "PERPLEXITY_API_KEY environment variable is not set. " +
      "Please add it to your environment variables."
    );
  }

  const url = "https://api.perplexity.ai/search";

  const body = {
    query: params.query,
    max_results: params.max_results || 10,
    max_tokens_per_page: params.max_tokens_per_page || 1024,
    ...(params.country && { country: params.country }),
    ...(params.search_domain_filter && { 
      search_domain_filter: params.search_domain_filter 
    }),
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Perplexity Search API error: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data: SearchResponse = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Failed to search Perplexity API: ${error}`);
  }
}

/**
 * Formats search results into a readable markdown string
 */
export function formatSearchResults(response: SearchResponse): string {
  const { results } = response;
  
  if (results.length === 0) {
    return "No search results found.";
  }

  let formatted = `Found ${results.length} search results:\n\n`;

  results.forEach((result, index) => {
    formatted += `### ${index + 1}. ${result.title}\n\n`;
    formatted += `**URL:** ${result.url}\n\n`;
    
    if (result.date) {
      formatted += `**Published:** ${result.date}\n\n`;
    }
    
    formatted += `${result.snippet}\n\n`;
    formatted += `---\n\n`;
  });

  return formatted;
}

