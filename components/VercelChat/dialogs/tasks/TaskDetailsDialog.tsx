"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tables } from "@/types/database.types";
import { cn } from "@/lib/utils";
import TaskDetailsDialogHeader from "./TaskDetailsDialogHeader";
import TaskDetailsDialogContent from "./TaskDetailsDialogContent";
import TaskDetailsDialogActionButtons from "./TaskDetailsDialogActionButtons";
import { useTaskDetailsDialog } from "./useTaskDetailsDialog";

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
    isActive,
    isPaused,
    canEdit,
  } = useTaskDetailsDialog({ task, isDeleted });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "max-w-xs md:max-w-md p-6 max-h-[90vh] overflow-hidden flex flex-col pt-10"
        )}
      >
        <TaskDetailsDialogHeader
          task={task}
          isActive={isActive}
          isPaused={isPaused}
          isDeleted={isDeleted}
        />

        <TaskDetailsDialogContent
          task={task}
          editTitle={editTitle}
          editPrompt={editPrompt}
          editCron={editCron}
          onTitleChange={setEditTitle}
          onPromptChange={setEditPrompt}
          onCronChange={setEditCron}
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
            onSaveSuccess={() => setIsDialogOpen(false)}
            onDeleteSuccess={() => {
              setIsDialogOpen(false);
              onDelete?.();
            }}
            isEnabled={!!task.enabled}
            canEdit={canEdit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;
