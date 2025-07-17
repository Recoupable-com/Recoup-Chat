import { useVercelChatContext } from "@/providers/VercelChatProvider";
import { useEffect, useState } from "react";

const usePromptSuggestions = () => {
  const { messages, status, append } = useVercelChatContext();
  const isLoading = status === "submitted" || status === "streaming";
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const lastMessage = messages[messages.length - 1];
  const isAssistantMessage = lastMessage?.role === "assistant";

  const content = lastMessage?.content;

  const handleSuggestionClick = (suggestion: string) => {
    append({
      role: "user",
      content: suggestion,
    });
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch("/api/prompts/suggestions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        });
        const data = await response.json();
        if (data.suggestions && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    };

    if (!isLoading && content && isAssistantMessage) {
      fetchSuggestions();
    }
    if (isLoading) {
      setSuggestions([]);
    }
  }, [content, isLoading, isAssistantMessage]);

  return {
    suggestions: messages.length <= 0 ? [] : suggestions,
    handleSuggestionClick,
    isLoading,
    isAssistantMessage,
  };
};

export default usePromptSuggestions;
