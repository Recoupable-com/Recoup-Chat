import { ToolsCalled } from "./scorers/ToolsCalled";

/**
 * Creates a scorer that checks if required tools were called.
 * Handles extracting output text and toolCalls from the task result.
 */
export const createToolsCalledScorer = (
  requiredTools: string[],
  penalizedTools: string[] = []
) => {
  return async (args: {
    output: unknown;
    expected?: string;
    input: string;
  }) => {
    // Extract output text and toolCalls
    const outputText =
      typeof args.output === "object" && args.output && "output" in args.output
        ? (args.output.output as string)
        : (args.output as string);

    const toolCalls =
      typeof args.output === "object" &&
      args.output &&
      "toolCalls" in args.output
        ? (args.output.toolCalls as Array<{
            toolName: string;
            args: Record<string, unknown>;
          }>)
        : undefined;

    return await ToolsCalled({
      output: outputText,
      input: args.input,
      expected: args.expected,
      toolCalls,
      requiredTools,
      penalizedTools,
    });
  };
};
