import { UIMessage } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";
import { setupChatRequest } from "@/lib/chat/setupChatRequest";
import { generateText } from "ai";
import { type ChatRequest } from "@/lib/chat/types";

/**
 * Call the chat functions directly instead of making HTTP requests
 * This function encapsulates the logic for calling the chat system
 * and can be reused across different evaluations.
 */
export async function callChatFunctions(input: string): Promise<string> {
  // Create the message structure expected by your chat system
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

  // Prepare the request body matching your ChatRequest type
  const body: ChatRequest = {
    messages,
    roomId: "3779c62e-7583-40c6-a0bb-6bbac841a531",
    accountId: "fb678396-a68f-4294-ae50-b8cacf9ce77b",
    artistId: "29cfd55a-98d9-45a5-96c9-c751a88f7799",
    model: DEFAULT_MODEL,
    excludeTools: [], // Don't exclude any tools - we want to test tool usage
  };

  try {
    // Use the same functions as your API endpoint
    const chatConfig = await setupChatRequest(body);
    const result = await generateText(chatConfig);

    // Return the text content from the result
    // Handle different possible response formats
    if (typeof result.text === "string") {
      return result.text;
    }

    // Try to extract text from content if available
    if (typeof result.content === "string") {
      return result.content;
    }

    // Fallback - convert result to string
    return String(result.text || result.content || "No response content");
  } catch (error) {
    console.error("Error calling chat functions:", error);
    throw error;
  }
}
