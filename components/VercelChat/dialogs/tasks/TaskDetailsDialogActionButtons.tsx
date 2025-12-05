"use client";

import { Button } from "@/components/ui/button";
import { Play, Trash2 } from "lucide-react";
import { useUpdateScheduledAction } from "@/hooks/useUpdateScheduledAction";
import { useDeleteScheduledAction } from "@/hooks/useDeleteScheduledAction";
import { toast } from "react-toastify";

interface TaskDetailsDialogActionButtonsProps {
  taskId: string;
  editTitle: string;
  editPrompt: string;
  editCron: string;
  editModel: string;
  onSaveSuccess: () => void;
  onDeleteSuccess: () => void;
  canEdit: boolean;
}

const TaskDetailsDialogActionButtons: React.FC<
  TaskDetailsDialogActionButtonsProps
> = ({
  taskId,
  editTitle,
  editPrompt,
  editCron,
  editModel,
  onSaveSuccess,
  onDeleteSuccess,
  canEdit,
}) => {
  const { updateAction, isLoading: isUpdating } = useUpdateScheduledAction();
  const { deleteAction, isLoading: isDeleting } = useDeleteScheduledAction();
  const isLoading = isUpdating || isDeleting;

  const handleRunNow = async () => {
    // TODO: Implement run now functionality
    toast.info("Run Now coming soon - task will run on schedule");
  };

  const handleDelete = async () => {
    if (!canEdit) return;

    try {
      await deleteAction({
        actionId: taskId,
        onSuccess: () => {
          onDeleteSuccess();
        },
      });
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleSave = async () => {
    if (!canEdit) return;

    try {
      const cronExpression = editCron.trim();
      await updateAction({
        updates: {
          id: taskId,
          title: editTitle,
          prompt: editPrompt,
          schedule: cronExpression,
          model: editModel,
        },
        onSuccess: () => {
          onSaveSuccess();
        },
        successMessage: "Task updated successfully",
      });
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  return (
    <div className="flex gap-2 pt-4 border-t border-border justify-between shrink-0">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleRunNow}
          disabled={isLoading}
          size="sm"
        >
          <Play className="h-4 w-4 mr-1.5" />
          Run Now
        </Button>
        <Button
          variant="ghost"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          disabled={isLoading}
          size="sm"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Button onClick={handleSave} disabled={isLoading} size="sm">
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

export default TaskDetailsDialogActionButtons;
