import { stepCountIs, ToolLoopAgent, ToolSet, UIMessageStreamWriter } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";
import { ChatRequest, RoutingDecision } from "@/lib/chat/types";
import { getOutstandingTasks } from "./getOutstandingTasks";
import { renderPlan } from "./renderPlan";
import type { Plan } from "./addTasksToPlan";
import { createCreatePlanTool } from "@/lib/tools/planning/createPlan";
import { createExecuteTaskTool } from "@/lib/tools/planning/executeTask";

export default async function getPlanningAgent(
  body: ChatRequest,
  writer?: UIMessageStreamWriter
): Promise<RoutingDecision> {
  const { model: bodyModel } = body;

  const plan: Plan = [];

  const modelName = bodyModel || DEFAULT_MODEL;
  const stopWhen = stepCountIs(111);
  const instructions = "You are a planning agent.";

  const createPlan = createCreatePlanTool(plan);
  const executeTask = createExecuteTaskTool(plan, body, writer);

  const tools: ToolSet = { createPlan, executeTask };

  const planningAgent = new ToolLoopAgent({
    model: modelName,
    instructions,
    tools,
    stopWhen,
    prepareStep: async (options) => {
      if (getOutstandingTasks(plan).length > 0) {
        console.log("getOutstandingTasks", getOutstandingTasks(plan));
        console.log("renderPlan", renderPlan(plan));
        return {
          activeTools: ["executeTask"],
          system: "Current todo list state\n\n" + renderPlan(plan),
          toolChoice: { toolName: "executeTask", type: "tool" },
        };
      }
      return options;
    },
  });

  return {
    agent: planningAgent,
    model: modelName,
    instructions,
    stopWhen,
  };
}
