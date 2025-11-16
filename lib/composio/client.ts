import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

let cachedClient: Composio<VercelProvider> | null = null;

/**
 * getComposioClient()
 *
 * Server-only async accessor for a singleton Composio client.
 * Required for "use server" modules: only async functions can be exported.
 */
export async function getComposioClient(): Promise<Composio<VercelProvider>> {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.NEXT_PUBLIC_COMPOSIO_API_KEY;
  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_COMPOSIO_API_KEY not found in environment variables"
    );
  }
  cachedClient = new Composio<VercelProvider>({
    apiKey,
    provider: new VercelProvider(),
  });
  return cachedClient;
}
