import { GatewayLanguageModelEntry } from "@ai-sdk/gateway";
import { PromptInputModelSelectItem } from "../ai-elements/prompt-input";
import { isFreeModel } from "@/lib/ai/isFreeModel";
import { Lock, Crown } from "lucide-react";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import { getFeaturedModelConfig } from "@/lib/ai/featuredModels";
import { Tooltip } from "../common/Tooltip";

const ModelSelectItem = ({ model }: { model: GatewayLanguageModelEntry }) => {
  const { isSubscribed } = usePaymentProvider();
  const isModelFree = isFreeModel(model);
  const isLocked = !isModelFree && !isSubscribed;
  const isUnlockedPro = !isModelFree && isSubscribed;
  
  // Get featured model config for pills and descriptions
  const featuredConfig = getFeaturedModelConfig(model.id);

  const content = (
    <div className="w-full">
      <div className="flex items-center gap-2.5">
        <span className="font-semibold text-sm text-foreground dark:text-white">{model.name}</span>
        {isLocked && <Lock className="h-3 w-3 text-muted-foreground dark:text-muted-foreground" />}
        {isUnlockedPro && <Crown className="h-3 w-3 text-muted-foreground dark:text-muted-foreground" />}
        {featuredConfig?.pill && (
          <span className="px-2.5 py-0.5 text-xs font-medium bg-transparent text-foreground dark:text-muted-foreground rounded-full border border-border-light">
            {featuredConfig.pill}
          </span>
        )}
      </div>
      {featuredConfig?.description && (
        <div className="text-xs text-muted-foreground/80 dark:text-muted-foreground mt-1.5 font-normal">
          {featuredConfig.description}
        </div>
      )}
    </div>
  );

  return (
    <PromptInputModelSelectItem
      value={model.id}
      className={`py-3 ${isLocked ? "opacity-40" : ""}`}
    >
      {featuredConfig?.tooltip ? (
        <Tooltip content={featuredConfig.tooltip}>
          {content}
        </Tooltip>
      ) : (
        content
      )}
    </PromptInputModelSelectItem>
  );
};

export default ModelSelectItem;
