import { Eval } from "braintrust";
import { AnswerSimilarity } from "autoevals";
import { callChatFunctions } from "@/lib/evals";
import { EVAL_ARTISTS } from "@/lib/consts";
import { getDynamicDates } from "@/lib/evals/getMonthlyListenersDates";

/**
 * Monthly Listeners Tracking Evaluation
 *
 * This evaluation tests whether Recoup properly sets up monthly listener reporting
 * for artists when users request tracking data between specific dates.
 *
 * Run: npx braintrust eval evals/monthly-listeners-tracking.eval.ts
 */
Eval("Monthly Listeners Tracking Evaluation", {
  data: () => {
    const { startDateFormatted, endDateFormatted } = getDynamicDates();

    const testCases = EVAL_ARTISTS.map((artist) => ({
      input: `what is the increase for ${artist} monthlies from ${startDateFormatted} to ${endDateFormatted}`,
      expected: `I've set up a monthlies tracking for ${artist}. would you like to receive the updated list in your email?`,
      metadata: {
        artist,
        start_date: startDateFormatted,
        end_date: endDateFormatted,
        expected_tool_usage: true,
        data_type: "monthly_listeners_tracking",
        tracking_setup: true,
      },
    }));

    return testCases;
  },

  task: async (input: string): Promise<string> => {
    try {
      const response = await callChatFunctions(input);
      return response;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : "Function call failed"}`;
    }
  },

  scores: [AnswerSimilarity],
});
