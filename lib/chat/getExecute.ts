import { streamText, UIMessageStreamWriter } from "ai";
import { ChatRequest } from "./types";
import { setupChatRequest } from "./setupChatRequest";
import { handleChatCredits } from "@/lib/credits/handleChatCredits";
import { getGoogleSheetsAgent } from "@/lib/agents/googleSheetsAgent/googleSheetsAgent";

type ExecuteOptions = {
  writer: UIMessageStreamWriter;
};

const getExecute = async (options: ExecuteOptions, body: ChatRequest) => {
  const { writer } = options;

  const chatConfig = await setupChatRequest(body);
  console.log("chatConfig agent", chatConfig.agent);

  try {
    let result;
    if (chatConfig.agent) {
      const googleSheetsAgent = await getGoogleSheetsAgent(body.accountId);
      result = await googleSheetsAgent.stream(chatConfig);
    } else {
      result = streamText(chatConfig);
    }

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
