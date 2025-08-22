import { z } from "zod";
import { tool } from "ai";



const createKnowledgeBase = tool({
  description: `
  Adds a knowledge base file to the active artist by generating a text file and appending it to the list of existing knowledge bases.
  `,
  inputSchema: z.object({
    knowledgeBaseText: z.string().describe("Text to add to the knowledge base"),
  }),
  execute: async ({ knowledgeBaseText }) => {
    return {
      success: true,
      knowledgeBaseText,
      message: "Knowledge base text prepared for creation and storage.",
    };
  },
});

export default createKnowledgeBase;
