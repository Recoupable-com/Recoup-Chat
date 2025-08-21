import { streamText, UIMessageStreamWriter } from "ai";
import { getCreditUsage } from "../ai/getCreditUsage";
import { deductCredits } from "../credits/deductCredits";
import { ChatRequest } from "./types";
import { setupChatRequest } from "./setupChatRequest";

type ExecuteOptions = {
  writer: UIMessageStreamWriter;
};

const getExecute = async (options: ExecuteOptions, body: ChatRequest) => {
  const { writer } = options;
  const chatConfig = await setupChatRequest(body);
  const result = streamText(chatConfig);
  writer.merge(result.toUIMessageStream());
  const usage = await result.usage;
  const usageCost = await getCreditUsage(usage, chatConfig.model);
  if (body.accountId) {
    const creditsToDeduct = Math.max(1, Math.round(usageCost * 100));
    await deductCredits({
      accountId: body.accountId,
      creditsToDeduct,
    });
  }
};

export default getExecute;
