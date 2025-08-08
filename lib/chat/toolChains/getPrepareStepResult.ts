import { LanguageModel, ModelMessage, StepResult, ToolSet } from "ai";
import { PrepareStepResult, TOOL_CHAINS, TOOL_MODEL_MAP } from "./toolChains";
import getExecutedToolTimeline from "./getExecutedToolTimeline";

type PrepareStepOptions = {
  steps: Array<StepResult<NoInfer<ToolSet>>>;
  stepNumber: number;
  model: LanguageModel;
  messages: Array<ModelMessage>;
};

/**
 * Returns the next tool to run based on timeline progression through tool chains.
 * Uses toolCallsContent to track exact execution order and position in sequence.
 */
const getPrepareStepResult = (
  options: PrepareStepOptions
): PrepareStepResult | undefined => {
  const { steps } = options;
  // Extract tool calls timeline (history) from steps
  const executedTimeline = getExecutedToolTimeline(steps);

  for (const [trigger, sequenceAfter] of Object.entries(TOOL_CHAINS)) {
    // Check if this chain has been triggered
    const triggerIndex = executedTimeline.indexOf(trigger);
    if (triggerIndex === -1) continue; // Chain not started

    const fullSequence = [{ toolName: trigger }, ...sequenceAfter];

    // Find our current position in the sequence by matching timeline
    let sequencePosition = 0;
    let timelinePosition = triggerIndex;

    // Walk through the timeline starting from trigger
    while (
      timelinePosition < executedTimeline.length &&
      sequencePosition < fullSequence.length
    ) {
      const currentTool = executedTimeline[timelinePosition];
      const expectedTool = fullSequence[sequencePosition].toolName;

      if (currentTool === expectedTool) {
        sequencePosition++;
      }
      timelinePosition++;
    }

    // Return next tool in sequence if available
    if (sequencePosition < fullSequence.length) {
      const nextToolItem = fullSequence[sequencePosition];
      const result: PrepareStepResult = {
        toolChoice: { type: "tool", toolName: nextToolItem.toolName },
      };

      // Add system prompt if available
      if (nextToolItem.system) {
        result.system = nextToolItem.system;
      }

      // Add messages if available
      if (nextToolItem.messages) {
        result.messages = options.messages.concat(nextToolItem.messages);
      }

      // Add model if specified for this tool
      const model = TOOL_MODEL_MAP[nextToolItem.toolName];
      if (model) {
        result.model = model;
      }

      return result;
    }
  }

  return undefined;
};

export default getPrepareStepResult;
