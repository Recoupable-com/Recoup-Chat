import { streamText, UIMessageStreamWriter } from "ai";
import { ChatRequest } from "./types";
import { setupChatRequest } from "./setupChatRequest";
import { handleChatCredits } from "@/lib/credits/handleChatCredits";

type ExecuteOptions = {
  writer: UIMessageStreamWriter;
};

const getExecute = async (options: ExecuteOptions, body: ChatRequest) => {
  const { writer } = options;
  console.log("🚀 getExecute START - Model:", body.model);

  const chatConfig = await setupChatRequest(body);
  console.log("🚀 getExecute - Chat config ready, model:", chatConfig.model);

  try {
    const result = streamText(chatConfig);
    console.log("🚀 getExecute - Starting stream...");
    writer.merge(result.toUIMessageStream());
    const usage = await result.usage;
    console.log("🚀 getExecute - Stream complete, usage:", usage);

    await handleChatCredits({
      usage,
      model: chatConfig.model,
      accountId: body.accountId,
    });
    console.log("🚀 getExecute - Credits handled");
  } catch (error) {
    console.error("🚀 getExecute ERROR:", error);
    throw error;
  }
};

export default getExecute;
