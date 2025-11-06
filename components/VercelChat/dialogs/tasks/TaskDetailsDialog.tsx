"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tables } from "@/types/database.types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { parseCronToFrequencyAndTime } from "@/lib/tasks/parseCronToFrequencyAndTime";
import TaskDetailsDialogHeader from "./TaskDetailsDialogHeader";
import TaskDetailsDialogContent from "./TaskDetailsDialogContent";
import TaskDetailsDialogActionButtons from "./TaskDetailsDialogActionButtons";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPrompt, setEditPrompt] = useState(task.prompt);
  const { frequency: initialFrequency, time: initialTime } =
    parseCronToFrequencyAndTime(task.schedule);
  const [editFrequency, setEditFrequency] = useState(initialFrequency);
  const [editTime, setEditTime] = useState(initialTime);

  const isActive = Boolean(task.enabled && !isDeleted);
  const isPaused = Boolean(!task.enabled && !isDeleted);
  const canEdit = !isDeleted;

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
          editFrequency={editFrequency}
          editTime={editTime}
          onTitleChange={setEditTitle}
          onPromptChange={setEditPrompt}
          onFrequencyChange={setEditFrequency}
          onTimeChange={setEditTime}
          canEdit={canEdit}
          isDeleted={isDeleted}
        />

        {/* Action Buttons - Only show if editable */}
        {canEdit && (
          <TaskDetailsDialogActionButtons
            taskId={task.id}
            editTitle={editTitle}
            editPrompt={editPrompt}
            editFrequency={editFrequency}
            editTime={editTime}
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
