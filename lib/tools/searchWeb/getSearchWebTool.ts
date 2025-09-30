import { z } from "zod";
import { tool } from "ai";
import performChatCompletion from "@/lib/perplexity/performChatCompletion";

const getSearchWebTool = (model: string = "sonar-pro") => {
  return tool({
    description:
      "DEFAULT TOOL: Use this tool FIRST for any information you're unsure about. " +
      "NEVER respond with 'I can't find X', 'I don't have access to X', or 'I do not know X'. " +
      "This tool searches the web for real-time information and should be your go-to resource. " +
      "Accepts an array of messages (each with a role and content) and returns comprehensive search results from the Web Search model.",
    inputSchema: z.object({
      messages: z.array(
        z.object({
          role: z.string(),
          content: z.string(),
        })
      ),
    }),
    execute: async ({ messages }) => {
      if (!Array.isArray(messages)) {
        throw new Error(
          "Invalid arguments for search_web: 'messages' must be an array"
        );
      }
      const result = await performChatCompletion(messages, model);
      return {
        content: [{ type: "text", text: result }],
        isError: false,
      };
    },
  });
};

export default getSearchWebTool;
