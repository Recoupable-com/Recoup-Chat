import { createDataStreamResponse, smoothStream, streamText } from "ai";
import { NextRequest } from "next/server";
import { serializeError } from "@/lib/errors/serializeError";
import { sendErrorNotification } from "@/lib/telegram/errors/sendErrorNotification";
import { setupChatRequest } from "@/lib/chat/setupChatRequest";
import { handleChatCompletion } from "@/lib/chat/handleChatCompletion";
import { getCorsHeaders } from "@/lib/chat/getCorsHeaders";
import { type ChatRequest, type ResponseMessages } from "@/lib/chat/types";

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
    const chatConfig = await setupChatRequest(body);

    return createDataStreamResponse({
      execute: (dataStream) => {
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
