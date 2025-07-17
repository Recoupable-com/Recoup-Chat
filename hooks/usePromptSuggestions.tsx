import { useVercelChatContext } from "@/providers/VercelChatProvider";
import { useEffect, useState } from "react";

export type Suggestion = {
  text: string;
  type: "youtube" | "tiktok" | "instagram" | "spotify" | "other";
}

const usePromptSuggestions = () => {
  const { messages, status, append } = useVercelChatContext();
  const isMessageLoading = status === "submitted" || status === "streaming";
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const lastMessage = messages[messages.length - 1];
  const isAssistantMessage = lastMessage?.role === "assistant";
  const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
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
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setIsLoading(false);
      }
    };

    if (!isMessageLoading && content && isAssistantMessage) {
      fetchSuggestions();
    }
    if (isMessageLoading) {
      setSuggestions([]);
    }
  }, [content, isMessageLoading, isAssistantMessage]);

  return {
    suggestions: messages.length <= 0 ? [] : suggestions,
    handleSuggestionClick,
    isLoading,
    isHidden: !isAssistantMessage,
  };
};

export default usePromptSuggestions;
