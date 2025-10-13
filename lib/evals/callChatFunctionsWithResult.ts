import { UIMessage } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";
import { setupChatRequest } from "@/lib/chat/setupChatRequest";
import { generateText } from "ai";
import { type ChatRequest } from "@/lib/chat/types";

/**
 * Call the chat functions and return the full result including tool calls from ALL steps.
 *
 * Note: result.toolCalls only contains calls from the LAST step. When using multi-step
 * tool chains, we need to collect toolCalls from result.steps to capture all tool usage.
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
  const result = await generateText(chatConfig);

  // Collect tool calls from ALL steps, not just the last one
  const allToolCalls =
    result.steps?.flatMap((step) => step.toolCalls || []) || result.toolCalls;

  // Return result with all tool calls from all steps
  return {
    ...result,
    toolCalls: allToolCalls,
  };
}
