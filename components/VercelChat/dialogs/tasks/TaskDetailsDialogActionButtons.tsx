"use client";

import { Button } from "@/components/ui/button";
import { Pause, Trash2 } from "lucide-react";
import { useUpdateScheduledAction } from "@/hooks/useUpdateScheduledAction";
import { useDeleteScheduledAction } from "@/hooks/useDeleteScheduledAction";
import { convertFrequencyAndTimeToCron } from "@/lib/tasks/convertFrequencyAndTimeToCron";

interface TaskDetailsDialogActionButtonsProps {
  taskId: string;
  editTitle: string;
  editPrompt: string;
  editFrequency: string;
  editTime: string;
  onSaveSuccess: () => void;
  onDeleteSuccess: () => void;
  isEnabled: boolean;
  canEdit: boolean;
}

const TaskDetailsDialogActionButtons: React.FC<
  TaskDetailsDialogActionButtonsProps
> = ({
  taskId,
  editTitle,
  editPrompt,
  editFrequency,
  editTime,
  onSaveSuccess,
  onDeleteSuccess,
  isEnabled,
  canEdit,
}) => {
  const { updateAction, isLoading: isUpdating } = useUpdateScheduledAction();
  const { deleteAction, isLoading: isDeleting } = useDeleteScheduledAction();
  const isLoading = isUpdating || isDeleting;

  const handlePause = async () => {
    if (!canEdit) return;

    try {
      await updateAction({
        updates: {
          id: taskId,
          enabled: !isEnabled,
        },
        successMessage: isEnabled ? "Task paused" : "Task activated",
      });
    } catch (error) {
      console.error("Failed to toggle task status:", error);
    }
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
      // Convert frequency and time back to cron expression
      const newCronExpression = convertFrequencyAndTimeToCron(
        editFrequency,
        editTime
      );

      await updateAction({
        updates: {
          id: taskId,
          title: editTitle,
          prompt: editPrompt,
          schedule: newCronExpression,
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
    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 justify-between shrink-0">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handlePause}
          disabled={isLoading}
          size="sm"
        >
          <Pause className="h-4 w-4 mr-2" />
          {isEnabled ? "Pause" : "Resume"}
        </Button>
        <Button
          variant="outline"
          onClick={handleDelete}
          className="border-red-200 text-red-600 hover:bg-red-50"
          disabled={isLoading}
          size="sm"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
      <Button
        onClick={handleSave}
        disabled={isLoading}
        className="bg-gray-900 hover:bg-gray-800"
        size="sm"
      >
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

export default TaskDetailsDialogActionButtons;
