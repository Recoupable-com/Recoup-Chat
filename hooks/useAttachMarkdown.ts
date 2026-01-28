import { useVercelChatContext } from "@/providers/VercelChatProvider";

export function useAttachMarkdown() {
  const { input, setInput } = useVercelChatContext();

  const attachMarkdownToInput = async (file: File): Promise<void> => {
    try {
      const text = await file.text();
      const markdownContent = `\n\n--- Markdown File: ${file.name} ---\n${text}\n--- End of Markdown ---\n`;
      setInput(input + markdownContent);
    } catch (error) {
      console.error("Error reading Markdown file:", error);
      throw error;
    }
  };

  return { attachMarkdownToInput };
}
