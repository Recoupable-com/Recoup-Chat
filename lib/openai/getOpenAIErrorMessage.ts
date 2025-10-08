/**
 * Transforms OpenAI API errors into user-friendly messages
 */
export function getOpenAIErrorMessage(error: unknown): string {
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";

  if (errorMessage.includes("API key")) {
    return "OpenAI API key is missing or invalid. Please check your environment variables.";
  }

  if (errorMessage.includes("content policy")) {
    return "Your prompt may violate content policy. Please try a different prompt.";
  }

  if (errorMessage.includes("rate limit")) {
    return "Rate limit exceeded. Please try again later.";
  }

  if (errorMessage.includes("quota")) {
    return "API quota exceeded. Please check your OpenAI account usage.";
  }

  if (errorMessage.includes("billing")) {
    return "Billing issue detected. Please check your OpenAI account billing settings.";
  }

  return errorMessage;
}
