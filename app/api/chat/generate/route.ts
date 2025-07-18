import { myProvider } from "@/lib/models";
import { generateText } from "ai";
import { NextRequest } from "next/server";
import generateUUID from "@/lib/generateUUID";
import { serializeError } from "@/lib/errors/serializeError";
import { sendErrorNotification } from "@/lib/telegram/errors/sendErrorNotification";
import {
  setupChatRequest,
  handleChatCompletion,
  createChatConfig,
  getCorsHeaders,
  type ChatRequest,
  ResponseMessages,
} from "@/lib/chat/sharedChatHandler";

// Handle OPTIONS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}

export async function POST(request: NextRequest) {
  const body: ChatRequest = await request.json();

  try {
    const selectedModelId = "sonnet-3.7";

    // Use shared setup function
    const setupResult = await setupChatRequest(body);

    // Use shared configuration for generateText
    const chatConfig = createChatConfig(
      setupResult,
      myProvider.languageModel(selectedModelId),
      generateUUID
    );

    // Use generateText instead of streamText for non-streaming response
    const result = await generateText(chatConfig);

    // Handle chat completion using shared function
    await handleChatCompletion(
      body,
      result.response.messages as ResponseMessages[]
    );

    // Return the complete response with all the data
    return new Response(
      JSON.stringify({
        text: result.text,
        reasoning: result.reasoning,
        sources: result.sources,
        finishReason: result.finishReason,
        usage: result.usage,
        response: {
          messages: result.response.messages,
          headers: result.response.headers,
          body: result.response.body,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...getCorsHeaders(),
        },
      }
    );
  } catch (e) {
    sendErrorNotification({
      ...body,
      error: serializeError(e),
      path: "/api/chat/generate",
    });
    console.error("Global error in chat generate API:", e);
    return new Response(JSON.stringify(serializeError(e)), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(),
      },
    });
  }
}
