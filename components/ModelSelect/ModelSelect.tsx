import {
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
} from "../ai-elements/prompt-input";
import { PromptInputModelSelectContent } from "../ai-elements/prompt-input";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import { isFreeModel } from "@/lib/ai/isFreeModel";
import { toast } from "react-toastify";
import ModelSelectItem from "./ModelSelectItem";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import { organizeModels } from "@/lib/ai/organizeModels";
import { getFeaturedModelConfig } from "@/lib/ai/featuredModels";
import { useMemo } from "react";
import { ChevronRight } from "lucide-react";

const ModelSelect = () => {
  const { model, setModel, availableModels } = useVercelChatContext();
  const { subscriptionActive } = usePaymentProvider();

  // Organize models into featured and other models
  const organizedModels = useMemo(() => {
    return organizeModels(availableModels);
  }, [availableModels]);

  // Get the selected model for clean display in trigger
  const selectedModel = availableModels.find(m => m.id === model);
  const selectedModelConfig = getFeaturedModelConfig(model);
  const displayName = selectedModelConfig?.displayName || selectedModel?.name || "Select a model";

  const handleModelChange = (value: string) => {
    const selectedModel = availableModels.find((m) => m.id === value);
    const isModelFree = selectedModel ? isFreeModel(selectedModel) : false;
    if (!isModelFree && !subscriptionActive) {
      toast.error(
        "This model is not free. Please upgrade to a paid plan or select a free model."
      );
      return;
    }
    setModel(value);
  };

  return (
    <PromptInputModelSelect onValueChange={handleModelChange} value={model}>
      <PromptInputModelSelectTrigger>
        <PromptInputModelSelectValue placeholder="Select a model">
          {displayName}
        </PromptInputModelSelectValue>
      </PromptInputModelSelectTrigger>
      <PromptInputModelSelectContent>
        {/* Featured Models */}
        {organizedModels.featuredModels.map((model) => (
          <ModelSelectItem key={model.id} model={model} />
        ))}

        {/* More Models Section */}
        {organizedModels.otherModels.length > 0 && (
          <>
            {organizedModels.featuredModels.length > 0 && (
              <div className="my-1 h-px bg-border" />
            )}
            <div className="relative">
              <PromptInputModelSelect onValueChange={handleModelChange} value="">
                <PromptInputModelSelectTrigger className="w-full justify-between px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg border-none shadow-none bg-transparent [&>svg]:hidden">
                  <span>More Models</span>
                  <ChevronRight className="h-4 w-4" />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent className="min-w-[200px]" side="right" align="start" sideOffset={8}>
                  {organizedModels.otherModels.map((model) => (
                    <ModelSelectItem key={model.id} model={model} />
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </div>
          </>
        )}
      </PromptInputModelSelectContent>
    </PromptInputModelSelect>
  );
};

export default ModelSelect;
