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
  
  try {
    const result = streamText(chatConfig);
    writer.merge(result.toUIMessageStream());
    const usage = await result.usage;
    
    await handleChatCredits({
      usage,
      model: chatConfig.model,
      accountId: body.accountId,
    });
  } catch (error) {
    throw error;
  }
};

export default getExecute;
