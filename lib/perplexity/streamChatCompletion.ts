import streamPerplexityApi from "./streamPerplexityApi";
import {
  PerplexityMessage,
  PerplexityStreamChunk,
  StreamedResponse,
} from "./types";

/**
 * Streams chat completion from Perplexity API, yielding content chunks in real-time
 * Parses SSE (Server-Sent Events) format and yields text as it arrives
 * Collects search results and citations from final chunks
 *
 * @param messages - Array of message objects with role and content
 * @param model - Perplexity model to use (default: sonar-pro)
 * @yields Content chunks as they arrive
 * @returns Final response with all content, search results, and citations
 */
async function* streamChatCompletion(
  messages: PerplexityMessage[],
  model: string = "sonar-pro"
): AsyncGenerator<string, StreamedResponse, undefined> {
  const response = await streamPerplexityApi(messages, model);

  if (!response.body) {
    throw new Error("Response body is null");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let fullContent = "";
  const searchResults: StreamedResponse["searchResults"] = [];
  const citations: string[] = [];

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.trim() || !line.startsWith("data: ")) continue;

        const dataStr = line.slice(6); // Remove "data: " prefix

        if (dataStr === "[DONE]") continue;

        try {
          const data: PerplexityStreamChunk = JSON.parse(dataStr);

          // Extract and yield content
          const content = data.choices[0]?.delta?.content;
          if (content) {
            fullContent += content;
            yield content;
          }

          // Collect search results from final chunks
          if (data.search_results && data.search_results.length > 0) {
            searchResults.push(...data.search_results);
          }

          // Collect citations from final chunks
          if (data.citations && data.citations.length > 0) {
            citations.push(...data.citations);
          }
        } catch (parseError) {
          // Skip malformed JSON chunks
          continue;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return {
    content: fullContent,
    searchResults,
    citations,
  };
}

export default streamChatCompletion;

