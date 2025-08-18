import { GatewayLanguageModelEntry } from "@ai-sdk/gateway";
import { PromptInputModelSelectItem } from "../ai-elements/prompt-input";
import { isFreeModel } from "@/lib/ai/isFreeModel";
import { Lock } from "lucide-react";

const ModelSelectItem = ({ model }: { model: GatewayLanguageModelEntry }) => {
  const isModelFree = isFreeModel(model);

  return (
    <PromptInputModelSelectItem
      value={model.id}
      className={!isModelFree ? "opacity-60 cursor-not-allowed" : ""}
    >
      <div className="flex items-center gap-2">
        {!isModelFree && <Lock className="h-3 w-3 text-muted-foreground" />}
        {model.name}
      </div>
    </PromptInputModelSelectItem>
  );
};

export default ModelSelectItem;
