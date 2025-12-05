"use client";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tables } from "@/types/database.types";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface TaskDetailsDialogHeaderProps {
  task: Tables<"scheduled_actions">;
  isEnabled: boolean;
  isDeleted?: boolean;
  onToggleEnabled?: () => void;
  isLoading?: boolean;
}

const TaskDetailsDialogHeader = ({
  task,
  isEnabled,
  isDeleted = false,
  onToggleEnabled,
  isLoading = false,
}: TaskDetailsDialogHeaderProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(task.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy task ID:", err);
    }
  };

  return (
    <DialogHeader className="pb-3 shrink-0 space-y-2">
      {/* Title row with toggle */}
      <div className="flex items-start justify-between gap-3">
        <DialogTitle
          className={cn("text-base text-left leading-tight pr-2", {
            "text-red-800": isDeleted,
          })}
        >
          {task.title}
        </DialogTitle>

        {!isDeleted && onToggleEnabled && (
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={cn(
                "text-xs font-medium",
                isEnabled ? "text-green-600" : "text-muted-foreground"
              )}
            >
              {isEnabled ? "Active" : "Paused"}
            </span>
            <Switch
              checked={isEnabled}
              onCheckedChange={onToggleEnabled}
              disabled={isLoading}
              className={cn(
                isEnabled && "data-[state=checked]:bg-green-500"
              )}
            />
          </div>
        )}

        {isDeleted && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 shrink-0">
            Deleted
          </span>
        )}
      </div>

      {/* Compact Task ID - just copy button */}
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        {copied ? (
          <Check className="w-3 h-3 text-green-600" />
        ) : (
          <Copy className="w-3 h-3" />
        )}
        <span>Copy Task ID</span>
      </button>
    </DialogHeader>
  );
};

export default TaskDetailsDialogHeader;
