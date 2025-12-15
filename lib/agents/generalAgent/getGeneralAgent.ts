import { stepCountIs, ToolLoopAgent } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";
import { RoutingDecision } from "@/lib/chat/types";
import { extractImageUrlsFromMessages } from "@/lib/chat/extractImageUrlsFromMessages";
import { buildSystemPromptWithImages } from "@/lib/chat/buildSystemPromptWithImages";
import { getSystemPrompt } from "@/lib/prompts/getSystemPrompt";
import { setupToolsForRequest } from "@/lib/chat/setupToolsForRequest";
import { ChatRequestBody } from "@/lib/chat/validateChatRequest";

export default async function getGeneralAgent(
  body: ChatRequestBody
): Promise<RoutingDecision> {
  const {
    accountId,
    messages,
    artistId,
    // email,
    // artistInstruction,
    // knowledgeBaseText,
    // timezone,
    model: bodyModel,
    // organizationId,
  } = body;
  const baseSystemPrompt = await getSystemPrompt({
    roomId: body.roomId,
    artistId,
    accountId,
    // email,
    // artistInstruction,
    // knowledgeBaseText,
    // timezone,
    // organizationId,
  });
  const imageUrls = extractImageUrlsFromMessages(messages);
  const instructions = buildSystemPromptWithImages(baseSystemPrompt, imageUrls);

  const isNanoBananaModel = bodyModel === "fal-ai/nano-banana/edit";
  const isDefaultModel = !bodyModel || isNanoBananaModel;

  // Build General Agent
  const tools = await setupToolsForRequest(body);
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
