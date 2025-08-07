import { LLM_MODELS } from "@/lib/consts";
import {
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
} from "../ai-elements/prompt-input";
import { PromptInputModelSelectContent } from "../ai-elements/prompt-input";
import { PromptInputModelSelectItem } from "../ai-elements/prompt-input";
import { useVercelChatContext } from "@/providers/VercelChatProvider";

const ModelSelect = () => {
  const { model, setModel } = useVercelChatContext();

  return (
    <PromptInputModelSelect
      onValueChange={(value) => {
        setModel(value);
      }}
      value={model}
    >
      <PromptInputModelSelectTrigger>
        <PromptInputModelSelectValue />
      </PromptInputModelSelectTrigger>
      <PromptInputModelSelectContent>
        {LLM_MODELS.map((model) => (
          <PromptInputModelSelectItem key={model.id} value={model.id}>
            {model.name}
          </PromptInputModelSelectItem>
        ))}
      </PromptInputModelSelectContent>
    </PromptInputModelSelect>
  );
};

export default ModelSelect;
