import { z } from "zod";
import { tool } from "ai";

const TOOL_CHAIN_STEPS = [
  "generate_txt_file - of the deep research",
  "update_account_info - add the txt as a knowledge base for the artist",
];

const createKnowledgeBase = tool({
  description: `
  Adds a knowledge base file to the active artist by generating a text file and appending it to the list of existing knowledge bases.
  Follows this tool loop:
  <tool_loop>
  ${TOOL_CHAIN_STEPS.join("\n")}
  </tool_loop>

  Keep going until the job is completely solved before ending your turn.
  If you're unsure, use your tools, don't guess.
  Plan thoroughly before every tool call and reflect on the outcome after each tool call.
  `,
  inputSchema: z.object({
    knowledgeBaseText: z.string().describe("Text to add to the knowledge base"),
  }),
  execute: async ({ knowledgeBaseText }) => {
    return {
      success: true,
      knowledgeBaseText,
      nextSteps: TOOL_CHAIN_STEPS,
      message: "Follow the tool loop to create and store the knowledge base.",
    };
  },
});

export default createKnowledgeBase;
