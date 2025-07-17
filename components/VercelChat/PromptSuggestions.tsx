import { Button } from "@/components/ui/button";

const PromptSuggestions = () => {
  const suggestions = [
    "Analyze my fan engagement trends",
    "Create a social media strategy",
    "Generate content ideas for next week",
    "Review my latest campaign performance",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    // TODO: Handle suggestion selection
    console.log("Selected suggestion:", suggestion);
  };

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
