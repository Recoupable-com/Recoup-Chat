import { Button } from "@/components/ui/button";
import usePromptSuggestions from "@/hooks/usePromptSuggestions";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import { useEffect, useState } from "react";

const PromptSuggestions = () => {
  const { handleSuggestionClick, isLoading, suggestions, isAssistantMessage } =
    usePromptSuggestions();
    
  if (!isAssistantMessage) return null;

  if (suggestions.length <= 0) return null;

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
