import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tables } from "@/types/database.types";
import { formatScheduledActionDate } from "@/lib/utils/formatScheduledActionDate";
import { parseCronToHuman } from "@/lib/utils/cronUtils";
import ScheduleMetaCard from "./ScheduleMetaCard";
import EditableDialogTitle from "./EditableDialogTitle";
import EditablePrompt from "./EditablePrompt";
import DeleteScheduledActionButton from "./DeleteScheduledActionButton";
import { useState } from "react";

type ScheduledAction = Tables<"scheduled_actions">;

interface ScheduledActionDetailsDialogProps {
  children: React.ReactNode;
  action: ScheduledAction;
  onDelete?: () => void;
}

const ScheduledActionDetailsDialog: React.FC<
  ScheduledActionDetailsDialogProps
> = ({ children, action, onDelete }) => {
  const [currentAction, setCurrentAction] = useState(action);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isActive = currentAction.enabled ?? false;

  const handleTitleChange = (newTitle: string) => {
    setCurrentAction(prev => ({ ...prev, title: newTitle }));
  };

  const handlePromptChange = (newPrompt: string) => {
    setCurrentAction(prev => ({ ...prev, prompt: newPrompt }));
  };

  const handleStatusChange = (newStatus: boolean) => {
    setCurrentAction(prev => ({ ...prev, enabled: newStatus }));
  };

  const handleDeleteSuccess = () => {
    setIsDialogOpen(false);
    onDelete?.();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-hidden flex flex-col pt-10">
        <DialogHeader className="pb-3">
          <DialogTitle asChild>
            <EditableDialogTitle
              title={currentAction.title}
              actionId={currentAction.id}
              isActive={isActive}
              onTitleChange={handleTitleChange}
              onStatusChange={handleStatusChange}
            />
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 px-4">
          {/* Action Details */}
          <EditablePrompt
            prompt={currentAction.prompt}
            actionId={currentAction.id}
            onPromptChange={handlePromptChange}
          />

          {/* Schedule Information Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Schedule Information</h3>
            
            <div className="grid gap-3 grid-cols-2">
              <ScheduleMetaCard label="Time" value={parseCronToHuman(currentAction.schedule)} variant="green" />
              <ScheduleMetaCard label="Next Run" value={formatScheduledActionDate(currentAction.next_run)} variant="orange" />
            </div>

            <div className="grid gap-3 grid-cols-2">
              <ScheduleMetaCard 
                label="Last Run" 
                value={currentAction.last_run ? formatScheduledActionDate(currentAction.last_run) : "Never executed"} 
                variant="blue"
              />
              <ScheduleMetaCard 
                label="Last Updated" 
                value={currentAction.updated_at ? formatScheduledActionDate(currentAction.updated_at) : formatScheduledActionDate(currentAction.created_at)} 
                variant="purple"
              />
            </div>
          </div>

          {/* Delete Button Section */}
          <div className="pt-4 border-t border-gray-200">
            <DeleteScheduledActionButton
              actionId={currentAction.id}
              actionTitle={currentAction.title}
              onDelete={handleDeleteSuccess}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduledActionDetailsDialog;
