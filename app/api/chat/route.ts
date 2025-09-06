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

  // DEBUG: Log nano banana model requests with attachments
  if (body.model === "google/gemini-2.5-flash-image-preview") {
    console.log("🍌 NANO BANANA DEBUG: Chat request received");
    console.log("🍌 Model:", body.model);
    console.log("🍌 Messages count:", body.messages?.length);
    
    const hasImageAttachments = body.messages?.some(msg => 
      msg.parts?.some(part => part.type === "file" && part.mediaType?.startsWith("image"))
    );
    console.log("🍌 Has image attachments:", hasImageAttachments);
    
    if (hasImageAttachments) {
      console.log("🍌 Image attachment details:");
      body.messages?.forEach((msg, idx) => {
        msg.parts?.forEach((part, partIdx) => {
          if (part.type === "file" && part.mediaType?.startsWith("image")) {
            console.log(`🍌   Message ${idx}, Part ${partIdx}:`, {
              type: part.type,
              mediaType: part.mediaType,
              url: part.url?.substring(0, 100) + "...",
              filename: part.filename
            });
          }
        });
      });
    }
  }

  try {
    const stream = createUIMessageStream({
      originalMessages: body.messages,
      generateId: generateUUID,
      execute: async (options) => await getExecute(options, body),
      onError: (e) => {
        // DEBUG: Enhanced error logging for nano banana model
        if (body.model === "google/gemini-2.5-flash-image-preview") {
          console.error("🍌 NANO BANANA ERROR in chat stream:", {
            error: e.message,
            stack: e.stack,
            model: body.model,
            hasImages: body.messages?.some(msg => 
              msg.parts?.some(part => part.type === "file" && part.mediaType?.startsWith("image"))
            )
          });
        }
        
        sendErrorNotification({
          ...body,
          error: serializeError(e),
          path: "/api/chat",
        });
        console.error("Error in chat API:", e);
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
