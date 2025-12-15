import { stepCountIs, ToolLoopAgent } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";
import { RoutingDecision } from "@/lib/chat/types";
import { extractImageUrlsFromMessages } from "@/lib/chat/extractImageUrlsFromMessages";
import { buildSystemPromptWithImages } from "@/lib/chat/buildSystemPromptWithImages";
import { getSystemPrompt } from "@/lib/prompts/getSystemPrompt";
import { setupToolsForRequest } from "@/lib/chat/setupToolsForRequest";
import { ChatRequestBody } from "@/lib/chat/validateChatRequest";
import { getAccountEmails } from "@/lib/supabase/account_emails/getAccountEmails";
import getAccountInfoById from "@/lib/supabase/account_info/getAccountInfoById";

export default async function getGeneralAgent(
  body: ChatRequestBody
): Promise<RoutingDecision> {
  const {
    accountId,
    messages,
    artistId,
    // knowledgeBaseText,
    model: bodyModel,
  } = body;

  // Fetch account email(s)
  const accountEmails = await getAccountEmails(accountId);
  // Use the first email from the list
  const email = accountEmails[0]?.email || undefined;

  // Fetch artist instruction and knowledge base if artistId is provided
  let artistInstruction: string | undefined;
  let knowledgeBaseText: string | undefined;
  if (artistId) {
    const artistAccountInfo = await getAccountInfoById(artistId);
    artistInstruction = artistAccountInfo?.instruction || undefined;

    // Process knowledge base files from account_info
    const knowledges = artistAccountInfo?.knowledges;
    if (knowledges && Array.isArray(knowledges) && knowledges.length > 0) {
      const textTypes = new Set([
        "text/plain",
        "text/markdown",
        "application/json",
        "text/csv",
      ]);
      const knowledgeFiles = knowledges as Array<{
        name?: string;
        url?: string;
        type?: string;
      }>;
      const texts = await Promise.all(
        knowledgeFiles
          .filter((f) => f.type && textTypes.has(f.type) && f.url)
          .map(async (f) => {
            try {
              const res = await fetch(f.url!);
              if (!res.ok) return "";
              const content = await res.text();
              return `--- ${f.name || "Unknown"} ---\n${content}`;
            } catch {
              return "";
            }
          })
      );
      const combinedText = texts.filter(Boolean).join("\n\n");
      if (combinedText) {
        knowledgeBaseText = combinedText;
      }
    }
  }

  const baseSystemPrompt = await getSystemPrompt({
    roomId: body.roomId,
    artistId,
    accountId,
    email,
    artistInstruction,
    knowledgeBaseText,
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
