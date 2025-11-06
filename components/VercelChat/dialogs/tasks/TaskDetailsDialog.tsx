import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tables } from "@/types/database.types";
import { cn } from "@/lib/utils";
import TaskDetailsDialogHeader from "./TaskDetailsDialogHeader";
import TaskPromptSection from "./TaskPromptSection";
import TaskLastRunSection from "./TaskLastRunSection";
import TaskScheduleSection from "./TaskScheduleSection";

interface TaskDetailsDialogProps {
  children: React.ReactNode;
  action: Tables<"scheduled_actions">;
  isDeleted?: boolean;
}

const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({
  children,
  action,
  isDeleted,
}) => {
  const isActive = Boolean(action.enabled && !isDeleted);
  const isPaused = Boolean(!action.enabled && !isDeleted);

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
          action={action}
          isActive={isActive}
          isPaused={isPaused}
          isDeleted={isDeleted}
        />

        <div className={cn("flex flex-col gap-3 mt-1 overflow-y-auto")}>
          {/* Prompt Section */}
          <TaskPromptSection prompt={action.prompt} isDeleted={isDeleted} />

          {/* Schedule Information */}
          <TaskScheduleSection
            schedule={action.schedule}
            nextRun={action.next_run || ""}
            isDeleted={isDeleted}
          />

          {/* Last Run Information */}
          <TaskLastRunSection lastRun={action.last_run} isDeleted={isDeleted} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;

