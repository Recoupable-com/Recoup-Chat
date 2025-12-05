"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tables } from "@/types/database.types";
import { cn } from "@/lib/utils";
import TaskDetailsDialogHeader from "./TaskDetailsDialogHeader";
import TaskDetailsDialogContent from "./TaskDetailsDialogContent";
import TaskDetailsDialogActionButtons from "./TaskDetailsDialogActionButtons";
import { useTaskDetailsDialog } from "./useTaskDetailsDialog";
import { useUpdateScheduledAction } from "@/hooks/useUpdateScheduledAction";

interface TaskDetailsDialogProps {
  children: React.ReactNode;
  task: Tables<"scheduled_actions">;
  isDeleted?: boolean;
  onDelete?: () => void;
}

const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({
  children,
  task,
  isDeleted = false,
  onDelete,
}) => {
  const {
    isDialogOpen,
    setIsDialogOpen,
    editTitle,
    setEditTitle,
    editPrompt,
    setEditPrompt,
    editCron,
    setEditCron,
    editModel,
    setEditModel,
    canEdit,
  } = useTaskDetailsDialog({ task, isDeleted });

  const { updateAction, isLoading: isToggling } = useUpdateScheduledAction();

  const handleToggleEnabled = async () => {
    if (!canEdit) return;

    try {
      await updateAction({
        updates: {
          id: task.id,
          enabled: !task.enabled,
        },
        successMessage: task.enabled ? "Task paused" : "Task activated",
      });
    } catch (error) {
      console.error("Failed to toggle task status:", error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </DialogTrigger>
      <DialogContent
        className={cn("max-w-sm md:max-w-[420px] p-5 flex flex-col gap-4")}
      >
        <TaskDetailsDialogHeader
          task={task}
          isEnabled={!!task.enabled}
          isDeleted={isDeleted}
          onToggleEnabled={canEdit ? handleToggleEnabled : undefined}
          isLoading={isToggling}
        />

        <TaskDetailsDialogContent
          task={task}
          editTitle={editTitle}
          editPrompt={editPrompt}
          editCron={editCron}
          editModel={editModel}
          onTitleChange={setEditTitle}
          onPromptChange={setEditPrompt}
          onCronChange={setEditCron}
          onModelChange={setEditModel}
          canEdit={canEdit}
          isDeleted={isDeleted}
        />

        {/* Action Buttons - Only show if editable */}
        {canEdit && (
          <TaskDetailsDialogActionButtons
            taskId={task.id}
            editTitle={editTitle}
            editPrompt={editPrompt}
            editCron={editCron}
            editModel={editModel}
            onSaveSuccess={() => setIsDialogOpen(false)}
            onDeleteSuccess={() => {
              setIsDialogOpen(false);
              onDelete?.();
            }}
            canEdit={canEdit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;
