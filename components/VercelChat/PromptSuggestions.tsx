import { Button } from "@/components/ui/button";
import usePromptSuggestions from "@/hooks/usePromptSuggestions";
import SkeletonShimmer from "@/components/ui/SkeletonShimmer";

const PromptSuggestions = () => {
  const { handleSuggestionClick, isLoading, suggestions, isAssistantMessage } =
    usePromptSuggestions();

  if (!isAssistantMessage) return null;

  return (
    <div className="prompt-suggestions w-full bg-transparent rounded-lg absolute top-[-2.7rem] left-0 right-0 mx-auto no-scrollbar pb-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-[0.8rem] bg-transparent">
        {isLoading ? (
          // Loading skeleton with shimmer effect
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonShimmer
              key={`skeleton-${index}`}
              className="h-8 px-3 flex-shrink-0 rounded-full bg-gray-200/80 border border-gray-300/70 w-[120px] md:w-[200px] animate-pulse overflow-hidden"
            />
          ))
        ) : (
          // Actual suggestions
          suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-xs h-8 px-3 flex-shrink-0 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-300 border"
            >
              {suggestion}
            </Button>
          ))
        )}
      </div>
    </div>
  );
};

export default PromptSuggestions;
