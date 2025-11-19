import { z } from "zod";
import { tool, convertToModelMessages } from "ai";
import type { Plan } from "@/lib/agents/planningAgent/addTasksToPlan";
import { getCurrentTask } from "@/lib/agents/planningAgent/getCurrentTask";
import { completeTask } from "@/lib/agents/planningAgent/completeTask";
import { getRoutingDecision } from "@/lib/agents/routingAgent";
import { ChatRequest } from "@/lib/chat/types";

export function createExecuteTaskTool(plan: Plan, body: ChatRequest) {
  const schema = z.object({});
  const { messages: inputMessages } = body;

  return tool({
    description: "Execute a task",
    inputSchema: schema,
    execute: async (): Promise<string> => {
      const currentTask = getCurrentTask(plan);
      if (!currentTask) {
        return "No outstanding tasks to execute.";
      }

      const { id } = currentTask;
      const messages = convertToModelMessages(inputMessages);

      const decision = await getRoutingDecision(body);
      console.log("decision", decision);

      const result = await decision.agent.generate({
        messages,
      });

      const output = {
        success: true,
        summary: result.text,
      };

      if (output.success) {
        completeTask(id, plan);
      }

      return output.summary;
    },
  });
}

const schema = z.object({});

const executeTask = tool({
  description: "Execute a task",
  inputSchema: schema,
  execute: async (): Promise<string> => {
    return "No outstanding tasks to execute.";
  },
});

export default executeTask;
