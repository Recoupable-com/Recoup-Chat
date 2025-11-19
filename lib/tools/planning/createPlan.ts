import { z } from "zod";
import { tool } from "ai";
import type { Plan } from "@/lib/agents/planningAgent/addTasksToPlan";
import { addTasksToPlan } from "@/lib/agents/planningAgent/addTasksToPlan";

export function createCreatePlanTool(plan: Plan) {
  const schema = z.object({
    tasks: z.array(z.string()),
  });

  return tool({
    description: "Create a plan for a given task.",
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
