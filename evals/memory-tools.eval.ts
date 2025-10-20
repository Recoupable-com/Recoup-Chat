import { Eval } from "braintrust";
import {
  callChatFunctionsWithResult,
  extractTextFromResult,
  createToolsCalledScorer,
} from "@/lib/evals";

/**
 * Memory & Storage Tools Evaluation
 *
 * This evaluation tests whether the AI properly uses memory/storage tools when
 * asked to save information. The AI should:
 * 1. Use write_file to save to artist's file storage
 * 2. Use create_knowledge_base to save to artist's knowledge base
 * 3. NOT just use generate_txt_file (which doesn't persist properly)
 * 4. Keep saved content concise with high signal, low noise
 *
 * Test cases:
 * - "Can I save all this info somewhere?" - Should use write_file or create_knowledge_base
 *
 * Required Tools: write_file, create_knowledge_base
 * Penalized Tools: generate_txt_file (when used alone without write_file)
 *
 * Run: npx braintrust eval evals/memory-tools.eval.ts
 */

const REQUIRED_TOOLS = ["write_file", "create_knowledge_base"];

const PENALIZED_TOOLS = ["generate_txt_file"];

Eval("Memory & Storage Tools Evaluation", {
  data: () => [
    {
      input: "Can I save all this info somewhere?",
      expected:
        "Confirmation that info was saved using write_file or create_knowledge_base (not just generate_txt_file)",
      metadata: {
        artist: "Unknown",
        platform: "n/a",
        request_type: "save_information",
        expected_tool_usage: true,
        requiredTools: REQUIRED_TOOLS,
        penalizedTools: PENALIZED_TOOLS,
      },
    },
  ],

  task: async (input: string) => {
    try {
      const result = await callChatFunctionsWithResult(input);
      const output = extractTextFromResult(result);
      const toolCalls =
        result.toolCalls?.map((tc) => ({
          toolName: tc.toolName,
          args: {},
        })) || [];

      return { output, toolCalls };
    } catch (error) {
      return {
        output: `Error: ${error instanceof Error ? error.message : "Function call failed"}`,
        toolCalls: [],
      };
    }
  },

  scores: [createToolsCalledScorer(REQUIRED_TOOLS, PENALIZED_TOOLS)],
});
