import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tables } from "@/types/database.types";
import { cn } from "@/lib/utils";
import { formatScheduledActionDate } from "@/lib/utils/formatScheduledActionDate";
import { parseCronToHuman } from "@/lib/utils/cronUtils";
import ScheduleMetaCard from "./ScheduleMetaCard";

type ScheduledAction = Tables<"scheduled_actions">;

interface ScheduledActionDetailsDialogProps {
  children: React.ReactNode;
  action: ScheduledAction;
}

const ScheduledActionDetailsDialog: React.FC<ScheduledActionDetailsDialogProps> = ({
  children,
  action,
}) => {
  const isActive = action.enabled;
  const isPaused = !action.enabled;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-hidden flex flex-col pt-10">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center justify-between text-base">
            <span className={cn("font-medium")}>
              {action.title}
            </span>
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-md",
                isActive
                  ? "bg-green-50 text-green-700"
                  : isPaused
                  ? "bg-gray-50 text-gray-600"
                  : "bg-red-50 text-red-600"
              )}
            >
              {isActive ? "Active" : isPaused ? "Paused" : "Deleted"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Action Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">Prompt</h3>
            <p className="text-sm text-gray-600 leading-snug">{action.prompt}</p>
          </div>

          {/* Schedule Information Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Schedule Information</h3>
            
            <div className="grid gap-3 grid-cols-2">
              <ScheduleMetaCard label="Time" value={parseCronToHuman(action.schedule)} variant="green" />
              <ScheduleMetaCard label="Next Run" value={formatScheduledActionDate(action.next_run)} variant="orange" />
            </div>

            <div className="grid gap-3 grid-cols-2">
              <ScheduleMetaCard 
                label="Last Run" 
                value={action.last_run ? formatScheduledActionDate(action.last_run) : "Never executed"} 
                variant="blue"
              />
              <ScheduleMetaCard 
                label="Last Updated" 
                value={action.updated_at ? formatScheduledActionDate(action.updated_at) : formatScheduledActionDate(action.created_at)} 
                variant="purple"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduledActionDetailsDialog;
