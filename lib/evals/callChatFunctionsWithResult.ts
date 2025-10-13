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

