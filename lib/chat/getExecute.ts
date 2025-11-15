import { streamText, UIMessageStreamWriter } from "ai";
import { ChatRequest } from "./types";
import { setupChatRequest } from "./setupChatRequest";
import { handleChatCredits } from "@/lib/credits/handleChatCredits";
import { getRoutingDecision } from "./getRoutingDecision";

type ExecuteOptions = {
  writer: UIMessageStreamWriter;
};

const getExecute = async (options: ExecuteOptions, body: ChatRequest) => {
  const { writer } = options;
  console.log("🚀 getExecute START - Model:", body.model);

  // Send routing status to UI immediately (transient - won't be in message history)
  writer.write({
    type: "data-routing-status",
    data: {
      status: "analyzing",
      message: "Determining optimal model...",
    },
    transient: true,
  });

  // Fast routing decision (non-blocking, uses lightweight model)
  const routingDecision = await getRoutingDecision(body);
  console.log("🚀 getExecute - Routing decision:", routingDecision);

  // Update UI with routing result (transient)
  writer.write({
    type: "data-routing-status",
    data: {
      status: "complete",
      message:
        routingDecision.reason === "user-selected"
          ? "Using selected model"
          : routingDecision.model
            ? `Routing to ${routingDecision.model}`
            : "Using default model",
      model: routingDecision.model,
      reason: routingDecision.reason,
    },
    transient: true,
  });

  // Apply routing decision to request
  const routedBody: ChatRequest = {
    ...body,
    model: routingDecision.model || body.model,
    excludeTools: routingDecision.excludeTools
      ? [...(body.excludeTools || []), ...routingDecision.excludeTools]
      : body.excludeTools,
  };

  const chatConfig = await setupChatRequest(routedBody);
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
