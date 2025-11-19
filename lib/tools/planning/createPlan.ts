import { z } from "zod";
import { tool } from "ai";

const schema = z.object({});

const createPlan = tool({
  description: "Create a plan - to be implemented",
  inputSchema: schema,
  execute: async (): Promise<unknown> => {
    return {};
  },
});

export default createPlan;
