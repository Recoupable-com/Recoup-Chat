import { Eval } from "braintrust";
import { Factuality } from "autoevals";
import { UIMessage } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";
import { setupChatRequest } from "@/lib/chat/setupChatRequest";
import { generateText } from "ai";
import { type ChatRequest } from "@/lib/chat/types";

/**
 * Album Sales Tool Call Evaluation
 *
 * This evaluation tests whether your AI system properly uses tool calls
 * to fetch album sales data instead of defaulting to "I don't have access" responses.
 *
 * This evaluation calls the chat functions directly (setupChatRequest + generateText)
 * instead of making HTTP requests, making it faster and more reliable.
 *
 * Run: npx braintrust eval evals/album-sales-tool-call.eval.ts
 */

// Note: The Factuality scorer from autoevals uses GPT-4o by default
// To use GPT-5-mini, set the OPENAI_MODEL environment variable:
// export OPENAI_MODEL=gpt-5-mini
// Then run: npx braintrust eval evals/album-sales-tool-call.eval.ts

Eval("Album Sales Tool Call Evaluation", {
  data: () => [
    {
      input:
        "how many albums did Halsey The Great Impersonator sell the first week of release",
      expected:
        "Based on available data, Halsey's 'The Great Impersonator' sold approximately 100,000 copies in its first week of release, debuting at #2 on the Billboard 200 chart.",
      metadata: {
        artist: "Halsey",
        album: "The Great Impersonator",
        expected_tool_usage: true,
        data_type: "first_week_sales",
      },
    },
    {
      input:
        "what were the first week sales for Taylor Swift's Midnights album",
      expected:
        "Taylor Swift's Midnights sold 1.578 million equivalent album units in its first week in the United States, which included 1.14 million pure album sales (vinyl, CD, and cassette) and 439.03 million streams. This marked the biggest sales week for any album since Adele's 25 in 2015 and the best sales week for a vinyl album in the modern tracking era.",
      metadata: {
        artist: "Taylor Swift",
        album: "Midnights",
        expected_tool_usage: true,
        data_type: "first_week_sales",
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
        data_type: "first_week_sales",
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
        data_type: "streaming_numbers",
      },
    },
  ],

  task: async (input: string): Promise<string> => {
    try {
      // Call the chat functions directly instead of making HTTP requests
      const response = await callChatFunctions(input);
      return response;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : "Function call failed"}`;
    }
  },

  scores: [Factuality],
});

// Call the chat functions directly instead of making HTTP requests
async function callChatFunctions(input: string): Promise<string> {
  // Create the message structure expected by your chat system
  const messages: UIMessage[] = [
    {
      id: "user-message",
      role: "user",
      parts: [
        {
          type: "text",
          text: input,
        },
      ],
    },
  ];

  // Prepare the request body matching your ChatRequest type
  const body: ChatRequest = {
    messages,
    roomId: "3779c62e-7583-40c6-a0bb-6bbac841a531",
    accountId: "fb678396-a68f-4294-ae50-b8cacf9ce77b",
    model: DEFAULT_MODEL,
    excludeTools: [], // Don't exclude any tools - we want to test tool usage
  };

  try {
    // Use the same functions as your API endpoint
    const chatConfig = await setupChatRequest(body);
    const result = await generateText(chatConfig);

    // Return the text content from the result
    // Handle different possible response formats
    if (typeof result.text === "string") {
      return result.text;
    }

    // Try to extract text from content if available
    if (typeof result.content === "string") {
      return result.content;
    }

    // Fallback - convert result to string
    return String(result.text || result.content || "No response content");
  } catch (error) {
    console.error("Error calling chat functions:", error);
    throw error;
  }
}
