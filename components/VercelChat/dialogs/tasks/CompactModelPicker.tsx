"use client";

import { Bot, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  FEATURED_MODELS,
  getFeaturedModelConfig,
} from "@/lib/ai/featuredModels";
import { cn } from "@/lib/utils";

interface CompactModelPickerProps {
  model: string;
  onModelChange: (value: string) => void;
  disabled?: boolean;
}

const CompactModelPicker: React.FC<CompactModelPickerProps> = ({
  model,
  onModelChange,
  disabled = false,
}) => {
  const modelConfig = getFeaturedModelConfig(model);
  const displayName =
    modelConfig?.displayName || model.split("/").pop() || "Select model";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-left font-normal h-10 px-3"
          disabled={disabled}
        >
          <div className="flex items-center gap-2 truncate">
            <Bot className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate text-sm">{displayName}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {FEATURED_MODELS.map((m) => (
          <DropdownMenuItem
            key={m.id}
            onClick={() => onModelChange(m.id)}
            className={cn(
              "flex items-center justify-between cursor-pointer",
              model === m.id && "bg-accent"
            )}
          >
            <div className="flex flex-col">
              <span className="font-medium">{m.displayName}</span>
              {m.description && (
                <span className="text-xs text-muted-foreground">
                  {m.description}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {m.pill && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {m.pill}
                </span>
              )}
              {model === m.id && <Check className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CompactModelPicker;
