import { GatewayLanguageModelEntry } from "@ai-sdk/gateway";
import { PromptInputModelSelectItem } from "../ai-elements/prompt-input";
import { isFreeModel } from "@/lib/ai/isFreeModel";
import { Lock, Crown } from "lucide-react";
import { usePaymentProvider } from "@/providers/PaymentProvider";

const ModelSelectItem = ({ model }: { model: GatewayLanguageModelEntry }) => {
  const { subscriptionActive } = usePaymentProvider();
  const isModelFree = isFreeModel(model);
  const isLocked = !isModelFree && !subscriptionActive;
  const isUnlockedPro = !isModelFree && subscriptionActive;

  return (
    <PromptInputModelSelectItem
      value={model.id}
      className={isLocked ? "opacity-60" : ""}
    >
      <div className="flex items-center gap-2">
        {isLocked && <Lock className="h-3 w-3 text-muted-foreground" />}
        {isUnlockedPro && <Crown className="h-3 w-3 text-muted-foreground" />}
        {model.name}
      </div>
    </PromptInputModelSelectItem>
  );
};

export default ModelSelectItem;
