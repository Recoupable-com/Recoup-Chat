/**
 * fetchPerplexityApi.ts
 * Non-streaming Perplexity chat completions client.
 * Single responsibility: Make non-streaming chat completion requests to Perplexity API.
 * 
 * See the Sonar API documentation for more details:
 * https://docs.perplexity.ai/api-reference/chat-completions
 */

import { getPerplexityApiKey, getPerplexityHeaders, PERPLEXITY_BASE_URL } from "./config";

/**
 * Performs a non-streaming chat completion request to Perplexity API.
 * 
 * @param messages - Array of message objects with role and content
 * @param model - Perplexity model to use (default: sonar-pro)
 * @returns Promise resolving to the Response object
 * @throws Error if API call fails or API key is missing
 */
const fetchPerplexityApi = async (
  messages: Array<{ role: string; content: string }>,
  model: string = "sonar-pro"
): Promise<Response> => {
  const apiKey = getPerplexityApiKey();
  const url = `${PERPLEXITY_BASE_URL}/chat/completions`;
  
  const body = {
    model,
    messages,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: getPerplexityHeaders(apiKey),
      body: JSON.stringify(body),
    });
    return response;
  } catch (error) {
    throw new Error(`Network error while calling Perplexity API: ${error}`);
  }
};

export default fetchPerplexityApi;
