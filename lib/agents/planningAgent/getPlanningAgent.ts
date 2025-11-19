import { stepCountIs, ToolLoopAgent } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";
import { ChatRequest, RoutingDecision } from "@/lib/chat/types";
import { getOutstandingTasks } from "./getOutstandingTasks";
import { renderPlan } from "./renderPlan";
import createPlan from "@/lib/tools/planning/createPlan";
import executeTask from "@/lib/tools/planning/executeTask";

export default async function getPlanningAgent(
  body: ChatRequest
): Promise<RoutingDecision> {
  const { model: bodyModel } = body;

  const plan: string[] = [];

  const model = bodyModel || DEFAULT_MODEL;
  const stopWhen = stepCountIs(111);
  const instructions = "You are a planning agent.";

  const planningAgent = new ToolLoopAgent({
    model,
    instructions,
    tools: { createPlan, executeTask }, // see implementation in reply!
    stopWhen,
    prepareStep: async () => {
      if (getOutstandingTasks(plan).length > 0) {
        return {
          activeTools: ["executeTask"],
          system: "Current todo list state\n\n" + renderPlan(plan),
          toolChoice: { toolName: "executeTask", type: "tool" },
        };
      }
      return undefined;
    },
  });

  return {
    agent: planningAgent as unknown as RoutingDecision["agent"],
    model,
    instructions,
    stopWhen,
  };
}
