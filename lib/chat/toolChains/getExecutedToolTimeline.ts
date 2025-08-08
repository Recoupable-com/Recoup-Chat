import { StepResult } from "ai";
import { ToolSet } from "ai";

type ToolCallContent = {
  type: "tool-result";
  toolCallId: string;
  toolName: string;
  output: { type: "json"; value: unknown };
};

const getExecutedToolTimeline = (steps: StepResult<ToolSet>[]) => {
  const toolCallsContent = steps.flatMap(
    (step): ToolCallContent[] =>
      step.toolResults?.map((result) => ({
        type: "tool-result" as const,
        toolCallId: result.toolCallId || "",
        toolName: result.toolName,
        output: { type: "json" as const, value: result.output },
      })) || []
  );

  // Build timeline of executed tools from toolCallsContent
  return toolCallsContent.map((call) => call.toolName);
};

export default getExecutedToolTimeline;
