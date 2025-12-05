import { cn } from "@/lib/utils";
import { Tables } from "@/types/database.types";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaskDetailsDialogTitle from "./TaskDetailsDialogTitle";
import { CronEditor } from "@/components/CronEditor";
import TaskPromptSection from "./TaskPromptSection";
import TaskLastRunSection from "./TaskLastRunSection";
import TaskScheduleSection from "./TaskScheduleSection";
import {
  FEATURED_MODELS,
  getFeaturedModelConfig,
} from "@/lib/ai/featuredModels";

interface TaskDetailsDialogContentProps {
  task: Tables<"scheduled_actions">;
  editTitle: string;
  editPrompt: string;
  editCron: string;
  editModel: string;
  onTitleChange: (value: string) => void;
  onPromptChange: (value: string) => void;
  onCronChange: (value: string) => void;
  onModelChange: (value: string) => void;
  canEdit: boolean;
  isDeleted?: boolean;
}

const TaskDetailsDialogContent: React.FC<TaskDetailsDialogContentProps> = ({
  task,
  editTitle,
  editPrompt,
  editCron,
  editModel,
  onTitleChange,
  onPromptChange,
  onCronChange,
  onModelChange,
  canEdit,
  isDeleted = false,
}) => {
  const modelConfig = getFeaturedModelConfig(editModel);
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
          <label className="text-xs font-medium text-foreground">
            Instructions
          </label>
          <Textarea
            value={editPrompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="w-full text-xs min-h-[80px] resize-y"
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

      {/* Model Section */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground">Model</label>
        {canEdit ? (
          <Select value={editModel} onValueChange={onModelChange}>
            <SelectTrigger className="w-full text-xs">
              <SelectValue>
                {modelConfig?.displayName || editModel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {FEATURED_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id} className="text-xs">
                  <div className="flex items-center gap-2">
                    <span>{model.displayName}</span>
                    {model.pill && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {model.pill}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-xs text-muted-foreground">
            {modelConfig?.displayName || "Default"}
          </p>
        )}
      </div>

      {/* Last Run Information - Read-only */}
      <TaskLastRunSection lastRun={task.last_run} isDeleted={isDeleted} />
    </div>
  );
};

export default TaskDetailsDialogContent;
