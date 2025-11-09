import { useState } from "react";
import { toast } from "react-toastify";
import { Tables } from "@/types/database.types";
import { useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/lib/tasks/updateTask";

type ScheduledAction = Tables<"scheduled_actions">;
type ScheduledActionUpdate = Partial<
  Omit<ScheduledAction, "id" | "created_at">
>;

interface UpdateScheduledActionParams {
  actionId: string;
  updates: ScheduledActionUpdate;
  onSuccess?: (updatedData: ScheduledAction) => void;
  successMessage?: string;
}

export const useUpdateScheduledAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateAction = async ({
    actionId,
    updates,
    onSuccess,
    successMessage = "Updated successfully",
  }: UpdateScheduledActionParams) => {
    setIsLoading(true);
    try {
      const updatedTask = await updateTask({
        id: actionId,
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.prompt !== undefined && { prompt: updates.prompt }),
        ...(updates.schedule !== undefined && { schedule: updates.schedule }),
        ...(updates.account_id !== undefined && {
          account_id: updates.account_id,
        }),
        ...(updates.artist_account_id !== undefined && {
          artist_account_id: updates.artist_account_id,
        }),
        ...(updates.enabled !== undefined && { enabled: updates.enabled }),
      });

      onSuccess?.(updatedTask);
      toast.success(successMessage);

      return updatedTask;
    } catch (error) {
      console.error("Failed to update scheduled action:", error);
      toast.error("Failed to update. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ["scheduled-actions"] });
    }
  };

  return {
    updateAction,
    isLoading,
  };
};
