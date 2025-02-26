import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import validateEnvironment from "./validateEnvironment";
import type { AgentOptions, AgentResponse } from "./types";
import { AI_MODEL, DESCRIPTION } from "../consts";
import { getSegmentFansTool } from "../tools/getSegmentFans";

/**
 * Initialize the agent with LangGraph
 * @param options Configuration options for the agent
 * @returns Agent executor and config
 */
async function initializeAgent(
  options: AgentOptions = {}
): Promise<AgentResponse> {
  try {
    validateEnvironment();

    const llm = new ChatOpenAI({
      modelName: AI_MODEL,
    });

    const memory = new MemorySaver();

    // Only include getSegmentFansTool if segmentId is provided
    const defaultTools = options.segmentId ? [getSegmentFansTool] : [];
    const tools = options.tools
      ? [...defaultTools, ...options.tools]
      : defaultTools;

    const agent = createReactAgent({
      llm,
      tools,
      messageModifier: DESCRIPTION,
      checkpointSaver: memory,
    });

    return { agent };
  } catch (error) {
    console.error("[Agent] Failed to initialize agent:", {
      error,
      options,
      model: AI_MODEL,
      threadId: options.threadId,
    });
    throw error;
  }
}

export default initializeAgent;
