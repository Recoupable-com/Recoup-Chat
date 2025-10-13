import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

/**
 * getComposioClient()
 * 
 * Server-side Composio client initialization for Vercel AI SDK.
 * Creates and configures Composio client with API key from environment.
 * 
 * This function should ONLY be called from server components or API routes
 * to prevent exposing the COMPOSIO_API_KEY to the client bundle.
 * 
 * @returns Composio client instance or null if API key is missing
 * 
 * @example
 * // In a server component or API route
 * const composio = getComposioClient();
 * if (composio) {
 *   const tools = await composio.tools.get(userId, { toolkits: ['GMAIL'] });
 * }
 */
export const getComposioClient = (): Composio<VercelProvider> | null => {
  const apiKey = process.env.COMPOSIO_API_KEY;
  
  if (!apiKey) {
    console.warn('COMPOSIO_API_KEY not found in environment variables');
    return null;
  }

  return new Composio<VercelProvider>({
    apiKey,
    provider: new VercelProvider(),
  });
};

