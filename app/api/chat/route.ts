// Ensure atob/btoa exist before any downstream imports that may rely on them
import "@/lib/polyfills/base64";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { NextRequest } from "next/server";
import { serializeError } from "@/lib/errors/serializeError";
import { sendErrorNotification } from "@/lib/telegram/errors/sendErrorNotification";
import { handleChatCompletion } from "@/lib/chat/handleChatCompletion";
import { getCorsHeaders } from "@/lib/chat/getCorsHeaders";
import generateUUID from "@/lib/generateUUID";
import getExecute from "@/lib/chat/getExecute";
import { validateChatRequest } from "@/lib/chat/validateChatRequest";

// Handle OPTIONS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}

export async function POST(request: NextRequest) {
  const validatedBodyOrError = await validateChatRequest(request);
  if (validatedBodyOrError instanceof Response) {
    return validatedBodyOrError;
  }
  const body = validatedBodyOrError;

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
        return JSON.stringify(serializeError(e));
      },
      onFinish: ({ messages }) => {
        void handleChatCompletion(body, messages).catch((e) => {
          console.error("Failed to handle chat completion:", e);
        });
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (e) {
    console.error("💬 /api/chat Global error:", e);
    sendErrorNotification({
      ...body,
      error: serializeError(e),
      path: "/api/chat",
    });
    return new Response(JSON.stringify(serializeError(e)), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(),
      },
    });
  }
}
