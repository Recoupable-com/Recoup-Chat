import { stepCountIs, ToolLoopAgent } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";
import { ChatRequest, RoutingDecision } from "@/lib/chat/types";
import { extractImageUrlsFromMessages } from "@/lib/chat/extractImageUrlsFromMessages";
import { buildSystemPromptWithImages } from "@/lib/chat/buildSystemPromptWithImages";
import { getSystemPrompt } from "@/lib/prompts/getSystemPrompt";
import { setupToolsForRequest } from "@/lib/chat/setupToolsForRequest";
import { getGoogleSheetsTools } from "@/lib/agents/googleSheetsAgent";

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
    model: bodyModel,
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

  const isNanoBananaModel = bodyModel === "fal-ai/nano-banana/edit";
  const isDefaultModel = !bodyModel || isNanoBananaModel;

  // Build General Agent
  const recoupTools = setupToolsForRequest(excludeTools);
  const googleSheetsTools = await getGoogleSheetsTools(body);
  const tools = { ...recoupTools, ...googleSheetsTools };
  const model = isDefaultModel ? DEFAULT_MODEL : bodyModel;
  const stopWhen = stepCountIs(111);

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
