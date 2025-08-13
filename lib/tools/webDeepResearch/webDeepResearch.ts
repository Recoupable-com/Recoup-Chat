import { tool } from "ai";
import { z } from "zod";
import deepResearch from "./deepResearch";

const webDeepResearch = tool({
  description: "Deep research on a given query",
  inputSchema: z.object({
    prompt: z.string().min(1),
  }),
  execute: async ({ prompt }) => {
    const response = await deepResearch({ prompt });
    console.log("DEEP RESEARCH RESPONSE", response);
    return response;
  },
});
export default webDeepResearch;
