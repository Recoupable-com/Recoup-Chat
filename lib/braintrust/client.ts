import * as ai from "ai";
import { initLogger, wrapAISDK } from "braintrust";

// Initialize Braintrust logging once for the app/server runtime.
// Requires env vars: BRAINTRUST_API_KEY and BRAINTRUST_PROJECT (optional)
const projectName = process.env.BRAINTRUST_PROJECT || "Recoup-Chat";
const apiKey = process.env.BRAINTRUST_API_KEY;

if (apiKey) {
  initLogger({ projectName, apiKey });
}

// Wrap top-level AI SDK functions
export const { generateText, streamText, generateObject, streamObject } =
  wrapAISDK(ai);

export { tool } from "ai";
