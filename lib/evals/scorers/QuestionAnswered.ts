import { DEFAULT_MODEL } from "@/lib/consts";
import { generateObject } from "ai";
import { z } from "zod";

/**
 * Custom scorer that checks if the AI actually answered the customer's question
 * with a specific answer, or if it deflected/explained why it couldn't answer
 */
export const QuestionAnswered = async ({
  output,
  expected,
  input,
}: {
  output: string;
  expected?: string;
  input: string;
}) => {
  try {
    const result = await generateObject({
      model: DEFAULT_MODEL,
      system: `You are an AI evaluation expert. Your job is to determine if an AI assistant actually answered the customer's question with a specific answer, or if it deflected, explained why it couldn't answer, or gave generic suggestions without providing the requested information.

Instructions:
1. Read the customer's question carefully to understand what specific information they're asking for
2. Analyze the AI's response to see if it provides that specific information
3. Distinguish between:
   - ANSWERED: The AI provided the specific information requested (even if approximate or with caveats)
   - NOT ANSWERED: The AI explained why it can't answer, offered alternatives, or deflected without providing the core information
4. Consider partial answers where the AI provides some but not all requested information
5. Return your analysis with a score from 0-1 where:
   - 1.0 = Fully answered with specific information
   - 0.5-0.9 = Partially answered or answered with significant caveats
   - 0.0-0.4 = Did not answer, deflected, or only explained why it couldn't answer`,
      prompt: `Evaluate whether this AI response actually answered the customer's question:

CUSTOMER QUESTION:
${input}

AI RESPONSE:
${output}
${expected ? `\nEXPECTED ANSWER TYPE:\n${expected}` : ""}

Return your evaluation as JSON.`,
      schema: z.object({
        answered: z
          .boolean()
          .describe(
            "Did the AI provide the specific information requested in the question?"
          ),
        hasSpecificAnswer: z
          .boolean()
          .describe(
            "Does the response contain specific data/numbers/facts that directly address the question?"
          ),
        deflected: z
          .boolean()
          .describe(
            "Did the AI deflect by explaining why it can't answer or offering alternatives instead of answering?"
          ),
        score: z
          .number()
          .min(0)
          .max(1)
          .describe(
            "Score from 0-1 where 1=fully answered, 0.5-0.9=partially answered, 0-0.4=not answered"
          ),
        reasoning: z
          .string()
          .describe(
            "Detailed explanation of why the response did or did not answer the question"
          ),
        whatWasAsked: z
          .string()
          .describe("What specific information did the customer ask for?"),
        whatWasProvided: z
          .string()
          .describe("What information did the AI actually provide?"),
      }),
    });

    if (!result.object) {
      throw new Error("No response object received from AI model");
    }

    const score =
      typeof result.object.score === "number"
        ? Math.max(0, Math.min(1, result.object.score))
        : 0;

    return {
      name: "question_answered",
      score,
      metadata: {
        answered: result.object.answered,
        hasSpecificAnswer: result.object.hasSpecificAnswer,
        deflected: result.object.deflected,
        reasoning: result.object.reasoning,
        whatWasAsked: result.object.whatWasAsked,
        whatWasProvided: result.object.whatWasProvided,
      },
    };
  } catch (error) {
    console.error("Error in QuestionAnswered scorer:", error);
    return {
      name: "question_answered",
      score: 0,
      metadata: {
        error: "Failed to evaluate if question was answered",
        error_message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
};
