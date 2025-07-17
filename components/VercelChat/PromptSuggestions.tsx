import { Button } from "@/components/ui/button";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import { useEffect, useState } from "react";

const PromptSuggestions = () => {
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

  if (messages.length <= 0) return null;
  if (!isAssistantMessage) return null;

  return (
    <div className="prompt-suggestions w-full bg-transparent rounded-lg absolute top-[-2.7rem] left-0 right-0 mx-auto no-scrollbar pb-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-[0.8rem] bg-transparent">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => handleSuggestionClick(suggestion)}
            className="text-xs h-8 px-3 flex-shrink-0 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-300 border"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PromptSuggestions;
