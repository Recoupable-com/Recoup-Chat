import { z } from "zod";
import { tool } from "ai";

const schema = z.object({});

const executeTask = tool({
  description: "Execute a task - to be implemented",
  inputSchema: schema,
  execute: async (): Promise<unknown> => {
    return {};
  },
});

export default executeTask;
