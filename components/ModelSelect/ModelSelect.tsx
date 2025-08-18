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

const ModelSelect = () => {
  const { model, setModel, availableModels } = useVercelChatContext();

  const handleModelChange = (value: string) => {
    const selectedModel = availableModels.find((m) => m.id === value);
    const isModelFree = selectedModel ? isFreeModel(selectedModel) : false;
    if (!isModelFree) {
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
        <PromptInputModelSelectValue />
      </PromptInputModelSelectTrigger>
      <PromptInputModelSelectContent>
        {availableModels.map((model) => (
          <ModelSelectItem key={model.id} model={model} />
        ))}
      </PromptInputModelSelectContent>
    </PromptInputModelSelect>
  );
};

export default ModelSelect;
