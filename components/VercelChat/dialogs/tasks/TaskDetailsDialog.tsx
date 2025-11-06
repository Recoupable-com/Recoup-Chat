import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tables } from "@/types/database.types";
import { cn } from "@/lib/utils";
import TaskDetailsDialogHeader from "./TaskDetailsDialogHeader";
import TaskPromptSection from "./TaskPromptSection";
import TaskLastRunSection from "./TaskLastRunSection";
import TaskScheduleSection from "./TaskScheduleSection";

interface TaskDetailsDialogProps {
  children: React.ReactNode;
  task: Tables<"scheduled_actions">;
  isDeleted?: boolean;
}

const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({
  children,
  task,
  isDeleted,
}) => {
  const isActive = Boolean(task.enabled && !isDeleted);
  const isPaused = Boolean(!task.enabled && !isDeleted);

  return (
    <Dialog>
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

        <div className={cn("flex flex-col gap-3 mt-1 overflow-y-auto")}>
          {/* Prompt Section */}
          <TaskPromptSection prompt={task.prompt} isDeleted={isDeleted} />

          {/* Schedule Information */}
          <TaskScheduleSection
            schedule={task.schedule}
            nextRun={task.next_run || ""}
            isDeleted={isDeleted}
          />

          {/* Last Run Information */}
          <TaskLastRunSection lastRun={task.last_run} isDeleted={isDeleted} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;
