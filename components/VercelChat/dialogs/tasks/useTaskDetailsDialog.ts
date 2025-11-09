import { useState, useEffect } from "react";
import { Tables } from "@/types/database.types";

interface UseTaskDetailsDialogParams {
  task: Tables<"scheduled_actions">;
  isDeleted?: boolean;
}

export const useTaskDetailsDialog = ({
  task,
  isDeleted = false,
}: UseTaskDetailsDialogParams) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPrompt, setEditPrompt] = useState(task.prompt);
  const [editCron, setEditCron] = useState(
    task.schedule?.trim() || "0 9 * * *"
  );

  // Sync edit state when task prop changes
  useEffect(() => {
    setEditTitle(task.title);
    setEditPrompt(task.prompt);
    setEditCron(task.schedule?.trim() || "0 9 * * *");
  }, [task]);

  const isActive = Boolean(task.enabled && !isDeleted);
  const isPaused = Boolean(!task.enabled && !isDeleted);
  const canEdit = !isDeleted;

  return {
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
  };
};
