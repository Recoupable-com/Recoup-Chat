import { generateText } from "ai";

/**
 * Extract text from a GenerateTextResult
 */
export function extractTextFromResult(
  result: Awaited<ReturnType<typeof generateText>>
): string {
  if (typeof result.text === "string") {
    return result.text;
  }

  if (typeof result.content === "string") {
    return result.content;
  }

  return String(result.text || result.content || "No response content");
}

