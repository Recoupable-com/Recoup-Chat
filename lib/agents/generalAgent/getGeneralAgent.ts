import { stepCountIs, ToolLoopAgent } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";
import { RoutingDecision } from "@/lib/chat/types";
import { extractImageUrlsFromMessages } from "@/lib/chat/extractImageUrlsFromMessages";
import { buildSystemPromptWithImages } from "@/lib/chat/buildSystemPromptWithImages";
import { getSystemPrompt } from "@/lib/prompts/getSystemPrompt";
import { setupToolsForRequest } from "@/lib/chat/setupToolsForRequest";
import { ChatRequestBody } from "@/lib/chat/validateChatRequest";
import { getAccountEmails } from "@/lib/supabase/account_emails/getAccountEmails";

export default async function getGeneralAgent(
  body: ChatRequestBody
): Promise<RoutingDecision> {
  const {
    accountId,
    messages,
    artistId,
    // artistInstruction,
    // knowledgeBaseText,
    model: bodyModel,
  } = body;

  // Fetch account email(s)
  let email: string | undefined;
  try {
    const accountEmails = await getAccountEmails(accountId);
    // Use the first email from the list
    email = accountEmails[0]?.email || undefined;
  } catch (error) {
    console.error("Error fetching account emails:", error);
    // Continue without email if fetch fails
  }

  const baseSystemPrompt = await getSystemPrompt({
    roomId: body.roomId,
    artistId,
    accountId,
    email,
    // artistInstruction,
    // knowledgeBaseText,
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
