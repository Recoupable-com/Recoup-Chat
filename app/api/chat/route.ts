// Ensure atob/btoa exist before any downstream imports that may rely on them
import "@/lib/polyfills/base64";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { NextRequest } from "next/server";
import { serializeError } from "@/lib/errors/serializeError";
import { sendErrorNotification } from "@/lib/telegram/errors/sendErrorNotification";
import { handleChatCompletion } from "@/lib/chat/handleChatCompletion";
import { getCorsHeaders } from "@/lib/chat/getCorsHeaders";
import { type ChatRequest } from "@/lib/chat/types";
import generateUUID from "@/lib/generateUUID";
import getExecute from "@/lib/chat/getExecute";

// Handle OPTIONS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}

export async function POST(request: NextRequest) {
  const body: ChatRequest = await request.json();
  
  console.log("💬 /api/chat POST - Model:", body.model, "Messages:", body.messages.length);

  try {
    const stream = createUIMessageStream({
      originalMessages: body.messages,
      generateId: generateUUID,
      execute: async (options) => await getExecute(options, body),
      onError: (e) => {
        console.error("💬 /api/chat onError:", e);
        sendErrorNotification({
          ...body,
          error: serializeError(e),
          path: "/api/chat",
        });
        console.error("Error in chat API:", e);
        return JSON.stringify(serializeError(e));
      },
      onFinish: ({ messages }) => {
        console.log("💬 /api/chat onFinish - Messages:", messages.length);
        void handleChatCompletion(body, messages).catch((e) => {
          console.error("Failed to handle chat completion:", e);
        });
      },
    });

    console.log("💬 /api/chat - Returning stream response");
    return createUIMessageStreamResponse({ stream });
  } catch (e) {
    console.error("💬 /api/chat Global error:", e);
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
