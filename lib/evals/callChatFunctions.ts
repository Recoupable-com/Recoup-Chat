import { UIMessage } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";
import { setupChatRequest } from "@/lib/chat/setupChatRequest";
import { generateText } from "ai";
import { type ChatRequest } from "@/lib/chat/types";

/**
 * Call the chat functions and return the full result including tool calls
 */
export async function callChatFunctionsWithResult(input: string) {
  const messages: UIMessage[] = [
    {
      id: "user-message",
      role: "user",
      parts: [
        {
          type: "text",
          text: input,
        },
      ],
    },
  ];

  const body: ChatRequest = {
    messages,
    roomId: "3779c62e-7583-40c6-a0bb-6bbac841a531",
    accountId: "fb678396-a68f-4294-ae50-b8cacf9ce77b",
    artistId: "29cfd55a-98d9-45a5-96c9-c751a88f7799",
    model: DEFAULT_MODEL,
    excludeTools: [], // Don't exclude any tools - we want to test tool usage
  };

  const chatConfig = await setupChatRequest(body);
  return await generateText(chatConfig);
}

/**
 * Extract text from a GenerateTextResult
 */
export function extractTextFromResult(result: Awaited<ReturnType<typeof generateText>>): string {
  if (typeof result.text === "string") {
    return result.text;
  }

  if (typeof result.content === "string") {
    return result.content;
  }

  return String(result.text || result.content || "No response content");
}

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
