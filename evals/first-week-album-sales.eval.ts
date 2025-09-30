import { Eval } from "braintrust";
import { Factuality } from "autoevals";
import { callChatFunctions } from "@/lib/evals";

/**
 * Album Sales Tool Call Evaluation
 *
 * This evaluation tests whether your AI system properly uses tool calls
 * to fetch album sales data instead of defaulting to "I don't have access" responses.
 *
 * Run: npx braintrust eval evals/first-week-album-sales.eval.ts
 */

Eval("First Week Album Sales Evaluation", {
  data: () => [
    {
      input:
        "how many albums did Halsey The Great Impersonator sell the first week of release",
      expected:
        "Halsey's album 'The Great Impersonator' sold between 93,000 and 100,000 copies in its first week of release. It debuted at No. 2 on the Billboard 200 chart.",
      metadata: {
        artist: "Halsey",
        album: "The Great Impersonator",
        expected_tool_usage: true,
        data_type: "first_week_album_sales",
      },
    },
    {
      input:
        "what were the first week sales for Taylor Swift's Midnights album?",
      expected:
        "Taylor Swift's Midnights sold 1.578 million equivalent album units in its first week in the United States, which included between 1 million and 1.5 million pure album sales. This marked the biggest sales week for any album since Adele's 25 in 2015 and the best sales week for a vinyl album in the modern tracking era.",
      metadata: {
        artist: "Taylor Swift",
        album: "Midnights",
        expected_tool_usage: true,
        data_type: "first_week_album_sales",
      },
    },
    {
      input:
        "how many copies did Drake's Certified Lover Boy sell in the first week",
      expected:
        "Drake's 'Certified Lover Boy' sold approximately 613,000 album-equivalent units in its first week, securing the #1 spot on the Billboard 200 chart.",
      metadata: {
        artist: "Drake",
        album: "Certified Lover Boy",
        expected_tool_usage: true,
        data_type: "first_week_album_sales",
      },
    },
    {
      input:
        "what are the first week streaming numbers for Bad Bunny's Un Verano Sin Ti",
      expected:
        "In its first week of release in the United States, Bad Bunny's album Un Verano Sin Ti garnered over 355 million on-demand streams and 274,000 album-equivalent units, the most for any album that year and the largest streaming week for a Latin album ever at that time. The album also set a record for the biggest debut for a Latin album in Spotify's history.",
      metadata: {
        artist: "Bad Bunny",
        album: "Un Verano Sin Ti",
        expected_tool_usage: true,
        data_type: "first_week_streaming_numbers",
      },
    },
  ],

  task: async (input: string): Promise<string> => {
    try {
      const response = await callChatFunctions(input);
      return response;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : "Function call failed"}`;
    }
  },

  scores: [Factuality],
});
