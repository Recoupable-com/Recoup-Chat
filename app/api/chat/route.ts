import { myProvider } from "@/lib/models";
import { createDataStreamResponse, smoothStream, streamText } from "ai";
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

    return createDataStreamResponse({
      execute: (dataStream) => {
        const chatConfig = createChatConfig(
          setupResult,
          myProvider.languageModel(selectedModelId),
          generateUUID
        );

        const result = streamText({
          ...chatConfig,
          experimental_transform: smoothStream({ chunking: "word" }),
          onFinish: async ({ response }) => {
            await handleChatCompletion(
              body,
              response.messages as ResponseMessages[]
            );
          },
          experimental_telemetry: {
            isEnabled: true,
            functionId: "stream-text",
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: (e) => {
        sendErrorNotification({
          ...body,
          error: serializeError(e),
          path: "/api/chat",
        });
        console.error("Error in chat API:", e);
        return JSON.stringify(serializeError(e));
      },
      headers: getCorsHeaders(),
    });
  } catch (e) {
    sendErrorNotification({
      ...body,
      error: serializeError(e),
      path: "/api/chat",
    });
    console.error("Global error in chat API:", e);
    return new Response(JSON.stringify(serializeError(e)), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(),
      },
    });
  }
}
