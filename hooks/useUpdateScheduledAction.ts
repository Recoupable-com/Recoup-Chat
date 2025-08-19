import { useState } from "react";
import { toast } from "react-toastify";
import { Tables } from "@/types/database.types";

type ScheduledAction = Tables<"scheduled_actions">;
type ScheduledActionUpdate = Partial<Omit<ScheduledAction, "id" | "created_at">>;

interface UpdateScheduledActionParams {
  actionId: string;
  updates: ScheduledActionUpdate;
  onSuccess?: (updatedData: ScheduledAction) => void;
  successMessage?: string;
}

export const useUpdateScheduledAction = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateAction = async ({
    actionId,
    updates,
    onSuccess,
    successMessage = "Updated successfully",
  }: UpdateScheduledActionParams) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/scheduled-actions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: actionId,
          ...updates,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update scheduled action");
      }

      const result = await response.json();
      
      // Call success callback with updated data
      onSuccess?.(result.data);
      
      // Show success message
      toast.success(successMessage);
      
      return result.data;
    } catch (error) {
      console.error("Failed to update scheduled action:", error);
      toast.error("Failed to update. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateAction,
    isLoading,
  };
};
