/**
 * config.ts
 * Centralized Perplexity API configuration and utilities.
 * Single responsibility: Manage API credentials, base URLs, and common headers.
 */

export const PERPLEXITY_BASE_URL = "https://api.perplexity.ai";

/**
 * Retrieves and validates Perplexity API key from environment variables.
 * Throws an error if the API key is not configured.
 * 
 * @returns The Perplexity API key
 * @throws Error if PERPLEXITY_API_KEY is not set
 */
export function getPerplexityApiKey(): string {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      "PERPLEXITY_API_KEY environment variable is not set. " +
      "Please add it to your environment variables."
    );
  }
  
  return apiKey;
}

/**
 * Creates standard headers for Perplexity API requests.
 * Includes Content-Type and Authorization with Bearer token.
 * 
 * @param apiKey - The Perplexity API key
 * @returns Headers object for fetch requests
 */
export function getPerplexityHeaders(apiKey: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
}

