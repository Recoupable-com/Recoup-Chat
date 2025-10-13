/**
 * streamPerplexityApi.ts
 * Streaming Perplexity chat completions client.
 * Single responsibility: Make streaming chat completion requests to Perplexity API.
 */

import { PerplexityMessage } from "./types";
import { getPerplexityApiKey, getPerplexityHeaders, PERPLEXITY_BASE_URL } from "./config";

/**
 * Initiates a streaming request to the Perplexity API.
 * Returns a Response object with streaming body for SSE parsing.
 * 
 * @param messages - Array of message objects with role and content
 * @param model - Perplexity model to use (default: sonar-pro)
 * @returns Response object with streaming enabled
 * @throws Error if API call fails or API key is missing
 */
const streamPerplexityApi = async (
  messages: PerplexityMessage[],
  model: string = "sonar-pro"
): Promise<Response> => {
  const apiKey = getPerplexityApiKey();
  const url = `${PERPLEXITY_BASE_URL}/chat/completions`;
  
  const body = {
    model,
    messages,
    stream: true,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: getPerplexityHeaders(apiKey),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Perplexity API error: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    return response;
  } catch (error) {
    throw new Error(`Network error while calling Perplexity API: ${error}`);
  }
};

export default streamPerplexityApi;

