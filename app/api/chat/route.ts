// Ensure atob/btoa exist before any downstream imports that may rely on them
import "@/lib/polyfills/base64";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { NextRequest } from "next/server";
import { serializeError } from "@/lib/errors/serializeError";
import { sendErrorNotification } from "@/lib/telegram/errors/sendErrorNotification";
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

  try {
    const stream = createUIMessageStream({
      originalMessages: body.messages,
      generateId: generateUUID,
      execute: async (options) => await getExecute(options, body),
      onError: (e) => {
        sendErrorNotification({
          ...body,
          error: serializeError(e),
          path: "/api/chat",
        });
        console.error("Error in chat API:", e);
        return JSON.stringify(serializeError(e));
      },
      // onFinish: async ({ messages }) => {
      //   await handleChatCompletion(body, messages);
      // },
    });

    return createUIMessageStreamResponse({ stream });
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
