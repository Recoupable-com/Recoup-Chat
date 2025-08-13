import generateText from "@/lib/ai/generateText";

/**
 * Generates a brief, formal title (max 20 characters) based on the given question context.
 * Highlights segment names if present in the question.
 *
 * @param question - The question or context to generate a title for
 * @returns A promise that resolves to the generated title string
 */
export async function generateChatTitle(question: string): Promise<string> {
  const response = await generateText({
    prompt: `Provide a brief title (more formal, no more than 20 characters!!!) that reflects the key elements of the given context.
        If the question is related to a segment or contains a segment name, highlight the segment name.
        Context: ${question}`,
  });

  return response.text;
}
