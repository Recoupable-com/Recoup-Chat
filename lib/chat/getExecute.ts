import { streamText, UIMessageStreamWriter } from "ai";
import { ChatRequest } from "./types";
import { setupChatRequest } from "./setupChatRequest";
import { handleChatCredits } from "./handleChatCredits";

type ExecuteOptions = {
  writer: UIMessageStreamWriter;
};

const getExecute = async (options: ExecuteOptions, body: ChatRequest) => {
  const { writer } = options;
  const chatConfig = await setupChatRequest(body);
  
  // DEBUG: Log nano banana model execution
  if (body.model === "google/gemini-2.5-flash-image-preview") {
    console.log("🍌 NANO BANANA EXECUTE: About to call streamText");
    console.log("🍌 Final chat config:", {
      model: chatConfig.model,
      messageCount: chatConfig.messages.length,
      systemPromptLength: chatConfig.system?.length,
      toolCount: Object.keys(chatConfig.tools || {}).length
    });
  }
  
  try {
    const result = streamText(chatConfig);
    writer.merge(result.toUIMessageStream());
    const usage = await result.usage;
    
    // DEBUG: Log successful completion for nano banana
    if (body.model === "google/gemini-2.5-flash-image-preview") {
      console.log("🍌 NANO BANANA SUCCESS: Stream completed", { usage });
    }
    
    await handleChatCredits({
      usage,
      model: chatConfig.model,
      accountId: body.accountId,
    });
  } catch (error) {
    // DEBUG: Log execution errors for nano banana
    if (body.model === "google/gemini-2.5-flash-image-preview") {
      console.error("🍌 NANO BANANA EXECUTE ERROR:", {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
    }
    throw error;
  }
};

export default getExecute;
