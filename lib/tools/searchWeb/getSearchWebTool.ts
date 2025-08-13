import { z } from "zod";
import { tool } from "ai";
import performChatCompletion from "@/lib/perplexity/performChatCompletion";

const getSearchWebTool = (model: string = "sonar-pro") => {
  return tool({
    description:
      "Engages in a conversation using the Sonar API. " +
      "Accepts an array of messages (each with a role and content) " +
      "and returns a ask completion response from the Perplexity model.",
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
      // Invoke the chat completion function with the provided messages
      const result = await performChatCompletion(messages, model);
      return {
        content: [{ type: "text", text: result }],
        isError: false,
      };
    },
  });
};

export default getSearchWebTool;
