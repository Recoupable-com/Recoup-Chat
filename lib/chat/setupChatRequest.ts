import generateUUID from "@/lib/generateUUID";
import { convertToModelMessages, stepCountIs, type ToolSet } from "ai";
import { MAX_MESSAGES } from "./const";
import { type ChatRequest, type ChatConfig } from "./types";
import { DEFAULT_MODEL } from "../consts";

export async function setupChatRequest(body: ChatRequest): Promise<ChatConfig> {
  // EXPERIMENTAL: Bypass async pre-stream work (DB/fetch/tool loading)
  const { model } = body;

  // Minimal system prompt to avoid DB and remote fetches
  const system = "Recoup assistant";

  // Convert UI messages without attaching external files or fetching metadata
  const messages = convertToModelMessages(body.messages).slice(-MAX_MESSAGES);

  // Empty toolset to avoid heavy imports and dynamic wiring
  const tools: ToolSet = {};

  return {
    model: model || DEFAULT_MODEL,
    system,
    messages,
    experimental_generateMessageId: generateUUID,
    tools,
    stopWhen: stepCountIs(111),
  };
}
