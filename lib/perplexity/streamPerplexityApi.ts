import { PerplexityMessage } from "./types";

/**
 * Initiates a streaming request to the Perplexity API
 * Returns a Response object with streaming body for SSE parsing
 * 
 * @param messages - Array of message objects with role and content
 * @param model - Perplexity model to use (default: sonar-pro)
 * @returns Response object with streaming enabled
 */
const streamPerplexityApi = async (
  messages: PerplexityMessage[],
  model: string = "sonar-pro"
): Promise<Response> => {
  const url = "https://api.perplexity.ai/chat/completions";
  
  const body = {
    model,
    messages,
    stream: true,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
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

