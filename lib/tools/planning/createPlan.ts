import { z } from "zod";
import { tool } from "ai";
import type { Plan } from "@/lib/agents/planningAgent/addTasksToPlan";
import { addTasksToPlan } from "@/lib/agents/planningAgent/addTasksToPlan";
import { getMcpTools } from "../getMcpTools";
import getGoogleSheetsTools from "@/lib/agents/googleSheetsAgent/getGoogleSheetsTools";
import { ChatRequest } from "@/lib/chat/types";

export async function createCreatePlanTool(plan: Plan, body: ChatRequest) {
  const schema = z.object({
    tasks: z.array(z.string()),
  });

  const description = `Create a plan for a given task. 
    Each task should be a single agent + action.
    
    General Agent
    - ${Object.keys(getMcpTools()).join(", ")}
    
    Google Sheets Agent
    - ${Object.keys(await getGoogleSheetsTools(body)).join(", ")}`;

  console.log("description", description);

  return tool({
    description,
    inputSchema: schema,
    execute: async ({ tasks }): Promise<string> => {
      addTasksToPlan(tasks, plan);
      return "Successfully created plan.";
    },
  });
}

const schema = z.object({
  tasks: z.array(z.string()),
});

const createPlan = tool({
  description: "Create a plan for a given task.",
  inputSchema: schema,
  execute: async (): Promise<string> => {
    return "Successfully created plan.";
  },
});

export default createPlan;
