import { useState, useEffect } from "react";
import { Tables } from "@/types/database.types";
import { parseCronToFrequencyAndTime } from "@/lib/tasks/parseCronToFrequencyAndTime";

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
  const { frequency: initialFrequency, time: initialTime } =
    parseCronToFrequencyAndTime(task.schedule);
  const [editFrequency, setEditFrequency] = useState(initialFrequency);
  const [editTime, setEditTime] = useState(initialTime);

  // Sync edit state when task prop changes
  useEffect(() => {
    setEditTitle(task.title);
    setEditPrompt(task.prompt);
    const { frequency, time } = parseCronToFrequencyAndTime(task.schedule);
    setEditFrequency(frequency);
    setEditTime(time);
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
    editFrequency,
    setEditFrequency,
    editTime,
    setEditTime,
    isActive,
    isPaused,
    canEdit,
  };
};
