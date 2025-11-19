import { z } from "zod";
import { tool, convertToModelMessages, UIMessageStreamWriter } from "ai";
import type { Plan } from "@/lib/agents/planningAgent/addTasksToPlan";
import { getCurrentTask } from "@/lib/agents/planningAgent/getCurrentTask";
import { completeTask } from "@/lib/agents/planningAgent/completeTask";
import { getRoutingDecision } from "@/lib/agents/routingAgent";
import { ChatRequest } from "@/lib/chat/types";

export function createExecuteTaskTool(
  plan: Plan,
  body: ChatRequest,
  writer?: UIMessageStreamWriter
) {
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

      let summary: string = "";
      if (writer) {
        const result = await decision.agent.stream({
          messages,
        });
        writer.merge(result.toUIMessageStream());
        summary = await result.text;
        const toolResults = await result.toolResults;
        console.log("toolResults.output", toolResults[0]?.output);
        console.log(
          "stringified toolResults.output",
          JSON.stringify(toolResults[0]?.output, null, 2)
        );
        summary += JSON.stringify(toolResults[0]?.output, null, 2);
      } else {
        const result = await decision.agent.generate({
          messages,
        });
        summary = result.text;
      }

      const output = {
        success: true,
        summary,
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
