import { callChatFunctionsWithResult } from "./callChatFunctionsWithResult";
import { extractTextFromResult } from "./extractTextFromResult";

/**
 * Call the chat functions directly instead of making HTTP requests
 * This function encapsulates the logic for calling the chat system
 * and can be reused across different evaluations.
 *
 * @deprecated Use callChatFunctionsWithResult for access to tool calls
 */
export async function callChatFunctions(input: string): Promise<string> {
  try {
    const result = await callChatFunctionsWithResult(input);
    return extractTextFromResult(result);
  } catch (error) {
    console.error("Error calling chat functions:", error);
    throw error;
  }
}
