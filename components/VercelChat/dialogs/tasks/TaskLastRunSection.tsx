import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatScheduledActionDate } from "@/lib/utils/formatScheduledActionDate";

interface TaskLastRunSectionProps {
  lastRun: string | null;
  isDeleted?: boolean;
}

const TaskLastRunSection = ({
  lastRun,
  isDeleted,
}: TaskLastRunSectionProps) => {
  if (!lastRun) return null;
  
  return (
    <div className={cn("flex items-center gap-1.5 text-xs pt-2 mt-1 border-t border-border", {
      "border-t border-red-100": isDeleted
    })}>
      <RotateCw className={cn("h-3.5 w-3.5 flex-shrink-0 text-green-600", {"text-red-600": isDeleted})} />
      <span className={cn("font-medium text-foreground", {"text-red-700": isDeleted})}>Last Run:</span>
      <span className={cn("break-words text-muted-foreground", {"text-red-600": isDeleted})}>
        {formatScheduledActionDate(lastRun)}
      </span>
    </div>
  );
};

export default TaskLastRunSection;

