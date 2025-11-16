import { UIMessageStreamWriter, type ToolSet } from "ai";
import { ChatRequest, ChatConfig } from "./types";
import { setupChatRequest } from "./setupChatRequest";
import { handleChatCredits } from "@/lib/credits/handleChatCredits";
import { z } from "zod";
import { getRoutingDecision } from "@/lib/agents/routingAgent";
import getGeneralAgent from "@/lib/agents/generalAgent/getGeneralAgent";
import getGoogleSheetsAgent from "@/lib/agents/googleSheetsAgent/getGoogleSheetsAgent";

type ExecuteOptions = {
  writer: UIMessageStreamWriter;
};

const MAX_AGENT_STEPS = 12;

const getExecute = async (options: ExecuteOptions, body: ChatRequest) => {
  const { writer } = options;

  // Initial configuration (router selects first agent)
  const chatConfig = await setupChatRequest(body);
  let currentDecision: ChatConfig = chatConfig; // contains agent, model, instructions, stopWhen, messages, tools, etc.

  try {
    for (let step = 0; step < MAX_AGENT_STEPS; step++) {
      // Inject routing tools alongside the agent's tools
      const toolsWithRouting = {
        ...currentDecision.tools,
        route_to: {
          description:
            "Switch the active agent immediately. Use when another agent is more appropriate for the next operation.",
          inputSchema: z.object({
            agent: z.enum(["generalAgent", "googleSheetsAgent"]),
            reason: z.string().optional(),
          }),
          execute: async ({
            agent,
          }: {
            agent: "generalAgent" | "googleSheetsAgent";
          }) => {
            const next =
              agent === "googleSheetsAgent"
                ? await getGoogleSheetsAgent(body)
                : await getGeneralAgent(body);
            const nextTools = next.agent.tools;
            currentDecision = {
              ...currentDecision,
              ...next,
              tools: {
                ...nextTools,
                // TODO: SRP for route_to tool
                route_to: toolsWithRouting.route_to,
              },
            } as ChatConfig;
            return { success: true };
          },
        },
        reconsider_routing: {
          description:
            "Ask the router to pick the next agent based on the current objective.",
          inputSchema: z.object({
            objective: z.string().optional(),
          }),
          execute: async () => {
            const routing = await getRoutingDecision(body);
            const nextTools = routing.agent?.tools;
            currentDecision = {
              ...currentDecision,
              ...routing,
              tools: {
                ...nextTools,
                route_to: toolsWithRouting.route_to,
                reconsider_routing: (toolsWithRouting as ToolSet)
                  .reconsider_routing,
              },
            } as ChatConfig;
            return { success: true };
          },
        },
      };

      const stepConfig: ChatConfig = {
        ...currentDecision,
        tools: toolsWithRouting,
      };

      const result = await currentDecision.agent.stream(stepConfig);

      writer.merge(result.toUIMessageStream());

      // If the agent signals completion and no routing change was requested, stop
      const done = await (result as unknown as { done?: boolean }).done;
      if (done) {
        const usage = await result.usage;
        await handleChatCredits({
          usage,
          model: currentDecision.model,
          accountId: body.accountId,
        });
        return;
      }

      // If not done, loop to allow tool-driven routing changes and more steps
    }

    // Safety: finalize usage after loop if available
    console.log("🚀 getExecute - Reached max steps without done signal");
  } catch (error) {
    console.error("🚀 getExecute ERROR:", error);
    throw error;
  }
};

export default getExecute;
