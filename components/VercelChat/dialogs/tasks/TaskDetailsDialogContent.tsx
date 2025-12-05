"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tables } from "@/types/database.types";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Expand, Clock } from "lucide-react";
import CompactSchedulePicker from "./CompactSchedulePicker";
import CompactModelPicker from "./CompactModelPicker";
import { parseCronToHuman } from "@/lib/tasks/parseCronToHuman";
import { getFeaturedModelConfig } from "@/lib/ai/featuredModels";

// Extended type to include model field (added via migration)
type ScheduledActionWithModel = Tables<"scheduled_actions"> & {
  model?: string | null;
};

interface TaskDetailsDialogContentProps {
  task: ScheduledActionWithModel;
  editTitle: string;
  editPrompt: string;
  editCron: string;
  editModel: string;
  onTitleChange: (value: string) => void;
  onPromptChange: (value: string) => void;
  onCronChange: (value: string) => void;
  onModelChange: (value: string) => void;
  canEdit: boolean;
  isDeleted?: boolean;
}

const formatNextRun = (nextRun: string | null): string => {
  if (!nextRun) return "Not scheduled";

  const date = new Date(nextRun);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  // Format time
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Format date context
  const isToday = date.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  let dateStr = "";
  if (isToday) {
    dateStr = "Today";
  } else if (isTomorrow) {
    dateStr = "Tomorrow";
  } else {
    dateStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  // Relative time
  let relativeStr = "";
  if (diffMs > 0) {
    if (diffHours > 24) {
      const days = Math.floor(diffHours / 24);
      relativeStr = `in ${days} day${days > 1 ? "s" : ""}`;
    } else if (diffHours > 0) {
      relativeStr = `in ${diffHours}h ${diffMins}m`;
    } else if (diffMins > 0) {
      relativeStr = `in ${diffMins}m`;
    } else {
      relativeStr = "soon";
    }
  } else {
    relativeStr = "overdue";
  }

  return `${dateStr} at ${timeStr} (${relativeStr})`;
};

const TaskDetailsDialogContent: React.FC<TaskDetailsDialogContentProps> = ({
  task,
  editTitle,
  editPrompt,
  editCron,
  editModel,
  onTitleChange,
  onPromptChange,
  onCronChange,
  onModelChange,
  canEdit,
  isDeleted = false,
}) => {
  const [isExpandedOpen, setIsExpandedOpen] = useState(false);
  const modelConfig = getFeaturedModelConfig(editModel);

  // Read-only view for deleted tasks
  if (!canEdit || isDeleted) {
    return (
      <div className={cn("flex flex-col gap-4")}>
        <div>
          <Label className="text-xs text-muted-foreground">Name</Label>
          <p className="text-sm font-medium mt-1">{task.title}</p>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Instructions</Label>
          <p className="text-sm mt-1 text-muted-foreground">{task.prompt}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Schedule</Label>
            <p className="text-sm mt-1">{parseCronToHuman(task.schedule)}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Model</Label>
            <p className="text-sm mt-1">
              {modelConfig?.displayName || "Default"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Editable view
  return (
    <>
      <div className={cn("flex flex-col gap-4")}>
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="task-name" className="text-xs font-medium">
            Name
          </Label>
          <Input
            id="task-name"
            value={editTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="h-9"
            placeholder="Task name..."
          />
        </div>

        {/* Instructions with expand button */}
        <div className="space-y-1.5">
          <Label htmlFor="task-instructions" className="text-xs font-medium">
            Instructions
          </Label>
          <div className="relative">
            <Textarea
              id="task-instructions"
              value={editPrompt}
              onChange={(e) => onPromptChange(e.target.value)}
              className="min-h-[72px] resize-none text-sm pr-8"
              placeholder="What should this task do?"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute bottom-1.5 right-1.5 h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => setIsExpandedOpen(true)}
            >
              <Expand className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Schedule + Model side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Schedule</Label>
            <CompactSchedulePicker
              cronExpression={editCron}
              onCronExpressionChange={onCronChange}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Model</Label>
            <CompactModelPicker model={editModel} onModelChange={onModelChange} />
          </div>
        </div>

        {/* Next Run Preview */}
        {task.next_run && task.enabled && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Next run:</span>
            <span className="font-medium">{formatNextRun(task.next_run)}</span>
          </div>
        )}
      </div>

      {/* Expanded Instructions Modal */}
      <Dialog open={isExpandedOpen} onOpenChange={setIsExpandedOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Instructions</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editPrompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="flex-1 min-h-[300px] resize-none text-sm"
            placeholder="What should this task do?"
            autoFocus
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskDetailsDialogContent;
