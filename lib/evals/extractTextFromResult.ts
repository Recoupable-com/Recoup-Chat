import { generateText } from "ai";
import { extractTextResultFromSteps } from "./extractTextResultFromSteps";

/**
 * Extract text from a GenerateTextResult
 */
export function extractTextFromResult(
  result: Awaited<ReturnType<typeof generateText>>
): string {
  // Handle multi-step responses (when maxSteps > 1)
  const stepsText = extractTextResultFromSteps(result);
  if (stepsText) return stepsText;

  // Fallback to direct text/content properties
  if (typeof result.text === "string") {
    return result.text;
  }

  if (typeof result.content === "string") {
    return result.content;
  }

  return String(result.text || result.content || "No response content");
}
