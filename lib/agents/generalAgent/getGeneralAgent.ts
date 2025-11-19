import { stepCountIs, ToolLoopAgent } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";
import { ChatRequest, RoutingDecision } from "@/lib/chat/types";
import { extractImageUrlsFromMessages } from "@/lib/chat/extractImageUrlsFromMessages";
import { buildSystemPromptWithImages } from "@/lib/chat/buildSystemPromptWithImages";
import { getSystemPrompt } from "@/lib/prompts/getSystemPrompt";
import { setupToolsForRequest } from "@/lib/chat/setupToolsForRequest";
import { handleNanoBananaModel } from "@/lib/chat/handleNanoBananaModel";

export default async function getGeneralAgent(
  body: ChatRequest
): Promise<RoutingDecision> {
  const {
    accountId,
    messages,
    artistId,
    email,
    artistInstruction,
    knowledgeBaseText,
    timezone,
    excludeTools,
  } = body;
  const baseSystemPrompt = await getSystemPrompt({
    roomId: body.roomId,
    artistId,
    accountId,
    email,
    artistInstruction,
    knowledgeBaseText,
    timezone,
  });
  const imageUrls = extractImageUrlsFromMessages(messages);
  const instructions = buildSystemPromptWithImages(baseSystemPrompt, imageUrls);

  // Handle nano banana specific logic
  const nanoBananaConfig = handleNanoBananaModel(body);

  const finalExcludeTools = nanoBananaConfig.excludeTools || excludeTools;

  // Build General Agent
  const tools = setupToolsForRequest(finalExcludeTools);
  const model = nanoBananaConfig.resolvedModel || DEFAULT_MODEL;
  const stopWhen = stepCountIs(1);

  const agent = new ToolLoopAgent({
    model,
    instructions,
    tools,
    stopWhen,
  });

  return {
    agent,
    model,
    instructions,
    stopWhen,
  };
}
