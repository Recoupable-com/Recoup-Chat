import { generateText, UIMessage } from "ai";
import { NextRequest } from "next/server";
import { serializeError } from "@/lib/errors/serializeError";
import { sendErrorNotification } from "@/lib/telegram/errors/sendErrorNotification";
import { setupChatRequest } from "@/lib/chat/setupChatRequest";
import { handleChatCompletion } from "@/lib/chat/handleChatCompletion";
import { getCorsHeaders } from "@/lib/chat/getCorsHeaders";
import { type ChatRequest } from "@/lib/chat/types";
import generateUUID from "@/lib/generateUUID";
import { handleChatCredits } from "@/lib/credits/handleChatCredits";
import { validateHeaders } from "@/lib/chat/validateHeaders";

// Handle OPTIONS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}

export async function POST(request: NextRequest) {
  const body: ChatRequest = await request.json();

  // If auth headers are present, resolve accountId via GET /api/accounts/id
  const headerValidationResult = await validateHeaders(request);
  if (headerValidationResult instanceof Response) {
    return headerValidationResult;
  }
  if (headerValidationResult.accountId) {
    body.accountId = headerValidationResult.accountId;
  }

  try {
    const chatConfig = await setupChatRequest(body);
    const result = await generateText(chatConfig);
    await handleChatCredits({
      usage: result.usage,
      model: chatConfig.model,
      accountId: body.accountId,
    });
    const responseUIMessage = {
      id: generateUUID(),
      role: "assistant",
      parts: [
        {
          type: "text",
          text: result?.text || "",
        },
      ],
    } as UIMessage;
    await handleChatCompletion(body, [responseUIMessage]);
    return new Response(
      JSON.stringify({
        text: result.content,
        reasoningText: result.reasoningText,
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
