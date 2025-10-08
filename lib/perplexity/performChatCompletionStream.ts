import fetchPerplexityApiStream from "./fetchPerplexityApiStream";

export type PerplexityStreamChunk = {
  type: 'content' | 'search' | 'complete';
  content?: string;
  searchResults?: Array<{
    url: string;
    title?: string;
  }>;
  citations?: string[];
  fullContent?: string;
};

/**
 * Performs a chat completion with streaming from Perplexity API
 * Yields chunks as they arrive for real-time updates
 */
async function* performChatCompletionStream(
  messages: Array<{ role: string; content: string }>,
  model: string = "sonar-pro"
): AsyncGenerator<PerplexityStreamChunk, void, unknown> {
  const stream = await fetchPerplexityApiStream(messages, model);
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  let buffer = '';
  let accumulatedContent = '';
  let searchResults: Array<{ url: string; title?: string }> = [];
  let citations: string[] = [];

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      // Decode the chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process all complete lines in the buffer
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (!line.trim() || !line.startsWith('data: ')) continue;

        const data = line.slice(6).trim();

        // Check for stream end
        if (data === '[DONE]') {
          // Yield final complete state
          yield {
            type: 'complete',
            fullContent: accumulatedContent,
            citations: citations.length > 0 ? citations : undefined,
          };
          return;
        }

        try {
          const chunk = JSON.parse(data);

          // Extract content delta
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            accumulatedContent += content;
            yield {
              type: 'content',
              content,
            };
          }

          // Check for search results in final chunk
          if (chunk.search_results && Array.isArray(chunk.search_results)) {
            searchResults = chunk.search_results.map((result: { url: string; title?: string }) => ({
              url: result.url,
              title: result.title,
            }));

            yield {
              type: 'search',
              searchResults,
            };
          }

          // Extract citations if present
          if (chunk.citations && Array.isArray(chunk.citations)) {
            citations = chunk.citations;
          }

        } catch (parseError) {
          // Skip invalid JSON chunks
          console.error('Failed to parse SSE chunk:', parseError);
        }
      }
    }

    // Yield final result if not already sent
    if (accumulatedContent) {
      yield {
        type: 'complete',
        fullContent: accumulatedContent,
        citations: citations.length > 0 ? citations : undefined,
      };
    }

  } finally {
    reader.releaseLock();
  }
}

export default performChatCompletionStream;
