// See the Sonar API documentation for more details:
// https://docs.perplexity.ai/api-reference/chat-completions
const fetchPerplexityApi = async (
  messages: Array<{ role: string; content: string }>,
  model: string = "sonar-pro"
) => {
  const url = new URL("https://api.perplexity.ai/chat/completions");
  const body = {
    model,
    messages: messages,
  };

  let response;
  try {
    response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify(body),
    });
    return response;
  } catch (error) {
    throw new Error(`Network error while calling Perplexity API: ${error}`);
  }
};

export default fetchPerplexityApi;
