/**
 * Fetches from Perplexity API with streaming enabled
 * Returns a ReadableStream that can be consumed for SSE parsing
 */
const fetchPerplexityApiStream = async (
  messages: Array<{ role: string; content: string }>,
  model: string = "sonar-pro"
): Promise<ReadableStream<Uint8Array>> => {
  const url = "https://api.perplexity.ai/chat/completions";
  const body = {
    model,
    messages,
    stream: true, // Enable streaming
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
      } catch {
        errorText = "Unable to parse error response";
      }
      throw new Error(
        `Perplexity API error: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    return response.body;
  } catch (error) {
    throw new Error(`Network error while calling Perplexity API: ${error}`);
  }
};

export default fetchPerplexityApiStream;
