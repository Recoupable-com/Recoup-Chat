import { cn } from "@/lib/utils";
import { Tables } from "@/types/database.types";
import { Textarea } from "@/components/ui/textarea";
import TaskDetailsDialogTitle from "./TaskDetailsDialogTitle";
import { CronEditor } from "@/components/CronEditor";
import TaskPromptSection from "./TaskPromptSection";
import TaskLastRunSection from "./TaskLastRunSection";
import TaskScheduleSection from "./TaskScheduleSection";

interface TaskDetailsDialogContentProps {
  task: Tables<"scheduled_actions">;
  editTitle: string;
  editPrompt: string;
  editCron: string;
  onTitleChange: (value: string) => void;
  onPromptChange: (value: string) => void;
  onCronChange: (value: string) => void;
  canEdit: boolean;
  isDeleted?: boolean;
}

const TaskDetailsDialogContent: React.FC<TaskDetailsDialogContentProps> = ({
  task,
  editTitle,
  editPrompt,
  editCron,
  onTitleChange,
  onPromptChange,
  onCronChange,
  canEdit,
  isDeleted = false,
}) => {
  return (
    <div className={cn("flex flex-col gap-3 mt-1 overflow-y-auto")}>
      {/* Title Section */}
      <TaskDetailsDialogTitle
        value={canEdit ? editTitle : task.title}
        onChange={onTitleChange}
        canEdit={canEdit}
      />

      {/* Prompt Section */}
      {canEdit ? (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">
            Instructions
          </label>
          <Textarea
            value={editPrompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="w-full text-xs min-h-[80px] resize-none"
            placeholder="Enter instructions..."
            disabled={false}
          />
        </div>
      ) : (
        <TaskPromptSection prompt={task.prompt} isDeleted={isDeleted} />
      )}

      {/* Schedule Section */}
      {canEdit ? (
        <CronEditor
          cronExpression={editCron}
          onCronExpressionChange={onCronChange}
        />
      ) : (
        <TaskScheduleSection
          schedule={task.schedule}
          nextRun={task.next_run || ""}
          isDeleted={isDeleted}
        />
      )}

      {/* Last Run Information - Read-only */}
      <TaskLastRunSection lastRun={task.last_run} isDeleted={isDeleted} />
    </div>
  );
};

export default TaskDetailsDialogContent;
