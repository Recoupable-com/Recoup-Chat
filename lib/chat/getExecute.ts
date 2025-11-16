import { UIMessageStreamWriter } from "ai";
import { ChatRequest } from "./types";
import { setupChatRequest } from "./setupChatRequest";
import { handleChatCredits } from "@/lib/credits/handleChatCredits";

type ExecuteOptions = {
  writer: UIMessageStreamWriter;
};

const getExecute = async (options: ExecuteOptions, body: ChatRequest) => {
  const { writer } = options;

  const chatConfig = await setupChatRequest(body);
  const { agent } = chatConfig;
  try {
    const result = await agent.stream(chatConfig);

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
