import { ToolLoopAgent, Output, stepCountIs } from "ai";
import { z } from "zod";
import { FAST_MODEL } from "@/lib/consts";

const RoutingDecisionSchema = z.object({
  agent: z.enum(["googleSheetsAgent", "generalAgent"]).optional(),
  reason: z.string().optional(),
});

export type RoutingDecision = z.infer<typeof RoutingDecisionSchema>;

/**
 * Fast routing agent that determines which specialized agent should handle the request.
 * Configured for single-step execution to minimize latency.
 */
export const routingAgent = new ToolLoopAgent({
  model: FAST_MODEL,
  instructions: `You are a fast routing agent that determines which specialized agent should handle customer messages.`,
  output: Output.object({
    schema: RoutingDecisionSchema,
  }),
  stopWhen: stepCountIs(1), // Single step for speed
});
