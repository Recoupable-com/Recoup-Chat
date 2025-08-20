import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteScheduledActionParams {
  actionId: string;
  onSuccess?: () => void;
  successMessage?: string;
}

export const useDeleteScheduledAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const deleteAction = async ({
    actionId,
    onSuccess,
    successMessage = "Scheduled action deleted successfully",
  }: DeleteScheduledActionParams) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/scheduled-actions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: actionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete scheduled action");
      }

      const result = await response.json();
      
      // Call success callback
      onSuccess?.();
      
      // Show success message
      toast.success(successMessage);
      
      return result.data;
    } catch (error) {
      console.error("Failed to delete scheduled action:", error);
      toast.error("Failed to delete. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ["scheduled-actions"] });
    }
  };

  return {
    deleteAction,
    isLoading,
  };
};
