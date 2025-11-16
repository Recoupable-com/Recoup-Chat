import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

const apiKey = process.env.COMPOSIO_API_KEY;

if (!apiKey) {
  console.warn("COMPOSIO_API_KEY not found in environment variables");
  throw new Error("COMPOSIO_API_KEY not found in environment variables");
}

export const getComposioClient = (): Composio<VercelProvider> => {
  return new Composio<VercelProvider>({
    apiKey,
    provider: new VercelProvider(),
  });
};
