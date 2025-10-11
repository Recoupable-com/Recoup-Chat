import fetchPerplexityApi from "./fetchPerplexityApi";
import { parseCitationsFromText } from "@/lib/citations/parseCitations";

/**
 * Performs a chat completion by sending a request to the Perplexity API.
 * Appends citations to the returned message content if they exist.
 *
 * @param {Array<{ role: string; content: string }>} messages - An array of message objects.
 * @param {string} model - The model to use for the completion.
 * @returns {Promise<string>} The chat completion result with appended citations.
 * @throws Will throw an error if the API request fails.
 */
async function performChatCompletion(
  messages: Array<{ role: string; content: string }>,
  model: string = "sonar-pro"
): Promise<string> {
  const response = await fetchPerplexityApi(messages, model);

  // Check for non-successful HTTP status
  if (!response.ok) {
    let errorText;
    try {
      errorText = await response.text();
    } catch (parseError) {
      console.error(parseError);
      errorText = "Unable to parse error response";
    }
    throw new Error(
      `Perplexity API error: ${response.status} ${response.statusText}\n${errorText}`
    );
  }

  // Attempt to parse the JSON response from the API
  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    throw new Error(
      `Failed to parse JSON response from Perplexity API: ${jsonError}`
    );
  }

  // Retrieve the main message content from the response
  let messageContent = data.choices[0].message.content;

  // If citations are provided, parse them for inline citation rendering
  if (
    data.citations &&
    Array.isArray(data.citations) &&
    data.citations.length > 0
  ) {
    // Add citations in the traditional format for parsing
    messageContent += "\n\nCitations:\n";
    data.citations.forEach((citation: string, index: number) => {
      messageContent += `[${index + 1}] ${citation}\n`;
    });
  }

  return messageContent;
}

export default performChatCompletion;
